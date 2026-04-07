import { siteCategories } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import HoverLink from "@/components/HoverLink";

export const metadata = {
  title: "Shop — The Dexarium",
};

const CATEGORY_THUMBNAIL: Record<string, string> = {
  "grimdark-future":            "/images/categories/thumbnails/grimdark-future.jpg",
  "age-of-fantasy":             "/images/categories/thumbnails/age-of-fantasy.jpg",
  "pokemon":                    "/images/categories/thumbnails/pokemon.jpg",
  "basing-battle-effects":      "/images/categories/thumbnails/basing-bits.jpg",
  "gaming-accessories-terrain": "/images/categories/thumbnails/terrain.jpg",
  "display-figures-busts":      "/images/categories/thumbnails/figurines-and-busts.jpg",
};

const CATEGORY_ROUTE: Record<string, string> = {
  "grimdark-future":            "/grimdark-future",
  "age-of-fantasy":             "/age-of-fantasy",
  "pokemon":                    "/pokemon",
  "basing-battle-effects":      "/basing-battle-effects",
  "gaming-accessories-terrain": "/gaming-accessories-terrain",
  "display-figures-busts":      "/display-figures-busts",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 text-xs tracking-wider font-body mb-8" style={{ color: "var(--muted)" }}>
          <HoverLink href="/" className="transition-colors" defaultColor="var(--muted)" hoverColor="var(--primary)">HOME</HoverLink>
          <span style={{ color: "var(--border)" }}>›</span>
          <span style={{ color: "var(--text)" }}>SHOP</span>
        </div>

        <div
          className="h-px mb-8"
          style={{
            background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
            opacity: 0.4,
          }}
        />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="font-body text-xs tracking-[0.15em] mb-3 uppercase" style={{ color: "var(--primary)" }}>
              Browse Collections
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>SHOP</h1>
          </div>
          <p className="font-body text-sm max-w-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            {siteCategories.length} categories. Premium 16K resin &amp; multicolour FDM.
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {siteCategories.map((cat) => {
            const thumb = CATEGORY_THUMBNAIL[cat.id];
            const href = CATEGORY_ROUTE[cat.id] ?? `/shop/${cat.id}`;
            return (
              <Link
                key={cat.id}
                href={href}
                className="group relative overflow-hidden transition-all duration-300"
                style={{
                  border: "1px solid var(--border)",
                  aspectRatio: "2/3",
                  minHeight: "320px",
                }}
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: "var(--surface)" }} />
                )}
                {/* Gradient overlay */}
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
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                  <h2
                    className="font-heading text-xs sm:text-sm md:text-base tracking-[0.05em] sm:tracking-[0.08em] leading-tight mb-2"
                    style={{ color: "#fff" }}
                  >
                    {cat.name.toUpperCase()}
                  </h2>
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
      </div>
    </div>
  );
}
