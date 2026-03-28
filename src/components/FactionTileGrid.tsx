"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BrandFaction } from "@/lib/products";

interface FactionTileGridProps {
  brandSlug: string;
  factions: BrandFaction[];
}

import type { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FactionTileGrid({ brandSlug, factions }: FactionTileGridProps) {
  if (factions.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p
          className="font-body text-xs tracking-[0.2em] uppercase mb-3"
          style={{ color: "var(--primary)", opacity: 0.7 }}
        >
          Choose Your Faction
        </p>
        <h2
          className="font-heading text-3xl sm:text-4xl tracking-wider"
          style={{ color: "var(--text)" }}
        >
          FACTIONS &amp; COLLECTIONS
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {factions.map((faction) => (
          <motion.div key={faction.id} variants={tileVariants}>
            <Link
              href={`/${brandSlug}/${faction.id}`}
              className="group block relative overflow-hidden transition-all duration-300 h-56"
              style={{
                background: `linear-gradient(160deg, var(--surface) 0%, color-mix(in srgb, ${faction.accentColor} 12%, var(--surface)) 100%)`,
                border: `1px solid ${faction.borderColor}`,
              }}
            >
              {/* Glow backdrop */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 80% 80% at 50% 100%, ${faction.glowColor} 0%, transparent 70%)`,
                }}
              />

              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 w-12 h-12 opacity-20"
                style={{
                  background: `linear-gradient(225deg, ${faction.accentColor} 0%, transparent 70%)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div>
                  <h3
                    className="font-heading text-xl tracking-wider mb-3 group-hover:tracking-widest transition-all duration-300"
                    style={{ color: "var(--text)" }}
                  >
                    {faction.name.toUpperCase()}
                  </h3>
                  <p
                    className="font-body text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {faction.flavorText}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="font-body text-xs tracking-[0.2em] group-hover:tracking-widest transition-all duration-300"
                    style={{ color: faction.accentColor }}
                  >
                    BROWSE
                  </span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: faction.accentColor }}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Bottom border accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${faction.accentColor}, transparent)` }}
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
