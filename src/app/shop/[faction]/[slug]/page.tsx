import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/products";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import AddToCartButton from "./AddToCartButton";

interface PageProps {
  params: Promise<{ faction: string; slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — The Dexarium`,
    description: `${product.type} · ${product.print_type ?? "RESIN"} · R ${(product.price_cents / 100).toLocaleString("en-ZA")}`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { faction, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const priceZAR = product.price_cents / 100;
  const formattedPrice = `R ${priceZAR.toLocaleString("en-ZA", { minimumFractionDigits: 0 })}`;
  const imageUrl = product.image_url ?? `https://picsum.photos/seed/${product.slug}/800/800`;
  const isOutOfStock = product.stock_quantity != null && product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity != null && product.stock_quantity > 0 && product.stock_quantity <= 5;

  const printType =
    product.print_type === "FDM" || product.print_type === "MULTICOLOUR" || product.print_type === "RESIN"
      ? product.print_type
      : "RESIN";

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs tracking-wider font-body mb-10" style={{ color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--muted)" }}>HOME</Link>
          <span style={{ color: "var(--border)" }}>›</span>
          <Link href={`/shop/${faction}`} style={{ color: "var(--muted)" }}>{faction.replace(/-/g, " ").toUpperCase()}</Link>
          <span style={{ color: "var(--border)" }}>›</span>
          <span style={{ color: "var(--text)" }}>{product.name.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div
            className="relative aspect-square overflow-hidden"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(10,10,10,0.3)]" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new && (
                <span className="font-body text-xs tracking-[0.1em] px-2 py-0.5 bg-[rgba(139,94,20,0.9)] text-[#f0e8d8]">NEW</span>
              )}
              {product.is_preorder && (
                <span className="font-body text-xs tracking-[0.1em] px-2 py-0.5 bg-[rgba(139,0,0,0.8)] text-[#ff9090]">PREORDER</span>
              )}
              {isOutOfStock && (
                <span className="font-body text-xs tracking-[0.1em] px-2 py-0.5 bg-[rgba(30,30,30,0.95)] text-[#888]">SOLD OUT</span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <span className="font-body text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "var(--muted)" }}>
              {product.type}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl mb-4 leading-tight" style={{ color: "var(--text)" }}>
              {product.name}
            </h1>

            {/* Print type badge */}
            <div className="mb-6">
              <span
                className={`font-body text-xs tracking-[0.1em] px-3 py-1 ${
                  printType === "RESIN"
                    ? "print-badge-resin"
                    : printType === "FDM"
                    ? "print-badge-fdm"
                    : "print-badge-multicolour"
                }`}
              >
                {printType}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="font-heading text-4xl" style={{ color: "var(--primary)" }}>
                {formattedPrice}
              </span>
              {isLowStock && (
                <p className="font-body text-xs mt-2" style={{ color: "rgba(139,94,20,0.9)" }}>
                  ⚠ Only {product.stock_quantity} left in stock
                </p>
              )}
              {product.is_preorder && product.preorder_date && (
                <p className="font-body text-xs mt-2" style={{ color: "rgba(139,0,0,0.8)" }}>
                  Available: {product.preorder_date} · Full payment due at dispatch
                </p>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-body text-xs tracking-wider px-2 py-0.5"
                    style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            )}

            {/* Add to Cart */}
            <div className="mb-6">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: priceZAR,
                  imageUrl,
                  printType,
                }}
                isOutOfStock={isOutOfStock}
              />
            </div>

            {/* Meta info */}
            <div className="space-y-2 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
              {product.faction && (
                <p className="font-body text-xs" style={{ color: "var(--muted)" }}>
                  <span style={{ opacity: 0.6 }}>FACTION: </span>
                  {product.faction.replace(/-/g, " ").toUpperCase()}
                </p>
              )}
              {product.brand && (
                <p className="font-body text-xs" style={{ color: "var(--muted)" }}>
                  <span style={{ opacity: 0.6 }}>RANGE: </span>
                  {product.brand.replace(/-/g, " ").toUpperCase()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
