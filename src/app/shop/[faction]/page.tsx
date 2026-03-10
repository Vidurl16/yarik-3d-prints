import { notFound } from "next/navigation";
import {
  factions,
  siteCategories,
  getProductsByFaction,
  getProductsBySiteCategory,
  getFactionById,
  getSiteCategoryById,
} from "@/lib/products";
import Link from "next/link";
import ProductGrid from "./ProductGrid";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ faction: string }>;
}

export async function generateStaticParams() {
  const factionParams = factions.map((f) => ({ faction: f.id }));
  const categoryParams = siteCategories.map((c) => ({ faction: c.id }));
  return [...factionParams, ...categoryParams];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { faction: slug } = await params;
  const siteCategory = getSiteCategoryById(slug);
  if (siteCategory) {
    return {
      title: `${siteCategory.name} — YARIK 3D Prints`,
      description: siteCategory.flavorText,
    };
  }
  const faction = getFactionById(slug);
  if (!faction) return { title: "Not Found" };
  return {
    title: `${faction.name} — YARIK 3D Prints`,
    description: faction.flavorText,
  };
}

export default async function FactionPage({ params }: PageProps) {
  const { faction: slug } = await params;

  // Try site category first, then faction
  const siteCategory = getSiteCategoryById(slug);
  const faction = getFactionById(slug);

  if (!siteCategory && !faction) notFound();

  const products = siteCategory
    ? getProductsBySiteCategory(siteCategory.id)
    : getProductsByFaction(faction!.id);

  const displayName = siteCategory ? siteCategory.name : faction!.name;
  const displayText = siteCategory ? siteCategory.flavorText : faction!.flavorText;
  const accentColor = siteCategory ? siteCategory.accentColor : faction!.accentColor;
  const glowColor = siteCategory ? siteCategory.glowColor : faction!.glowColor;
  const borderColor = siteCategory ? siteCategory.borderColor : faction!.borderColor;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden mb-12"
        style={{
          background: `linear-gradient(135deg, #0a0a0a 0%, ${accentColor}30 50%, #0a0a0a 100%)`,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${glowColor} 0%, transparent 70%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#6b6b6b] font-body mb-6">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">HOME</Link>
            <span className="text-[rgba(201,168,76,0.3)]">›</span>
            <Link href="/shop" className="hover:text-[#c9a84c] transition-colors">SHOP</Link>
            <span className="text-[rgba(201,168,76,0.3)]">›</span>
            <span className="text-[rgba(232,224,208,0.5)] uppercase">{displayName}</span>
          </div>

          <p className="font-body text-[10px] tracking-[0.3em] text-[rgba(201,168,76,0.5)] mb-3 uppercase">
            {products.length} Models Available
          </p>
          <h1 className="font-heading text-3xl sm:text-5xl text-[#e8e0d0] mb-3">
            {displayName.toUpperCase()}
          </h1>
          <p className="font-body text-sm text-[#6b6b6b] max-w-md">
            {displayText}
          </p>

          {/* Faction sub-filters for site categories */}
          {siteCategory && (
            <div className="flex flex-wrap gap-2 mt-6">
              {factions
                .filter((f) => products.some((p) => p.faction === f.id))
                .map((f) => (
                  <span
                    key={f.id}
                    className="font-body text-[10px] tracking-widest px-3 py-1 border border-[rgba(201,168,76,0.15)] text-[rgba(232,224,208,0.5)]"
                  >
                    {f.name.toUpperCase()}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductGrid products={products} siteCategory={siteCategory?.id ?? faction?.id} />
      </div>
    </div>
  );
}
