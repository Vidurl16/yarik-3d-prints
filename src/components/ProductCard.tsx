"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, type Product } from "@/lib/products";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const badgeClass: Record<string, string> = {
  RESIN: "print-badge-resin",
  FDM: "print-badge-fdm",
  MULTICOLOUR: "print-badge-multicolour",
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openDrawer } = useCartStore();
  const [adding, setAdding] = useState(false);

  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      printType: product.printType,
    });
    setAdding(true);
    openDrawer();
    setTimeout(() => setAdding(false), 1200);
  }

  return (
    <div className="group card-bg flex flex-col overflow-hidden transition-all duration-300 hover:border-[rgba(201,168,76,0.35)]">
      {/* Image */}
      <div className="product-card-frame bg-[#111]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="product-card-image opacity-80 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.7)] to-transparent" />

        {/* Print type badge */}
        <span
          className={`absolute top-3 left-3 font-body text-xs tracking-[0.1em] px-2 py-0.5 ${badgeClass[product.printType]}`}
        >
          {product.printType}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className="font-body text-xs tracking-wider text-[rgba(240,232,216,0.55)] uppercase">
          {product.category}
        </span>

        <h3 className="font-body text-sm font-semibold text-[#e8e0d0] leading-snug flex-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[rgba(201,168,76,0.08)]">
          <span className="font-heading text-[#c9a84c] text-base">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`font-body text-xs tracking-wider px-3 py-1.5 transition-all duration-200 ${
              adding
                ? "bg-[rgba(201,168,76,0.2)] text-[#c9a84c] border border-[rgba(201,168,76,0.5)]"
                : "bg-[#8b0000] hover:bg-[#b50000] text-[#e8e0d0] border border-transparent"
            }`}
          >
            {adding ? "ADDED ✓" : "ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}
