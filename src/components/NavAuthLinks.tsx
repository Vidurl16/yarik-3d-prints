"use client";

import Link from "next/link";
import { getBrowserClient } from "@/lib/supabase/browser";
import { useEffect, useState } from "react";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function NavAuthLinks({ mobile = false }: { mobile?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let supabase: ReturnType<typeof getBrowserClient> | null = null;
    try {
      supabase = getBrowserClient();
    } catch {
      setReady(true);
      return;
    }

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user);
      setReady(true);
      if (data.user) {
        fetch("/api/auth/me").then(r => r.json()).then(d => setAdmin(!!d.isAdmin)).catch(() => {});
      }
    }).catch(() => setReady(true));

    const { data: sub } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setReady(true);
      if (session?.user) {
        fetch("/api/auth/me").then(r => r.json()).then(d => setAdmin(!!d.isAdmin)).catch(() => {});
      } else {
        setAdmin(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const linkClass = mobile
    ? "block px-2 py-2.5 font-body text-sm tracking-[0.15em] text-[#f0e8d8] hover:text-[#c4a045] transition-colors"
    : "font-body text-xs tracking-[0.15em] text-[#f0e8d8] hover:text-[#c4a045] transition-colors relative group";

  const underline = !mobile && (
    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#c4a045] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
  );

  if (!ready) {
    return (
      <Link href="/login" className={linkClass} style={{ opacity: 0.5 }}>
        LOGIN{underline}
      </Link>
    );
  }

  if (!user) {
    return (
      <Link href="/login" className={linkClass}>
        LOGIN{underline}
      </Link>
    );
  }

  return (
    <>
      {admin && (
        <Link href="/admin" className={linkClass} style={{ color: "#c4a045" }}>
          ADMIN{underline}
        </Link>
      )}
      <Link href="/account" className={linkClass}>
        ACCOUNT{underline}
      </Link>
    </>
  );
}
