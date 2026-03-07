export type PrintType = "RESIN" | "FDM" | "MULTICOLOUR";
export type Category = "Infantry" | "Vehicles" | "Characters" | "Terrain" | "Accessories" | "Basing";
export type UnitRole = "HQ" | "Battleline" | "Infantry" | "Cavalry" | "Vehicles" | "Transports" | "Support";
export type SiteCategoryId =
  | "grimdark-future"
  | "age-of-fantasy"
  | "pokemon"
  | "basing-battle-effects"
  | "gaming-accessories-terrain";

export interface Product {
  id: string;
  name: string;
  price: number;
  printType: PrintType;
  category: Category;
  faction: string;
  siteCategory: SiteCategoryId;
  imageUrl: string;
  role?: UnitRole;
  tags?: string[];
  isNewArrival?: boolean;
  isPreorder?: boolean;
  preorderDate?: string;
}

export interface Faction {
  id: string;
  name: string;
  flavorText: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  productCount: number;
}

export interface SiteCategory {
  id: SiteCategoryId;
  name: string;
  shortName: string;
  flavorText: string;
  icon: string;
  /** Path to SVG icon under /public (served at this URL path) */
  iconSrc: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  theme: "grimdark" | "fantasy" | "cosy" | "neutral";
}

export const siteCategories: SiteCategory[] = [
  {
    id: "grimdark-future",
    name: "Grimdark Future",
    shortName: "Grimdark",
    flavorText: "40K-scale miniatures. Industrial ruin. Eternal war.",
    icon: "⚙️",
    iconSrc: "/brand-icons/grimdark-future.svg",
    accentColor: "#8b0000",
    glowColor: "rgba(139,0,0,0.5)",
    borderColor: "rgba(139,0,0,0.4)",
    theme: "grimdark",
  },
  {
    id: "age-of-fantasy",
    name: "Age of Fantasy",
    shortName: "Fantasy",
    flavorText: "Heroic warriors. Ancient magic. Epic battlefields.",
    icon: "⚔️",
    iconSrc: "/brand-icons/age-of-fantasy.svg",
    accentColor: "#2a5a3a",
    glowColor: "rgba(42,90,58,0.5)",
    borderColor: "rgba(80,160,100,0.35)",
    theme: "fantasy",
  },
  {
    id: "pokemon",
    name: "Pokémon",
    shortName: "Pokémon",
    flavorText: "Gotta catch 'em all — in glorious resin.",
    icon: "⭐",
    iconSrc: "/brand-icons/pokemon.svg",
    accentColor: "#c9a84c",
    glowColor: "rgba(201,168,76,0.4)",
    borderColor: "rgba(240,200,0,0.4)",
    theme: "cosy",
  },
  {
    id: "basing-battle-effects",
    name: "Basing & Battle Effects",
    shortName: "Basing",
    flavorText: "Realistic bases, scatter, and battlefield dressing.",
    icon: "🪨",
    iconSrc: "/brand-icons/basing-battle-effects.svg",
    accentColor: "#5a4a2a",
    glowColor: "rgba(90,74,42,0.5)",
    borderColor: "rgba(140,110,60,0.35)",
    theme: "neutral",
  },
  {
    id: "gaming-accessories-terrain",
    name: "Gaming Accessories & Terrain",
    shortName: "Terrain",
    flavorText: "Immersive terrain, tokens, trays and gaming accessories.",
    icon: "🏗️",
    iconSrc: "/brand-icons/gaming-accessories-terrain.svg",
    accentColor: "#2a3a5a",
    glowColor: "rgba(42,58,90,0.5)",
    borderColor: "rgba(80,120,180,0.35)",
    theme: "neutral",
  },
];

