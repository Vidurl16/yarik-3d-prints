import type { ThemeId } from "./theme/themes";
import { THEMES, ARMY_BUILDER_BRANDS } from "./theme/themes";
import Link from "next/link";

interface BrandPageProps {
  themeId: ThemeId;
  brandSlug: string;
}

export default function BrandPage({ themeId, brandSlug }: BrandPageProps) {
  const theme = THEMES[themeId];
  const hasArmyBuilder = (ARMY_BUILDER_BRANDS as readonly string[]).includes(brandSlug);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-[60vh] flex items-end overflow-hidden"
        style={{
          backgroundImage: `url('${theme.heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Texture overlay (noise) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
            opacity: 0.04,
          }}
          aria-hidden="true"
        />
        {/* Gradient fade to page bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, var(--bg) 100%)`,
          }}
          aria-hidden="true"
        />
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 100%, var(--glow, rgba(196,160,69,0.1)) 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 pt-32">
          <p
            className="font-body text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--primary)", opacity: 0.7 }}
          >
            The Dexarium
          </p>
          <h1
            className="font-heading text-4xl sm:text-6xl leading-tight mb-4"
            style={{ color: "var(--text)" }}
          >
            {theme.icon} {theme.label}
          </h1>
          <p
            className="font-body text-base tracking-widest mb-8"
            style={{ color: "var(--muted)" }}
          >
            {theme.tagline}
          </p>

          <div className="flex gap-4 flex-wrap">
            {hasArmyBuilder && (
              <Link
                href={`/${brandSlug}/army-builder`}
                className="font-body text-sm tracking-[0.2em] px-6 py-3 transition-all duration-200"
                style={{
                  background: "var(--primary)",
                  color: "var(--bg)",
                  border: "1px solid var(--primary)",
                }}
              >
                ARMY BUILDER →
              </Link>
            )}
            <Link
              href="/"
              className="font-body text-sm tracking-[0.2em] px-6 py-3 transition-all duration-200"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              ← ALL CATEGORIES
            </Link>
          </div>
        </div>
      </section>

      {/* ── FILTERS ──────────────────────────────────────────── */}
      <section
        className="sticky top-16 z-30 border-b"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4 overflow-x-auto">
          <span
            className="font-body text-[10px] tracking-[0.3em] uppercase flex-shrink-0"
            style={{ color: "var(--muted)" }}
          >
            Filter
          </span>
          {/* Placeholder filter chips */}
          {["All", "New", "Preorder", "Resin", "FDM"].map((f) => (
            <button
              key={f}
              className="font-body text-xs tracking-wider px-4 py-1.5 flex-shrink-0 transition-all duration-150"
              style={{
                border: "1px solid var(--border)",
                color: f === "All" ? "var(--bg)" : "var(--muted)",
                background: f === "All" ? "var(--primary)" : "transparent",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* ── PRODUCT GRID (placeholder) ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2
            className="font-heading text-2xl tracking-wider"
            style={{ color: "var(--text)" }}
          >
            PRODUCTS
          </h2>
          <span
            className="font-body text-xs tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            — coming soon —
          </span>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            />
          ))}
        </div>
      </section>

      {/* ── UPSELL SECTION (placeholder) ─────────────────────── */}
      <section
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p
            className="font-body text-[10px] tracking-[0.35em] uppercase mb-3"
            style={{ color: "var(--primary)", opacity: 0.7 }}
          >
            Complete Your Build
          </p>
          <h2
            className="font-heading text-2xl tracking-wider mb-8"
            style={{ color: "var(--text)" }}
          >
            ADD-ONS & EXTRAS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Basing Materials", icon: "🪨", slug: "basing-battle-effects" },
              { label: "Battle Effects", icon: "💥", slug: "basing-battle-effects" },
            ].map(({ label, icon, slug }) => (
              <Link
                key={label}
                href={`/${slug}`}
                className="group flex items-center gap-4 p-5 transition-all duration-200"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <span className="text-3xl">{icon}</span>
                <div>
                  <p
                    className="font-heading text-sm tracking-wider"
                    style={{ color: "var(--text)" }}
                  >
                    {label.toUpperCase()}
                  </p>
                  <p
                    className="font-body text-xs mt-1"
                    style={{ color: "var(--muted)" }}
                  >
                    Browse collection →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
