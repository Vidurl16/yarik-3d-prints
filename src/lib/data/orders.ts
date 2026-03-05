import { getServiceClient } from "@/lib/supabase/server";
import type { DbOrder, DbOrderItem } from "./types";

/**
 * Upsert an order by Stripe session ID (idempotent).
 * Returns the order ID.
 */
export async function upsertOrder(
  order: Omit<DbOrder, "id" | "created_at">
): Promise<string | null> {
  const supabase = getServiceClient();

  // Check for existing order first (idempotency)
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", order.stripe_session_id)
    .single();

  if (existing) return existing.id as string;

  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select("id")
    .single();

  if (error) {
    console.error("[DB] upsertOrder:", error.message);
    return null;
  }
  return data?.id ?? null;
}

/**
 * Insert order items. Skips duplicates gracefully.
 */
export async function insertOrderItems(
  items: Omit<DbOrderItem, "id" | "created_at">[]
): Promise<void> {
  if (items.length === 0) return;
  const supabase = getServiceClient();
  const { error } = await supabase.from("order_items").insert(items);
  if (error) console.error("[DB] insertOrderItems:", error.message);
}
