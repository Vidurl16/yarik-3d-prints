import { siteCategories } from "@/lib/products";
import Link from "next/link";
import BrandIcon from "@/components/BrandIcon";

export const metadata = {
  title: "Shop — YARIK 3D Prints",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#6b6b6b] font-body mb-8">
          <Link href="/" className="hover:text-[#c9a84c] transition-colors">HOME</Link>
          <span className="text-[rgba(201,168,76,0.3)]">›</span>
          <span className="text-[rgba(232,224,208,0.5)]">SHOP</span>
        </div>

        <div
          className="h-px mb-8"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
          }}
        />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] text-[rgba(201,168,76,0.5)] mb-3 uppercase">
              Browse Collections
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl text-[#e8e0d0]">SHOP</h1>
          </div>
          <p className="font-body text-sm text-[#6b6b6b] max-w-xs leading-relaxed">
            {siteCategories.length} categories. Premium 16K resin &amp; multicolour FDM.
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.id}`}
              className="group relative flex flex-col p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, #141414 0%, #1a1414 100%)",
                border: `1px solid ${cat.borderColor}`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 50% 120%, ${cat.glowColor} 0%, transparent 70%)`,
                }}
              />
              <div className="relative z-10">
                <div className="w-20 h-20 mb-5 flex items-center justify-center">
                  <BrandIcon
                    id={cat.id}
                    className="w-full h-full"
                    style={{ color: cat.accentColor }}
                  />
                </div>
                <h2 className="font-heading text-xl tracking-[0.08em] text-[#e8e0d0] mb-2 group-hover:text-[#c9a84c] transition-colors">
                  {cat.name.toUpperCase()}
                </h2>
                <p className="font-body text-sm text-[#6b6b6b] leading-relaxed mb-6">
                  {cat.flavorText}
                </p>
                <span
                  className="font-body text-xs tracking-[0.2em] transition-colors"
                  style={{ color: cat.accentColor }}
                >
                  EXPLORE COLLECTION →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
