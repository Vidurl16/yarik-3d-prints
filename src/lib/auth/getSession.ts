import { createAuthClient } from "@/lib/supabase/server-auth";
import type { User } from "@supabase/supabase-js";

/**
 * Get the current authenticated user from the SSR cookie session.
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<User | null> {
  try {
    const supabase = await createAuthClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}
