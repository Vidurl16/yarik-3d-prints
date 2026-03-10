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
    { label: "Statues",     match: (p) => (p.tags ?? []).includes("statue") },
    { label: "Figurines",   match: (p) => (p.tags ?? []).some((t) => ["starter", "fan-favourite"].includes(t)) || p.name.toLowerCase().includes("figurine") || p.name.toLowerCase().includes("figure") },
    { label: "Busts",       match: (p) => (p.tags ?? []).includes("bust") },
    { label: "Collections", match: (p) => (p.tags ?? []).some((t) => ["collection", "set", "display"].includes(t)) },
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

export const dbBrandFilters: Record<string, DbFilterDef[]> = {
  "grimdark-future": [
    {
      label: "Infantry",
      match: (p) => p.type === "infantry" || tags(p).some((t) => ["infantry", "cavalry"].includes(t)),
    },
    {
      label: "Characters",
      match: (p) => p.type === "character" || tags(p).some((t) => ["character", "hq", "leader"].includes(t)),
    },
    {
      label: "Vehicles",
      match: (p) => p.type === "vehicle" || tags(p).some((t) => ["vehicle", "vehicles", "tank", "transport", "transports"].includes(t)),
    },
  ],
  "age-of-fantasy": [
    {
      label: "Warbands",
      match: (p) => (p.type === "infantry" || tags(p).includes("infantry")) && !tags(p).includes("cavalry"),
    },
    {
      label: "Cavalry",
      match: (p) => p.type === "cavalry" || tags(p).some((t) => ["cavalry", "mount", "mounted"].includes(t)),
    },
    {
      label: "Heroes & Wizards",
      match: (p) => p.type === "character" || tags(p).some((t) => ["character", "hq", "hero", "wizard", "magic"].includes(t)),
    },
    {
      label: "Monsters & Mounts",
      match: (p) => p.type === "monster" || tags(p).some((t) => ["monster", "dragon", "beast", "creature", "chariot"].includes(t)),
    },
  ],
  "pokemon": [
    { label: "Statues",     match: (p) => p.type === "statue"   || tags(p).includes("statue") },
    { label: "Figurines",   match: (p) => p.type === "figurine" || tags(p).some((t) => ["figurine", "figure", "starter", "fan-favourite"].includes(t)) },
    { label: "Busts",       match: (p) => p.type === "bust"     || tags(p).includes("bust") },
    { label: "Collections", match: (p) => p.type === "set"      || tags(p).some((t) => ["set", "collection", "display"].includes(t)) },
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
};
