import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * POST /api/admin/revalidate
 * Purges ISR cache for all storefront pages so product changes appear immediately.
 * Protected by a simple shared secret (not user auth — called server-to-server).
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET ?? "dev";

  if (secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Revalidate all product-related pages
  revalidatePath("/shop");
  revalidatePath("/new-arrivals");
  revalidatePath("/preorders");
  // Brand-specific pages
  const brands = [
    "grimdark-future",
    "age-of-fantasy",
    "pokemon",
    "basing-battle-effects",
    "gaming-accessories-terrain",
  ];
  for (const brand of brands) {
    revalidatePath(`/${brand}`);
  }

  return NextResponse.json({ revalidated: true });
}
