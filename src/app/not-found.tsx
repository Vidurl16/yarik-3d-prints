import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — The Dexarium",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="text-center max-w-md">
        <div
          className="h-px mb-12 w-24 mx-auto"
          style={{ background: "var(--primary)", opacity: 0.5 }}
        />

        <p className="font-body text-xs tracking-[0.15em] mb-4 uppercase" style={{ color: "var(--primary)", opacity: 0.8 }}>
          Error 404
        </p>

        <h1 className="font-heading text-5xl sm:text-6xl mb-4" style={{ color: "var(--primary)" }}>
          LOST IN THE WARP
        </h1>

        <p className="font-body text-sm leading-relaxed mb-10" style={{ color: "var(--muted)" }}>
          The page you seek has been swallowed by the immaterium. The coordinates you entered lead nowhere in this plane of existence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="font-body text-xs tracking-[0.2em] px-8 py-3 transition-all duration-200 inline-block"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            RETURN TO SAFETY
          </Link>
          <Link
            href="/shop"
            className="font-body text-xs tracking-[0.2em] px-8 py-3 transition-all duration-200 inline-block"
            style={{ border: "1px solid var(--border)", color: "var(--primary)" }}
          >
            BROWSE THE SHOP
          </Link>
        </div>

        <div
          className="h-px mt-12 w-24 mx-auto"
          style={{ background: "var(--primary)", opacity: 0.5 }}
        />
      </div>
    </div>
  );
}
