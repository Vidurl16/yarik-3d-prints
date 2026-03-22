"use client";

import { getBrowserClient } from "@/lib/supabase/browser";

export default function AccountSignOut() {
  async function handleSignOut() {
    try {
      const supabase = getBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // If Supabase isn't configured, still redirect away
    }
    // Hard redirect so server session cache is fully cleared
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleSignOut}
      className="font-body text-xs tracking-[0.2em] px-4 py-2 transition-colors"
      style={{
        border: "1px solid var(--border)",
        color: "var(--muted)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.color = "var(--text)";
        el.style.borderColor = "var(--primary)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.color = "var(--muted)";
        el.style.borderColor = "var(--border)";
      }}
    >
      SIGN OUT
    </button>
  );
}
