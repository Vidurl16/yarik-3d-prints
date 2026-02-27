export type PrintType = "RESIN" | "FDM" | "MULTICOLOUR";
export type Category = "Infantry" | "Vehicles" | "Characters" | "Terrain";

export interface Product {
  id: string;
  name: string;
  price: number;
  printType: PrintType;
  category: Category;
  faction: string;
  imageUrl: string;
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
  seed: string
): Product {
  return {
    id,
    name,
    price,
    printType,
    category,
    faction,
    imageUrl: `https://picsum.photos/seed/${seed}/400/400`,
  };
}

export const products: Product[] = [
  // Space Marines
  p("sm-1", "Intercessor Squad ×5", 350, "RESIN", "Infantry", "space-marines", "sm-intercessor"),
  p("sm-2", "Primaris Captain", 180, "RESIN", "Characters", "space-marines", "sm-captain"),
  p("sm-3", "Land Raider Tank", 650, "MULTICOLOUR", "Vehicles", "space-marines", "sm-landraider"),
  p("sm-4", "Librarian in Phobos Armour", 220, "RESIN", "Characters", "space-marines", "sm-librarian"),
  p("sm-5", "Drop Pod", 480, "FDM", "Vehicles", "space-marines", "sm-droppod"),
  p("sm-6", "Chapter Banner Bearer", 160, "RESIN", "Characters", "space-marines", "sm-banner"),

  // Orks
  p("ork-1", "Ork Boyz ×10", 350, "RESIN", "Infantry", "orks", "ork-boyz"),
  p("ork-2", "Warboss", 210, "RESIN", "Characters", "orks", "ork-warboss"),
  p("ork-3", "Battlewagon", 650, "MULTICOLOUR", "Vehicles", "orks", "ork-battlewagon"),
  p("ork-4", "Weirdboy Warphead", 220, "RESIN", "Characters", "orks", "ork-weirdboy"),
  p("ork-5", "Looted Wagon", 480, "FDM", "Vehicles", "orks", "ork-looted"),
  p("ork-6", "Nob with Waaagh Banner", 160, "RESIN", "Characters", "orks", "ork-nob"),

  // Tyranids
  p("tyr-1", "Termagant Brood ×10", 350, "RESIN", "Infantry", "tyranids", "tyr-termagant"),
  p("tyr-2", "Hive Tyrant", 620, "MULTICOLOUR", "Characters", "tyranids", "tyr-hivetyrant"),
  p("tyr-3", "Tyrannofex", 480, "FDM", "Vehicles", "tyranids", "tyr-tyrannofex"),
  p("tyr-4", "Broodlord", 220, "RESIN", "Characters", "tyranids", "tyr-broodlord"),
  p("tyr-5", "Trygon Prime", 450, "RESIN", "Vehicles", "tyranids", "tyr-trygon"),
  p("tyr-6", "Venomthrope", 160, "RESIN", "Characters", "tyranids", "tyr-venomthrope"),

  // Chaos Space Marines
  p("csm-1", "Chaos Legionaries ×5", 350, "RESIN", "Infantry", "chaos-space-marines", "csm-legionaries"),
  p("csm-2", "Chaos Lord", 180, "RESIN", "Characters", "chaos-space-marines", "csm-lord"),
  p("csm-3", "Chaos Rhino", 480, "FDM", "Vehicles", "chaos-space-marines", "csm-rhino"),
  p("csm-4", "Sorcerer in Terminator Armour", 220, "RESIN", "Characters", "chaos-space-marines", "csm-sorcerer"),
  p("csm-5", "Chaos Predator", 650, "MULTICOLOUR", "Vehicles", "chaos-space-marines", "csm-predator"),
  p("csm-6", "Dark Apostle", 160, "RESIN", "Characters", "chaos-space-marines", "csm-apostle"),

  // Custom Projects
  p("cp-1", "Custom Miniature (Single)", 350, "RESIN", "Characters", "custom-projects", "cp-mini"),
  p("cp-2", "Custom Bust", 480, "RESIN", "Characters", "custom-projects", "cp-bust"),
  p("cp-3", "Custom Terrain Piece", 650, "MULTICOLOUR", "Terrain", "custom-projects", "cp-terrain"),
  p("cp-4", "Custom Nameplate", 120, "RESIN", "Terrain", "custom-projects", "cp-nameplate"),
  p("cp-5", "Custom Vehicle Kit", 550, "FDM", "Vehicles", "custom-projects", "cp-vehicle"),
  p("cp-6", "Custom Display Base", 160, "RESIN", "Terrain", "custom-projects", "cp-base"),

  // Pokémon Merch
  p("poke-1", "Charizard Statue", 650, "MULTICOLOUR", "Characters", "pokemon-merch", "poke-charizard"),
  p("poke-2", "Pikachu Figurine", 180, "RESIN", "Characters", "pokemon-merch", "poke-pikachu"),
  p("poke-3", "Mewtwo Bust", 350, "RESIN", "Characters", "pokemon-merch", "poke-mewtwo"),
  p("poke-4", "Gengar Figure", 220, "RESIN", "Characters", "pokemon-merch", "poke-gengar"),
  p("poke-5", "Snorlax Display", 480, "FDM", "Characters", "pokemon-merch", "poke-snorlax"),
  p("poke-6", "Eevee Collection Set", 420, "RESIN", "Characters", "pokemon-merch", "poke-eevee"),
];

export function getProductsByFaction(factionId: string): Product[] {
  return products.filter((p) => p.faction === factionId);
}

export function getFactionById(id: string): Faction | undefined {
  return factions.find((f) => f.id === id);
}

export function formatPrice(price: number): string {
  return `R ${price.toLocaleString("en-ZA")}`;
}
