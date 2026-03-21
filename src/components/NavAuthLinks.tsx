"use client";

import Link from "next/link";
import { getBrowserClient } from "@/lib/supabase/browser";
import { useEffect, useState } from "react";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function NavAuthLinks({ mobile = false }: { mobile?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = getBrowserClient();
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return null;

  const linkClass = mobile
    ? "block px-2 py-2.5 font-body text-sm tracking-[0.15em] text-[#f0e8d8] hover:text-[#c4a045] transition-colors"
    : "font-body text-xs tracking-[0.15em] text-[#f0e8d8] hover:text-[#c4a045] transition-colors relative group";

  return user ? (
    <Link href="/account" className={linkClass}>
      ACCOUNT
      {!mobile && <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#c4a045] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />}
    </Link>
  ) : (
    <Link href="/login" className={linkClass}>
      LOGIN
      {!mobile && <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#c4a045] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />}
    </Link>
  );
}
