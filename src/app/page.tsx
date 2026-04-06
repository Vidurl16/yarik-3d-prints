import Link from "next/link";
import Image from "next/image";
import { siteCategories, formatPrice } from "@/lib/products";
import { getNewArrivals, getPreorders } from "@/lib/data/products";

const CATEGORY_THUMBNAIL: Record<string, string> = {
  "grimdark-future":           "/images/categories/thumbnails/grimdark-future.jpg",
  "age-of-fantasy":            "/images/categories/thumbnails/age-of-fantasy.jpg",
  "pokemon":                   "/images/categories/thumbnails/pokemon.jpg",
  "basing-battle-effects":     "/images/categories/thumbnails/basing-bits.jpg",
  "gaming-accessories-terrain":"/images/categories/thumbnails/terrain.jpg",
  "display-figures-busts":     "/images/categories/thumbnails/figurines-and-busts.jpg",
};

// Map siteCategory IDs → top-level brand routes
const CATEGORY_ROUTE_MAP: Record<string, string> = {
  "grimdark-future": "/grimdark-future",
  "age-of-fantasy": "/age-of-fantasy",
  "pokemon": "/pokemon",
  "basing-battle-effects": "/basing-battle-effects",
  "gaming-accessories-terrain": "/gaming-accessories-terrain",
  "display-figures-busts": "/display-figures-busts",
};

