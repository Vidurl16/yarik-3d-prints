import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { isAdmin } from "@/lib/auth/isAdmin";

/** GET /api/auth/me — returns current user email + isAdmin flag */
export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ isAdmin: false });
  return NextResponse.json({ isAdmin: isAdmin(user.email), email: user.email });
}
