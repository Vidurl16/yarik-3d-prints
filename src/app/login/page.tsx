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
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getBrowserClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setError(null);
        setMode("login");
        alert("Check your email for a confirmation link, then log in.");
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
    <div className="min-h-screen bg-[#0c0902] flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-heading text-2xl tracking-[0.15em] text-[#c4a045] mb-2">
            {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </h1>
          <p className="font-body text-xs tracking-wider text-[rgba(196,160,69,0.4)]">
            THE DEXARIUM
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-body text-xs tracking-[0.2em] text-[rgba(240,232,216,0.5)] mb-2 uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#140e06] border border-[rgba(196,160,69,0.2)] px-4 py-3 font-body text-sm text-[#f0e8d8] placeholder-[#3a3228] focus:outline-none focus:border-[rgba(196,160,69,0.6)] transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block font-body text-xs tracking-[0.2em] text-[rgba(240,232,216,0.5)] mb-2 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#140e06] border border-[rgba(196,160,69,0.2)] px-4 py-3 font-body text-sm text-[#f0e8d8] placeholder-[#3a3228] focus:outline-none focus:border-[rgba(196,160,69,0.6)] transition-colors"
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
            className="w-full bg-[#8b0000] hover:bg-[#b50000] disabled:opacity-50 text-[#f0e8d8] font-body text-xs tracking-[0.2em] py-3.5 transition-colors duration-200 uppercase"
          >
            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
            className="font-body text-xs text-[rgba(196,160,69,0.5)] hover:text-[#c4a045] transition-colors tracking-wider"
          >
            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
          <div>
            <Link href="/" className="font-body text-xs text-[rgba(240,232,216,0.3)] hover:text-[rgba(240,232,216,0.6)] transition-colors tracking-wider">
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
