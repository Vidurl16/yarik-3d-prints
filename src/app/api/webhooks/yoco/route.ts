import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { updateOrderPaymentStatus, getOrderWithItemsBySessionId, decrementStockForOrder } from "@/lib/data/orders";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let provider;
  try {
    provider = getPaymentProvider();
  } catch (err) {
    console.error("[Webhook/yoco] Provider init error:", err);
    return NextResponse.json({ error: "Payment provider not configured" }, { status: 503 });
  }

  let event;
  try {
    event = await provider.verifyWebhookAndParseEvent(headers, rawBody);
  } catch (err) {
    console.error("[Webhook/yoco] Signature verification failed:", err);
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  if (event.status === "unknown" || !event.providerSessionId) {
    return NextResponse.json({ received: true, processed: false });
  }

  const paymentStatus =
    event.status === "succeeded"
      ? "paid"
      : event.status === "refunded"
      ? "refunded"
      : "failed";

  const updated = await updateOrderPaymentStatus(
    event.providerSessionId,
    paymentStatus,
    {
      eventId: event.providerEventId,
      paidAt: paymentStatus === "paid" ? new Date().toISOString() : undefined,
      totalAmountCents: event.amountCents ?? undefined,
      email: event.customerEmail ?? undefined,
      metadata: event.metadata,
    }
  );

  if (!updated) {
    console.warn("[Webhook/yoco] Order not found for session:", event.providerSessionId);
  }

  if (updated && paymentStatus === "paid") {
    const orderWithItems = await getOrderWithItemsBySessionId(event.providerSessionId);
    if (orderWithItems) {
      // Decrement stock before sending confirmation email
      await decrementStockForOrder(orderWithItems.order.id);
      await sendOrderConfirmationEmail(orderWithItems.order, orderWithItems.items);
    }
  }

  return NextResponse.json({ received: true, processed: updated });
}
