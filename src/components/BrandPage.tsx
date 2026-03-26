import type { ThemeId } from "./theme/themes";
import { THEMES, ARMY_BUILDER_BRANDS } from "./theme/themes";
import Link from "next/link";
import Image from "next/image";
import BrandIcon from "@/components/BrandIcon";
import type { DbProduct } from "@/lib/data/types";
import BrandProductGrid from "./BrandProductGrid";

interface BrandPageProps {
  themeId: ThemeId;
  brandSlug: string;
  products?: DbProduct[];
}

/** Cross-sell add-ons per brand — uses real DB brand slugs */
const BRAND_ADDONS: Record<string, { label: string; sub: string; icon: string; slug: string }[]> = {
  "grimdark-future": [
    { label: "Basing & Battle Effects", sub: "Urban rubble, craters & scatter", icon: "🪨", slug: "basing-battle-effects" },
    { label: "Gaming Accessories & Terrain", sub: "Ruins, walls & fortifications", icon: "🗺️", slug: "gaming-accessories-terrain" },
  ],
  "age-of-fantasy": [
    { label: "Basing & Battle Effects", sub: "Grass tufts, dead forest & nature bases", icon: "🪨", slug: "basing-battle-effects" },
    { label: "Gaming Accessories & Terrain", sub: "Ancient ruins, forests & dungeons", icon: "🗺️", slug: "gaming-accessories-terrain" },
  ],
  "pokemon": [
    { label: "Gaming Accessories & Terrain", sub: "Display stands, arenas & accessories", icon: "🗺️", slug: "gaming-accessories-terrain" },
    { label: "Basing & Battle Effects", sub: "Scenic bases & diorama elements", icon: "🪨", slug: "basing-battle-effects" },
  ],
  "basing-battle-effects": [
    { label: "Grimdark Future", sub: "Sci-fi infantry, vehicles & characters", icon: "⚙️", slug: "grimdark-future" },
    { label: "Age of Fantasy", sub: "Fantasy warriors & monsters to base", icon: "⚔️", slug: "age-of-fantasy" },
  ],
  "gaming-accessories-terrain": [
    { label: "Grimdark Future", sub: "Populate your sci-fi battlefields", icon: "⚙️", slug: "grimdark-future" },
    { label: "Age of Fantasy", sub: "Populate your fantasy landscapes", icon: "⚔️", slug: "age-of-fantasy" },
  ],
};

export default function BrandPage({ themeId, brandSlug, products = [] }: BrandPageProps) {
  const theme = THEMES[themeId];
  const hasArmyBuilder = (ARMY_BUILDER_BRANDS as readonly string[]).includes(brandSlug);
  const addons = BRAND_ADDONS[brandSlug] ?? [];

  return (
    // data-theme drives all CSS var(--bg/text/primary/…) for this brand
    <div data-theme={themeId} style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-[70vh] flex items-end overflow-hidden"
      >
        {/* Full-bleed background image */}
        <Image
          src={theme.heroImage}
          alt={theme.label}
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: theme.heroFit ?? "cover",
            objectPosition: theme.heroPosition ?? "center center",
          }}
        />

        {/* Dark base scrim so text is legible over any image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(0,0,0,0.35)" }}
          aria-hidden="true"
        />
        {/* Gradient fade — top transparent, bottom fades into page bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.5) 60%, var(--bg) 100%)`,
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
            className="font-body text-xs tracking-[0.15em] uppercase mb-3"
            style={{ color: "var(--primary)", opacity: 0.7 }}
          >
            The Dexarium
          </p>
          <h1
            className="font-heading text-4xl sm:text-6xl leading-tight mb-4 flex items-center gap-5"
            style={{ color: "var(--text)" }}
          >
            {theme.iconSrc ? (
              <span className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 shrink-0">
                <BrandIcon
                  id={brandSlug}
                  className="w-full h-full"
                  style={{ color: "var(--primary)" }}
                />
              </span>
            ) : (
              <span>{theme.icon}</span>
            )}
            {theme.label}
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

      {/* ── FILTER BAR + PRODUCT GRID ────────────────────────── */}
      <BrandProductGrid products={products} brandSlug={brandSlug} />

      {/* ── UPSELL SECTION (placeholder) ─────────────────────── */}
      <section
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p
            className="font-body text-xs tracking-[0.15em] uppercase mb-3"
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
            {addons.map(({ label, sub, icon, slug }) => (
              <Link
                key={slug}
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
                    {sub}
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
