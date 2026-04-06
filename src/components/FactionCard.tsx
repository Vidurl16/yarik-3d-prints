import Link from "next/link";
import type { Faction } from "@/lib/products";

interface FactionCardProps {
  faction: Faction;
}

export default function FactionCard({ faction }: FactionCardProps) {
  return (
    <Link
      href={`/${faction.brand}/${faction.id}`}
      className="group relative block overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #141414 0%, #1a1414 100%)",
        border: `1px solid ${faction.borderColor}`,
      }}
    >
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 120%, ${faction.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-12 h-12 opacity-40"
        style={{
          background: `linear-gradient(225deg, ${faction.accentColor} 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-16 h-16 opacity-20"
        style={{
          background: `linear-gradient(45deg, ${faction.accentColor} 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 p-6 sm:p-8">
        {/* Product count badge */}
        <div className="flex items-start justify-between mb-4">
          <span
            className="font-body text-xs tracking-[0.1em] px-2 py-1 uppercase"
            style={{
              border: `1px solid ${faction.borderColor}`,
              color: faction.accentColor === "#2a2a2a" ? "#888" : faction.borderColor.replace("0.3", "0.9").replace("0.35", "0.9").replace("0.4", "0.9").replace("0.5", "0.9"),
            }}
          >
            {faction.productCount} MODELS
          </span>

          <svg
            className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
            style={{ color: "#c9a84c" }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>

        {/* Faction Name */}
        <h3 className="font-heading text-xl sm:text-2xl text-[#e8e0d0] group-hover:text-[#c9a84c] transition-colors duration-300 mb-3">
          {faction.name}
        </h3>

        {/* Flavor Text */}
        <p className="font-body text-sm text-[#6b6b6b] group-hover:text-[rgba(232,224,208,0.7)] transition-colors duration-300 leading-relaxed">
          {faction.flavorText}
        </p>

        {/* Bottom line */}
        <div
          className="mt-6 h-px opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${faction.borderColor.replace("0.3", "0.8").replace("0.35", "0.8").replace("0.4", "0.8").replace("0.5", "0.8")}, transparent)` }}
        />
      </div>
    </Link>
  );
}
