import type { Product } from "@/lib/products";
import type { DbProduct } from "@/lib/data/types";

export interface StaticFilterDef {
  label: string;
  match: (p: Product) => boolean;
}

export interface DbFilterDef {
  label: string;
  match: (p: DbProduct) => boolean;
}

// ── Static (mock) product filters per site-category ─────────────────────────

export const staticBrandFilters: Record<string, StaticFilterDef[]> = {
  "grimdark-future": [
    { label: "Infantry",   match: (p) => p.category === "Infantry" },
    { label: "Characters", match: (p) => p.category === "Characters" },
    { label: "Vehicles",   match: (p) => p.category === "Vehicles" },
  ],
  "age-of-fantasy": [
    { label: "Warbands",         match: (p) => p.category === "Infantry" && !(p.tags ?? []).includes("cavalry") },
    { label: "Cavalry",          match: (p) => (p.tags ?? []).includes("cavalry") },
    { label: "Heroes & Wizards", match: (p) => p.category === "Characters" },
    { label: "Monsters & Mounts",match: (p) => p.category === "Vehicles" },
  ],
  "pokemon": [
    { label: "Pokéballs",         match: (p) => (p.tags ?? []).includes("pokeball") && !(p.tags ?? []).includes("themed-pokeball") },
    { label: "Themed Pokéballs",  match: (p) => (p.tags ?? []).includes("themed-pokeball") },
    { label: "3D Cards",          match: (p) => (p.tags ?? []).includes("3d-card") },
    { label: "Figurines",         match: (p) => (p.tags ?? []).includes("figurine") || (p.tags ?? []).includes("bust") || (p.tags ?? []).includes("statue") },
  ],
  "basing-battle-effects": [
    { label: "Bases",            match: (p) => (p.tags ?? []).includes("base") },
    { label: "Scatter & Debris", match: (p) => (p.tags ?? []).some((t) => ["scatter", "debris", "rubble"].includes(t)) },
    { label: "Battle Effects",   match: (p) => (p.tags ?? []).some((t) => ["marker", "explosion", "effects"].includes(t)) },
  ],
  "gaming-accessories-terrain": [
    { label: "Terrain",     match: (p) => p.category === "Terrain" },
    { label: "Accessories", match: (p) => p.category === "Accessories" },
  ],
};

// ── DB product filters per brand slug ────────────────────────────────────────

function tags(p: DbProduct): string[] {
  return p.tags.map((t) => t.toLowerCase());
}

// Valid Grimdark Future filter tags: Characters, Battleline, Infantry/Mounted, Vehicles, Monsters, Transports
// Valid Age of Fantasy filter tags: Heroes, Cavalry, Infantry, Monsters, Warmachines, Spells
export const dbBrandFilters: Record<string, DbFilterDef[]> = {
  "grimdark-future": [
    {
      label: "Characters",
      match: (p) => p.type === "character" || tags(p).some((t) => ["characters", "character", "hq", "leader"].includes(t)),
    },
    {
      label: "Battleline",
      match: (p) => p.type === "battleline" || tags(p).includes("battleline"),
    },
    {
      label: "Infantry/Mounted",
      match: (p) => p.type === "infantry" || p.type === "cavalry" || tags(p).some((t) => ["infantry/mounted", "infantry", "cavalry", "mounted"].includes(t)),
    },
    {
      label: "Vehicles",
      match: (p) => p.type === "vehicle" || tags(p).some((t) => ["vehicles", "vehicle", "tank"].includes(t)),
    },
    {
      label: "Monsters",
      match: (p) => p.type === "monster" || tags(p).some((t) => ["monsters", "monster", "beast", "creature"].includes(t)),
    },
    {
      label: "Transports",
      match: (p) => p.type === "transport" || tags(p).some((t) => ["transports", "transport"].includes(t)),
    },
  ],
  "age-of-fantasy": [
    {
      label: "Heroes",
      match: (p) => p.type === "character" || tags(p).some((t) => ["heroes", "hero", "hq", "wizard", "magic"].includes(t)),
    },
    {
      label: "Cavalry",
      match: (p) => p.type === "cavalry" || tags(p).some((t) => ["cavalry", "mount", "mounted"].includes(t)),
    },
    {
      label: "Infantry",
      match: (p) => (p.type === "infantry" || tags(p).includes("infantry")) && !tags(p).includes("cavalry"),
    },
    {
      label: "Monsters",
      match: (p) => p.type === "monster" || tags(p).some((t) => ["monsters", "monster", "dragon", "beast", "creature"].includes(t)),
    },
    {
      label: "Warmachines",
      match: (p) => p.type === "warmachine" || tags(p).some((t) => ["warmachines", "warmachine", "war machine", "chariot"].includes(t)),
    },
    {
      label: "Spells",
      match: (p) => p.type === "spell" || tags(p).some((t) => ["spells", "spell", "magic-card"].includes(t)),
    },
  ],
  "pokemon": [
    { label: "Pokéballs",        match: (p) => tags(p).includes("pokeball") && !tags(p).includes("themed-pokeball") },
    { label: "Themed Pokéballs", match: (p) => tags(p).includes("themed-pokeball") },
    { label: "3D Cards",         match: (p) => tags(p).includes("3d-card") },
    { label: "Figurines",        match: (p) => p.type === "figurine" || p.type === "statue" || p.type === "bust" || tags(p).some((t) => ["figurine", "bust", "statue"].includes(t)) },
  ],
  "basing-battle-effects": [
    { label: "Bases",            match: (p) => p.type === "base"    || tags(p).includes("base") },
    { label: "Scatter & Debris", match: (p) => p.type === "scatter" || tags(p).some((t) => ["scatter", "debris", "rubble"].includes(t)) },
    { label: "Battle Effects",   match: (p) => p.type === "effect"  || tags(p).some((t) => ["explosion", "marker", "effects", "effect"].includes(t)) },
  ],
  "gaming-accessories-terrain": [
    { label: "Terrain",     match: (p) => p.type === "terrain"   || tags(p).includes("terrain") },
    { label: "Accessories", match: (p) => p.type === "accessory" || tags(p).some((t) => ["accessory", "dice", "token", "storage", "tray", "foam"].includes(t)) },
  ],
  "display-figures-busts": [
    { label: "Single Figures",  match: (p) => tags(p).includes("single figures") },
    { label: "Dioramas",        match: (p) => tags(p).includes("dioramas") },
    { label: "Busts",           match: (p) => tags(p).includes("busts") },
    { label: "Limited Edition", match: (p) => tags(p).includes("limited edition") },
  ],
};
