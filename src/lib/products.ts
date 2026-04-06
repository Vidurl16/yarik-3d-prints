export type PrintType = "RESIN" | "FDM" | "MULTICOLOUR";
export type Category = "Infantry" | "Vehicles" | "Characters" | "Terrain" | "Accessories" | "Basing";
export type UnitRole = "HQ" | "Battleline" | "Infantry" | "Cavalry" | "Vehicles" | "Transports" | "Support";
export type SiteCategoryId =
  | "grimdark-future"
  | "age-of-fantasy"
  | "pokemon"
  | "basing-battle-effects"
  | "gaming-accessories-terrain"
  | "display-figures-busts";

export interface Product {
  id: string;
  slug: string;
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

/** A faction or product-type group within a brand */
export interface BrandFaction {
  id: string;
  name: string;
  flavorText: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  brand: SiteCategoryId;
  /** Product type categories available within this faction */
  productTypes?: string[];
  /** Optional photo image for faction tile (under public/) */
  imageUrl?: string;
}

/** Brand → faction/category groupings for the new navigation structure */
export const brandFactions: Partial<Record<SiteCategoryId, BrandFaction[]>> = {
  "grimdark-future": [
    { id: "space-marines",        name: "Angels of Death",           flavorText: "The Emperor's finest. Unyielding. Eternal.",              accentColor: "#1a3a6e", glowColor: "rgba(26,58,110,0.7)",  borderColor: "rgba(201,168,76,0.4)",  brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/angels-of-death.jpg" },
    { id: "dark-angels",          name: "Dark Angels of Death",      flavorText: "Secrets buried in blood. Honour through redemption.",     accentColor: "#1a3a1a", glowColor: "rgba(26,58,26,0.7)",   borderColor: "rgba(100,160,60,0.4)",  brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/dark-angels-of-death.jpg" },
    { id: "blood-angels",         name: "Bloodied Angels of Death",  flavorText: "Feral fury beneath gilded armour.",                       accentColor: "#8b0000", glowColor: "rgba(139,0,0,0.7)",    borderColor: "rgba(200,50,50,0.4)",   brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/bloodied-angels-of-death.jpg" },
    { id: "space-wolves",         name: "Space Vikings",             flavorText: "Howling into the void. Wild. Unbroken.",                  accentColor: "#2a3a5a", glowColor: "rgba(42,58,90,0.7)",   borderColor: "rgba(140,160,200,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/space-vikings.jpg" },
    { id: "black-templars",       name: "Templars",                  flavorText: "Crusaders of the void. No mercy. No retreat.",            accentColor: "#1a1a1a", glowColor: "rgba(60,50,0,0.7)",    borderColor: "rgba(200,168,76,0.4)",  brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/templars.jpg" },
    { id: "custodians",           name: "Custodians",                flavorText: "The golden guard of the god-emperor. Peerless.",          accentColor: "#c9a84c", glowColor: "rgba(201,168,76,0.7)", borderColor: "rgba(201,168,76,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/custodians.jpg" },
    { id: "imperial-guard",       name: "The Guard",                 flavorText: "A trillion soldiers. Courage in numbers.",                accentColor: "#5a4a2a", glowColor: "rgba(90,74,42,0.7)",   borderColor: "rgba(140,120,60,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/the-guard.jpg" },
    { id: "sisters-of-battle",    name: "Battle Sisters",            flavorText: "Faith forged in fire. Blessed bolt and flame.",           accentColor: "#8b1a1a", glowColor: "rgba(139,26,26,0.7)", borderColor: "rgba(200,80,80,0.4)",  brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/battle-sisters.jpg" },
    { id: "grey-knights",         name: "Silver Paladins",           flavorText: "Daemon hunters. Psychic warriors forged in silver.",      accentColor: "#5a6a7a", glowColor: "rgba(90,106,122,0.7)", borderColor: "rgba(180,200,220,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/silver-paladins.jpg" },
    { id: "adeptus-mechanicus",   name: "Mars Tech",                 flavorText: "Machine and flesh. The Omnissiah provides.",              accentColor: "#8b1a00", glowColor: "rgba(139,26,0,0.7)",  borderColor: "rgba(200,80,40,0.4)",  brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/mars-tech.jpg" },
    { id: "knights",              name: "Knights Collosus",          flavorText: "Walking cathedrals of death. Household honour.",          accentColor: "#3a2a1a", glowColor: "rgba(58,42,26,0.7)",  borderColor: "rgba(160,120,60,0.4)", brand: "grimdark-future", productTypes: ["Characters","Vehicles"],             imageUrl: "/images/categories/factions/grimdark-future/knights-collosus.jpg" },
    { id: "chaos-space-marines",  name: "Lords of Chaos",            flavorText: "Sworn to the dark gods. Corrupted. Deadly.",             accentColor: "#6e1a1a", glowColor: "rgba(110,26,26,0.8)", borderColor: "rgba(139,0,0,0.5)",   brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/lords-of-chaos.jpg" },
    { id: "death-guard",          name: "Lords of Decay",            flavorText: "Blessed by pestilence. Rot made manifest.",              accentColor: "#4a5a1a", glowColor: "rgba(74,90,26,0.7)",  borderColor: "rgba(120,140,50,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/lords-of-decay.jpg" },
    { id: "thousand-sons",        name: "Lords of Sorcery",          flavorText: "Masters of the warp. Knowledge is power.",               accentColor: "#1a2a6e", glowColor: "rgba(26,42,110,0.7)", borderColor: "rgba(80,120,200,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/lords-of-sorcery.jpg" },
    { id: "world-eaters",         name: "Lords of Slaughter",        flavorText: "Blood for the Blood God. Skulls for the skull throne.",  accentColor: "#8b0000", glowColor: "rgba(139,0,0,0.8)",  borderColor: "rgba(180,40,40,0.5)",  brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/lords-of-slaughter.jpg" },
    { id: "emperors-children",    name: "Lords of Perfection",       flavorText: "Pleasure. Pain. Excess without limit.",                  accentColor: "#6e1a6e", glowColor: "rgba(110,26,110,0.7)", borderColor: "rgba(180,80,180,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/lords-of-perfection.jpg" },
    { id: "chaos-knights",        name: "Legio Demonica",            flavorText: "Corrupted warmachines. Daemon-bound iron.",              accentColor: "#3a1a1a", glowColor: "rgba(58,26,26,0.7)",  borderColor: "rgba(140,50,50,0.4)",  brand: "grimdark-future", productTypes: ["Characters","Vehicles"],             imageUrl: "/images/categories/factions/grimdark-future/legio-demonica.jpg" },
    { id: "chaos-titans",         name: "Chaotic Knights Collosus",  flavorText: "Titan-scale heresy. The ground trembles.",               accentColor: "#4a1a0a", glowColor: "rgba(74,26,10,0.7)",  borderColor: "rgba(160,70,40,0.4)",  brand: "grimdark-future", productTypes: ["Vehicles"],                          imageUrl: "/images/categories/factions/grimdark-future/chaotic-knights-collosus.jpg" },
    { id: "orks",                 name: "Greenskins",                flavorText: "Brutal. Loud. Unstoppable. WAAAGH!",                     accentColor: "#2d5a1b", glowColor: "rgba(45,90,27,0.7)",  borderColor: "rgba(100,160,60,0.35)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/greenskins.jpg" },
    { id: "necrons",              name: "Undying Legion",            flavorText: "Ancient beyond reckoning. Death is just a delay.",       accentColor: "#1a4a1a", glowColor: "rgba(26,74,26,0.7)",  borderColor: "rgba(80,200,80,0.4)",  brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/undying-legion.jpg" },
    { id: "tyranids",             name: "The Swarm",                 flavorText: "The Great Devourer consumes all.",                       accentColor: "#4a1a6e", glowColor: "rgba(74,26,110,0.7)", borderColor: "rgba(180,140,200,0.35)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/the-swarm.jpg" },
    { id: "eldar",                name: "Eldar",                     flavorText: "Ancient. Graceful. Deadly beyond measure.",             accentColor: "#1a3a5a", glowColor: "rgba(26,58,90,0.7)",  borderColor: "rgba(100,160,220,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/eldar.jpg" },
    { id: "dark-eldar",           name: "Dark Eldar",                flavorText: "Raiders from the webway. Pain is their currency.",       accentColor: "#3a1a4a", glowColor: "rgba(58,26,74,0.7)",  borderColor: "rgba(140,80,200,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/dark-eldar.jpg" },
    { id: "tau",                  name: "The Greater Good",          flavorText: "For the Greater Good. United, humanity shall prevail.",  accentColor: "#1a4a5a", glowColor: "rgba(26,74,90,0.7)",  borderColor: "rgba(80,160,180,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/the-greater-good.jpg" },
    { id: "leagues-of-votann",    name: "Dwarf Kin",                 flavorText: "Ancient grudges never forgotten. Kin stand together.",   accentColor: "#5a3a1a", glowColor: "rgba(90,58,26,0.7)",  borderColor: "rgba(160,120,60,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/dwarf-kin.jpg" },
    { id: "genestealer-cults",    name: "Gene Cults",                flavorText: "The Great Devourer's vanguard, hiding in plain sight.",  accentColor: "#4a1a3a", glowColor: "rgba(74,26,58,0.7)",  borderColor: "rgba(160,80,140,0.4)", brand: "grimdark-future", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/grimdark-future/gene-cults.jpg" },
  ],
  "age-of-fantasy": [
    { id: "high-elves",    name: "Eternals",       flavorText: "Immortal warriors. Shining blade and unwavering resolve.",     accentColor: "#c9a84c", glowColor: "rgba(201,168,76,0.7)", borderColor: "rgba(201,168,76,0.4)", brand: "age-of-fantasy", productTypes: ["Infantry","Cavalry","Characters"], imageUrl: "/images/categories/factions/age-of-fantasy/eternals.jpg" },
    { id: "wood-elves",    name: "Elves",          flavorText: "Swift as the wind. Masters of the ancient forests.",           accentColor: "#2a5a2a", glowColor: "rgba(42,90,42,0.7)",   borderColor: "rgba(100,180,80,0.4)", brand: "age-of-fantasy", productTypes: ["Infantry","Cavalry","Characters"], imageUrl: "/images/categories/factions/age-of-fantasy/elves.jpg" },
    { id: "dark-elves",    name: "Dark Elves",     flavorText: "Ruthless. Cunning. No mercy for the weak.",                    accentColor: "#2a1a4a", glowColor: "rgba(42,26,74,0.7)",   borderColor: "rgba(120,80,180,0.4)", brand: "age-of-fantasy", productTypes: ["Infantry","Cavalry","Characters"], imageUrl: "/images/categories/factions/age-of-fantasy/dark-elves.jpg" },
    { id: "woodelves",     name: "Wood Elves",     flavorText: "Guardians of the sacred groves. Nature's wrath incarnate.",   accentColor: "#3a5a1a", glowColor: "rgba(58,90,26,0.7)",   borderColor: "rgba(120,160,60,0.4)", brand: "age-of-fantasy", productTypes: ["Infantry","Cavalry","Characters"], imageUrl: "/images/categories/factions/age-of-fantasy/woodelves.jpg" },
    { id: "lizardmen",     name: "Lizardmen",      flavorText: "Ancient servants of the Old Ones. Cold-blooded wrath.",        accentColor: "#1a5a3a", glowColor: "rgba(26,90,58,0.7)",   borderColor: "rgba(60,160,100,0.4)", brand: "age-of-fantasy", productTypes: ["Infantry","Cavalry","Characters"], imageUrl: "/images/categories/factions/age-of-fantasy/lizardmen.jpg" },
    { id: "cities",        name: "Cities",         flavorText: "Armies of the city-states. Strength in unity.",               accentColor: "#3a3a5a", glowColor: "rgba(58,58,90,0.7)",   borderColor: "rgba(120,120,180,0.4)", brand: "age-of-fantasy", productTypes: ["Infantry","Cavalry","Characters"], imageUrl: "/images/categories/factions/age-of-fantasy/cities.jpg" },
    { id: "vampire-lords", name: "Vampire Lords",  flavorText: "Eternal nobility. Blood is both thirst and throne.",          accentColor: "#5a1a1a", glowColor: "rgba(90,26,26,0.7)",   borderColor: "rgba(160,60,60,0.4)",  brand: "age-of-fantasy", productTypes: ["Infantry","Cavalry","Characters"], imageUrl: "/images/categories/factions/age-of-fantasy/vampire-lords.jpg" },
    { id: "undead",        name: "The Haunted",    flavorText: "Spectral legions. The veil between worlds grows thin.",       accentColor: "#2a1a4a", glowColor: "rgba(42,26,74,0.7)",   borderColor: "rgba(140,100,200,0.35)", brand: "age-of-fantasy", productTypes: ["Infantry","Cavalry","Characters"], imageUrl: "/images/categories/factions/age-of-fantasy/the-haunted.jpg" },
    { id: "flesh-eaters",  name: "Flesh Eaters",   flavorText: "Delusional ghouls believing themselves noble knights.",        accentColor: "#4a1a1a", glowColor: "rgba(74,26,26,0.7)",  borderColor: "rgba(140,50,50,0.4)",  brand: "age-of-fantasy", productTypes: ["Infantry","Characters"],           imageUrl: "/images/categories/factions/age-of-fantasy/flesh-eaters.jpg" },
    { id: "rotkin",        name: "Rotkin",         flavorText: "Plague monks. Disease and devotion inseparable.",             accentColor: "#4a5a1a", glowColor: "rgba(74,90,26,0.7)",   borderColor: "rgba(120,140,50,0.4)", brand: "age-of-fantasy", productTypes: ["Infantry","Characters"],           imageUrl: "/images/categories/factions/age-of-fantasy/rotkin.jpg" },
    { id: "ratmen",        name: "Ratmen",         flavorText: "Skittering masses. Outnumber, overwhelm, devour.",            accentColor: "#5a4a1a", glowColor: "rgba(90,74,26,0.7)",   borderColor: "rgba(160,130,50,0.4)", brand: "age-of-fantasy", productTypes: ["Infantry","Characters"],           imageUrl: "/images/categories/factions/age-of-fantasy/ratmen.jpg" },
    { id: "chaos-knights-aof", name: "Chaos Knights",  flavorText: "Armoured servants of the dark gods. Dread made flesh.",      accentColor: "#6e1a1a", glowColor: "rgba(110,26,26,0.7)", borderColor: "rgba(160,50,50,0.4)",  brand: "age-of-fantasy", productTypes: ["Infantry","Cavalry","Characters"], imageUrl: "/images/categories/factions/age-of-fantasy/chaos-knights.jpg" },
    { id: "chaos-dwarves", name: "Chaos Dwarves",  flavorText: "Forge-masters of the dark lands. Industry and malice.",      accentColor: "#3a1a1a", glowColor: "rgba(58,26,26,0.7)",  borderColor: "rgba(120,50,30,0.4)",  brand: "age-of-fantasy", productTypes: ["Infantry","Characters","Vehicles"], imageUrl: "/images/categories/factions/age-of-fantasy/chaos-dwarves.jpg" },
    { id: "greenskins",    name: "Greenskins",     flavorText: "The biggest and the baddest. WAAAGH!",                        accentColor: "#2d5a1b", glowColor: "rgba(45,90,27,0.7)",  borderColor: "rgba(100,160,60,0.35)", brand: "age-of-fantasy", productTypes: ["Infantry","Characters"],          imageUrl: "/images/categories/factions/age-of-fantasy/greenskins.jpg" },
    { id: "goblins",       name: "Goblins",        flavorText: "Cunning little terrors. More dangerous in numbers.",          accentColor: "#3a6a1a", glowColor: "rgba(58,106,26,0.7)", borderColor: "rgba(100,180,50,0.4)", brand: "age-of-fantasy", productTypes: ["Infantry","Characters"],           imageUrl: "/images/categories/factions/age-of-fantasy/goblins.jpg" },
    { id: "ogres",         name: "Ogres",          flavorText: "Hungry. Massive. Unstoppable eating machines.",              accentColor: "#5a3a1a", glowColor: "rgba(90,58,26,0.7)",  borderColor: "rgba(160,110,50,0.4)", brand: "age-of-fantasy", productTypes: ["Infantry","Characters"],           imageUrl: "/images/categories/factions/age-of-fantasy/ogres.jpg" },
    { id: "giants",        name: "Giants",         flavorText: "Towering behemoths that shake the earth.",                   accentColor: "#3a2a1a", glowColor: "rgba(58,42,26,0.7)",  borderColor: "rgba(140,100,50,0.4)", brand: "age-of-fantasy", productTypes: ["Characters"],                      imageUrl: "/images/categories/factions/age-of-fantasy/giants.jpg" },
  ],
  "pokemon": [
    { id: "pokeballs",        name: "Pokéballs",        flavorText: "Classic resin Pokéballs — hand-painted and display ready.",              accentColor: "#c8281c", glowColor: "rgba(200,40,28,0.6)",  borderColor: "rgba(200,40,28,0.4)",  brand: "pokemon", imageUrl: "/images/categories/factions/pokemon/pokeballs.jpg" },
    { id: "themed-pokeballs", name: "Themed Pokéballs", flavorText: "Custom-painted Pokéballs themed after your favourite Pokémon.",          accentColor: "#e8c838", glowColor: "rgba(232,200,56,0.6)", borderColor: "rgba(232,200,56,0.4)", brand: "pokemon", imageUrl: "/images/categories/factions/pokemon/themed-pokeballs.jpg" },
    { id: "3d-cards",         name: "3D Display Cards", flavorText: "Multicolour FDM Pokémon display cards — art you can hold.",             accentColor: "#4a78c8", glowColor: "rgba(74,120,200,0.6)", borderColor: "rgba(74,120,200,0.4)", brand: "pokemon", imageUrl: "/images/categories/factions/pokemon/3d-cards.jpg" },
    { id: "figurines",        name: "Figurines & Statues", flavorText: "Resin Pokémon figurines, busts and display pieces.",                accentColor: "#c9a84c", glowColor: "rgba(201,168,76,0.6)", borderColor: "rgba(201,168,76,0.4)", brand: "pokemon", imageUrl: "/images/categories/factions/pokemon/figurines.jpg" },
  ],
  "basing-battle-effects": [
    { id: "old-world-city",    name: "Old World City",     flavorText: "Cobblestone streets, crumbling walls & urban rubble.",    accentColor: "#5a4a2a", glowColor: "rgba(90,74,42,0.6)",  borderColor: "rgba(140,110,60,0.4)", brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/old-world-city.jpg" },
    { id: "modern-city",       name: "Modern City",        flavorText: "Industrial ruin, concrete & twisted rebar.",              accentColor: "#4a4a4a", glowColor: "rgba(74,74,74,0.6)",  borderColor: "rgba(120,120,120,0.4)", brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/modern-city.jpg" },
    { id: "jungle-and-forest", name: "Jungle & Forest",   flavorText: "Roots, vines & dense undergrowth bases.",                 accentColor: "#2a5a1a", glowColor: "rgba(42,90,26,0.6)",  borderColor: "rgba(80,160,50,0.4)",  brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/jungle-and-forest.jpg" },
    { id: "rock-and-crystals", name: "Rock & Crystals",   flavorText: "Raw stone, gemstone shards & crystal formations.",        accentColor: "#3a3a5a", glowColor: "rgba(58,58,90,0.6)",  borderColor: "rgba(100,100,180,0.4)", brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/rock-and-crystals.jpg" },
    { id: "alien-worlds",      name: "Alien Worlds",       flavorText: "Xenos terrain, bioluminescent flora & strange growths.", accentColor: "#4a1a5a", glowColor: "rgba(74,26,90,0.6)",  borderColor: "rgba(140,60,180,0.4)", brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/alien-worlds.jpg" },
    { id: "elemental",         name: "Elemental",          flavorText: "Lava, ice, arcane energy & elemental forces.",            accentColor: "#8b2200", glowColor: "rgba(139,34,0,0.6)",  borderColor: "rgba(200,80,40,0.4)",  brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/elemental.jpg" },
    { id: "caves-and-swamps",  name: "Caves & Swamps",    flavorText: "Dark caverns, murky water & boggy terrain.",              accentColor: "#2a4a1a", glowColor: "rgba(42,74,26,0.6)",  borderColor: "rgba(80,120,50,0.4)",  brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/caves-and-swamps.jpg" },
    { id: "desert",            name: "Desert",             flavorText: "Sand, bone & sun-bleached ruins.",                       accentColor: "#8b6a1a", glowColor: "rgba(139,106,26,0.6)", borderColor: "rgba(200,160,60,0.4)", brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/desert.jpg" },
    { id: "oceanic",           name: "Oceanic",            flavorText: "Coral, shells, seaweed & ocean-floor scenics.",          accentColor: "#1a4a6a", glowColor: "rgba(26,74,106,0.6)", borderColor: "rgba(60,140,200,0.4)", brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/oceanic.jpg" },
    { id: "chaos-wastes",      name: "Chaos Wastes",       flavorText: "Warped stone, daemonic sigils & corrupted earth.",       accentColor: "#6e1a1a", glowColor: "rgba(110,26,26,0.6)", borderColor: "rgba(160,50,50,0.4)",  brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/chaos-wastes.jpg" },
    { id: "animal-life",       name: "Animal Life",        flavorText: "Skulls, bones, feathers & wildlife scatter.",            accentColor: "#5a3a1a", glowColor: "rgba(90,58,26,0.6)",  borderColor: "rgba(160,110,50,0.4)", brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/animal-life.jpg" },
    { id: "misc-and-skulls",   name: "Misc & Skulls",      flavorText: "Skulls, tokens, trophies & random scatter.",             accentColor: "#5a2a1a", glowColor: "rgba(90,42,26,0.6)",  borderColor: "rgba(160,80,50,0.4)",  brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/misc-and-skulls.jpg" },
    { id: "unique-debris",     name: "Unique Debris",      flavorText: "Cogs, pipes, tech debris & industrial scatter.",         accentColor: "#3a3a3a", glowColor: "rgba(58,58,58,0.6)",  borderColor: "rgba(120,120,120,0.4)", brand: "basing-battle-effects", imageUrl: "/images/categories/factions/basing-bits/unique-debris.jpg" },
  ],
  "display-figures-busts": [
    {
      id: "comics", name: "Comics",
      flavorText: "Display figures from comic universes.",
      accentColor: "#c9a84c", glowColor: "rgba(201,168,76,0.5)", borderColor: "rgba(201,168,76,0.3)",
      brand: "display-figures-busts",
      imageUrl: "/images/categories/factions/display-figures-busts/comics.jpg",
    },
    {
      id: "games", name: "Games",
      flavorText: "Figures from video & tabletop games.",
      accentColor: "#3a7a5a", glowColor: "rgba(58,122,90,0.5)", borderColor: "rgba(58,122,90,0.3)",
      brand: "display-figures-busts",
      imageUrl: "/images/categories/factions/display-figures-busts/games.jpg",
    },
    {
      id: "movies", name: "Movies",
      flavorText: "Iconic characters from the silver screen.",
      accentColor: "#1a4a7a", glowColor: "rgba(26,74,122,0.5)", borderColor: "rgba(26,74,122,0.3)",
      brand: "display-figures-busts",
      imageUrl: "/images/categories/factions/display-figures-busts/movies.jpg",
    },
    {
      id: "other", name: "Other",
      flavorText: "Unique display pieces that defy categories.",
      accentColor: "#4a4a4a", glowColor: "rgba(74,74,74,0.5)", borderColor: "rgba(120,120,120,0.3)",
      brand: "display-figures-busts",
      imageUrl: "/images/categories/factions/display-figures-busts/other.jpg",
    },
  ],
};

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
  {
    id: "display-figures-busts",
    name: "Display Figures & Busts",
    shortName: "Display",
    flavorText: "Comics, games, movies — beautifully rendered in resin.",
    icon: "🗿",
    iconSrc: "/brand-icons/display-figures-busts.svg",
    accentColor: "#5a3a7a",
    glowColor: "rgba(90,58,122,0.5)",
    borderColor: "rgba(130,80,180,0.35)",
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
    slug: id,
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
  p("he-2", "Archmage on Dragon", 780, "MULTICOLOUR", "Characters", "high-elves", "age-of-fantasy", "he-archmage", { role: "HQ", tags: ["character", "dragon", "magic"], isPreorder: true, preorderDate: "October 2026" }),
  p("he-3", "Silver Helm Cavalry ×5", 420, "RESIN", "Infantry", "high-elves", "age-of-fantasy", "he-silverhelm", { role: "Cavalry", tags: ["cavalry", "elite", "elves"] }),
  p("he-4", "White Lions ×10", 380, "RESIN", "Infantry", "high-elves", "age-of-fantasy", "he-whitelions", { role: "Infantry", tags: ["infantry", "elite", "elves"] }),
  p("he-5", "Eagle Chariot", 560, "MULTICOLOUR", "Vehicles", "high-elves", "age-of-fantasy", "he-chariot", { role: "Vehicles", tags: ["chariot", "fast"] }),
  p("he-6", "Loremaster of Hoeth", 240, "RESIN", "Characters", "high-elves", "age-of-fantasy", "he-loremaster", { role: "Support", tags: ["character", "magic", "support"] }),

  // Undead Legion (Age of Fantasy)
  p("un-1", "Skeleton Warriors ×20", 280, "RESIN", "Infantry", "undead", "age-of-fantasy", "un-skeletons", { role: "Battleline", tags: ["infantry", "undead", "skeleton"] }),
  p("un-2", "Lich King", 340, "RESIN", "Characters", "undead", "age-of-fantasy", "un-lichking", { role: "HQ", tags: ["character", "magic", "undead"], isPreorder: true, preorderDate: "November 2026" }),
  p("un-3", "Black Knights ×5", 460, "RESIN", "Infantry", "undead", "age-of-fantasy", "un-blackknights", { role: "Cavalry", tags: ["cavalry", "undead", "elite"] }),
  p("un-4", "Zombie Dragon", 720, "MULTICOLOUR", "Vehicles", "undead", "age-of-fantasy", "un-zombiedragon", { role: "Vehicles", tags: ["monster", "dragon", "undead"] }),
  p("un-5", "Spirit Hosts ×3", 180, "RESIN", "Infantry", "undead", "age-of-fantasy", "un-spirithosts", { role: "Support", tags: ["spirit", "undead", "ethereal"] }),
  p("un-6", "Necromancer", 160, "RESIN", "Characters", "undead", "age-of-fantasy", "un-necromancer", { role: "Support", tags: ["character", "magic", "undead"] }),

  // Pokémon — Figurines & Statues
  p("poke-1", "Charizard Statue", 650, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "poke-charizard", { tags: ["fire", "dragon", "statue", "figurine"], isNewArrival: true }),
  p("poke-2", "Pikachu Figurine", 180, "RESIN", "Characters", "pokemon-merch", "pokemon", "poke-pikachu", { tags: ["electric", "starter", "figurine"] }),
  p("poke-3", "Mewtwo Bust", 350, "RESIN", "Characters", "pokemon-merch", "pokemon", "poke-mewtwo", { tags: ["psychic", "legendary", "bust", "figurine"] }),
  p("poke-4", "Gengar Figure", 220, "RESIN", "Characters", "pokemon-merch", "pokemon", "poke-gengar", { tags: ["ghost", "fan-favourite", "figurine"] }),
  p("poke-5", "Snorlax Display Piece", 480, "FDM", "Characters", "pokemon-merch", "pokemon", "poke-snorlax", { tags: ["normal", "display", "figurine"] }),
  p("poke-6", "Eevee Collection Set", 420, "RESIN", "Characters", "pokemon-merch", "pokemon", "poke-eevee", { tags: ["normal", "collection", "set", "figurine"], isPreorder: true, preorderDate: "September 2026" }),

  // Pokémon — Pokéballs
  p("pokeball-1", "Standard Pokéball", 120, "RESIN", "Characters", "pokemon-merch", "pokemon", "pokeball-standard", { tags: ["pokeball", "classic", "display"] }),
  p("pokeball-2", "Great Ball", 120, "RESIN", "Characters", "pokemon-merch", "pokemon", "pokeball-great", { tags: ["pokeball", "great", "display"] }),
  p("pokeball-3", "Ultra Ball", 135, "RESIN", "Characters", "pokemon-merch", "pokemon", "pokeball-ultra", { tags: ["pokeball", "ultra", "display"], isNewArrival: true }),
  p("pokeball-4", "Master Ball", 180, "RESIN", "Characters", "pokemon-merch", "pokemon", "pokeball-master", { tags: ["pokeball", "master", "legendary"] }),
  p("pokeball-5", "Pokéball Trio Set", 320, "RESIN", "Characters", "pokemon-merch", "pokemon", "pokeball-trio", { tags: ["pokeball", "set", "collection"] }),
  p("pokeball-6", "Safari Ball", 135, "RESIN", "Characters", "pokemon-merch", "pokemon", "pokeball-safari", { tags: ["pokeball", "safari", "display"] }),

  // Pokémon — Themed Pokéballs
  p("themed-pb-1", "Charizard Flame Pokéball", 280, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "themed-charizard-ball", { tags: ["themed-pokeball", "charizard", "fire", "display"], isNewArrival: true }),
  p("themed-pb-2", "Pikachu Thunder Pokéball", 280, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "themed-pikachu-ball", { tags: ["themed-pokeball", "pikachu", "electric", "display"] }),
  p("themed-pb-3", "Mewtwo Psychic Pokéball", 280, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "themed-mewtwo-ball", { tags: ["themed-pokeball", "mewtwo", "psychic", "legendary"] }),
  p("themed-pb-4", "Eevee Woodland Pokéball", 260, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "themed-eevee-ball", { tags: ["themed-pokeball", "eevee", "normal", "display"] }),
  p("themed-pb-5", "Gengar Shadow Pokéball", 280, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "themed-gengar-ball", { tags: ["themed-pokeball", "gengar", "ghost", "display"] }),
  p("themed-pb-6", "Custom Themed Pokéball", 320, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "themed-custom-ball", { tags: ["themed-pokeball", "custom", "bespoke"], isPreorder: true, preorderDate: "August 2026" }),

  // Pokémon — 3D Display Cards
  p("3dcard-1", "Charizard 3D Display Card", 380, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "3dcard-charizard", { tags: ["3d-card", "charizard", "fire", "display"], isNewArrival: true }),
  p("3dcard-2", "Pikachu 3D Display Card", 320, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "3dcard-pikachu", { tags: ["3d-card", "pikachu", "electric", "display"] }),
  p("3dcard-3", "Gengar 3D Display Card", 340, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "3dcard-gengar", { tags: ["3d-card", "gengar", "ghost", "display"] }),
  p("3dcard-4", "Mewtwo 3D Display Card", 380, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "3dcard-mewtwo", { tags: ["3d-card", "mewtwo", "legendary", "display"] }),
  p("3dcard-5", "Eevee 3D Display Card", 320, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "3dcard-eevee", { tags: ["3d-card", "eevee", "normal", "display"] }),
  p("3dcard-6", "Snorlax 3D Display Card", 340, "MULTICOLOUR", "Characters", "pokemon-merch", "pokemon", "3dcard-snorlax", { tags: ["3d-card", "snorlax", "normal", "display"], isPreorder: true, preorderDate: "October 2026" }),

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
  p("ter-6", "Army Transport Foam Insert", 340, "FDM", "Accessories", "custom-projects", "gaming-accessories-terrain", "ter-foam", { tags: ["accessory", "transport", "storage"], isPreorder: true, preorderDate: "October 2026" }),
];

export function getProductsByFaction(factionId: string): Product[] {
  return products.filter((p) => p.faction === factionId);
}

export function getBrandFactions(brandId: SiteCategoryId): BrandFaction[] {
  return brandFactions[brandId] ?? [];
}

export function getBrandFactionById(brandId: SiteCategoryId, factionId: string): BrandFaction | undefined {
  return (brandFactions[brandId] ?? []).find((f) => f.id === factionId);
}

export function getProductsByBrandAndFaction(brandId: SiteCategoryId, factionId: string): Product[] {
  // For Pokémon, factionId maps to a product sub-type tag
  if (brandId === "pokemon") {
    const tagMap: Record<string, string> = {
      "pokeballs": "pokeball",
      "themed-pokeballs": "themed-pokeball",
      "3d-cards": "3d-card",
      "figurines": "figurine",
    };
    const tag = tagMap[factionId];
    if (tag) {
      return products.filter((p) => p.siteCategory === brandId && (p.tags ?? []).includes(tag));
    }
  }
  return products.filter((p) => p.siteCategory === brandId && p.faction === factionId);
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
