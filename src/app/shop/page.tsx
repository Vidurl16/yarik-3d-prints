import { factions } from "@/lib/products";
import FactionCard from "@/components/FactionCard";
import Link from "next/link";

export const metadata = {
  title: "Shop by Faction — YARIK 3D Prints",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Breadcrumb */}
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
              Choose Your Allegiance
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl text-[#e8e0d0]">
              SHOP BY FACTION
            </h1>
          </div>
          <p className="font-body text-sm text-[#6b6b6b] max-w-xs leading-relaxed">
            {factions.length} factions. Hundreds of models. All printed on demand.
          </p>
        </div>
      </div>

      {/* Faction Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {factions.map((faction) => (
            <FactionCard key={faction.id} faction={faction} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div
            className="inline-block px-8 py-6"
            style={{
              background: "linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(26,16,16,0.8) 100%)",
              border: "1px solid rgba(201,168,76,0.12)",
            }}
          >
            <p className="font-heading text-sm text-[#c9a84c] mb-2 tracking-widest">
              SOMETHING UNIQUE?
            </p>
            <p className="font-body text-sm text-[#6b6b6b] mb-4">
              We print anything — your STL files, custom characters, display pieces.
            </p>
            <Link
              href="/shop/custom-projects"
              className="font-body text-xs tracking-[0.2em] px-6 py-2 border border-[rgba(201,168,76,0.4)] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)] transition-all duration-200 inline-block"
            >
              VIEW CUSTOM PROJECTS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
