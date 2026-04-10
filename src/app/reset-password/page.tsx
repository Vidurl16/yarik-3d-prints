"use client";

/**
 * Password reset landing page.
 *
 * Supabase redirects here after the user clicks the reset-password email link.
 * Two token delivery modes are handled:
 *   - PKCE (default for @supabase/ssr):  URL contains ?code=xxx
 *   - Implicit / hash flow:              URL hash contains #access_token=xxx&type=recovery
 *
 * SUPABASE DASHBOARD:
 *   Auth → URL Configuration → Site URL      = https://thedexarium.co.za
 *   Auth → URL Configuration → Redirect URLs = https://thedexarium.co.za/reset-password
 */

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/browser";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    const supabase = getBrowserClient();
    let settled = false;

    function markReady() {
      if (!settled) { settled = true; setReady(true); }
    }
    function markInvalid() {
      if (!settled) { settled = true; setInvalidToken(true); }
    }

    // PKCE flow — Supabase appends ?code= to the redirectTo URL
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
        if (exchangeError) markInvalid();
        else markReady();
      });
      return;
    }

    // Implicit / hash flow — createBrowserClient detects #access_token in the URL
    // and fires onAuthStateChange with PASSWORD_RECOVERY
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") markReady();
      else if (event === "SIGNED_IN" && session) markReady();
    });

    // Already has a session (e.g. page reload after token was already processed)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) markReady();
    });

    // No valid token arrived within 5 s → show expired state
    const timeout = setTimeout(markInvalid, 5000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
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
      setSuccess(true);
      setTimeout(() => router.push("/account"), 2000);
    }
  }

  // ── States ────────────────────────────────────────────────────────────────

  if (invalidToken) {
    return (
      <div className="text-center max-w-sm">
        <h1 className="font-heading text-xl tracking-[0.15em] mb-3" style={{ color: "var(--accent)" }}>
          LINK EXPIRED
        </h1>
        <p className="font-body text-sm mb-6 leading-relaxed" style={{ color: "var(--muted)" }}>
          This password reset link has expired or has already been used.
          Request a fresh one and use it within 1 hour.
        </p>
        <Link
          href="/login"
          className="font-body text-sm tracking-[0.2em] uppercase px-8 py-3.5 inline-block transition-colors"
          style={{ background: "var(--primary)", color: "var(--bg)" }}
        >
          Request New Link
        </Link>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="text-center max-w-sm">
        <p className="font-body text-sm tracking-widest animate-pulse" style={{ color: "var(--muted)" }}>
          VERIFYING RESET LINK…
        </p>
        <p className="font-body text-xs mt-3" style={{ color: "var(--muted)", opacity: 0.6 }}>
          If this persists,{" "}
          <Link href="/login" style={{ color: "var(--primary)" }}>
            request a new link
          </Link>.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center max-w-sm">
        <h1 className="font-heading text-xl tracking-[0.15em] mb-3" style={{ color: "var(--primary)" }}>
          ✓ PASSWORD UPDATED
        </h1>
        <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
          Redirecting you to your account…
        </p>
      </div>
    );
  }

  // ── Password form ─────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-10">
        <h1 className="font-heading text-2xl tracking-[0.15em] mb-2" style={{ color: "var(--primary)" }}>
          NEW PASSWORD
        </h1>
        <p className="font-body text-xs tracking-wider" style={{ color: "var(--muted)" }}>
          THE DEXARIUM
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            className="block font-body text-sm tracking-[0.2em] mb-2 uppercase"
            style={{ color: "var(--muted)" }}
          >
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-3.5 font-body text-base focus:outline-none transition-colors"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            placeholder="Min. 8 characters"
            autoFocus
          />
        </div>

        <div>
          <label
            className="block font-body text-sm tracking-[0.2em] mb-2 uppercase"
            style={{ color: "var(--muted)" }}
          >
            Confirm Password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-3.5 font-body text-base focus:outline-none transition-colors"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            placeholder="Repeat password"
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
          className="w-full disabled:opacity-50 font-body text-sm tracking-[0.2em] py-4 uppercase transition-colors duration-200"
          style={{ background: "var(--primary)", color: "var(--bg)" }}
        >
          {loading ? "UPDATING…" : "SET NEW PASSWORD"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="font-body text-sm tracking-wider transition-colors"
          style={{ color: "var(--muted)", opacity: 0.7 }}
        >
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-20"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <Suspense
        fallback={
          <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
            Loading…
          </p>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
