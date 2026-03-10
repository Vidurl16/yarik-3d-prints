import BundleBuilder from "@/components/BundleBuilder";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Army Builder — YARIK 3D Prints",
  description: "Build your custom army. Select 3+ units for a 15% warband discount.",
};

export default function BuilderPage() {
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <div className="relative overflow-hidden mb-12" style={{ borderBottom: "1px solid var(--border)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 100% at 50% 100%, var(--glow, rgba(139,0,0,0.1)) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] tracking-widest font-body mb-6" style={{ color: "var(--muted)" }}>
            <Link href="/" className="transition-colors" style={{ color: "var(--muted)" }}>HOME</Link>
            <span style={{ color: "var(--border)" }}>›</span>
            <span style={{ color: "var(--text)", opacity: 0.5 }}>BUILD</span>
          </div>

          <p className="font-body text-[10px] tracking-[0.3em] mb-3 uppercase" style={{ color: "var(--primary)", opacity: 0.7 }}>
            Multi-Faction Builder · Pick 3+ for 15% Off
          </p>
          <h1 className="font-heading text-3xl sm:text-5xl mb-3" style={{ color: "var(--text)" }}>
            ARMY BUILDER
          </h1>
          <p className="font-body text-sm max-w-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            Mix units across Space Marines, Orks, Chaos, and Tyranids. Bundle 3 or more
            and the 15% warband discount activates automatically.
          </p>

          {/* Discount callout */}
          <div
            className="inline-flex items-center gap-3 mt-6 px-4 py-2"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
          >
            <svg className="w-4 h-4" style={{ color: "var(--primary)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            <span className="font-body text-xs tracking-wider" style={{ color: "var(--primary)" }}>
              SELECT 3+ PARTS TO UNLOCK 15% WARBAND DISCOUNT
            </span>
          </div>
        </div>
      </div>

      {/* Builder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BundleBuilder />
      </div>
    </div>
  );
}
