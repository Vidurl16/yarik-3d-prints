import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { isAdmin } from "@/lib/auth/isAdmin";
import { getServiceClient } from "@/lib/supabase/server";

const BUCKET = "product-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const productId = (formData.get("productId") as string) ?? "unknown";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "File exceeds 5 MB" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${productId}/${Date.now()}.${ext}`;

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const supabase = getServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
