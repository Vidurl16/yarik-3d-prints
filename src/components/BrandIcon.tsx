import type { SiteCategoryId } from "@/lib/products";

interface BrandIconProps {
  id: SiteCategoryId | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders brand category icons as inline SVG so `currentColor` and CSS
 * colour variables resolve correctly on both light and dark backgrounds.
 *
 * Source files live at public/brand-icons/ — see ICON_SOURCES.md for provenance.
 * All icons are original artwork by The Dexarium.
 */
export default function BrandIcon({ id, className = "", style }: BrandIconProps) {
  const shared = {
    className,
    style,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512",
    fill: "none" as const,
    "aria-hidden": true as const,
  };

  switch (id) {
    /* ── Grimdark Future — 12-tooth mechanical gear ───────────────────────── */
    case "grimdark-future":
      return (
        <svg {...shared}>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M 237.71,81.96 L 222.37,43.65 L 289.63,43.65 L 274.29,81.96
               L 327.18,96.13 L 333.05,55.28 L 391.30,88.91 L 358.86,114.42
               L 397.58,153.14 L 423.09,120.70 L 456.72,178.95 L 415.87,184.82
               L 430.04,237.71 L 468.35,222.37 L 468.35,289.63 L 430.04,274.29
               L 415.87,327.18 L 456.72,333.05 L 423.09,391.30 L 397.58,358.86
               L 358.86,397.58 L 391.30,423.09 L 333.05,456.72 L 327.18,415.87
               L 274.29,430.04 L 289.63,468.35 L 222.37,468.35 L 237.71,430.04
               L 184.82,415.87 L 178.95,456.72 L 120.70,423.09 L 153.14,397.58
               L 114.42,358.86 L 88.91,391.30 L 55.28,333.05 L 96.13,327.18
               L 81.96,274.29 L 43.65,289.63 L 43.65,222.37 L 81.96,237.71
               L 96.13,184.82 L 55.28,178.95 L 88.91,120.70 L 114.42,153.14
               L 153.14,114.42 L 120.70,88.91 L 178.95,55.28 L 184.82,96.13 Z
               M 328.00,256.00 A 72,72 0 1,0 184.00,256.00
               A 72,72 0 1,0 328.00,256.00 Z"
          />
          {/* Inner crosshair detail */}
          <rect x="246" y="200" width="20" height="112" rx="4" fill="currentColor" opacity="0.4" />
          <rect x="200" y="246" width="112" height="20" rx="4" fill="currentColor" opacity="0.4" />
        </svg>
      );

    /* ── Age of Fantasy — heraldic shield with sword ──────────────────────── */
    case "age-of-fantasy":
      return (
        <svg {...shared}>
          {/* Shield body */}
          <path
            fill="currentColor"
            d="M 56,90 Q 56,60 86,60 L 426,60 Q 456,60 456,90 L 456,340
               Q 456,380 256,460 Q 56,380 56,340 Z"
          />
          {/* Sword blade — reversed out as lighter overlay */}
          <rect x="248" y="76" width="16" height="244" rx="5" fill="currentColor" opacity="0.18" />
          {/* Cross-guard */}
          <rect x="192" y="290" width="128" height="18" rx="5" fill="currentColor" opacity="0.18" />
          {/* Pommel */}
          <ellipse cx="256" cy="364" rx="20" ry="20" fill="currentColor" opacity="0.18" />
          {/* Shield border */}
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            opacity="0.3"
            d="M 56,90 Q 56,60 86,60 L 426,60 Q 456,60 456,90 L 456,340
               Q 456,380 256,460 Q 56,380 56,340 Z"
          />
        </svg>
      );

    /* ── Pokémon — Poké Ball photo ───────────────────────────────────────── */
    case "pokemon":
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img
          src="/brand-icons/pokemon.webp"
          alt="Pokémon"
          className={className}
          style={{ ...style, background: "transparent", border: "none", outline: "none" }}
        />
      );

    /* ── Basing & Battle Effects — miniature base with terrain rocks ─────── */
    case "basing-battle-effects":
      return (
        <svg {...shared}>
          {/* Base rim (outer oval minus inner oval = ring) */}
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M 476,270 A 220,190 0 1,0 36,270 A 220,190 0 1,0 476,270 Z
               M 456,255 A 200,165 0 1,0 56,255 A 200,165 0 1,0 456,255 Z"
          />
          {/* Rock 1 (large, left) */}
          <path
            fill="currentColor"
            d="M 155,250 Q 140,210 170,195 Q 200,178 220,205
               Q 238,225 225,255 Q 208,278 178,270 Q 148,262 155,250 Z"
          />
          {/* Rock 2 (medium, right) */}
          <path
            fill="currentColor"
            d="M 285,235 Q 278,205 300,193 Q 322,181 338,202
               Q 352,222 342,245 Q 330,265 308,260 Q 282,254 285,235 Z"
          />
          {/* Rock 3 (small, centre-top) */}
          <path
            fill="currentColor"
            d="M 248,200 Q 244,182 258,174 Q 272,166 282,180
               Q 292,193 283,207 Q 272,218 258,213 Q 242,206 248,200 Z"
          />
          {/* Scatter pebbles */}
          <circle cx="210" cy="248" r="7" fill="currentColor" opacity="0.55" />
          <circle cx="320" cy="252" r="5" fill="currentColor" opacity="0.55" />
          <circle cx="256" cy="238" r="4" fill="currentColor" opacity="0.50" />
          <circle cx="172" cy="230" r="5" fill="currentColor" opacity="0.50" />
        </svg>
      );

    /* ── Gaming Accessories & Terrain — castle tower with merlons ────────── */
    case "gaming-accessories-terrain":
      return (
        <svg {...shared}>
          {/* Tower silhouette + merlons */}
          <path
            fill="currentColor"
            d="M 96,448 L 96,210 L 96,140 L 168,140 L 168,210
               L 220,210 L 220,140 L 292,140 L 292,210
               L 344,210 L 344,140 L 416,140 L 416,210
               L 416,448 Z"
          />
          {/* Arrow slit (lighter overlay to suggest opening) */}
          <path
            d="M 242,300 Q 256,260 270,300 L 270,390 Q 256,400 242,390 Z"
            fill="currentColor"
            opacity="0.12"
          />
          {/* Foundation base */}
          <rect x="72" y="440" width="368" height="28" rx="6" fill="currentColor" opacity="0.55" />
          {/* Gate arch */}
          <path
            d="M 196,448 L 196,360 Q 196,308 256,308 Q 316,308 316,360 L 316,448 Z"
            fill="currentColor"
            opacity="0.15"
          />
        </svg>
      );

    /* ── Display Figures & Busts — pedestal bust silhouette ──────────────── */
    case "display-figures-busts":
      return (
        <svg {...shared}>
          {/* Head */}
          <ellipse cx="256" cy="130" rx="80" ry="90" fill="currentColor" />
          {/* Neck */}
          <rect x="226" y="210" width="60" height="60" rx="8" fill="currentColor" />
          {/* Shoulders / bust truncation */}
          <path
            fill="currentColor"
            d="M 140,270 Q 130,310 160,330 L 352,330 Q 382,310 372,270 Q 340,240 256,238 Q 172,240 140,270 Z"
          />
          {/* Pedestal column */}
          <rect x="216" y="330" width="80" height="80" rx="4" fill="currentColor" opacity="0.75" />
          {/* Pedestal base */}
          <rect x="160" y="408" width="192" height="32" rx="6" fill="currentColor" opacity="0.85" />
          {/* Pedestal foot */}
          <rect x="136" y="436" width="240" height="20" rx="4" fill="currentColor" opacity="0.6" />
        </svg>
      );

    default:
      return null;
  }
}
