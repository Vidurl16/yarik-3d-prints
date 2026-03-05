import { getServiceClient } from "@/lib/supabase/server";
import type { DbProduct } from "./types";

const isConfigured = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function getProductsByBrand(brand: string): Promise<DbProduct[]> {
  if (!isConfigured()) return [];
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("brand", brand)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) console.error("[DB] getProductsByBrand:", error.message);
  return data ?? [];
}

export async function getNewArrivals(): Promise<DbProduct[]> {
  if (!isConfigured()) return [];
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_new", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) console.error("[DB] getNewArrivals:", error.message);
  return data ?? [];
}

export async function getPreorders(): Promise<DbProduct[]> {
  if (!isConfigured()) return [];
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_preorder", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) console.error("[DB] getPreorders:", error.message);
  return data ?? [];
}
