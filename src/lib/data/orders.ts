import { getServiceClient } from "@/lib/supabase/server";
import type { DbOrder, DbOrderItem, PaymentStatus } from "./types";
import { normalizeEmail } from "@/lib/utils/normalizeEmail";

export interface CreateOrderInput {
  user_id?: string | null;
  email?: string | null;
  currency?: string;
  total_amount_cents?: number;
  payment_provider: string;
  payment_session_id: string;
  payment_status?: PaymentStatus;
  payment_metadata?: Record<string, unknown>;
  shipping_address?: Record<string, string> | null;
  postnet_details?: { branch_name: string; number: string; email: string } | null;
}

/**
 * Insert a new order. Returns the created order's ID.
 * Uses payment_session_id for idempotency.
 */
export async function createOrder(input: CreateOrderInput): Promise<string | null> {
  const supabase = getServiceClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("payment_session_id", input.payment_session_id)
    .maybeSingle();

  if (existing) return existing.id as string;

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: input.user_id ?? null,
      email: input.email ?? null,
      currency: input.currency ?? "ZAR",
      total_amount_cents: input.total_amount_cents ?? 0,
      payment_provider: input.payment_provider,
      payment_session_id: input.payment_session_id,
      payment_status: input.payment_status ?? "pending",
      payment_metadata: {
        ...(input.payment_metadata ?? {}),
        // shipping_address stored here until DB column migration is applied
        ...(input.shipping_address ? { shipping_address: input.shipping_address } : {}),
        ...(input.postnet_details ? { postnet_details: input.postnet_details } : {}),
      },
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[DB] createOrder:", error.message);
    return null;
  }
  return data?.id ?? null;
}

/**
 * Mark an order as paid (or failed/refunded) after webhook verification.
 * Idempotent: skips if already in the target status and event already recorded.
 */
export async function updateOrderPaymentStatus(
  paymentSessionId: string,
  status: PaymentStatus,
  opts: {
    eventId?: string;
    paidAt?: string;
    totalAmountCents?: number;
    email?: string;
    metadata?: Record<string, unknown>;
  } = {}
): Promise<boolean> {
  const supabase = getServiceClient();

  // Fetch current order
  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("id, payment_status, payment_event_ids")
    .eq("payment_session_id", paymentSessionId)
    .maybeSingle();

  if (fetchErr || !order) {
    console.error("[DB] updateOrderPaymentStatus: order not found for session", paymentSessionId);
    return false;
  }

  // Idempotency: skip if event already processed
  if (opts.eventId && order.payment_event_ids?.includes(opts.eventId)) {
    return true;
  }

  const updatePayload: Record<string, unknown> = {
    payment_status: status,
    status: status, // keep legacy status in sync
    payment_event_ids: [...(order.payment_event_ids ?? []), opts.eventId].filter(Boolean),
  };

  if (status === "paid") {
    updatePayload.paid_at = opts.paidAt ?? new Date().toISOString();
  }
  if (opts.totalAmountCents !== undefined) {
    updatePayload.total_amount_cents = opts.totalAmountCents;
  }
  if (opts.email) {
    updatePayload.email = opts.email;
  }
  if (opts.metadata) {
    updatePayload.payment_metadata = opts.metadata;
  }

  const { error } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("id", order.id);

  if (error) {
    console.error("[DB] updateOrderPaymentStatus:", error.message);
    return false;
  }
  return true;
}

/**
 * Get an order by its payment_session_id.
 */
export async function getOrderBySessionId(sessionId: string): Promise<DbOrder | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("payment_session_id", sessionId)
    .maybeSingle();
  if (error) console.error("[DB] getOrderBySessionId:", error.message);
  return (data as DbOrder) ?? null;
}

/**
 * Insert order items. Safe to call multiple times (uses ON CONFLICT DO NOTHING via DB).
 */
export async function insertOrderItems(
  items: Omit<DbOrderItem, "id" | "created_at">[]
): Promise<void> {
  if (items.length === 0) return;
  const supabase = getServiceClient();
  const { error } = await supabase.from("order_items").insert(items);
  if (error) console.error("[DB] insertOrderItems:", error.message);
}

