import { createClient } from "@supabase/supabase-js";

/**
 * Browser-safe Supabase client (anon key).
 * Uses a module-level singleton to avoid creating multiple connections.
 */
let _browser: ReturnType<typeof createClient> | null = null;

export function getBrowserClient() {
  if (!_browser) {
    _browser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _browser;
}
