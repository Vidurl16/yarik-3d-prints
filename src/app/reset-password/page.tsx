"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/browser";
import Link from "next/link";

type PageState = "loading" | "ready" | "expired" | "success";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getBrowserClient();

    // onAuthStateChange catches PASSWORD_RECOVERY for both flows:
    //  - Implicit: Supabase client auto-processes #access_token hash and fires the event
    //  - PKCE:     createBrowserClient auto-exchanges ?code= on init, then fires the event
    const { data: listener } = supabase.auth.onAuthStateChange((event: import("@supabase/supabase-js").AuthChangeEvent) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setPageState("ready");
      }
    });

    // If neither fires within 15 s, treat link as expired
    const timeout = setTimeout(() => {
      setPageState((prev) => (prev === "loading" ? "expired" : prev));
    }, 15000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = getBrowserClient();

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out. Please try again.")), 15000)
      );
      const update = supabase.auth.updateUser({ password });
      const { error: updateError } = await Promise.race([update, timeout]);

      if (updateError) {
        setError(updateError.message);
        setSubmitting(false);
        return;
      }

      setPageState("success");
      setTimeout(() => router.push("/account"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (pageState === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 pt-20"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <div className="text-center max-w-sm">
          <p
            className="font-heading text-sm tracking-widest mb-4"
            style={{ color: "var(--primary)", opacity: 0.85 }}
          >
            VERIFYING RESET LINK…
          </p>
          <p className="font-body text-xs" style={{ color: "var(--muted)" }}>
            If this message persists, check your spam folder and ensure you clicked
            the most recent reset link.{" "}
            <Link href="/login" style={{ color: "var(--primary)" }}>
              Request a new one
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  // ── Expired / invalid token ───────────────────────────────────────────────
  if (pageState === "expired") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 pt-20"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <div className="text-center max-w-sm space-y-4">
          <p
            className="font-heading text-lg tracking-widest"
            style={{ color: "#f87171" }}
          >
            LINK EXPIRED
          </p>
          <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
            This password reset link is invalid or has expired. Reset links are
            single-use and expire after 1 hour. If your email went to spam, the
            spam scanner may have consumed the link — request a fresh one.
          </p>
          <Link
            href="/login"
            className="inline-block font-body text-xs tracking-[0.2em] uppercase px-6 py-3 transition-colors"
            style={{ background: "var(--primary)", color: "var(--bg)" }}
          >
            Request a New Link
          </Link>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (pageState === "success") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 pt-20"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <div className="text-center max-w-sm space-y-4">
          <p
            className="font-heading text-2xl tracking-widest"
            style={{ color: "var(--primary)" }}
          >
            ✓ PASSWORD UPDATED
          </p>
          <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
            Redirecting you to your account…
          </p>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-20"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1
            className="font-heading text-2xl tracking-[0.15em] mb-2"
            style={{ color: "var(--primary)" }}
          >
            NEW PASSWORD
          </h1>
          <p
            className="font-body text-xs tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            THE DEXARIUM
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block font-body text-xs tracking-[0.1em] mb-2 uppercase"
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
              className="w-full px-4 py-3 font-body text-sm focus:outline-none"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              className="block font-body text-xs tracking-[0.1em] mb-2 uppercase"
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
              className="w-full px-4 py-3 font-body text-sm focus:outline-none"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
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
            disabled={submitting}
            className="w-full disabled:opacity-50 font-body text-xs tracking-[0.2em] py-3.5 transition-colors duration-200 uppercase"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            {submitting ? "UPDATING…" : "SET NEW PASSWORD"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="font-body text-xs tracking-wider"
            style={{ color: "var(--muted)", opacity: 0.6 }}
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
