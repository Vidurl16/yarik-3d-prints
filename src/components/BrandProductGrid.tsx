"use client";

import { useState } from "react";
import type { DbProduct } from "@/lib/data/types";
import DbProductCard from "./DbProductCard";

const FILTER_TABS = ["All", "Infantry", "Vehicles", "Characters", "Terrain"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

function matchesFilter(product: DbProduct, filter: FilterTab): boolean {
  if (filter === "All") return true;
  const type = product.type.toLowerCase();
  const tags = product.tags.map((t) => t.toLowerCase());
  switch (filter) {
    case "Infantry":
      return type === "infantry" || tags.some((t) => t === "infantry" || t === "cavalry");
    case "Vehicles":
      return type === "vehicle" || tags.some((t) => t === "vehicle" || t === "vehicles" || t === "transports");
    case "Characters":
      return (
        type === "character" ||
        tags.some((t) => t === "character" || t === "hq")
      );
    case "Terrain":
      return type === "terrain" || tags.some((t) => t === "terrain");
    default:
      return true;
  }
}

interface BrandProductGridProps {
  products: DbProduct[];
}

export default function BrandProductGrid({ products }: BrandProductGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const filtered = products.filter((p) => matchesFilter(p, activeFilter));

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
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="font-body text-xs tracking-wider px-4 py-1.5 flex-shrink-0 transition-all duration-150"
              style={{
                border: "1px solid var(--border)",
                color: activeFilter === tab ? "var(--bg)" : "var(--muted)",
                background: activeFilter === tab ? "var(--primary)" : "transparent",
              }}
            >
              {tab}
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
