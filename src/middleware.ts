import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — required for Server Component auth to work correctly
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin email check (coarse gate — server components do a finer check)
    const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!allowlist.includes((user.email ?? "").toLowerCase())) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect /account — redirect to login if not authed
  if (req.nextUrl.pathname.startsWith("/account") && !user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    // Refresh auth cookies on all non-static routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
