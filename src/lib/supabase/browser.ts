import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-safe Supabase client (anon key).
 * Uses createBrowserClient from @supabase/ssr so auth tokens are stored in
 * cookies (not just localStorage), allowing server components and middleware
 * to read the session via SSR.
 *
 * Uses a module-level singleton to avoid creating multiple connections.
 */
let _browser: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserClient() {
  if (!_browser) {
    _browser = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _browser;
}
