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
    <div className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 text-[10px] tracking-widest font-body mb-8" style={{ color: "var(--muted)" }}>
          <Link href="/" className="transition-colors" style={{ color: "var(--muted)" }}>HOME</Link>
          <span style={{ color: "var(--border)" }}>›</span>
          <span style={{ color: "var(--text)", opacity: 0.5 }}>PREORDERS</span>
        </div>

        <div
          className="h-px mb-8"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,0,0,0.5), transparent)" }}
        />

        <p className="font-body text-[10px] tracking-[0.3em] mb-3 uppercase" style={{ color: "var(--accent)", opacity: 0.8 }}>
          Coming Soon
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl mb-2" style={{ color: "var(--text)" }}>PREORDERS</h1>
        <p className="font-body text-sm max-w-md" style={{ color: "var(--muted)" }}>
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
                  background: "var(--surface)",
                  border: "1px solid rgba(139,0,0,0.3)",
                }}
              >
                <div className="relative w-full aspect-square overflow-hidden" style={{ background: "var(--surface)" }}>
                  <Image
                    src={product.image_url ?? `https://picsum.photos/seed/${product.slug}/400/400`}
                    alt={product.name}
                    fill
                    loading="lazy"
                    className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-xs tracking-[0.3em] text-[rgba(139,0,0,0.8)]">
                      COMING SOON
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 font-body text-[9px] tracking-[0.15em] px-2 py-0.5 bg-[rgba(139,0,0,0.25)] text-[#ff6060] border border-[rgba(139,0,0,0.5)]">
                    PREORDER
                  </span>
                  {product.preorder_date && (
                    <span className="absolute bottom-3 right-3 font-body text-[10px] tracking-widest" style={{ color: "var(--muted)" }}>
                      {product.preorder_date}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <span className="font-body text-[9px] tracking-widest uppercase mb-1" style={{ color: "var(--muted)" }}>
                    {product.type}
                  </span>
                  <h3 className="font-body text-sm font-semibold leading-snug flex-1 mb-3" style={{ color: "var(--text)" }}>
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(139,0,0,0.15)" }}>
                    <span className="font-heading" style={{ color: "var(--primary)" }}>R {(product.price_cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 0 })}</span>
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
            <p className="font-heading text-sm tracking-widest mb-4" style={{ color: "var(--accent)", opacity: 0.6 }}>
              NO PREORDERS AVAILABLE
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
