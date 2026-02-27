"use client";

import { useState, useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/products";
import type { CartItem } from "@/store/cartStore";

interface BundlePart {
  id: string;
  name: string;
  price: number;
  description: string;
}

const ORK_PARTS: BundlePart[] = [
  { id: "bundle-ork-boyz", name: "Ork Boyz ×5", price: 120, description: "Core infantry — the backbone of any WAAAGH!" },
  { id: "bundle-ork-nob", name: "Ork Nob Leader", price: 95, description: "Elite sergeant, keeps the ladz in line" },
  { id: "bundle-warbike", name: "Warbike", price: 180, description: "Fast attack — hits hard, hits first" },
  { id: "bundle-deff-dread", name: "Deff Dread", price: 320, description: "Ramshackle walker of DOOM" },
  { id: "bundle-gretchin", name: "Gretchin ×10", price: 85, description: "Cheap bodies to absorb bullets" },
  { id: "bundle-warboss", name: "Warboss", price: 210, description: "The big boss. Biggest, meanest Ork around" },
];

const DISCOUNT_THRESHOLD = 3;
const DISCOUNT_RATE = 0.15;

export default function BundleBuilder() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { addItem, openDrawer } = useCartStore();

  const togglePart = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedParts = useMemo(
    () => ORK_PARTS.filter((p) => selected.has(p.id)),
    [selected]
  );

  const subtotal = useMemo(
    () => selectedParts.reduce((sum, p) => sum + p.price, 0),
    [selectedParts]
  );

  const hasDiscount = selectedParts.length >= DISCOUNT_THRESHOLD;
  const discountAmount = hasDiscount ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const total = subtotal - discountAmount;

  function handleAddWarband() {
    if (selectedParts.length === 0) return;

    selectedParts.forEach((part) => {
      const item: Omit<CartItem, "quantity"> = {
        id: part.id,
        name: part.name,
        price: hasDiscount
          ? Math.round(part.price * (1 - DISCOUNT_RATE))
          : part.price,
        imageUrl: `https://picsum.photos/seed/${part.id}/400/400`,
        printType: "RESIN",
      };
      addItem(item);
    });

    openDrawer();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Parts Checklist */}
      <div className="lg:col-span-3 space-y-3">
        <h2 className="font-heading text-sm tracking-[0.2em] text-[rgba(201,168,76,0.5)] mb-6">
          SELECT YOUR PARTS
        </h2>

        {ORK_PARTS.map((part) => {
          const isSelected = selected.has(part.id);
          return (
            <button
              key={part.id}
              onClick={() => togglePart(part.id)}
              className={`w-full text-left p-4 transition-all duration-200 flex items-start gap-4 group ${
                isSelected
                  ? "bg-[rgba(139,0,0,0.15)] border border-[rgba(139,0,0,0.5)]"
                  : "bg-[rgba(20,20,20,0.8)] border border-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.3)]"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-5 h-5 flex-shrink-0 mt-0.5 border flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? "bg-[#8b0000] border-[#8b0000]"
                    : "border-[rgba(201,168,76,0.3)] group-hover:border-[rgba(201,168,76,0.6)]"
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              {/* Part Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className={`font-body font-semibold text-sm transition-colors ${isSelected ? "text-[#e8e0d0]" : "text-[rgba(232,224,208,0.7)] group-hover:text-[#e8e0d0]"}`}>
                    {part.name}
                  </span>
                  <span className={`font-heading text-sm flex-shrink-0 ${isSelected ? "text-[#c9a84c]" : "text-[rgba(201,168,76,0.6)]"}`}>
                    {formatPrice(part.price)}
                  </span>
                </div>
                <p className="font-body text-xs text-[#6b6b6b] mt-0.5 leading-relaxed">
                  {part.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Order Summary — Sticky */}
      <div className="lg:col-span-2">
        <div
          className="lg:sticky lg:top-24 p-6 space-y-4"
          style={{
            background: "linear-gradient(160deg, #141414 0%, #1a1010 100%)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <h2 className="font-heading text-sm tracking-[0.2em] text-[#c9a84c]">
            ORDER SUMMARY
          </h2>

          {/* Selected parts */}
          <div className="space-y-2 min-h-[120px]">
            {selectedParts.length === 0 ? (
              <p className="font-body text-xs text-[#6b6b6b] italic">
                Select parts to build your warband…
              </p>
            ) : (
              selectedParts.map((part) => (
                <div key={part.id} className="flex items-center justify-between">
                  <span className="font-body text-xs text-[rgba(232,224,208,0.8)] truncate pr-2">
                    {part.name}
                  </span>
                  <span className="font-body text-xs text-[#c9a84c] flex-shrink-0">
                    {formatPrice(part.price)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[rgba(201,168,76,0.1)] pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-[#6b6b6b] tracking-wider">
                SUBTOTAL
              </span>
              <span className="font-body text-sm text-[#e8e0d0]">
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Discount Badge */}
            {hasDiscount ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[10px] tracking-wider text-[#c9a84c]">
                    WARBAND DISCOUNT
                  </span>
                  <span className="font-body text-[9px] bg-[rgba(201,168,76,0.2)] text-[#c9a84c] border border-[rgba(201,168,76,0.4)] px-1.5 py-0.5">
                    −15%
                  </span>
                </div>
                <span className="font-body text-sm text-[#c9a84c]">
                  −{formatPrice(discountAmount)}
                </span>
              </div>
            ) : selectedParts.length > 0 ? (
              <p className="font-body text-[10px] text-[#6b6b6b] italic">
                Select {DISCOUNT_THRESHOLD - selectedParts.length} more part{DISCOUNT_THRESHOLD - selectedParts.length !== 1 ? "s" : ""} for 15% off
              </p>
            ) : null}

            <div className="flex items-center justify-between pt-2 border-t border-[rgba(201,168,76,0.1)]">
              <span className="font-heading text-xs tracking-[0.15em] text-[#e8e0d0]">
                TOTAL
              </span>
              <span className="font-heading text-xl text-[#c9a84c]">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddWarband}
            disabled={selectedParts.length === 0}
            className={`w-full py-3 font-body text-sm tracking-[0.15em] transition-all duration-200 ${
              selectedParts.length === 0
                ? "bg-[rgba(139,0,0,0.2)] text-[rgba(232,224,208,0.3)] cursor-not-allowed border border-[rgba(139,0,0,0.2)]"
                : "bg-[#8b0000] hover:bg-[#b50000] text-[#e8e0d0] border border-transparent"
            }`}
          >
            ADD WARBAND TO CART
          </button>

          {selectedParts.length > 0 && (
            <p className="font-body text-[10px] text-center text-[#6b6b6b]">
              {selectedParts.length} piece{selectedParts.length !== 1 ? "s" : ""} selected
              {hasDiscount && " · 15% warband discount applied"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
