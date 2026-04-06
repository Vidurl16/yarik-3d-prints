// ─── Theme System ────────────────────────────────────────────────────────────
// Route-driven theming: each brand slug maps to a ThemeId.
// CSS variables defined in globals.css under [data-theme="<id>"] selectors.
// Components consume var(--bg), var(--text), etc. — never hardcoded colours.

export type ThemeId =
  | "dexarium"
  | "grimdark"
  | "fantasy"
  | "pokemon"
  | "basing"
  | "terrain"
  | "display";

/** Map from URL brand slug → ThemeId */
export const BRAND_THEME_MAP: Record<string, ThemeId> = {
  "grimdark-future": "grimdark",
  "age-of-fantasy": "fantasy",
  pokemon: "pokemon",
  "basing-battle-effects": "basing",
  "gaming-accessories-terrain": "terrain",
  "display-figures-busts": "display",
};

/** All valid brand slugs (used in generateStaticParams) */
export const BRAND_SLUGS = Object.keys(BRAND_THEME_MAP) as string[];

/** Slugs that have an Army Builder sub-route */
export const ARMY_BUILDER_BRANDS = ["grimdark-future", "age-of-fantasy"] as const;

/** CSS variable token names consumed by components */
export interface ThemeTokens {
  /** Page background */
  bg: string;
  /** Card / surface background */
  surface: string;
  /** Primary body text */
  text: string;
  /** Muted / secondary text */
  muted: string;
  /** Primary accent (buttons, headings) */
  primary: string;
  /** Secondary accent (glows, highlights) */
  accent: string;
  /** Border colour */
  border: string;
  /** Hero image path under public/ */
  heroImage: string;
  /** How the hero image should fit inside the banner */
  heroFit?: "cover" | "contain";
  /** Background position for the hero image */
  heroPosition?: string;
  /** Hero section min-height override (e.g. "50vh" for wide/short images) */
  heroMinHeight?: string;
  /** Human-readable brand label */
  label: string;
  /** Emoji icon for nav / tiles (fallback) */
  icon: string;
  /** SVG icon path under public/ */
  iconSrc: string;
  /** Short brand tagline */
  tagline: string;
}

export const THEMES: Record<ThemeId, ThemeTokens> = {
  dexarium: {
    bg: "#faf5ec",
    surface: "#f0e6d2",
    text: "#1e1208",
    muted: "#7a5e40",
    primary: "#8b5e14",
    accent: "#5c3d1a",
    border: "rgba(92, 61, 26, 0.15)",
    heroImage: "/brand-assets/dexarium/hero.svg",
    heroFit: "cover",
    heroPosition: "center top",
    label: "The Dexarium",
    icon: "🔮",
    iconSrc: "",
    tagline: "From Spark to Legend",
  },
  grimdark: {
    bg: "#08080e",
    surface: "#0f0f1a",
    text: "#d4cce0",
    muted: "#5a5570",
    primary: "#9b4060",
    accent: "#c0392b",
    border: "rgba(155,64,96,0.25)",
    heroImage: "/images/categories/banners/grimdark-future.jpg",
    heroFit: "cover",
    heroPosition: "center top",
    label: "Grimdark Future",
    icon: "⚔️",
    iconSrc: "/brand-icons/grimdark-future.svg",
    tagline: "Industrial Ruin · War Without End",
  },
  fantasy: {
    bg: "#080e08",
    surface: "#0f180e",
    text: "#d8e8d0",
    muted: "#4a5e48",
    primary: "#5ca85c",
    accent: "#2e7d2e",
    border: "rgba(92,168,92,0.25)",
    heroImage: "/images/categories/banners/fantasy.jpg",
    heroFit: "cover",
    heroPosition: "center top",
    label: "Age of Fantasy",
    icon: "🏰",
    iconSrc: "/brand-icons/age-of-fantasy.svg",
    tagline: "Legends of the Old World",
  },
  pokemon: {
    bg: "#08090f",
    surface: "#0f1018",
    text: "#e8ecf8",
    muted: "#4a5278",
    primary: "#e8c838",
    accent: "#c8281c",
    border: "rgba(232,200,56,0.25)",
    heroImage: "/images/categories/banners/pokemon2.jpg",
    heroFit: "cover",
    heroPosition: "center center",
    label: "Pokémon",
    icon: "✨",
    iconSrc: "/brand-icons/pokemon.svg",
    tagline: "Gotta Print 'Em All",
  },
  basing: {
    bg: "#0d0b07",
    surface: "#16120c",
    text: "#e8dcc8",
    muted: "#5e5040",
    primary: "#a08040",
    accent: "#6b4e20",
    border: "rgba(160,128,64,0.25)",
    heroImage: "/images/categories/banners/basing.jpg",
    heroFit: "cover",
    heroPosition: "center top",
    label: "Basing & Battle Effects",
    icon: "🪨",
    iconSrc: "/brand-icons/basing-battle-effects.svg",
    tagline: "Ground Your Legend",
  },
  terrain: {
    bg: "#080e08",
    surface: "#0f180f",
    text: "#d8e8d0",
    muted: "#485848",
    primary: "#608060",
    accent: "#3a5c3a",
    border: "rgba(96,128,96,0.25)",
    heroImage: "/images/categories/banners/terrain.jpg",
    heroFit: "cover",
    heroPosition: "center center",
    label: "Gaming Accessories & Terrain",
    icon: "🗺️",
    iconSrc: "/brand-icons/gaming-accessories-terrain.svg",
    tagline: "Build Your Battlefield",
  },
  display: {
    bg: "#000000",
    surface: "#0d0d0d",
    text: "#ffffff",
    muted: "#888888",
    primary: "#8a5ab0",
    accent: "#5a3a7a",
    border: "rgba(138,90,176,0.25)",
    heroImage: "/images/categories/banners/figurines-and-busts.jpg",
    heroFit: "cover",
    heroPosition: "center center",
    label: "Display Figures & Busts",
    icon: "🗿",
    iconSrc: "/brand-icons/display-figures-busts.svg",
    tagline: "Comics · Games · Movies · Other",
  },
};

/** Resolve brand slug to ThemeId (falls back to dexarium) */
export function resolveTheme(brandSlug: string): ThemeId {
  return BRAND_THEME_MAP[brandSlug] ?? "dexarium";
}
