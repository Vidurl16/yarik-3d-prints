import Link from "next/link";

export default function HeroPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* ── Red radial glow (bottom) ─────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none animate-glow-pulse"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% 110%, rgba(139,0,0,0.45) 0%, transparent 65%)",
        }}
      />

      {/* ── Subtle top vignette ──────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% -10%, rgba(201,168,76,0.04) 0%, transparent 60%)",
        }}
      />

      {/* ── Animated Cog Watermark ───────────────────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-[700px] h-[700px] opacity-[0.025] animate-spin-slow"
          fill="currentColor"
          style={{ color: "#c9a84c" }}
        >
          <path d="M43.6,2.1l-3.4,9.2c-2.5,0.6-4.9,1.5-7.1,2.7L24,9.2l-9.2,9.2l4.8,9.1
            c-1.2,2.2-2.1,4.6-2.7,7.1L7.7,38v13l9.2,3.4c0.6,2.5,1.5,4.9,2.7,7.1L14.8,71L24,80.2
            l9.1-4.8c2.2,1.2,4.6,2.1,7.1,2.7l3.4,9.2h13l3.4-9.2c2.5-0.6,4.9-1.5,7.1-2.7l9.1,4.8
            L85.2,71l-4.8-9.1c1.2-2.2,2.1-4.6,2.7-7.1l9.2-3.4V38l-9.2-3.4c-0.6-2.5-1.5-4.9-2.7-7.1
            l4.8-9.1L76,9.2l-9.1,4.8c-2.2-1.2-4.6-2.1-7.1-2.7L56.4,2.1H43.6z
            M50,32c9.9,0,18,8.1,18,18s-8.1,18-18,18s-18-8.1-18-18S40.1,32,50,32z
            M50,38c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S56.6,38,50,38z" />
        </svg>
      </div>

      {/* ── Second smaller cog (reverse) ─────────────────────── */}
      <div
        className="absolute bottom-10 right-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-40 h-40 opacity-[0.04] animate-spin-reverse"
          fill="currentColor"
          style={{ color: "#8b0000" }}
        >
          <path d="M43.6,2.1l-3.4,9.2c-2.5,0.6-4.9,1.5-7.1,2.7L24,9.2l-9.2,9.2l4.8,9.1
            c-1.2,2.2-2.1,4.6-2.7,7.1L7.7,38v13l9.2,3.4c0.6,2.5,1.5,4.9,2.7,7.1L14.8,71L24,80.2
            l9.1-4.8c2.2,1.2,4.6,2.1,7.1,2.7l3.4,9.2h13l3.4-9.2c2.5-0.6,4.9-1.5,7.1-2.7l9.1,4.8
            L85.2,71l-4.8-9.1c1.2-2.2,2.1-4.6,2.7-7.1l9.2-3.4V38l-9.2-3.4c-0.6-2.5-1.5-4.9-2.7-7.1
            l4.8-9.1L76,9.2l-9.1,4.8c-2.2-1.2-4.6-2.1-7.1-2.7L56.4,2.1H43.6z
            M50,38c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S56.6,38,50,38z" />
        </svg>
      </div>

      {/* ── Hero Content ─────────────────────────────────────── */}
      <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto pt-16">
        {/* Overline */}
        <p
          className="font-body text-[10px] sm:text-xs tracking-[0.35em] text-[rgba(201,168,76,0.6)] mb-6 uppercase animate-fade-in-up"
        >
          Medical-Grade Resin · Bambu Lab Multicolour FDM
        </p>

        {/* Main Headline */}
        <h1
          className="font-heading text-5xl sm:text-7xl md:text-8xl text-[#e8e0d0] leading-[1.05] mb-6 animate-fade-in-up-delay-1"
          style={{
            textShadow: "0 0 80px rgba(201,168,76,0.15), 0 2px 40px rgba(0,0,0,0.8)",
          }}
        >
          FORGE YOUR
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #c9a84c 0%, #e0c878 40%, #a07a20 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ARMY
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="font-body text-sm sm:text-base text-[rgba(232,224,208,0.65)] max-w-xl mx-auto leading-relaxed tracking-wide mb-10 animate-fade-in-up-delay-2"
        >
          Medical-grade resin &amp; multicolour FDM printing.
          <br className="hidden sm:block" />
          Built to battlefield standard.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-3">
          <Link
            href="/shop"
            className="group relative font-body text-xs sm:text-sm tracking-[0.2em] px-8 py-4 border border-[#c9a84c] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)] transition-all duration-300 min-w-[200px] text-center"
          >
            <span className="relative z-10">SHOP BY FACTION</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 100%)" }}
            />
          </Link>

          <Link
            href="/builder"
            className="group relative font-body text-xs sm:text-sm tracking-[0.2em] px-8 py-4 bg-[#8b0000] hover:bg-[#b50000] text-[#e8e0d0] transition-all duration-300 min-w-[200px] text-center"
            style={{ boxShadow: "0 0 30px rgba(139,0,0,0.3)" }}
          >
            BUILD A BUNDLE
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-30">
          <span className="font-body text-[9px] tracking-[0.3em] text-[#c9a84c]">SCROLL</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#c9a84c] to-transparent" />
        </div>
      </div>

      {/* ── Bottom Features Bar ───────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[rgba(201,168,76,0.08)]">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 divide-x divide-[rgba(201,168,76,0.08)]">
          {[
            { label: "DENTAL RESIN", sub: "Medical-grade precision" },
            { label: "BAMBU LAB FDM", sub: "Multicolour enclosed printing" },
            { label: "WARHAMMER 40K", sub: "Minis, terrain & customs" },
          ].map(({ label, sub }) => (
            <div key={label} className="px-4 sm:px-6 text-center">
              <p className="font-heading text-[8px] sm:text-[10px] tracking-[0.2em] text-[rgba(201,168,76,0.6)]">
                {label}
              </p>
              <p className="font-body text-[9px] sm:text-xs text-[#6b6b6b] mt-0.5 hidden sm:block">
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
