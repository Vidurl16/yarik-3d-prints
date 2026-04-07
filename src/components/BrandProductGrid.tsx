"use client";

import { useState } from "react";
import type { DbProduct } from "@/lib/data/types";
import DbProductCard from "./DbProductCard";
import { dbBrandFilters, type DbFilterDef } from "@/lib/brandFilters";

interface BrandProductGridProps {
  products: DbProduct[];
  brandSlug: string;
  initialTag?: string;
}

export default function BrandProductGrid({ products, brandSlug, initialTag }: BrandProductGridProps) {
  const brandFilterDefs: DbFilterDef[] = dbBrandFilters[brandSlug] ?? [];

  // Match URL ?tag= param to a filter label (case-insensitive)
  const matchedInitial = initialTag
    ? brandFilterDefs.find((f) => f.label.toLowerCase() === initialTag.toLowerCase())?.label
    : undefined;

  const [activeFilter, setActiveFilter] = useState<string>(matchedInitial ?? "All");

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 overflow-x-auto">
          <span className="font-body text-xs tracking-[0.1em] uppercase flex-shrink-0"
            style={{ color: "var(--muted)" }}
          >
            Filter
          </span>
          <button
            key="All"
            onClick={() => setActiveFilter("All")}
            className="font-body text-xs tracking-[0.1em] px-4 py-1.5 flex-shrink-0 transition-all duration-150"
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
              className="font-body text-xs tracking-[0.1em] px-4 py-1.5 flex-shrink-0 transition-all duration-150"
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
              className="font-body text-xs tracking-wider flex-shrink-0"
              style={{ color: "var(--muted)" }}
            >
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </section>

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <h2
          className="font-heading text-2xl tracking-wider mb-8"
          style={{ color: "var(--text)" }}
        >
          PRODUCTS
        </h2>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              className="font-body text-base tracking-widest"
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
              className="font-body text-xs tracking-[0.1em] px-6 py-2"
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
