"use client";

/**
 * CartSyncProvider
 *
 * Mounts once at the root layout. Handles two responsibilities:
 *
 * 1. Auth-triggered merge: when a user signs in, merge their local
 *    (guest) cart with the cart stored in Supabase, then persist
 *    the merged result back to DB.
 *
 * 2. Ongoing sync: while logged in, debounce-save cart changes to
 *    Supabase whenever the items array changes.
 */

import { useEffect, useRef } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { useCartStore } from "@/store/cartStore";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function CartSyncProvider() {
  const mergeAndSync = useCartStore((s) => s.mergeAndSync);
  const syncToDb = useCartStore((s) => s.syncToDb);
  const items = useCartStore((s) => s.items);
  const activeUserIdRef = useRef<string | null>(null);

  // --- 1. Auth state listener ---
  useEffect(() => {
    const supabase = getBrowserClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_IN" && session?.user) {
          activeUserIdRef.current = session.user.id;
          await mergeAndSync(session.user.id);
        } else if (event === "SIGNED_OUT") {
          activeUserIdRef.current = null;
        } else if (event === "INITIAL_SESSION" && session?.user) {
          // Page loaded while already logged in — sync current local cart to DB
          activeUserIdRef.current = session.user.id;
          await mergeAndSync(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  // mergeAndSync is a stable store reference — no need to re-run on change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 2. Ongoing sync while logged in ---
  useEffect(() => {
    const userId = activeUserIdRef.current;
    if (!userId) return;
    syncToDb(userId);
  // We intentionally depend on `items` to trigger sync on every cart change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return null;
}
