"use client";

import { useState } from "react";
import type { DbProduct } from "@/lib/data/types";
import DbProductCard from "./DbProductCard";
import { dbBrandFilters, type DbFilterDef } from "@/lib/brandFilters";

interface BrandProductGridProps {
  products: DbProduct[];
  brandSlug: string;
}

export default function BrandProductGrid({ products, brandSlug }: BrandProductGridProps) {
  const brandFilterDefs: DbFilterDef[] = dbBrandFilters[brandSlug] ?? [];
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const activeFilterDef = brandFilterDefs.find((f) => f.label === activeFilter);
  const filtered = activeFilter === "All" || !activeFilterDef
    ? products
    : products.filter(activeFilterDef.match);

  // Only surface filter tabs that have at least one matching product
  const availableTabs = brandFilterDefs.filter((f) => products.some(f.match));

  return (
    <>
      {/* Filter bar */}
      <section
        className="sticky top-16 z-30 border-b"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4 overflow-x-auto">
          <span
            className="font-body text-[10px] tracking-[0.3em] uppercase flex-shrink-0"
            style={{ color: "var(--muted)" }}
          >
            Filter
          </span>
          <button
            key="All"
            onClick={() => setActiveFilter("All")}
            className="font-body text-xs tracking-wider px-4 py-1.5 flex-shrink-0 transition-all duration-150"
            style={{
              border: "1px solid var(--border)",
              color: activeFilter === "All" ? "var(--bg)" : "var(--muted)",
              background: activeFilter === "All" ? "var(--primary)" : "transparent",
            }}
          >
            All
          </button>
          {availableTabs.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className="font-body text-xs tracking-wider px-4 py-1.5 flex-shrink-0 transition-all duration-150"
              style={{
                border: "1px solid var(--border)",
                color: activeFilter === f.label ? "var(--bg)" : "var(--muted)",
                background: activeFilter === f.label ? "var(--primary)" : "transparent",
              }}
            >
              {f.label}
            </button>
          ))}
          {products.length > 0 && (
            <span
              className="ml-auto font-body text-[10px] tracking-wider flex-shrink-0"
              style={{ color: "var(--muted)" }}
            >
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </section>

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2
          className="font-heading text-2xl tracking-wider mb-8"
          style={{ color: "var(--text)" }}
        >
          PRODUCTS
        </h2>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <DbProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div
            className="py-20 text-center"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="font-heading text-sm tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              PRODUCTS COMING SOON
            </p>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p
              className="font-heading text-sm tracking-widest mb-4"
              style={{ color: "var(--muted)" }}
            >
              NO {activeFilter.toUpperCase()} PRODUCTS
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="font-body text-xs tracking-[0.2em] px-6 py-2"
              style={{
                border: "1px solid var(--border)",
                color: "var(--primary)",
              }}
            >
              SHOW ALL
            </button>
          </div>
        )}
      </section>
    </>
  );
}