export const factions: Faction[] = [
  {
    id: "space-marines",
    name: "Space Marines",
    flavorText: "The Emperor's finest. Unyielding. Eternal.",
    accentColor: "#1a3a6e",
    glowColor: "rgba(26,58,110,0.6)",
    borderColor: "rgba(201,168,76,0.4)",
    productCount: 6,
  },
  {
    id: "orks",
    name: "Orks",
    flavorText: "Brutal. Loud. Unstoppable. WAAAGH!",
    accentColor: "#2d5a1b",
    glowColor: "rgba(45,90,27,0.6)",
    borderColor: "rgba(100,160,60,0.35)",
    productCount: 6,
  },
  {
    id: "tyranids",
    name: "Tyranids",
    flavorText: "The Great Devourer consumes all.",
    accentColor: "#4a1a6e",
    glowColor: "rgba(74,26,110,0.6)",
    borderColor: "rgba(180,140,200,0.35)",
    productCount: 6,
  },
  {
    id: "chaos-space-marines",
    name: "Chaos Space Marines",
    flavorText: "Sworn to the dark gods. Corrupted. Deadly.",
    accentColor: "#6e1a1a",
    glowColor: "rgba(110,26,26,0.7)",
    borderColor: "rgba(139,0,0,0.5)",
    productCount: 6,
  },
  {
    id: "high-elves",
    name: "High Elves",
    flavorText: "Ancient. Proud. Unmatched in blade and sorcery.",
    accentColor: "#1a4a3a",
    glowColor: "rgba(26,74,58,0.6)",
    borderColor: "rgba(100,200,140,0.35)",
    productCount: 6,
  },
  {
    id: "undead",
    name: "Undead Legion",
    flavorText: "Death is no barrier. The dead march eternal.",
    accentColor: "#2a1a4a",
    glowColor: "rgba(42,26,74,0.6)",
    borderColor: "rgba(140,100,200,0.35)",
    productCount: 6,
  },
  {
    id: "custom-projects",
    name: "Custom Projects",
    flavorText: "Your vision. Our printers. Anything goes.",
    accentColor: "#2a2a2a",
    glowColor: "rgba(80,80,80,0.5)",
    borderColor: "rgba(140,140,140,0.3)",
    productCount: 6,
  },
  {
    id: "pokemon-merch",
    name: "Pokémon Merch",
    flavorText: "Gotta catch 'em all — in glorious resin.",
    accentColor: "#6b5a00",
    glowColor: "rgba(200,180,0,0.35)",
    borderColor: "rgba(240,200,0,0.35)",
    productCount: 6,
  },
];

function p(
  id: string,
  name: string,
  price: number,
  printType: PrintType,
  category: Category,
  faction: string,
  siteCategory: SiteCategoryId,
  seed: string,
  opts?: { role?: UnitRole; tags?: string[]; isNewArrival?: boolean; isPreorder?: boolean; preorderDate?: string }
): Product {
  return {
    id,
    name,
    price,
    printType,
    category,
    faction,
    siteCategory,
    imageUrl: `https://picsum.photos/seed/${seed}/400/400`,
    ...opts,
  };
}