export default async function HeroPage() {
  const [newArrivalsData, preordersData] = await Promise.all([
    getNewArrivals(),
    getPreorders(),
  ]);
  const newArrivals = newArrivalsData.slice(0, 4);
  const preorders = preordersData.slice(0, 4);

  return (
    <div data-theme="dexarium" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative min-h-screen flex items-start justify-center overflow-hidden">
        {/* Subtle warm vignette at bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 110%, var(--glow) 0%, transparent 60%)",
          }}
        />
        {/* Decorative corner ornaments */}
        {([
          ["top-8 left-8",    "M 0 48 L 0 0 L 48 0"],
          ["top-8 right-8",   "M 48 48 L 48 0 L 0 0"],
          ["bottom-24 left-8",  "M 0 0 L 0 48 L 48 48"],
          ["bottom-24 right-8", "M 48 0 L 48 48 L 0 48"],
        ] as [string, string][]).map(([pos, d]) => (
          <div key={pos} className={`absolute ${pos} pointer-events-none hidden sm:block`} style={{ opacity: 0.18 }} aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--primary)" strokeWidth="1.5">
              <path d={d} />
            </svg>
          </div>
        ))}

        {/* Very faint hex watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-[600px] h-[600px] opacity-[0.04] animate-spin-slow"
            fill="currentColor"
            style={{ color: "var(--primary)" }}
          >
            <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto pt-28 pb-16">
          {/* Logo */}
          <div className="flex justify-center mb-6 animate-fade-in-up">
            <div
              className="relative w-40 h-40 sm:w-52 sm:h-52 overflow-hidden rounded-full"
              style={{
                boxShadow: "0 4px 32px var(--glow), 0 1px 4px rgba(0,0,0,0.1)",
                border: "2px solid var(--border)",
              }}
            >
              <Image
                src="/logo.jpg"
                alt="The Dexarium"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 160px, 208px"
                priority
              />
            </div>
          </div>

          <p
            className="font-body text-xs tracking-[0.15em] mb-4 uppercase animate-fade-in-up"
            style={{ color: "var(--muted)" }}
          >
            🇿🇦 South African · Unique Pokémon &amp; Tabletop Merchandise
          </p>
          <h1
            className="font-heading text-5xl sm:text-7xl md:text-8xl leading-[1.05] mb-4 animate-fade-in-up-delay-1"
            style={{ color: "var(--text)" }}
          >
            THE DEXARIUM
          </h1>
          <p
            className="font-heading text-xl sm:text-2xl mb-8 animate-fade-in-up-delay-1"
            style={{
              color: "var(--primary)",
              letterSpacing: "0.25em",
            }}
          >
            FROM SPARK TO LEGEND
          </p>
          <p
            className="font-body text-sm sm:text-base max-w-xl mx-auto leading-relaxed tracking-wide mb-10 animate-fade-in-up-delay-2"
            style={{ color: "var(--muted)" }}
          >
            Premium 16K resin &amp; multicolour FDM printing.
            <br className="hidden sm:block" />
            Pokémon, Warhammer, custom orders — built to last.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-3">
            <Link
              href="/shop"
              className="group font-body text-xs sm:text-sm tracking-[0.2em] px-8 py-4 transition-all duration-300 min-w-[200px] text-center"
              style={{
                border: "1px solid var(--primary)",
                color: "var(--primary)",
              }}
            >
              BROWSE SHOP
            </Link>
            <Link
              href="/grimdark-future/army-builder"
              className="group font-body text-xs sm:text-sm tracking-[0.2em] px-8 py-4 transition-all duration-300 min-w-[200px] text-center"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                boxShadow: "0 4px 24px var(--glow)",
              }}
            >
              ARMY BUILDER
            </Link>
          </div>

          <div className="mt-10 flex flex-col items-center gap-2" style={{ opacity: 0.35 }}>
            <span
              className="font-body text-xs tracking-[0.15em]"
              style={{ color: "var(--primary)" }}
            >
              SCROLL
            </span>
            <div
              className="w-px h-10"
              style={{ background: `linear-gradient(to bottom, var(--primary), transparent)` }}
            />
          </div>
        </div>

        {/* Bottom Features Bar */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
        >
          <div
            className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-3"
            style={{ gap: 0 }}
          >
            {[
              {
                label: "16K DENTAL RESIN", sub: "Medical-grade precision",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 mx-auto mb-1" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                ),
              },
              {
                label: "BAMBU LAB FDM", sub: "Multicolour enclosed printing",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 mx-auto mb-1" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                  </svg>
                ),
              },
              {
                label: "MADE IN SA 🇿🇦", sub: "Shipped across South Africa",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 mx-auto mb-1" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
              },
            ].map(({ label, sub, icon }, i) => (
              <div
                key={label}
                className="px-4 sm:px-6 text-center py-1"
                style={{
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                  color: "var(--primary)",
                }}
              >
                <div className="hidden sm:block">{icon}</div>
                <p className="font-heading text-[11px] tracking-[0.15em]">{label}</p>
                <p className="font-body text-xs mt-0.5 hidden sm:block" style={{ color: "var(--muted)" }}>
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORY TILES ─────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[98vw] mx-auto">
        <div className="text-center mb-8">
          <p
            className="font-body text-xs tracking-[0.15em] mb-3 uppercase"
            style={{ color: "var(--muted)" }}
          >
            Collections
          </p>
          <h2
            className="font-heading text-3xl sm:text-4xl"
            style={{ color: "var(--text)" }}
          >
            SHOP BY CATEGORY
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {siteCategories.map((cat) => {
            const thumb = CATEGORY_THUMBNAIL[cat.id];
            return (
              <Link
                key={cat.id}
                href={CATEGORY_ROUTE_MAP[cat.id] ?? `/shop/${cat.id}`}
                className="group relative overflow-hidden transition-all duration-300"
                style={{
                  border: "1px solid var(--border)",
                  aspectRatio: "2/3",
                  minHeight: "360px",
                }}
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: "var(--surface)" }} />
                )}
                {/* Gradient overlay — stronger at bottom for legibility */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
                  }}
                />
                {/* Accent border on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: "inset 0 0 0 1px var(--primary)" }}
                />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3
                    className="font-heading text-sm sm:text-base tracking-[0.08em] leading-tight mb-2"
                    style={{ color: "#fff" }}
                  >
                    {cat.name.toUpperCase()}
                  </h3>
                  <span
                    className="font-body text-[11px] tracking-[0.12em] transition-all duration-300 opacity-0 group-hover:opacity-100 inline-block translate-y-1 group-hover:translate-y-0"
                    style={{ color: "var(--primary)" }}
                  >
                    EXPLORE →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── NEW ARRIVALS ───────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-7xl mx-auto"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-8 pt-10">
              <div>
                <p
                  className="font-body text-xs tracking-[0.15em] mb-2 uppercase"
                  style={{ color: "var(--muted)" }}
                >
                  Just Landed
                </p>
                <h2
                  className="font-heading text-3xl"
                  style={{ color: "var(--text)" }}
                >
                  NEW ARRIVALS
                </h2>
              </div>
              <Link
                href="/new-arrivals"
                className="font-body text-xs tracking-[0.2em] transition-colors hidden sm:block"
                style={{ color: "var(--primary)" }}
              >
                VIEW ALL →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {newArrivals.map((product) => (
                <Link
                  key={product.id}
                  href={CATEGORY_ROUTE_MAP[product.brand] ?? `/shop/${product.brand}`}
                  className="group card-bg overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <div
                    className="product-card-frame"
                    style={{ background: "var(--surface)" }}
                  >
                    <Image
                      src={product.image_url ?? `https://picsum.photos/seed/${product.slug}/400/400`}
                      alt={product.name}
                      fill
                      loading="lazy"
                      className="product-card-image opacity-90 group-hover:opacity-100"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <span
                      className="absolute top-2 left-2 font-body text-xs tracking-[0.1em] px-2 py-0.5"
                      style={{ background: "var(--primary)", color: "var(--bg)" }}
                    >
                      NEW
                    </span>
                  </div>
                  <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <p
                      className="font-body text-xs font-semibold leading-snug truncate"
                      style={{ color: "var(--text)" }}
                    >
                      {product.name}
                    </p>
                    <p className="font-heading text-sm mt-1" style={{ color: "var(--primary)" }}>
                      {formatPrice(product.price_cents / 100)}
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
        <section className="py-12 px-4 sm:px-6 lg:px-8 mb-8">
          <div
            className="max-w-7xl mx-auto"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-8 pt-10">
              <div>
                <p
                  className="font-body text-xs tracking-[0.15em] mb-2 uppercase"
                  style={{ color: "var(--muted)" }}
                >
                  Coming Soon
                </p>
                <h2
                  className="font-heading text-3xl"
                  style={{ color: "var(--text)" }}
                >
                  PREORDERS
                </h2>
              </div>
              <Link
                href="/preorders"
                className="font-body text-xs tracking-[0.2em] transition-colors hidden sm:block"
                style={{ color: "var(--primary)" }}
              >
                VIEW ALL →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {preorders.map((product) => (
                <Link
                  key={product.id}
                  href={CATEGORY_ROUTE_MAP[product.brand] ?? `/shop/${product.brand}`}
                  className="group card-bg overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    borderLeft: "1px solid var(--border)",
                    borderRight: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                    borderTop: "2px solid var(--primary)",
                  }}
                >
                  <div
                    className="product-card-frame"
                    style={{ background: "var(--surface)" }}
                  >
                    <Image
                      src={product.image_url ?? `https://picsum.photos/seed/${product.slug}/400/400`}
                      alt={product.name}
                      fill
                      loading="lazy"
                      className="product-card-image opacity-70 group-hover:opacity-90"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <span
                      className="absolute top-2 left-2 font-body text-xs tracking-[0.1em] px-2 py-0.5"
                      style={{ background: "var(--accent)", color: "var(--bg)" }}
                    >
                      PREORDER
                    </span>
                  </div>
                  <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <p
                      className="font-body text-xs font-semibold leading-snug truncate"
                      style={{ color: "var(--text)" }}
                    >
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="font-heading text-sm" style={{ color: "var(--primary)" }}>
                        {formatPrice(product.price_cents / 100)}
                      </p>
                      {product.preorder_date && (
                        <p className="font-body text-xs" style={{ color: "var(--muted)" }}>
                          {product.preorder_date}
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