/**
 * List orders for admin view with optional filters.
 */
export async function listOrdersAdmin(opts: {
  from?: string;
  to?: string;
  status?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<DbOrder[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 100)
    .range(opts.offset ?? 0, (opts.offset ?? 0) + (opts.limit ?? 100) - 1);

  if (opts.from) query = query.gte("created_at", opts.from);
  if (opts.to) query = query.lte("created_at", opts.to);
  if (opts.status) query = query.eq("payment_status", opts.status);

  const { data, error } = await query;
  if (error) console.error("[DB] listOrdersAdmin:", error.message);
  return (data as DbOrder[]) ?? [];
}

/**
 * Get a single order with its items by order ID.
 */
export async function getOrderWithItems(
  orderId: string
): Promise<{ order: DbOrder; items: DbOrderItem[] } | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .maybeSingle();
  if (error) {
    console.error("[DB] getOrderWithItems:", error.message);
    return null;
  }
  if (!data) return null;
  const { order_items, ...order } = data as DbOrder & { order_items: DbOrderItem[] };
  return { order: order as DbOrder, items: order_items ?? [] };
}

export async function getGuestOrderWithItems(
  orderId: string,
  email: string
): Promise<{ order: DbOrder; items: DbOrderItem[] } | null> {
  const normalizedOrderId = orderId.trim();
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedOrderId || !normalizedEmail) return null;

  // Validate UUID format before hitting the DB to avoid a postgres error
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(normalizedOrderId)) return null;

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", normalizedOrderId)
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error("[DB] getGuestOrderWithItems:", error.message);
    return null;
  }
  if (!data) return null;

  const { order_items, ...order } = data as DbOrder & { order_items: DbOrderItem[] };
  return { order: order as DbOrder, items: order_items ?? [] };
}

/**
 * Get a single order with its items by payment_session_id.
 */
export async function getOrderWithItemsBySessionId(
  sessionId: string
): Promise<{ order: DbOrder; items: DbOrderItem[] } | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("payment_session_id", sessionId)
    .maybeSingle();
  if (error) {
    console.error("[DB] getOrderWithItemsBySessionId:", error.message);
    return null;
  }
  if (!data) return null;
  const { order_items, ...order } = data as DbOrder & { order_items: DbOrderItem[] };
  return { order: order as DbOrder, items: order_items ?? [] };
}

/**
 * Get orders for a user (for /account page).
 */
export async function getOrdersByUser(userId: string): Promise<DbOrder[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error("[DB] getOrdersByUser:", error.message);
  return (data as DbOrder[]) ?? [];
}

/**
 * Decrement stock_quantity for each item in a paid order.
 * Items with NULL stock_quantity (unlimited) are skipped.
 * If decrement would go below 0, it is clamped to 0 and a warning is logged.
 */
export async function decrementStockForOrder(orderId: string): Promise<void> {
  const supabase = getServiceClient();

  const { data: items, error } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId);

  if (error || !items?.length) {
    if (error) console.error("[DB] decrementStockForOrder fetch items:", error.message);
    return;
  }

  for (const item of items) {
    if (!item.product_id) continue;

    const { data: product, error: fetchErr } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.product_id)
      .maybeSingle();

    if (fetchErr || !product) continue;
    if (product.stock_quantity == null) continue; // null = unlimited

    const newQty = Math.max(0, product.stock_quantity - item.quantity);
    if (product.stock_quantity < item.quantity) {
      console.warn(
        `[Stock] Oversell on product ${item.product_id}: had ${product.stock_quantity}, sold ${item.quantity}. Clamping to 0.`
      );
    }

    const { error: updateErr } = await supabase
      .from("products")
      .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
      .eq("id", item.product_id);

    if (updateErr) {
      console.error("[DB] decrementStockForOrder update:", updateErr.message);
    } else {
      console.log(`[Stock] product ${item.product_id}: ${product.stock_quantity} → ${newQty}`);
    }
  }
}
