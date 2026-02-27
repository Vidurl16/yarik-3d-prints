import BundleBuilder from "@/components/BundleBuilder";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bundle Builder — YARIK 3D Prints",
  description: "Build your custom Ork warband. Select 3+ parts for a 15% discount.",
};

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden mb-12" style={{ borderBottom: "1px solid rgba(139,0,0,0.3)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(139,0,0,0.2) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#6b6b6b] font-body mb-6">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">HOME</Link>
            <span className="text-[rgba(201,168,76,0.3)]">›</span>
            <span className="text-[rgba(232,224,208,0.5)]">BUILD</span>
          </div>

          <p className="font-body text-[10px] tracking-[0.3em] text-[rgba(201,168,76,0.5)] mb-3 uppercase">
            Ork Warband · Pick 3+ for 15% Off
          </p>
          <h1 className="font-heading text-3xl sm:text-5xl text-[#e8e0d0] mb-3">
            BUILD YOUR WARBAND
          </h1>
          <p className="font-body text-sm text-[#6b6b6b] max-w-lg leading-relaxed">
            Select your pieces, see your total update live. Bundle 3 or more
            and the 15% warband discount activates automatically.
          </p>

          {/* Discount callout */}
          <div
            className="inline-flex items-center gap-3 mt-6 px-4 py-2"
            style={{ border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.05)" }}
          >
            <svg className="w-4 h-4 text-[#c9a84c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            <span className="font-body text-xs tracking-wider text-[#c9a84c]">
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
