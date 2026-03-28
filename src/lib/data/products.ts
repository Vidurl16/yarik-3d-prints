import { getServiceClient } from "@/lib/supabase/server";
import type { DbProduct } from "./types";
import type { Product, PrintType, Category, SiteCategoryId, UnitRole } from "@/lib/products";
import {
  getNewArrivals as getStaticNewArrivals,
  getPreorders as getStaticPreorders,
  getProductsByFaction as getStaticProductsByFaction,
  getProductsBySiteCategory as getStaticProductsBySiteCategory,
} from "@/lib/products";

const isConfigured = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

/** Map a static Product to DbProduct shape for use in DB-backed UI components */
function toDbProduct(prod: Product): DbProduct {
  return {
    id: prod.id,
    slug: prod.id,
    name: prod.name,
    brand: prod.siteCategory as string,
    type: prod.printType,
    print_type: prod.printType,
    faction: prod.faction,
    role: prod.role ?? null,
    price_cents: prod.price * 100,
    currency: "ZAR",
    tags: prod.tags ?? [],
    image_url: prod.imageUrl,
    is_preorder: prod.isPreorder ?? false,
    is_new: prod.isNewArrival ?? false,
    is_active: true,
    preorder_date: prod.preorderDate ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function normalizeTags(prod: DbProduct): string[] {
  return (prod.tags ?? []).map((tag) => tag.toLowerCase());
}

function mapPrintType(prod: DbProduct): PrintType {
  const explicit = prod.print_type?.toUpperCase();
  if (explicit === "RESIN" || explicit === "FDM" || explicit === "MULTICOLOUR") {
    return explicit;
  }
  const tags = normalizeTags(prod);
  if (tags.includes("fdm")) return "FDM";
  if (tags.includes("multicolour") || tags.includes("multicolor")) return "MULTICOLOUR";
  return "RESIN";
}

function mapCategory(prod: DbProduct): Category {
  const type = prod.type.toLowerCase();
  const tags = normalizeTags(prod);
  if (type === "terrain") return tags.includes("accessory") ? "Accessories" : "Terrain";
  if (type === "accessory") return "Accessories";
  if (type === "base" || type === "effect" || tags.includes("base") || tags.includes("effects")) return "Basing";
  if (type === "vehicle" || type === "monster") return "Vehicles";
  if (type === "character" || type === "figurine" || type === "statue" || type === "bust" || type === "set") return "Characters";
  return "Infantry";
}

function inferFaction(prod: DbProduct): string {
  if (prod.faction) return prod.faction;

  const slug = prod.slug.toLowerCase();
  const tags = normalizeTags(prod);
  if (prod.brand === "grimdark-future") {
    if (slug.includes("ork") || tags.includes("greenskin")) return "orks";
    if (slug.includes("tyr") || tags.includes("xenos") || tags.includes("swarm")) return "tyranids";
    if (slug.includes("chaos") || tags.includes("chaos")) return "chaos-space-marines";
    return "space-marines";
  }
  if (prod.brand === "age-of-fantasy") {
    if (slug.includes("lich") || slug.includes("skeleton") || slug.includes("black-knight") || tags.includes("undead")) {
      return "undead";
    }
    return "high-elves";
  }
  if (prod.brand === "pokemon") return "pokemon-merch";
  // Basing and terrain products don't belong to any faction — return brand so
  // they show only on brand pages, not on faction listing pages.
  if (prod.brand === "basing-battle-effects") return "basing-battle-effects";
  if (prod.brand === "gaming-accessories-terrain") return "gaming-accessories-terrain";
  return "custom-projects";
}

function inferRole(prod: DbProduct): UnitRole | undefined {
  const explicit = prod.role as UnitRole | null | undefined;
  if (explicit) return explicit;

  const tags = normalizeTags(prod);
  if (tags.includes("hq") || tags.includes("leader") || tags.includes("hero") || tags.includes("wizard")) return "HQ";
  if (tags.includes("battleline")) return "Battleline";
  if (tags.includes("support")) return "Support";
  if (tags.includes("cavalry") || tags.includes("mounted")) return "Cavalry";
  if (tags.includes("transport") || tags.includes("transports")) return "Transports";
  if (prod.type.toLowerCase() === "vehicle" || prod.type.toLowerCase() === "monster") return "Vehicles";
  if (prod.brand === "grimdark-future" || prod.brand === "age-of-fantasy") return "Infantry";
  return undefined;
}

export function toCatalogProduct(prod: DbProduct): Product {
  const faction = inferFaction(prod);
  return {
    id: prod.id,
    slug: prod.slug,
    name: prod.name,
    price: Math.round(prod.price_cents / 100),
    printType: mapPrintType(prod),
    category: mapCategory(prod),
    faction,
    siteCategory: prod.brand as SiteCategoryId,
    imageUrl: prod.image_url ?? `https://picsum.photos/seed/${prod.slug}/400/400`,
    role: inferRole(prod),
    tags: prod.tags ?? [],
    isNewArrival: prod.is_new,
    isPreorder: prod.is_preorder,
    preorderDate: prod.preorder_date ?? undefined,
  };
}

export async function getCatalogProductsByBrand(brand: string): Promise<Product[]> {
  return (await getProductsByBrand(brand)).map(toCatalogProduct);
}

export async function getCatalogProductsBySiteCategory(
  category: SiteCategoryId
): Promise<Product[]> {
  return getCatalogProductsByBrand(category);
}

export async function getCatalogProductsByFaction(factionId: string): Promise<Product[]> {
  const fallbackProducts = getStaticProductsByFaction(factionId);
  if (!isConfigured()) return fallbackProducts;

  const brandProducts = await Promise.all([
    getProductsByBrand("grimdark-future"),
    getProductsByBrand("age-of-fantasy"),
    getProductsByBrand("pokemon"),
    getProductsByBrand("basing-battle-effects"),
    getProductsByBrand("gaming-accessories-terrain"),
  ]);

  const matches = brandProducts
    .flat()
    .map(toCatalogProduct)
    .filter((product) => product.faction === factionId);

  return matches.length > 0 ? matches : fallbackProducts;
}

export async function getCatalogNewArrivals(): Promise<Product[]> {
  return (await getNewArrivals()).map(toCatalogProduct);
}

export async function getCatalogPreorders(): Promise<Product[]> {
  return (await getPreorders()).map(toCatalogProduct);
}

/** Fetch DB products for a specific brand+faction (or Pokémon sub-type) */
export async function getCatalogProductsByFactionInBrand(
  brand: string,
  factionId: string
): Promise<Product[]> {
  const allBrandProducts = await getProductsByBrand(brand);
  const mapped = allBrandProducts.map(toCatalogProduct);

  // For Pokémon, "factionId" maps to a product sub-type identified by tag
  if (brand === "pokemon") {
    const tagMap: Record<string, string> = {
      "pokeballs": "pokeball",
      "themed-pokeballs": "themed-pokeball",
      "3d-cards": "3d-card",
      "figurines": "figurine",
    };
    const tag = tagMap[factionId];
    if (tag) {
      return mapped.filter((p) => (p.tags ?? []).includes(tag));
    }
  }

  return mapped.filter((p) => p.faction === factionId);
}

export async function getCatalogBuilderProducts(): Promise<Product[]> {
  const brands: SiteCategoryId[] = ["grimdark-future", "age-of-fantasy"];
  const products = await Promise.all(brands.map((brand) => getCatalogProductsByBrand(brand)));
  return products.flat().filter((product) => product.role);
}

export async function getProductsByBrand(brand: string): Promise<DbProduct[]> {
  const fallbackProducts = getStaticProductsBySiteCategory(brand as Product["siteCategory"]).map(toDbProduct);
  if (!isConfigured()) {
    return fallbackProducts;
  }
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("brand", brand)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[DB] getProductsByBrand:", error.message);
    return fallbackProducts;
  }
  return data ?? [];
}

export async function getNewArrivals(): Promise<DbProduct[]> {
  const fallbackProducts = getStaticNewArrivals().map(toDbProduct);
  if (!isConfigured()) {
    return fallbackProducts;
  }
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_new", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[DB] getNewArrivals:", error.message);
    return fallbackProducts;
  }
  return data ?? [];
}

export async function getPreorders(): Promise<DbProduct[]> {
  const fallbackProducts = getStaticPreorders().map(toDbProduct);
  if (!isConfigured()) {
    return fallbackProducts;
  }
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_preorder", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[DB] getPreorders:", error.message);
    return fallbackProducts;
  }
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<DbProduct | null> {
  if (!isConfigured()) {
    return null;
  }
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) {
    console.error("[DB] getProductBySlug:", error.message);
    return null;
  }
  return data ?? null;
}
