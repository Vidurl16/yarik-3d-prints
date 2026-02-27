"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product, Category } from "@/lib/products";

const CATEGORIES: Array<"All" | Category> = [
  "All",
  "Infantry",
  "Characters",
  "Vehicles",
  "Terrain",
];

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [activeFilter, setActiveFilter] = useState<"All" | Category>("All");

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? products
        : products.filter((p) => p.category === activeFilter),
    [products, activeFilter]
  );

  // Only show filter buttons for categories that have products
  const availableCategories = useMemo(
    () =>
      CATEGORIES.filter(
        (cat) =>
          cat === "All" || products.some((p) => p.category === cat)
      ),
    [products]
  );

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`font-body text-[10px] tracking-[0.2em] px-4 py-2 transition-all duration-200 ${
              activeFilter === cat
                ? "bg-[#8b0000] text-[#e8e0d0] border border-[#8b0000]"
                : "text-[rgba(232,224,208,0.5)] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)] hover:text-[#e8e0d0]"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

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
