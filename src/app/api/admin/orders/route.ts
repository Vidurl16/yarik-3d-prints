import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { isAdmin } from "@/lib/auth/isAdmin";
import { listOrdersAdmin } from "@/lib/data/orders";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "100");
  const offset = Number(searchParams.get("offset") ?? "0");

  const orders = await listOrdersAdmin({ from, to, status, limit, offset });
  return NextResponse.json({ orders });
}
