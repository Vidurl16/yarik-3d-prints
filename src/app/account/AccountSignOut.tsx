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
      className="font-body text-xs tracking-[0.2em] px-4 py-2 border border-[rgba(196,160,69,0.2)] text-[rgba(240,232,216,0.5)] hover:text-[#f0e8d8] hover:border-[rgba(196,160,69,0.5)] transition-colors"
    >
      SIGN OUT
    </button>
  );
}
