"use client";

import { useActionState } from "react";
import { submitContactForm } from "./actions";
import type { ContactFormState } from "./actions";

const INITIAL_STATE: ContactFormState = { status: "idle" };

const ENQUIRY_TYPES = [
  "Custom Print",
  "Preorder",
  "Bulk Order",
  "Commission Work",
  "General Enquiry",
];

export default function ContactForm() {
  const [state, action, isPending] = useActionState(submitContactForm, INITIAL_STATE);

  if (state.status === "success") {
    return (
      <div
        className="p-8 text-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div
          className="w-12 h-12 mx-auto mb-4 flex items-center justify-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <svg className="w-6 h-6" style={{ color: "var(--primary)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="font-heading text-lg tracking-widest mb-2" style={{ color: "var(--primary)" }}>
          MESSAGE SENT
        </h3>
        <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
          We&apos;ve received your enquiry and will respond within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="p-8 space-y-6"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <h2 className="font-heading text-lg tracking-widest" style={{ color: "var(--primary)" }}>
        SEND AN ENQUIRY
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--muted)" }}>
            Name <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className="w-full px-4 py-2.5 font-body text-sm outline-none transition-all"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--muted)" }}>
            Email <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="your@email.com"
            className="w-full px-4 py-2.5 font-body text-sm outline-none transition-all"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--muted)" }}>
          Enquiry Type
        </label>
        <select
          name="enquiryType"
          className="w-full px-4 py-2.5 font-body text-sm outline-none transition-all appearance-none"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          <option value="">Select a type…</option>
          {ENQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--muted)" }}>
          Message <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us about your project, order, or question…"
          className="w-full px-4 py-2.5 font-body text-sm outline-none transition-all resize-none"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        />
      </div>

      {state.status === "error" && state.message && (
        <p className="font-body text-xs text-[#ff6060]">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 font-body text-sm tracking-[0.15em] transition-all duration-200"
        style={{
          background: isPending ? "var(--muted)" : "var(--accent)",
          color: "var(--bg)",
          opacity: isPending ? 0.6 : 1,
          cursor: isPending ? "wait" : "pointer",
        }}
      >
        {isPending ? "SENDING…" : "SEND MESSAGE"}
      </button>
    </form>
  );
}
