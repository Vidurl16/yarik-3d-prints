import { getPreorders } from "@/lib/data/products";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Preorders — The Dexarium",
  description: "Reserve your models before they drop. Secure your spot in the queue.",
};

export default async function PreordersPage() {
  const products = await getPreorders();

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#6b6b6b] font-body mb-8">
          <Link href="/" className="hover:text-[#c9a84c] transition-colors">HOME</Link>
          <span className="text-[rgba(201,168,76,0.3)]">›</span>
          <span className="text-[rgba(232,224,208,0.5)]">PREORDERS</span>
        </div>

        <div
          className="h-px mb-8"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,0,0,0.5), transparent)" }}
        />

        <p className="font-body text-[10px] tracking-[0.3em] text-[rgba(139,0,0,0.7)] mb-3 uppercase">
          Coming Soon
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl text-[#e8e0d0] mb-2">PREORDERS</h1>
        <p className="font-body text-sm text-[#6b6b6b] max-w-md">
          Reserve your models before they print. Priority queue. Full payment on dispatch.
        </p>
      </div>

      {/* Preorder Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #141414 0%, #1a1010 100%)",
                  border: "1px solid rgba(139,0,0,0.3)",
                }}
              >
                <div className="relative w-full aspect-square overflow-hidden bg-[#111]">
                  <Image
                    src={product.image_url ?? `https://picsum.photos/seed/${product.slug}/400/400`}
                    alt={product.name}
                    fill
                    loading="lazy"
                    className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.9)] to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-xs tracking-[0.3em] text-[rgba(139,0,0,0.8)]">
                      COMING SOON
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 font-body text-[9px] tracking-[0.15em] px-2 py-0.5 bg-[rgba(139,0,0,0.25)] text-[#ff6060] border border-[rgba(139,0,0,0.5)]">
                    PREORDER
                  </span>
                  {product.preorder_date && (
                    <span className="absolute bottom-3 right-3 font-body text-[10px] tracking-widest text-[#6b6b6b]">
                      {product.preorder_date}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <span className="font-body text-[9px] tracking-widest text-[#6b6b6b] uppercase mb-1">
                    {product.type}
                  </span>
                  <h3 className="font-body text-sm font-semibold text-[#e8e0d0] leading-snug flex-1 mb-3">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between pt-3 border-t border-[rgba(139,0,0,0.15)]">
                    <span className="font-heading text-[#c9a84c]">R {(product.price_cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 0 })}</span>
                    <Link
                      href="/contact"
                      className="font-body text-[10px] tracking-widest px-3 py-1.5 bg-[rgba(139,0,0,0.2)] hover:bg-[rgba(139,0,0,0.4)] text-[#ff6060] border border-[rgba(139,0,0,0.4)] transition-all duration-200"
                    >
                      RESERVE
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-heading text-sm text-[rgba(139,0,0,0.5)] tracking-widest mb-4">
              NO PREORDERS AVAILABLE
            </p>
            <Link
              href="/shop"
              className="font-body text-xs tracking-[0.2em] px-6 py-2 border border-[rgba(201,168,76,0.4)] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)] transition-all"
            >
              BROWSE SHOP
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
