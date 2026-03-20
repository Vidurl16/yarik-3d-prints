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

// PATCH /api/admin/products/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAdmin();
  if (!user) return forbidden();

  const { id } = await params;
  const body = await req.json();
  const supabase = getServiceClient();

  const updateData: Record<string, unknown> = {};
  const allowedFields = [
    "slug", "name", "brand", "type", "print_type", "faction", "role", "price_cents", "currency",
    "tags", "image_url", "is_preorder", "is_new", "is_active", "preorder_date", "stock_quantity",
  ];

  for (const field of allowedFields) {
    if (field in body) {
      if (field === "tags" && !Array.isArray(body.tags)) {
        updateData.tags = (body.tags ?? "").split(",").map((t: string) => t.trim()).filter(Boolean);
      } else if (field === "price_cents") {
        updateData.price_cents = Number(body.price_cents);
      } else if (field === "stock_quantity") {
        updateData.stock_quantity = body.stock_quantity != null ? Number(body.stock_quantity) : null;
      } else {
        updateData[field] = body[field];
      }
    }
  }

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await triggerRevalidation();

  return NextResponse.json({ product: data });
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAdmin();
  if (!user) return forbidden();

  const { id } = await params;
  const supabase = getServiceClient();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await triggerRevalidation();

  return NextResponse.json({ success: true });
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
