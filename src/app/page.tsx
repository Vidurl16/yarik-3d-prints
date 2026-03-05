import Link from "next/link";
import Image from "next/image";
import { siteCategories, getNewArrivals, getPreorders, formatPrice } from "@/lib/products";

// Map siteCategory IDs → new top-level brand routes
const CATEGORY_ROUTE_MAP: Record<string, string> = {
  "grimdark-future": "/grimdark-future",
  "age-of-fantasy": "/age-of-fantasy",
  "pokemon": "/pokemon",
  "basing-battle-effects": "/basing-battle-effects",
  "gaming-accessories-terrain": "/gaming-accessories-terrain",
};

export default function HeroPage() {
  const newArrivals = getNewArrivals().slice(0, 4);
  const preorders = getPreorders().slice(0, 4);

  return (
    <div data-theme="dexarium" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Warm amber radial glow */}
        <div
          className="absolute inset-0 pointer-events-none animate-glow-pulse"
          style={{
            background:
              "radial-gradient(ellipse 90% 50% at 50% 110%, rgba(123,94,42,0.35) 0%, transparent 65%)",
          }}
        />
        {/* Top gold vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 60% at 50% -10%, rgba(196,160,69,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Animated gem/hex watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-[600px] h-[600px] opacity-[0.03] animate-spin-slow"
            fill="currentColor"
            style={{ color: "#c4a045" }}
          >
            <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto pt-16">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div
              className="relative w-28 h-28 sm:w-36 sm:h-36 overflow-hidden rounded-full"
              style={{
                boxShadow: "0 0 60px rgba(196,160,69,0.25), 0 0 120px rgba(196,160,69,0.08)",
                border: "2px solid rgba(196,160,69,0.3)",
              }}
            >
              <Image
                src="/logo.jpg"
                alt="The Dexarium"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 112px, 144px"
                priority
              />
            </div>
          </div>

          <p className="font-body text-[10px] sm:text-xs tracking-[0.35em] text-[rgba(196,160,69,0.6)] mb-4 uppercase animate-fade-in-up">
            🇿🇦 South African · Unique Pokémon &amp; Tabletop Merchandise
          </p>
          <h1
            className="font-heading text-5xl sm:text-7xl md:text-8xl text-[#f0e8d8] leading-[1.05] mb-4 animate-fade-in-up-delay-1"
            style={{
              textShadow: "0 0 80px rgba(196,160,69,0.15), 0 2px 40px rgba(0,0,0,0.8)",
            }}
          >
            THE DEXARIUM
          </h1>
          <p
            className="font-heading text-xl sm:text-2xl mb-8 animate-fade-in-up-delay-1"
            style={{
              background: "linear-gradient(135deg, #c4a045 0%, #ddb95a 40%, #9a7820 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.25em",
            }}
          >
            FROM SPARK TO LEGEND
          </p>
          <p className="font-body text-sm sm:text-base text-[rgba(240,232,216,0.55)] max-w-xl mx-auto leading-relaxed tracking-wide mb-10 animate-fade-in-up-delay-2">
            Premium 16K resin &amp; multicolour FDM printing.
            <br className="hidden sm:block" />
            Pokémon, Warhammer, custom orders — built to last.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-3">
            <Link
              href="/shop"
              className="group relative font-body text-xs sm:text-sm tracking-[0.2em] px-8 py-4 border border-[#c4a045] text-[#c4a045] hover:bg-[rgba(196,160,69,0.1)] transition-all duration-300 min-w-[200px] text-center"
            >
              BROWSE SHOP
            </Link>
            <Link
              href="/builder"
              className="group relative font-body text-xs sm:text-sm tracking-[0.2em] px-8 py-4 bg-[#7b5e2a] hover:bg-[#9a7838] text-[#f0e8d8] transition-all duration-300 min-w-[200px] text-center"
              style={{ boxShadow: "0 0 30px rgba(123,94,42,0.3)" }}
            >
              ARMY BUILDER
            </Link>
          </div>

          <div className="mt-16 flex flex-col items-center gap-2 opacity-30">
            <span className="font-body text-[9px] tracking-[0.3em] text-[#c4a045]">SCROLL</span>
            <div className="w-px h-10 bg-gradient-to-b from-[#c4a045] to-transparent" />
          </div>
        </div>

        {/* Bottom Features Bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[rgba(196,160,69,0.08)]">
          <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 divide-x divide-[rgba(196,160,69,0.08)]">
            {[
              { label: "16K DENTAL RESIN", sub: "Medical-grade precision" },
              { label: "BAMBU LAB FDM", sub: "Multicolour enclosed printing" },
              { label: "MADE IN SA 🇿🇦", sub: "Shipped across South Africa" },
            ].map(({ label, sub }) => (
              <div key={label} className="px-4 sm:px-6 text-center">
                <p className="font-heading text-[8px] sm:text-[10px] tracking-[0.2em] text-[rgba(196,160,69,0.6)]">
                  {label}
                </p>
                <p className="font-body text-[9px] sm:text-xs text-[#6b5e48] mt-0.5 hidden sm:block">
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
          <p className="font-body text-[10px] tracking-[0.35em] text-[rgba(196,160,69,0.5)] mb-3 uppercase">
            Collections
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#f0e8d8]">SHOP BY CATEGORY</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {siteCategories.map((cat) => (
            <Link
              key={cat.id}
              href={CATEGORY_ROUTE_MAP[cat.id] ?? `/shop/${cat.id}`}
              className="group relative flex flex-col items-center text-center p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(160deg, #140e06 0%, #1c1508 100%)",
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
                <h3 className="font-heading text-sm tracking-[0.1em] mb-2 text-[rgba(240,232,216,0.9)]">
                  {cat.shortName.toUpperCase()}
                </h3>
                <p className="font-body text-[11px] text-[#6b5e48] leading-relaxed">
                  {cat.flavorText}
                </p>
                <span className="mt-4 inline-block font-body text-[10px] tracking-[0.2em] text-[#c4a045] group-hover:text-[#ddb95a] transition-colors">
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
            style={{ borderTop: "1px solid rgba(196,160,69,0.1)" }}
          >
            <div className="flex items-center justify-between mb-10 pt-16">
              <div>
                <p className="font-body text-[10px] tracking-[0.35em] text-[rgba(196,160,69,0.5)] mb-2 uppercase">
                  Just Landed
                </p>
                <h2 className="font-heading text-3xl text-[#f0e8d8]">NEW ARRIVALS</h2>
              </div>
              <Link
                href="/new-arrivals"
                className="font-body text-xs tracking-[0.2em] text-[#c4a045] hover:text-[#ddb95a] transition-colors hidden sm:block"
              >
                VIEW ALL →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {newArrivals.map((product) => (
                <Link
                  key={product.id}
                  href={CATEGORY_ROUTE_MAP[product.siteCategory] ?? `/shop/${product.siteCategory}`}
                  className="group card-bg overflow-hidden transition-all duration-300 hover:border-[rgba(196,160,69,0.35)]"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-[#0f0a03]">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,9,2,0.7)] to-transparent" />
                    <span className="absolute top-2 left-2 font-body text-[9px] tracking-[0.15em] px-2 py-0.5 bg-[rgba(196,160,69,0.2)] text-[#c4a045] border border-[rgba(196,160,69,0.4)]">
                      NEW
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-body text-xs font-semibold text-[#f0e8d8] leading-snug truncate">
                      {product.name}
                    </p>
                    <p className="font-heading text-sm text-[#c4a045] mt-1">
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
            style={{ borderTop: "1px solid rgba(123,94,42,0.2)" }}
          >
            <div className="flex items-center justify-between mb-10 pt-16">
              <div>
                <p className="font-body text-[10px] tracking-[0.35em] text-[rgba(196,160,69,0.5)] mb-2 uppercase">
                  Coming Soon
                </p>
                <h2 className="font-heading text-3xl text-[#f0e8d8]">PREORDERS</h2>
              </div>
              <Link
                href="/preorders"
                className="font-body text-xs tracking-[0.2em] text-[#c4a045] hover:text-[#ddb95a] transition-colors hidden sm:block"
              >
                VIEW ALL →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {preorders.map((product) => (
                <Link
                  key={product.id}
                  href={CATEGORY_ROUTE_MAP[product.siteCategory] ?? `/shop/${product.siteCategory}`}
                  className="group card-bg overflow-hidden transition-all duration-300 hover:border-[rgba(196,160,69,0.3)]"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-[#0f0a03]">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,9,2,0.8)] to-transparent" />
                    <span className="absolute top-2 left-2 font-body text-[9px] tracking-[0.15em] px-2 py-0.5 bg-[rgba(123,94,42,0.25)] text-[#c4a045] border border-[rgba(123,94,42,0.5)]">
                      PREORDER
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-body text-xs font-semibold text-[#f0e8d8] leading-snug truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="font-heading text-sm text-[#c4a045]">
                        {formatPrice(product.price)}
                      </p>
                      {product.preorderDate && (
                        <p className="font-body text-[10px] text-[#6b5e48]">
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
