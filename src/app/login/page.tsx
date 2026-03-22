"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/browser";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [forgotSent, setForgotSent] = useState(false);
  const [signupSent, setSignupSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getBrowserClient();

    if (mode === "forgot") {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ??
        window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/update-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setForgotSent(true);
      }
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setError(null);
        setSignupSent(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push(next);
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-heading text-2xl tracking-[0.15em] mb-2" style={{ color: "var(--primary)" }}>
            {mode === "login" ? "SIGN IN" : mode === "signup" ? "CREATE ACCOUNT" : "RESET PASSWORD"}
          </h1>
          <p className="font-body text-xs tracking-wider" style={{ color: "var(--muted)" }}>
            THE DEXARIUM
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {forgotSent ? (
            <div className="font-body text-xs text-center px-4 py-6" style={{ color: "var(--muted)" }}>
              <p className="mb-2" style={{ color: "var(--primary)" }}>Check your inbox!</p>
              <p>A reset link has been sent to <strong>{email}</strong>.</p>
            </div>
          ) : signupSent ? (
            <div className="font-body text-xs text-center px-4 py-6" style={{ color: "var(--muted)" }}>
              <p className="mb-2 text-base" style={{ color: "var(--primary)" }}>✓ Account created!</p>
              <p className="mb-4">Check <strong>{email}</strong> for a confirmation link, then come back to sign in.</p>
              <button
                onClick={() => { setMode("login"); setSignupSent(false); setError(null); }}
                className="font-body text-xs tracking-[0.2em] px-6 py-2.5 uppercase transition-colors"
                style={{ background: "var(--accent)", color: "var(--bg)" }}
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <>
          <div>
            <label className="block font-body text-xs tracking-[0.2em] mb-2 uppercase" style={{ color: "var(--muted)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 font-body text-sm focus:outline-none transition-colors"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="your@email.com"
            />
          </div>

          {mode !== "forgot" && (
          <div>
            <label className="block font-body text-xs tracking-[0.2em] mb-2 uppercase" style={{ color: "var(--muted)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 font-body text-sm focus:outline-none transition-colors"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="••••••••"
            />
          </div>
          )}

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
            {loading ? "..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
          </>
          )}
        </form>

        <div className="mt-6 text-center space-y-3">
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setForgotSent(false); }}
            className="font-body text-xs tracking-wider transition-colors"
            style={{ color: "var(--muted)" }}
          >
            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
          {mode === "login" && (
            <div>
              <button
                onClick={() => { setMode("forgot"); setError(null); setForgotSent(false); }}
                className="font-body text-xs tracking-wider transition-colors"
                style={{ color: "var(--muted)", opacity: 0.7 }}
              >
                Forgot password?
              </button>
            </div>
          )}
          {mode === "forgot" && (
            <div>
              <button
                onClick={() => { setMode("login"); setError(null); setForgotSent(false); }}
                className="font-body text-xs tracking-wider transition-colors"
                style={{ color: "var(--muted)", opacity: 0.7 }}
              >
                ← Back to sign in
              </button>
            </div>
          )}
          <div>
            <Link href="/" className="font-body text-xs tracking-wider transition-colors" style={{ color: "var(--muted)", opacity: 0.6 }}>
              ← Back to Dexarium
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
