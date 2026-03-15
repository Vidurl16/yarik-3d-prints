import { getServiceClient } from "@/lib/supabase/server";
import type { DbProduct } from "./types";
import type { Product } from "@/lib/products";
import {
  getNewArrivals as getStaticNewArrivals,
  getPreorders as getStaticPreorders,
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
