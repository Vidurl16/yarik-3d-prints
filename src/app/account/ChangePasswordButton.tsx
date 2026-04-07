"use client";

import { useState } from "react";

export default function ChangePasswordButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleClick() {
    setState("loading");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setState(res.ok ? "sent" : "error");
  }

  if (state === "sent") {
    return (
      <p className="font-body text-xs tracking-wider" style={{ color: "#4ade80" }}>
        ✓ Reset link sent to {email}
      </p>
    );
  }

  if (state === "error") {
    return (
      <p className="font-body text-xs tracking-wider" style={{ color: "#f87171" }}>
        Failed to send reset email. Please try again.
      </p>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="font-body text-xs tracking-[0.15em] uppercase px-4 py-2 transition-all disabled:opacity-50"
      style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,160,69,0.5)";
        (e.currentTarget as HTMLElement).style.color = "var(--primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.color = "var(--muted)";
      }}
    >
      {state === "loading" ? "Sending…" : "Send Reset Email"}
    </button>
  );
}
