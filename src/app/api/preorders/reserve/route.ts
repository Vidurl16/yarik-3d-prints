import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/index";

export async function POST(req: NextRequest) {
  try {
    const { product_id, name, email, message } = await req.json();

    if (!product_id || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "product_id, name, and email are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const supabase = getServiceClient();

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name, price_cents, is_preorder, is_active")
      .eq("id", product_id)
      .eq("is_preorder", true)
      .eq("is_active", true)
      .maybeSingle();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found or not available for reservation" }, { status: 404 });
    }

    // Return success if already reserved by same email (idempotent)
    const { data: existing, error: dupCheckError } = await supabase
      .from("preorder_reservations")
      .select("id")
      .eq("product_id", product_id)
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (dupCheckError?.message?.includes("does not exist")) {
      return NextResponse.json(
        { error: "Reservations table not set up — run supabase/migrations/001_create_preorder_reservations.sql in the Supabase dashboard." },
        { status: 503 }
      );
    }

    if (existing) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    const { error: insertError } = await supabase
      .from("preorder_reservations")
      .insert({
        product_id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message?.trim() || null,
      });

    if (insertError) {
      console.error("[Preorder/reserve] Insert error:", insertError.message);
      // Surface a helpful message if the migration hasn't been run yet
      if (insertError.message?.includes("does not exist")) {
        return NextResponse.json(
          { error: "Reservations table not set up — run supabase/migrations/001_create_preorder_reservations.sql in the Supabase dashboard." },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: "Failed to save reservation" }, { status: 500 });
    }

    // Best-effort confirmation email
    await sendEmail({
      to: email.trim(),
      subject: `Reservation confirmed — ${product.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #8b0000;">Preorder Reserved — ${product.name}</h2>
          <p>Hi ${name.trim()},</p>
          <p>Your spot in the queue for <strong>${product.name}</strong> has been secured.
          We&apos;ll be in touch as soon as it&apos;s ready to ship.</p>
          <p>Full payment is due at dispatch — no charge today.</p>
          <hr style="border-color: #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">The Dexarium · South African 3D Prints</p>
        </div>
      `,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Preorder/reserve] Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
