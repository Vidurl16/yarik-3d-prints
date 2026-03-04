import { getNewArrivals } from "@/lib/products";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals — YARIK 3D Prints",
  description: "The latest premium 3D prints — fresh off the printer.",
};

export default function NewArrivalsPage() {
  const products = getNewArrivals();

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#6b6b6b] font-body mb-8">
          <Link href="/" className="hover:text-[#c9a84c] transition-colors">HOME</Link>
          <span className="text-[rgba(201,168,76,0.3)]">›</span>
          <span className="text-[rgba(232,224,208,0.5)]">NEW ARRIVALS</span>
        </div>

        <div
          className="h-px mb-8"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }}
        />

        <p className="font-body text-[10px] tracking-[0.3em] text-[rgba(201,168,76,0.5)] mb-3 uppercase">
          Just Landed
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl text-[#e8e0d0] mb-2">NEW ARRIVALS</h1>
        <p className="font-body text-sm text-[#6b6b6b]">
          {products.length} fresh prints — 16K resin &amp; multicolour FDM.
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-heading text-sm text-[rgba(201,168,76,0.4)] tracking-widest mb-4">
              NO NEW ARRIVALS YET
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
