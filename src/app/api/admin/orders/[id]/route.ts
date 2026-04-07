import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { isAdmin } from "@/lib/auth/isAdmin";
import { getServiceClient } from "@/lib/supabase/server";
import { getOrderWithItems } from "@/lib/data/orders";
import { sendOrderStatusEmail } from "@/lib/email";

const VALID_STATUSES = ["pending", "processing", "dispatched", "fulfilled", "failed", "refunded", "cancelled"];
const VALID_PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, payment_status, notes, custom_message } = body as {
    status?: string;
    payment_status?: string;
    notes?: string;
    custom_message?: string;
  };

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  if (payment_status && !VALID_PAYMENT_STATUSES.includes(payment_status)) {
    return NextResponse.json({ error: "Invalid payment_status" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (status) update.status = status;
  if (payment_status) {
    update.payment_status = payment_status;
    if (payment_status === "paid") update.paid_at = new Date().toISOString();
  }
  if (notes !== undefined) update.admin_notes = notes;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", id)
    .select("id, status, payment_status, paid_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send status notification email to customer when fulfilment status changes
  if (status) {
    const orderWithItems = await getOrderWithItems(id);
    if (orderWithItems) {
      sendOrderStatusEmail(orderWithItems.order, status, custom_message || undefined).catch((err) =>
        console.error("[Email] Status email failed for order", id, err)
      );
    }
  }

  return NextResponse.json({ order: data });
}
