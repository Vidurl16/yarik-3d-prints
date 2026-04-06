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
        <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto pt-16 pb-16">
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

          <div className="mt-16 flex flex-col items-center gap-2" style={{ opacity: 0.35 }}>
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
            className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3"
            style={{ gap: 0 }}
          >
            {[
              { label: "16K DENTAL RESIN", sub: "Medical-grade precision" },
              { label: "BAMBU LAB FDM", sub: "Multicolour enclosed printing" },
              { label: "MADE IN SA 🇿🇦", sub: "Shipped across South Africa" },
            ].map(({ label, sub }, i) => (
              <div
                key={label}
                className="px-4 sm:px-6 text-center py-1"
                style={{
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                }}
              >
                <p
                  className="font-heading text-[11px] tracking-[0.15em]"
                  style={{ color: "var(--primary)" }}
                >
                  {label}
                </p>
                <p
                  className="font-body text-xs mt-0.5 hidden sm:block"
                  style={{ color: "var(--muted)" }}
                >
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {siteCategories.map((cat) => {
            const thumb = CATEGORY_THUMBNAIL[cat.id];
            return (
              <Link
                key={cat.id}
                href={CATEGORY_ROUTE_MAP[cat.id] ?? `/shop/${cat.id}`}
                className="group relative overflow-hidden"
                style={{ border: "1px solid var(--border)", aspectRatio: "3/5" }}
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: "var(--surface)" }} />
                )}
                {/* Dark gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
                  }}
                />
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(ellipse 80% 40% at 50% 120%, var(--glow) 0%, transparent 70%)` }}
                />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <h3
                    className="font-heading text-sm sm:text-base tracking-[0.08em] leading-tight mb-1"
                    style={{ color: "#fff" }}
                  >
                    {cat.name.toUpperCase()}
                  </h3>
                  <span
                    className="font-body text-xs tracking-[0.1em] transition-colors"
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
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-7xl mx-auto"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-10 pt-16">
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
                  className="group card-bg overflow-hidden transition-all duration-300"
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
                      style={{
                        background: "var(--primary)",
                        color: "var(--bg)",
                      }}
                    >
                      NEW
                    </span>
                  </div>
                  <div className="p-3">
                    <p
                      className="font-body text-xs font-semibold leading-snug truncate"
                      style={{ color: "var(--text)" }}
                    >
                      {product.name}
                    </p>
                    <p
                      className="font-heading text-sm mt-1"
                      style={{ color: "var(--primary)" }}
                    >
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
        <section className="py-16 px-4 sm:px-6 lg:px-8 mb-8">
          <div
            className="max-w-7xl mx-auto"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-10 pt-16">
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
                  className="group card-bg overflow-hidden transition-all duration-300"
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
                        className="product-card-image opacity-70 group-hover:opacity-90"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    <span
                      className="absolute top-2 left-2 font-body text-xs tracking-[0.1em] px-2 py-0.5"
                      style={{
                        background: "var(--accent)",
                        color: "var(--bg)",
                      }}
                    >
                      PREORDER
                    </span>
                  </div>
                  <div className="p-3">
                    <p
                      className="font-body text-xs font-semibold leading-snug truncate"
                      style={{ color: "var(--text)" }}
                    >
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p
                        className="font-heading text-sm"
                        style={{ color: "var(--primary)" }}
                      >
                        {formatPrice(product.price_cents / 100)}
                      </p>
                      {product.preorder_date && (
                        <p
                          className="font-body text-xs"
                          style={{ color: "var(--muted)" }}
                        >
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
