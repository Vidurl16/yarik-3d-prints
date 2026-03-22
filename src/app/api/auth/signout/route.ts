import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient } from "@/lib/supabase/server-auth";

/**
 * GET /api/auth/signout
 * Server-side sign-out: clears Supabase auth cookies and redirects to home.
 * More reliable than client-side signOut() which can hang on slow networks.
 */
export async function GET(request: NextRequest) {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(new URL("/", origin));
}
