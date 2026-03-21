"use client";

import { getBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function AccountSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = getBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
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
