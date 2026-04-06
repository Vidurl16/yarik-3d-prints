"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/products";
import type { BrandFaction } from "@/lib/products";
import type { ThemeTokens } from "@/components/theme/themes";
import DbProductCard from "@/components/DbProductCard";
import { type DbProduct } from "@/lib/data/types";

// We receive static Product[] here, convert to minimal DbProduct shape for DbProductCard
function toDbShape(p: Product): DbProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.siteCategory,
    type: p.category.toLowerCase(),
    print_type: p.printType,
    faction: p.faction,
    role: p.role ?? null,
    price_cents: p.price * 100,
    currency: "ZAR",
    tags: p.tags ?? [],
    image_url: p.imageUrl,
    image_urls: null,
    options: null,
    is_preorder: p.isPreorder ?? false,
    is_new: p.isNewArrival ?? false,
    is_active: true,
    preorder_date: p.preorderDate ?? null,
    created_at: "",
    updated_at: "",
  };
}

// Group products by category/type for the grouped display
function groupProducts(
  products: Product[],
  brandSlug: string
): { label: string; items: Product[] }[] {
  if (brandSlug === "pokemon") {
    const groups = [
      { label: "Pokéballs", tags: ["pokeball"] },
      { label: "Themed Pokéballs", tags: ["themed-pokeball"] },
      { label: "3D Cards", tags: ["3d-card"] },
      { label: "Figurines & Statues", tags: ["figurine", "bust", "statue"] },
    ];
    return groups
      .map(({ label, tags }) => ({
        label,
        items: products.filter((p) => tags.some((t) => (p.tags ?? []).includes(t))),
      }))
      .filter((g) => g.items.length > 0);
  }

  const t = (p: Product) => (p.tags ?? []).map((s) => s.toLowerCase());

  if (brandSlug === "age-of-fantasy") {
    const groups: { label: string; match: (p: Product) => boolean }[] = [
      { label: "Heroes",      match: (p) => p.category === "Characters" || t(p).some((x) => ["hero", "heroes", "hq", "wizard", "magic"].includes(x)) },
      { label: "Cavalry",     match: (p) => t(p).some((x) => ["cavalry", "mounted", "mount"].includes(x)) },
      { label: "Infantry",    match: (p) => p.category === "Infantry" && !t(p).some((x) => ["cavalry", "mounted", "mount"].includes(x)) },
      { label: "Monsters",    match: (p) => t(p).some((x) => ["monster", "monsters", "dragon", "beast", "creature"].includes(x)) || (p.category === "Vehicles" && !t(p).some((x) => ["warmachine", "chariot"].includes(x))) },
      { label: "Warmachines", match: (p) => t(p).some((x) => ["warmachine", "warmachines", "chariot", "war machine"].includes(x)) },
      { label: "Spells",      match: (p) => t(p).some((x) => ["spell", "spells", "magic-card"].includes(x)) },
    ];
    return groups
      .map(({ label, match }) => ({ label, items: products.filter(match) }))
      .filter((g) => g.items.length > 0);
  }

  if (brandSlug === "grimdark-future") {
    const groups: { label: string; match: (p: Product) => boolean }[] = [
      { label: "Characters",      match: (p) => p.category === "Characters" || t(p).some((x) => ["character", "characters", "hq", "leader"].includes(x)) },
      { label: "Battleline",      match: (p) => t(p).includes("battleline") },
      { label: "Infantry/Mounted",match: (p) => p.category === "Infantry" && !t(p).includes("battleline") && !t(p).some((x) => ["cavalry", "mounted"].includes(x)) },
      { label: "Vehicles",        match: (p) => (p.category === "Vehicles" || t(p).some((x) => ["vehicle", "vehicles", "tank"].includes(x))) && !t(p).some((x) => ["monster", "beast", "creature"].includes(x)) },
      { label: "Monsters",        match: (p) => t(p).some((x) => ["monster", "monsters", "beast", "creature"].includes(x)) },
      { label: "Transports",      match: (p) => t(p).some((x) => ["transport", "transports"].includes(x)) },
    ];
    return groups
      .map(({ label, match }) => ({ label, items: products.filter(match) }))
      .filter((g) => g.items.length > 0);
  }

  // For all other brands: group by category
  const categoryOrder = ["Characters", "Infantry", "Vehicles", "Terrain", "Basing", "Accessories"];
  const grouped: Record<string, Product[]> = {};
  for (const p of products) {
    const key = p.category;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  }

  return categoryOrder
    .filter((cat) => grouped[cat]?.length > 0)
    .map((cat) => ({ label: cat, items: grouped[cat] }));
}

interface FactionProductPageProps {
  theme: ThemeTokens;
  brandSlug: string;
  faction: BrandFaction;
  products: Product[];
}

