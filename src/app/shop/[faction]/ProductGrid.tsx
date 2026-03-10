"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";
import { staticBrandFilters, type StaticFilterDef } from "@/lib/brandFilters";

interface ProductGridProps {
  products: Product[];
  siteCategory?: string;
}

export default function ProductGrid({ products, siteCategory }: ProductGridProps) {
  const brandFilters: StaticFilterDef[] = siteCategory
    ? (staticBrandFilters[siteCategory] ?? [])
    : [];

  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    if (activeFilter === "All") return products;
    const def = brandFilters.find((f) => f.label === activeFilter);
    return def ? products.filter(def.match) : products;
  }, [products, activeFilter, brandFilters]);

  // Only show filter buttons that have at least one matching product
  const availableFilters = useMemo(
    () => brandFilters.filter((f) => products.some(f.match)),
    [products, brandFilters]
  );

  return (
    <div>
      {/* Filter Bar */}
      {availableFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveFilter("All")}
            className={`font-body text-[10px] tracking-[0.2em] px-4 py-2 transition-all duration-200 ${
              activeFilter === "All"
                ? "bg-[#8b0000] text-[#e8e0d0] border border-[#8b0000]"
                : "text-[rgba(232,224,208,0.5)] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)] hover:text-[#e8e0d0]"
            }`}
          >
            ALL
          </button>
          {availableFilters.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`font-body text-[10px] tracking-[0.2em] px-4 py-2 transition-all duration-200 ${
                activeFilter === f.label
                  ? "bg-[#8b0000] text-[#e8e0d0] border border-[#8b0000]"
                  : "text-[rgba(232,224,208,0.5)] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)] hover:text-[#e8e0d0]"
              }`}
            >
              {f.label.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-heading text-sm tracking-widest text-[rgba(201,168,76,0.4)]">
            NO MODELS IN THIS CATEGORY
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

