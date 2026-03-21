import { getNewArrivals } from "@/lib/data/products";
import Link from "next/link";
import DbProductCard from "@/components/DbProductCard";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "New Arrivals — The Dexarium",
  description: "The latest premium 3D prints — fresh off the printer.",
};

export default async function NewArrivalsPage() {
  const products = await getNewArrivals();

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 text-xs tracking-wider font-body mb-8" style={{ color: "var(--muted)" }}>
          <Link href="/" className="transition-colors hover:opacity-100" style={{ color: "var(--muted)" }}>HOME</Link>
          <span style={{ color: "var(--border)" }}>›</span>
          <span style={{ color: "var(--text)" }}>NEW ARRIVALS</span>
        </div>

        <div
          className="h-px mb-8"
          style={{ background: "linear-gradient(90deg, transparent, var(--primary), transparent)", opacity: 0.4 }}
        />

        <p className="font-body text-xs tracking-[0.15em] mb-3 uppercase" style={{ color: "var(--primary)" }}>
          Just Landed
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl mb-2" style={{ color: "var(--text)" }}>NEW ARRIVALS</h1>
        <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
          {products.length} fresh prints — 16K resin &amp; multicolour FDM.
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <DbProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-heading text-sm tracking-widest mb-4" style={{ color: "var(--primary)", opacity: 0.85 }}>
              NO NEW ARRIVALS YET
            </p>
            <Link
              href="/shop"
              className="font-body text-xs tracking-[0.2em] px-6 py-2 transition-all"
              style={{ border: "1px solid var(--border)", color: "var(--primary)" }}
            >
              BROWSE SHOP
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