export default function FactionProductPage({
  theme,
  brandSlug,
  faction,
  products,
}: FactionProductPageProps) {
  const groups = groupProducts(products, brandSlug);
  const allLabels = groups.map((g) => g.label);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const visibleGroups =
    activeFilter === "All"
      ? groups
      : groups.filter((g) => g.label === activeFilter);

  return (
    <div
      data-theme={theme as unknown as string}
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* Page header */}
      <div
        className="pt-24 pb-10 border-b"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, ${faction.accentColor} 10%, var(--bg)) 0%, var(--bg) 100%)`,
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-2 font-body text-xs tracking-wider mb-6"
            style={{ color: "var(--muted)" }}
          >
            <Link
              href="/"
              className="transition-colors hover:text-[var(--primary)]"
              style={{ color: "var(--muted)" }}
            >
              HOME
            </Link>
            <span style={{ color: "var(--border)" }}>›</span>
            <Link
              href={`/${brandSlug}`}
              className="transition-colors hover:text-[var(--primary)]"
              style={{ color: "var(--muted)" }}
            >
              {theme.label.toUpperCase()}
            </Link>
            <span style={{ color: "var(--border)" }}>›</span>
            <span style={{ color: "var(--text)" }}>{faction.name.toUpperCase()}</span>
          </div>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1
                className="font-heading text-4xl sm:text-5xl tracking-wider mb-3"
                style={{ color: "var(--text)" }}
              >
                {faction.name.toUpperCase()}
              </h1>
              <p
                className="font-body text-base"
                style={{ color: "var(--muted)" }}
              >
                {faction.flavorText}
              </p>
            </div>

            {/* Army builder CTA for war game factions */}
            {(brandSlug === "grimdark-future" || brandSlug === "age-of-fantasy") && (
              <Link
                href={`/${brandSlug}/army-builder`}
                className="font-body text-sm tracking-[0.2em] px-6 py-3 flex-shrink-0 transition-all duration-200"
                style={{
                  background: "var(--primary)",
                  color: "var(--bg)",
                  border: "1px solid var(--primary)",
                }}
              >
                ARMY BUILDER →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      {allLabels.length > 1 && (
        <div
          className="sticky top-16 z-30 border-b"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto">
            <span
              className="font-body text-xs tracking-[0.1em] uppercase flex-shrink-0"
              style={{ color: "var(--muted)" }}
            >
              Filter
            </span>
            <button
              onClick={() => setActiveFilter("All")}
              className="font-body text-xs tracking-[0.1em] px-4 py-1.5 flex-shrink-0 transition-all"
              style={{
                border: "1px solid var(--border)",
                color: activeFilter === "All" ? "var(--bg)" : "var(--muted)",
                background: activeFilter === "All" ? "var(--primary)" : "transparent",
              }}
            >
              All
            </button>
            {allLabels.map((label) => (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className="font-body text-xs tracking-[0.1em] px-4 py-1.5 flex-shrink-0 transition-all"
                style={{
                  border: "1px solid var(--border)",
                  color: activeFilter === label ? "var(--bg)" : "var(--muted)",
                  background: activeFilter === label ? "var(--primary)" : "transparent",
                }}
              >
                {label}
              </button>
            ))}
            <span
              className="font-body text-xs tracking-wider flex-shrink-0 ml-2"
              style={{ color: "var(--muted)" }}
            >
              {products.length} product{products.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Product groups */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {products.length === 0 ? (
          <div
            className="py-24 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p
              className="font-heading text-sm tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              PRODUCTS COMING SOON
            </p>
            <p className="font-body text-xs mt-3" style={{ color: "var(--muted)", opacity: 0.7 }}>
              Check back soon or contact us for custom orders.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="space-y-14"
            >
              {visibleGroups.map((group) => (
                <section key={group.label}>
                  {/* Section header */}
                  <div className="flex items-center gap-4 mb-6">
                    <h2
                      className="font-heading text-xl sm:text-2xl tracking-wider"
                      style={{ color: "var(--text)" }}
                    >
                      {group.label.toUpperCase()}
                    </h2>
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                    <span
                      className="font-body text-xs tracking-wider flex-shrink-0"
                      style={{ color: "var(--muted)" }}
                    >
                      {group.items.length}
                    </span>
                  </div>

                  {/* Product grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {group.items.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04, duration: 0.35 }}
                      >
                        <DbProductCard product={toDbShape(product)} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Back to brand link */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <Link
          href={`/${brandSlug}`}
          className="inline-flex items-center gap-2 font-body text-sm tracking-[0.15em] transition-colors"
          style={{ color: "var(--muted)" }}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M13 8H3M7 4L3 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          BACK TO {theme.label.toUpperCase()}
        </Link>
      </div>
    </div>
  );
}
