import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { isAdmin } from "@/lib/auth/isAdmin";
import { getServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from") ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const to = searchParams.get("to") ?? new Date().toISOString().slice(0, 10);

  const supabase = getServiceClient();

  // KPI: revenue, order count, AOV
  const { data: kpiData } = await supabase
    .from("orders")
    .select("total_amount_cents, payment_status")
    .eq("payment_status", "paid")
    .gte("paid_at", `${from}T00:00:00Z`)
    .lte("paid_at", `${to}T23:59:59Z`);

  const paidOrders = kpiData ?? [];
  const totalRevenueCents = paidOrders.reduce((sum, o) => sum + (o.total_amount_cents ?? 0), 0);
  const orderCount = paidOrders.length;
  const aovCents = orderCount > 0 ? Math.round(totalRevenueCents / orderCount) : 0;

  // Top products by revenue
  const { data: itemData } = await supabase
    .from("order_items")
    .select(`
      name_snapshot,
      product_id,
      quantity,
      unit_amount_cents,
      orders!inner(payment_status, paid_at)
    `)
    .eq("orders.payment_status", "paid")
    .gte("orders.paid_at", `${from}T00:00:00Z`)
    .lte("orders.paid_at", `${to}T23:59:59Z`);

  // Aggregate by product name
  const productMap: Record<string, { name: string; totalCents: number; totalQty: number }> = {};
  for (const item of itemData ?? []) {
    const key = item.product_id ?? item.name_snapshot ?? "Unknown";
    if (!productMap[key]) {
      productMap[key] = { name: item.name_snapshot ?? key, totalCents: 0, totalQty: 0 };
    }
    productMap[key].totalCents += (item.unit_amount_cents ?? 0) * (item.quantity ?? 1);
    productMap[key].totalQty += item.quantity ?? 1;
  }

  const productList = Object.values(productMap).sort((a, b) => b.totalCents - a.totalCents);
  const topByRevenue = productList.slice(0, 10);
  const topByQuantity = [...productList].sort((a, b) => b.totalQty - a.totalQty).slice(0, 10);

  return NextResponse.json({
    from,
    to,
    totalRevenueCents,
    orderCount,
    aovCents,
    topByRevenue,
    topByQuantity,
  });
}