export const products: Product[] = [
  // Space Marines (Grimdark Future)
  p("sm-1", "Intercessor Squad ×5", 350, "RESIN", "Infantry", "space-marines", "grimdark-future", "sm-intercessor", { role: "Battleline", tags: ["infantry", "bolter", "power-armour"], isNewArrival: true }),
  p("sm-2", "Primaris Captain", 180, "RESIN", "Characters", "space-marines", "grimdark-future", "sm-captain", { role: "HQ", tags: ["character", "leader", "power-armour"] }),
  p("sm-3", "Land Raider Tank", 650, "MULTICOLOUR", "Vehicles", "space-marines", "grimdark-future", "sm-landraider", { role: "Vehicles", tags: ["tank", "transport", "heavy"] }),
  p("sm-4", "Librarian in Phobos Armour", 220, "RESIN", "Characters", "space-marines", "grimdark-future", "sm-librarian", { role: "HQ", tags: ["character", "psyker", "elite"] }),
  p("sm-5", "Drop Pod", 480, "FDM", "Vehicles", "space-marines", "grimdark-future", "sm-droppod", { role: "Transports", tags: ["transport", "deployment"] }),
  p("sm-6", "Chapter Banner Bearer", 160, "RESIN", "Characters", "space-marines", "grimdark-future", "sm-banner", { role: "Support", tags: ["character", "support"] }),

  // Orks (Grimdark Future)
  p("ork-1", "Ork Boyz ×10", 350, "RESIN", "Infantry", "orks", "grimdark-future", "ork-boyz", { role: "Battleline", tags: ["infantry", "choppa", "greenskin"] }),
  p("ork-2", "Warboss", 210, "RESIN", "Characters", "orks", "grimdark-future", "ork-warboss", { role: "HQ", tags: ["character", "leader", "greenskin"] }),
  p("ork-3", "Battlewagon", 650, "MULTICOLOUR", "Vehicles", "orks", "grimdark-future", "ork-battlewagon", { role: "Vehicles", tags: ["tank", "heavy", "looted"] }),
  p("ork-4", "Weirdboy Warphead", 220, "RESIN", "Characters", "orks", "grimdark-future", "ork-weirdboy", { role: "HQ", tags: ["character", "psyker", "greenskin"] }),
  p("ork-5", "Looted Wagon", 480, "FDM", "Vehicles", "orks", "grimdark-future", "ork-looted", { role: "Transports", tags: ["transport", "looted"] }),
  p("ork-6", "Nob with Waaagh Banner", 160, "RESIN", "Characters", "orks", "grimdark-future", "ork-nob", { role: "Support", tags: ["character", "support", "greenskin"] }),

  // Tyranids (Grimdark Future)
  p("tyr-1", "Termagant Brood ×10", 350, "RESIN", "Infantry", "tyranids", "grimdark-future", "tyr-termagant", { role: "Battleline", tags: ["infantry", "swarm", "xenos"], isNewArrival: true }),
  p("tyr-2", "Hive Tyrant", 620, "MULTICOLOUR", "Characters", "tyranids", "grimdark-future", "tyr-hivetyrant", { role: "HQ", tags: ["character", "monster", "xenos"] }),
  p("tyr-3", "Tyrannofex", 480, "FDM", "Vehicles", "tyranids", "grimdark-future", "tyr-tyrannofex", { role: "Vehicles", tags: ["monster", "heavy", "xenos"] }),
  p("tyr-4", "Broodlord", 220, "RESIN", "Characters", "tyranids", "grimdark-future", "tyr-broodlord", { role: "HQ", tags: ["character", "elite", "xenos"] }),
  p("tyr-5", "Trygon Prime", 450, "RESIN", "Vehicles", "tyranids", "grimdark-future", "tyr-trygon", { role: "Vehicles", tags: ["monster", "deepstrike", "xenos"] }),
  p("tyr-6", "Venomthrope", 160, "RESIN", "Characters", "tyranids", "grimdark-future", "tyr-venomthrope", { role: "Support", tags: ["support", "xenos"] }),

  // Chaos Space Marines (Grimdark Future)
  p("csm-1", "Chaos Legionaries ×5", 350, "RESIN", "Infantry", "chaos-space-marines", "grimdark-future", "csm-legionaries", { role: "Battleline", tags: ["infantry", "chaos", "power-armour"] }),
  p("csm-2", "Chaos Lord", 180, "RESIN", "Characters", "chaos-space-marines", "grimdark-future", "csm-lord", { role: "HQ", tags: ["character", "leader", "chaos"] }),
  p("csm-3", "Chaos Rhino", 480, "FDM", "Vehicles", "chaos-space-marines", "grimdark-future", "csm-rhino", { role: "Transports", tags: ["transport", "chaos"] }),
  p("csm-4", "Sorcerer in Terminator Armour", 220, "RESIN", "Characters", "chaos-space-marines", "grimdark-future", "csm-sorcerer", { role: "HQ", tags: ["character", "psyker", "chaos"] }),
  p("csm-5", "Chaos Predator", 650, "MULTICOLOUR", "Vehicles", "chaos-space-marines", "grimdark-future", "csm-predator", { role: "Vehicles", tags: ["tank", "heavy", "chaos"] }),
  p("csm-6", "Dark Apostle", 160, "RESIN", "Characters", "chaos-space-marines", "grimdark-future", "csm-apostle", { role: "Support", tags: ["character", "support", "chaos"] }),

  // High Elves (Age of Fantasy)
  p("he-1", "Spearmen Regiment ×10", 320, "RESIN", "Infantry", "high-elves", "age-of-fantasy", "he-spearmen", { role: "Battleline", tags: ["infantry", "spear", "elves"], isNewArrival: true }),
  p("he-2", "Archmage on Dragon", 780, "MULTICOLOUR", "Characters", "high-elves", "age-of-fantasy", "he-archmage", { role: "HQ", tags: ["character", "dragon", "magic"], isPreorder: true, preorderDate: "May 2025" }),
  p("he-3", "Silver Helm Cavalry ×5", 420, "RESIN", "Infantry", "high-elves", "age-of-fantasy", "he-silverhelm", { role: "Cavalry", tags: ["cavalry", "elite", "elves"] }),
  p("he-4", "White Lions ×10", 380, "RESIN", "Infantry", "high-elves", "age-of-fantasy", "he-whitelions", { role: "Infantry", tags: ["infantry", "elite", "elves"] }),
  p("he-5", "Eagle Chariot", 560, "MULTICOLOUR", "Vehicles", "high-elves", "age-of-fantasy", "he-chariot", { role: "Vehicles", tags: ["chariot", "fast"] }),
  p("he-6", "Loremaster of Hoeth", 240, "RESIN", "Characters", "high-elves", "age-of-fantasy", "he-loremaster", { role: "Support", tags: ["character", "magic", "support"] }),

  // Undead Legion (Age of Fantasy)
  p("un-1", "Skeleton Warriors ×20", 280, "RESIN", "Infantry", "undead", "age-of-fantasy", "un-skeletons", { role: "Battleline", tags: ["infantry", "undead", "skeleton"] }),
  p("un-2", "Lich King", 340, "RESIN", "Characters", "undead", "age-of-fantasy", "un-lichking", { role: "HQ", tags: ["character", "magic", "undead"], isPreorder: true, preorderDate: "June 2025" }),
  p("un-3", "Black Knights ×5", 460, "RESIN", "Infantry", "undead", "age-of-fantasy", "un-blackknights", { role: "Cavalry", tags: ["cavalry", "undead", "elite"] }),
  p("un-4", "Zombie Dragon", 720, "MULTICOLOUR", "Vehicles", "undead", "age-of-fantasy", "un-zombiedragon", { role: "Vehicles", tags: ["monster", "dragon", "undead"] }),
  p("un-5", "Spirit Hosts ×3", 180, "RESIN", "Infantry", "undead", "age-of-fantasy", "un-spirithosts", { role: "Support", tags: ["spirit", "undead", "ethereal"] }),
  p("un-6", "Necromancer", 160, "RESIN", "Characters", "undead", "age-of-fantasy", "un-necromancer", { role: "Support", tags: ["character", "magic", "undead"] }),

  // Pokémon Merch
  p("poke-1", "Charizard Statue", 650, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "poke-charizard", { tags: ["fire", "dragon", "statue"], isNewArrival: true }),
  p("poke-2", "Pikachu Figurine", 180, "RESIN", "Characters", "pokemon-merch", "pokemon", "poke-pikachu", { tags: ["electric", "starter", "cute"] }),
  p("poke-3", "Mewtwo Bust", 350, "RESIN", "Characters", "pokemon-merch", "pokemon", "poke-mewtwo", { tags: ["psychic", "legendary", "bust"] }),
  p("poke-4", "Gengar Figure", 220, "RESIN", "Characters", "pokemon-merch", "pokemon", "poke-gengar", { tags: ["ghost", "fan-favourite"] }),
  p("poke-5", "Snorlax Display", 480, "FDM", "Characters", "pokemon-merch", "pokemon", "poke-snorlax", { tags: ["normal", "display"] }),
  p("poke-6", "Eevee Collection Set", 420, "RESIN", "Characters", "pokemon-merch", "pokemon", "poke-eevee", { tags: ["normal", "collection", "set"], isPreorder: true, preorderDate: "April 2025" }),

  // Basing & Battle Effects
  p("bas-1", "Urban Rubble Base Set ×5 (32mm)", 120, "RESIN", "Basing", "custom-projects", "basing-battle-effects", "bas-urban", { tags: ["base", "urban", "32mm"] }),
  p("bas-2", "Cobblestone Base Set ×5 (32mm)", 110, "RESIN", "Basing", "custom-projects", "basing-battle-effects", "bas-cobble", { tags: ["base", "cobblestone", "32mm"] }),
  p("bas-3", "Lava Crater Base Set ×5 (40mm)", 150, "RESIN", "Basing", "custom-projects", "basing-battle-effects", "bas-lava", { tags: ["base", "lava", "40mm"], isNewArrival: true }),
  p("bas-4", "Dead Forest Base Set ×5 (50mm)", 180, "RESIN", "Basing", "custom-projects", "basing-battle-effects", "bas-forest", { tags: ["base", "nature", "50mm"] }),
  p("bas-5", "Scatter Rubble & Debris Set", 95, "RESIN", "Basing", "custom-projects", "basing-battle-effects", "bas-debris", { tags: ["scatter", "debris", "rubble"] }),
  p("bas-6", "Battle Effects Explosion Marker ×3", 140, "MULTICOLOUR", "Basing", "custom-projects", "basing-battle-effects", "bas-explosion", { tags: ["marker", "explosion", "effects"] }),

  // Gaming Accessories & Terrain
  p("ter-1", "Ruined Gothic Building", 650, "MULTICOLOUR", "Terrain", "custom-projects", "gaming-accessories-terrain", "ter-gothic", { tags: ["terrain", "gothic", "ruin"] }),
  p("ter-2", "Industrial Pipes & Walkways", 480, "FDM", "Terrain", "custom-projects", "gaming-accessories-terrain", "ter-pipes", { tags: ["terrain", "industrial", "modular"], isNewArrival: true }),
  p("ter-3", "Trench System Modular Set", 560, "FDM", "Terrain", "custom-projects", "gaming-accessories-terrain", "ter-trench", { tags: ["terrain", "trench", "modular"] }),
  p("ter-4", "Custom Dice Tray", 220, "RESIN", "Accessories", "custom-projects", "gaming-accessories-terrain", "ter-dicetray", { tags: ["accessory", "dice", "tray"] }),
  p("ter-5", "Magnetised Token Set ×20", 160, "RESIN", "Accessories", "custom-projects", "gaming-accessories-terrain", "ter-tokens", { tags: ["accessory", "token", "magnet"] }),
  p("ter-6", "Army Transport Foam Insert", 340, "FDM", "Accessories", "custom-projects", "gaming-accessories-terrain", "ter-foam", { tags: ["accessory", "transport", "storage"], isPreorder: true, preorderDate: "May 2025" }),
];

export function getProductsByFaction(factionId: string): Product[] {
  return products.filter((p) => p.faction === factionId);
}

export function getProductsBySiteCategory(categoryId: SiteCategoryId): Product[] {
  return products.filter((p) => p.siteCategory === categoryId);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNewArrival);
}

export function getPreorders(): Product[] {
  return products.filter((p) => p.isPreorder);
}

export function getFactionById(id: string): Faction | undefined {
  return factions.find((f) => f.id === id);
}

export function getSiteCategoryById(id: string): SiteCategory | undefined {
  return siteCategories.find((c) => c.id === id);
}

export function formatPrice(price: number): string {
  return `R ${price.toLocaleString("en-ZA")}`;
}
