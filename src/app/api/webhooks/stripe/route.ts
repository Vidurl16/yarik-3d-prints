import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { upsertOrder, insertOrderItems } from "@/lib/data/orders";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  // Read raw body for signature verification
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(stripe, session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session
): Promise<void> {
  // Upsert order — idempotent by stripe_session_id
  const orderId = await upsertOrder({
    stripe_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === "string" ? session.payment_intent : null,
    email: session.customer_details?.email ?? null,
    currency: session.currency ?? "zar",
    total_amount_cents: session.amount_total ?? 0,
    status: "paid",
  });

  if (!orderId) {
    // Already existed — upsertOrder returned null only on insert error
    console.warn("[Webhook] Order already exists or failed to insert for session:", session.id);
    return;
  }

  // Fetch line items from Stripe
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  // Insert order items
  await insertOrderItems(
    lineItems.data.map((item) => ({
      order_id: orderId,
      product_id: null, // Phase 1: no product ID mapping yet
      name_snapshot: item.description ?? "",
      quantity: item.quantity ?? 1,
      unit_amount_cents: item.price?.unit_amount ?? 0,
    }))
  );
}
