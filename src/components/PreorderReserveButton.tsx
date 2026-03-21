"use client";

import { useState } from "react";

interface PreorderReserveButtonProps {
  productId: string;
  productName: string;
}

type Step = "idle" | "form" | "loading" | "success" | "error";

export default function PreorderReserveButton({ productId, productName }: PreorderReserveButtonProps) {
  const [step, setStep] = useState<Step>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/preorders/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, name, email, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong");
        setStep("error");
      } else {
        setStep("success");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStep("error");
    }
  }

  if (step === "success") {
    return (
      <div className="font-body text-xs tracking-wider px-3 py-1.5 bg-[rgba(139,0,0,0.2)] text-[#ff6060] border border-[rgba(139,0,0,0.4)] text-center">
        ✓ RESERVED
      </div>
    );
  }

  if (step === "idle") {
    return (
      <button
        onClick={() => setStep("form")}
        className="font-body text-xs tracking-wider px-3 py-1.5 bg-[rgba(139,0,0,0.2)] hover:bg-[rgba(139,0,0,0.4)] text-[#ff6060] border border-[rgba(139,0,0,0.4)] transition-all duration-200"
      >
        RESERVE
      </button>
    );
  }

  return (
    <div
      className="mt-3 p-4"
      style={{ background: "rgba(139,0,0,0.08)", border: "1px solid rgba(139,0,0,0.25)" }}
    >
      <p className="font-body text-xs tracking-wider mb-3 text-[#ff6060]">
        RESERVE: {productName}
      </p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className="w-full px-3 py-2 font-body text-xs focus:outline-none"
          style={{ background: "var(--bg)", border: "1px solid rgba(139,0,0,0.3)", color: "var(--text)" }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-3 py-2 font-body text-xs focus:outline-none"
          style={{ background: "var(--bg)", border: "1px solid rgba(139,0,0,0.3)", color: "var(--text)" }}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
          className="w-full px-3 py-2 font-body text-xs focus:outline-none resize-none"
          style={{ background: "var(--bg)", border: "1px solid rgba(139,0,0,0.3)", color: "var(--text)" }}
        />

        {(step === "error" && errorMsg) && (
          <p className="font-body text-xs text-red-400">{errorMsg}</p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={step === "loading"}
            className="flex-1 font-body text-xs tracking-wider py-2 bg-[rgba(139,0,0,0.6)] hover:bg-[rgba(139,0,0,0.8)] text-[#ff6060] border border-[rgba(139,0,0,0.5)] transition-all duration-200 disabled:opacity-50"
          >
            {step === "loading" ? "..." : "CONFIRM"}
          </button>
          <button
            type="button"
            onClick={() => { setStep("idle"); setErrorMsg(null); }}
            className="font-body text-xs tracking-wider px-3 py-2 transition-colors"
            style={{ color: "var(--muted)" }}
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
