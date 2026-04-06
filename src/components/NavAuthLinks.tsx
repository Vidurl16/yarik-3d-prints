"use client";

import Link from "next/link";
import { getBrowserClient } from "@/lib/supabase/browser";
import { useEffect, useState } from "react";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function NavAuthLinks({ mobile = false }: { mobile?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    let supabase: ReturnType<typeof getBrowserClient> | null = null;
    try {
      supabase = getBrowserClient();
    } catch {
      setReady(true);
      return;
    }

    async function loadUser(u: User) {
      setUser(u);
      setReady(true);
      fetch("/api/auth/me").then(r => r.json()).then(d => setAdmin(!!d.isAdmin)).catch(() => {});
      // Fetch profile for display name — falls back to user_metadata if profile table not yet migrated
      try {
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", u.id).single();
        const name = profile?.full_name || (u.user_metadata?.full_name as string | undefined) || "";
        setFirstName(name.split(" ")[0] ?? "");
      } catch {
        const name = (u.user_metadata?.full_name as string | undefined) ?? "";
        setFirstName(name.split(" ")[0] ?? "");
      }
    }

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      if (data.user) {
        loadUser(data.user);
      } else {
        setReady(true);
      }
    }).catch(() => setReady(true));

    const { data: sub } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        loadUser(session.user);
      } else {
        setUser(null);
        setAdmin(false);
        setFirstName("");
        setReady(true);
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
        {firstName ? `Welcome, ${firstName}` : "ACCOUNT"}{underline}
      </Link>
    </>
  );
}
