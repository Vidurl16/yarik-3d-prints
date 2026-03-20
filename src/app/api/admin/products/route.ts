import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { isAdmin } from "@/lib/auth/isAdmin";
import { getServiceClient } from "@/lib/supabase/server";

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

async function checkAdmin() {
  const user = await getSession();
  if (!user || !isAdmin(user.email)) return null;
  return user;
}

// GET /api/admin/products
export async function GET() {
  const user = await checkAdmin();
  if (!user) return forbidden();

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

// POST /api/admin/products
export async function POST(req: NextRequest) {
  const user = await checkAdmin();
  if (!user) return forbidden();

  const body = await req.json();
  const supabase = getServiceClient();

  const insertData = {
    slug: body.slug,
    name: body.name,
    brand: body.brand,
    type: body.type,
    print_type: body.print_type ?? null,
    faction: body.faction ?? null,
    role: body.role ?? null,
    price_cents: Number(body.price_cents),
    currency: body.currency ?? "ZAR",
    tags: Array.isArray(body.tags) ? body.tags : (body.tags ?? "").split(",").map((t: string) => t.trim()).filter(Boolean),
    image_url: body.image_url ?? null,
    is_preorder: Boolean(body.is_preorder),
    is_new: Boolean(body.is_new),
    is_active: body.is_active !== false,
    preorder_date: body.preorder_date ?? null,
    stock_quantity: body.stock_quantity != null ? Number(body.stock_quantity) : null,
  };

  const { data, error } = await supabase
    .from("products")
    .insert(insertData)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Trigger revalidation for storefront
  await triggerRevalidation();

  return NextResponse.json({ product: data }, { status: 201 });
}

async function triggerRevalidation() {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    console.warn("[Revalidate] REVALIDATE_SECRET is not configured — skipping trigger");
    return;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`;
  try {
    const res = await fetch(`${baseUrl}/api/admin/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) {
      console.error("[Revalidate] Trigger failed:", res.status, await res.text());
    }
  } catch {
    console.error("[Revalidate] Trigger request failed");
  }
}
