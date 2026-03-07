import { getServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "../../ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = getServiceClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-heading text-xl tracking-[0.15em] text-[#c4a045] mb-8">
        EDIT PRODUCT
      </h1>
      <p className="font-body text-xs text-[rgba(240,232,216,0.3)] mb-6">{product.name}</p>
      <ProductForm product={product} />
    </div>
  );
}
