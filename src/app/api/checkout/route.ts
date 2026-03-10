import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { createOrder, insertOrderItems } from "@/lib/data/orders";
import { getSession } from "@/lib/auth/getSession";

interface CartLineItem {
  product_id?: string;
  name: string;
  price: number; // ZAR, not cents
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartLineItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    // Get session user (optional — guest checkout allowed)
    const user = await getSession();

    const totalCents = items.reduce(
      (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
      0
    );

    const provider = getPaymentProvider();

    // Create a placeholder order in DB with status=pending
    const placeholderSessionId = `pending_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const orderId = await createOrder({
      user_id: user?.id ?? null,
      email: user?.email ?? null,
      currency: "ZAR",
      total_amount_cents: totalCents,
      payment_provider: provider.name,
      payment_session_id: placeholderSessionId,
      payment_status: "pending",
    });

    if (!orderId) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create checkout session with provider
    const checkout = await provider.createCheckout({
      orderId,
      amountCents: totalCents,
      currency: "ZAR",
      customerEmail: user?.email ?? null,
      successUrl: `${baseUrl}/cart?success=true&order=${orderId}`,
      cancelUrl: `${baseUrl}/cart?cancelled=true`,
      metadata: {
        order_id: orderId,
        ...(user?.id ? { user_id: user.id } : {}),
      },
    });

    // Update order with real provider session ID
    const { getServiceClient } = await import("@/lib/supabase/server");
    await getServiceClient()
      .from("orders")
      .update({ payment_session_id: checkout.providerSessionId })
      .eq("id", orderId);

    // Insert order items as snapshot
    await insertOrderItems(
      items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id ?? null,
        name_snapshot: item.name,
        quantity: item.quantity,
        unit_amount_cents: Math.round(item.price * 100),
      }))
    );

    return NextResponse.json({ redirectUrl: checkout.redirectUrl });
  } catch (err) {
    console.error("[Checkout] Error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
