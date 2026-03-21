"use client";

import { getBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function AdminSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = getBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="font-body text-xs tracking-wide px-3 py-1.5 border border-[rgba(196,160,69,0.3)] text-[rgba(240,232,216,0.7)] hover:text-[rgba(240,232,216,0.8)] hover:border-[rgba(196,160,69,0.4)] transition-colors"
    >
      Sign Out
    </button>
  );
}
