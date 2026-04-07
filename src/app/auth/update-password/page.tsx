"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/browser";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = getBrowserClient();
    const { data: listener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = getBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/account?updated=true");
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="text-center max-w-sm">
          <p className="font-heading text-sm tracking-widest mb-4" style={{ color: "var(--primary)", opacity: 0.85 }}>
            VERIFYING RESET LINK…
          </p>
          <p className="font-body text-xs" style={{ color: "var(--muted)" }}>
            If this message persists, your link may have expired.{" "}
            <Link href="/login" style={{ color: "var(--primary)" }}>Request a new one</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-heading text-2xl tracking-[0.15em] mb-2" style={{ color: "var(--primary)" }}>
            NEW PASSWORD
          </h1>
          <p className="font-body text-xs tracking-wider" style={{ color: "var(--muted)" }}>THE DEXARIUM</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-body text-xs tracking-[0.1em] mb-2 uppercase" style={{ color: "var(--muted)" }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 font-body text-sm focus:outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block font-body text-xs tracking-[0.1em] mb-2 uppercase" style={{ color: "var(--muted)" }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 font-body text-sm focus:outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-body text-xs text-red-400 bg-red-900/20 border border-red-900/30 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full disabled:opacity-50 font-body text-xs tracking-[0.2em] py-3.5 transition-colors duration-200 uppercase"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            {loading ? "UPDATING…" : "SET NEW PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
}
