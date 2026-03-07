import { getServiceClient } from "@/lib/supabase/server";

const BUCKET = "product-images";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Upload a product image to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadProductImage(
  productId: string,
  file: File
): Promise<string> {
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Image exceeds 5 MB limit");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${productId}/${Date.now()}.${ext}`;

  const supabase = getServiceClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
