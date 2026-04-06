import type { ThemeId } from "./theme/themes";
import { THEMES, ARMY_BUILDER_BRANDS } from "./theme/themes";
import Link from "next/link";
import Image from "next/image";
import BrandIcon from "@/components/BrandIcon";
import type { DbProduct } from "@/lib/data/types";
import BrandProductGrid from "./BrandProductGrid";
import FactionTileGrid from "./FactionTileGrid";
import { brandFactions } from "@/lib/products";

interface BrandPageProps {
  themeId: ThemeId;
  brandSlug: string;
  products?: DbProduct[];
  initialTag?: string;
}

// TODO: Replace placeholder images with real subcategory thumbnails (owner to upload)
const DISPLAY_SUBCATEGORIES = [
  {
    name: "Single Figures",
    tag: "single figures",
    accent: "#a87c4f",
    glow: "rgba(168,124,79,0.35)",
    gradient: "linear-gradient(160deg, #1a1208 0%, #2e1f0d 50%, #1a1208 100%)",
    icon: "◈",
    desc: "Hand-crafted single miniatures",
  },
  {
    name: "Dioramas",
    tag: "dioramas",
    accent: "#5a8fa3",
    glow: "rgba(90,143,163,0.35)",
    gradient: "linear-gradient(160deg, #0a1520 0%, #0f2535 50%, #0a1520 100%)",
    icon: "◉",
    desc: "Multi-figure scenic compositions",
  },
  {
    name: "Busts",
    tag: "busts",
    accent: "#8b6fae",
    glow: "rgba(139,111,174,0.35)",
    gradient: "linear-gradient(160deg, #130d1e 0%, #1f1230 50%, #130d1e 100%)",
    icon: "◎",
    desc: "Detailed portrait-scale busts",
  },
  {
    name: "Limited Edition",
    tag: "limited edition",
    accent: "#c9a84c",
    glow: "rgba(201,168,76,0.35)",
    gradient: "linear-gradient(160deg, #1a1500 0%, #2e2500 50%, #1a1500 100%)",
    icon: "✦",
    desc: "Exclusive & collector's pieces",
  },
];

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

export default function BrandPage({ themeId, brandSlug, products = [], initialTag }: BrandPageProps) {
  const theme = THEMES[themeId];
  const hasArmyBuilder = (ARMY_BUILDER_BRANDS as readonly string[]).includes(brandSlug);
  const addons = BRAND_ADDONS[brandSlug] ?? [];
  const factions = brandFactions[brandSlug as keyof typeof brandFactions] ?? [];
  const hasFactions = factions.length > 0;

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

      {/* ── DISPLAY FIGURES: Browse by Type → then Browse by Theme ─── */}
      {brandSlug === "display-figures-busts" && !initialTag ? (
        <>
          {/* 1. BROWSE BY TYPE — Single Figures, Dioramas, Busts, Limited Edition */}
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-8">
              <p className="font-body text-xs tracking-[0.2em] uppercase mb-3"
                style={{ color: "var(--primary)", opacity: 0.7 }}>
                What are you looking for?
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl tracking-wider" style={{ color: "var(--text)" }}>
                BROWSE BY TYPE
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {DISPLAY_SUBCATEGORIES.map((sub) => (
                <a
                  key={sub.name}
                  href={`/display-figures-busts?tag=${encodeURIComponent(sub.tag)}`}
                  className="group relative overflow-hidden transition-all duration-300"
                  style={{
                    aspectRatio: "3/4",
                    background: sub.gradient,
                    border: `1px solid color-mix(in srgb, ${sub.accent} 30%, transparent)`,
                  }}
                >
                  {/* Corner accent */}
                  <div
                    className="absolute top-0 right-0 w-14 h-14 opacity-20"
                    style={{ background: `linear-gradient(225deg, ${sub.accent} 0%, transparent 70%)` }}
                  />

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse 80% 60% at 50% 120%, ${sub.glow} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-5">
                    {/* Icon top-left */}
                    <span className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                      style={{ color: sub.accent }}>
                      {sub.icon}
                    </span>

                    {/* Text bottom */}
                    <div>
                      <p className="font-body text-xs mb-2 leading-relaxed"
                        style={{ color: `color-mix(in srgb, ${sub.accent} 70%, white)`, opacity: 0.75 }}>
                        {sub.desc}
                      </p>
                      <h3
                        className="font-heading text-base sm:text-lg tracking-wider group-hover:tracking-widest transition-all duration-300 mb-2"
                        style={{ color: "var(--text)" }}
                      >
                        {sub.name.toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-body text-xs tracking-[0.2em] group-hover:tracking-widest transition-all duration-300"
                          style={{ color: sub.accent }}
                        >
                          BROWSE
                        </span>
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          style={{ color: sub.accent }}
                          viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}
                        >
                          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent line on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${sub.accent}, transparent)` }}
                  />
                </a>
              ))}
            </div>
          </section>

          {/* 2. BROWSE BY THEME — Comics, Games, Movies, Other */}
          <FactionTileGrid
            brandSlug={brandSlug}
            factions={factions}
            heading="BROWSE BY THEME"
            subheading="Browse by Universe"
          />
        </>
      ) : hasFactions && !initialTag ? (
        /* Other brands with factions — standard faction tiles */
        <FactionTileGrid brandSlug={brandSlug} factions={factions} />
      ) : (
        /* Product grid — shown when ?tag= is active or brand has no factions */
        <BrandProductGrid products={products} brandSlug={brandSlug} initialTag={initialTag} />
      )}

      {/* ── UPSELL SECTION (hidden for Pokémon per TASK-04) ─────────────────────── */}
      {addons.length > 0 && brandSlug !== "pokemon" && (
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
      )}

    </div>
  );
}
