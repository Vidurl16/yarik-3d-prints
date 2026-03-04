import Link from "next/link";
import Image from "next/image";
import { siteCategories, getNewArrivals, getPreorders, formatPrice } from "@/lib/products";

export default function HeroPage() {
  const newArrivals = getNewArrivals().slice(0, 4);
  const preorders = getPreorders().slice(0, 4);

  return (
    <div className="bg-[#0a0a0a]">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Red radial glow */}
        <div
          className="absolute inset-0 pointer-events-none animate-glow-pulse"
          style={{
            background:
              "radial-gradient(ellipse 90% 50% at 50% 110%, rgba(139,0,0,0.45) 0%, transparent 65%)",
          }}
        />
        {/* Top vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 60% at 50% -10%, rgba(201,168,76,0.04) 0%, transparent 60%)",
          }}
        />

        {/* Animated Cog Watermark */}
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

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto pt-16">
          <p className="font-body text-[10px] sm:text-xs tracking-[0.35em] text-[rgba(201,168,76,0.6)] mb-6 uppercase animate-fade-in-up">
            16K Medical-Grade Resin · Bambu Lab Multicolour FDM
          </p>
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
          <p className="font-body text-sm sm:text-base text-[rgba(232,224,208,0.65)] max-w-xl mx-auto leading-relaxed tracking-wide mb-10 animate-fade-in-up-delay-2">
            Premium 16K resin &amp; multicolour FDM printing.
            <br className="hidden sm:block" />
            Built to battlefield standard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-3">
            <Link
              href="/shop"
              className="group relative font-body text-xs sm:text-sm tracking-[0.2em] px-8 py-4 border border-[#c9a84c] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)] transition-all duration-300 min-w-[200px] text-center"
            >
              BROWSE SHOP
            </Link>
            <Link
              href="/builder"
              className="group relative font-body text-xs sm:text-sm tracking-[0.2em] px-8 py-4 bg-[#8b0000] hover:bg-[#b50000] text-[#e8e0d0] transition-all duration-300 min-w-[200px] text-center"
              style={{ boxShadow: "0 0 30px rgba(139,0,0,0.3)" }}
            >
              ARMY BUILDER
            </Link>
          </div>

          <div className="mt-16 flex flex-col items-center gap-2 opacity-30">
            <span className="font-body text-[9px] tracking-[0.3em] text-[#c9a84c]">SCROLL</span>
            <div className="w-px h-10 bg-gradient-to-b from-[#c9a84c] to-transparent" />
          </div>
        </div>

        {/* Bottom Features Bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[rgba(201,168,76,0.08)]">
          <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 divide-x divide-[rgba(201,168,76,0.08)]">
            {[
              { label: "16K DENTAL RESIN", sub: "Medical-grade precision" },
              { label: "BAMBU LAB FDM", sub: "Multicolour enclosed printing" },
              { label: "MADE IN SA", sub: "Shipped across South Africa" },
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

      {/* ── CATEGORY TILES ─────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-body text-[10px] tracking-[0.35em] text-[rgba(201,168,76,0.5)] mb-3 uppercase">
            Collections
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#e8e0d0]">SHOP BY CATEGORY</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {siteCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.id}`}
              className="group relative flex flex-col items-center text-center p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(160deg, #141414 0%, #1a1414 100%)",
                border: `1px solid ${cat.borderColor}`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 50% 120%, ${cat.glowColor} 0%, transparent 70%)`,
                }}
              />
              <div className="relative z-10">
                <span className="text-4xl mb-4 block">{cat.icon}</span>
                <h3
                  className="font-heading text-sm tracking-[0.1em] mb-2 transition-colors"
                  style={{ color: cat.accentColor === "#c9a84c" ? "#c9a84c" : "rgba(232,224,208,0.9)" }}
                >
                  {cat.shortName.toUpperCase()}
                </h3>
                <p className="font-body text-[11px] text-[#6b6b6b] leading-relaxed">
                  {cat.flavorText}
                </p>
                <span
                  className="mt-4 inline-block font-body text-[10px] tracking-[0.2em] transition-colors"
                  style={{ color: cat.accentColor }}
                >
                  EXPLORE →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEW ARRIVALS ───────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-7xl mx-auto"
            style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}
          >
            <div className="flex items-center justify-between mb-10 pt-16">
              <div>
                <p className="font-body text-[10px] tracking-[0.35em] text-[rgba(201,168,76,0.5)] mb-2 uppercase">
                  Just Landed
                </p>
                <h2 className="font-heading text-3xl text-[#e8e0d0]">NEW ARRIVALS</h2>
              </div>
              <Link
                href="/new-arrivals"
                className="font-body text-xs tracking-[0.2em] text-[#c9a84c] hover:text-[#e0c878] transition-colors hidden sm:block"
              >
                VIEW ALL →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {newArrivals.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.siteCategory}`}
                  className="group card-bg overflow-hidden transition-all duration-300 hover:border-[rgba(201,168,76,0.35)]"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-[#111]">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.7)] to-transparent" />
                    <span className="absolute top-2 left-2 font-body text-[9px] tracking-[0.15em] px-2 py-0.5 bg-[rgba(201,168,76,0.2)] text-[#c9a84c] border border-[rgba(201,168,76,0.4)]">
                      NEW
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-body text-xs font-semibold text-[#e8e0d0] leading-snug truncate">
                      {product.name}
                    </p>
                    <p className="font-heading text-sm text-[#c9a84c] mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PREORDERS ──────────────────────────────────────── */}
      {preorders.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 mb-8">
          <div
            className="max-w-7xl mx-auto"
            style={{ borderTop: "1px solid rgba(139,0,0,0.2)" }}
          >
            <div className="flex items-center justify-between mb-10 pt-16">
              <div>
                <p className="font-body text-[10px] tracking-[0.35em] text-[rgba(139,0,0,0.7)] mb-2 uppercase">
                  Coming Soon
                </p>
                <h2 className="font-heading text-3xl text-[#e8e0d0]">PREORDERS</h2>
              </div>
              <Link
                href="/preorders"
                className="font-body text-xs tracking-[0.2em] text-[rgba(139,0,0,0.8)] hover:text-[#b50000] transition-colors hidden sm:block"
              >
                VIEW ALL →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {preorders.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.siteCategory}`}
                  className="group card-bg overflow-hidden transition-all duration-300 hover:border-[rgba(139,0,0,0.4)]"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-[#111]">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.8)] to-transparent" />
                    <span className="absolute top-2 left-2 font-body text-[9px] tracking-[0.15em] px-2 py-0.5 bg-[rgba(139,0,0,0.25)] text-[#ff6060] border border-[rgba(139,0,0,0.5)]">
                      PREORDER
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-body text-xs font-semibold text-[#e8e0d0] leading-snug truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="font-heading text-sm text-[#c9a84c]">
                        {formatPrice(product.price)}
                      </p>
                      {product.preorderDate && (
                        <p className="font-body text-[10px] text-[#6b6b6b]">
                          {product.preorderDate}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
