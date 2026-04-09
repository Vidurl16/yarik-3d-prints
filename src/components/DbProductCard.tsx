"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import type { DbProduct } from "@/lib/data/types";

interface DbProductCardProps {
  product: DbProduct;
}

export default function DbProductCard({ product }: DbProductCardProps) {
  const { addItem, openDrawer } = useCartStore();
  const [adding, setAdding] = useState(false);
  const printType =
    product.print_type === "FDM" || product.print_type === "MULTICOLOUR" || product.print_type === "RESIN"
      ? product.print_type
      : "RESIN";

  const priceZAR = product.price_cents / 100;
  const formattedPrice = `R ${priceZAR.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
  const imageUrl =
    product.image_url ??
    `https://picsum.photos/seed/${product.slug}/400/400`;

  const isOutOfStock = product.stock_quantity != null && product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity != null && product.stock_quantity > 0 && product.stock_quantity <= 5;

  // Faction/slug based detail page URL
  const detailHref = product.faction
    ? `/shop/${product.faction}/${product.slug}`
    : `/shop/${product.brand}/${product.slug}`;

  function handleAddToCart() {
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: priceZAR,
      imageUrl,
      printType,
    });
    setAdding(true);
    openDrawer();
    setTimeout(() => setAdding(false), 1200);
  }

  return (
    <div className="group card-bg flex flex-col overflow-hidden transition-all duration-300 hover:border-[rgba(201,168,76,0.35)]">
      {/* Image — links to product detail */}
      <Link href={detailHref} className="block relative">
        <div className="product-card-frame bg-[#111]">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="product-card-image opacity-80 group-hover:opacity-100 group-hover:brightness-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.7)] to-transparent" />

          <span className="absolute bottom-3 left-3 font-body text-xs tracking-[0.1em] px-2 py-0.5 print-badge-resin">
            {printType}
          </span>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.is_new && (
              <span className="font-body text-xs tracking-[0.1em] px-2 py-0.5 bg-[rgba(139,94,20,0.8)] text-[#f0e8d8]">
                NEW
              </span>
            )}
            {product.is_preorder && (
              <span className="font-body text-xs tracking-[0.1em] px-2 py-0.5 bg-[rgba(139,0,0,0.7)] text-[#ff9090]">
                PREORDER
              </span>
            )}
            {isOutOfStock && (
              <span className="font-body text-xs tracking-[0.1em] px-2 py-0.5 bg-[rgba(30,30,30,0.9)] text-[#aaa]">
                SOLD OUT
              </span>
            )}
            {isLowStock && (
              <span className="font-body text-xs tracking-[0.1em] px-2 py-0.5 bg-[rgba(139,94,20,0.7)] text-[#f0e8d8]">
                {product.stock_quantity} LEFT
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span
          className="font-body text-xs tracking-wider uppercase"
          style={{ color: "var(--muted, #6b6b6b)" }}
        >
          {product.type}
        </span>

        <Link href={detailHref} className="flex-1">
          <h3
            className="font-body text-sm font-semibold leading-snug hover:opacity-80 transition-opacity"
            style={{ color: "var(--text, #e8e0d0)" }}
          >
            {product.name}
          </h3>
        </Link>

        {product.is_preorder && product.preorder_date && (
          <p className="font-body text-xs text-[#ff9090] tracking-wide">
            Available: {product.preorder_date}
          </p>
        )}

        <div
          className="flex items-center justify-between mt-auto pt-2"
          style={{ borderTop: "1px solid var(--border, rgba(201,168,76,0.08))" }}
        >
          <span
            className="font-heading text-base"
            style={{ color: "var(--primary, #c9a84c)" }}
          >
            {formattedPrice}
          </span>

          {isOutOfStock ? (
            <span className="font-body text-xs tracking-wider px-3 py-1.5" style={{ color: "var(--muted)" }}>
              SOLD OUT
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`font-body text-xs tracking-wider px-3 py-2 min-h-[44px] md:min-h-0 md:py-1.5 transition-all duration-200 ${
                adding
                  ? "bg-[rgba(201,168,76,0.2)] text-[#c9a84c] border border-[rgba(201,168,76,0.5)]"
                  : "bg-[#8b0000] hover:bg-[#b50000] text-[#e8e0d0] border border-transparent"
              }`}
            >
              {adding ? "✓ ADDED" : "+ ADD"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

