"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import ProductOptions from "@/components/ProductOptions";

interface Option {
  label: string;
  choices: string[];
}

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  printType: "RESIN" | "FDM" | "MULTICOLOUR";
  options?: Option[];
}

interface AddToCartButtonProps {
  product: ProductInfo;
  isOutOfStock: boolean;
}

export default function AddToCartButton({ product, isOutOfStock }: AddToCartButtonProps) {
  const { addItem, openDrawer } = useCartStore();
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const options = product.options ?? [];
  const allSelected = options.every((opt) => selected[opt.label]);
  const canAdd = !isOutOfStock && (options.length === 0 || allSelected);

  function handleOptionChange(label: string, choice: string) {
    setSelected((prev) => ({ ...prev, [label]: choice }));
  }

  function handleAddToCart() {
    if (!canAdd) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      printType: product.printType,
      selectedOptions: options.length > 0 ? selected : undefined,
    });
    setAdding(true);
    openDrawer();
    setTimeout(() => setAdding(false), 1200);
  }

  if (isOutOfStock) {
    return (
      <div
        className="w-full py-4 font-body text-sm tracking-[0.2em] text-center"
        style={{ border: "1px solid var(--border)", color: "var(--muted)", opacity: 0.5 }}
      >
        OUT OF STOCK
      </div>
    );
  }

  return (
    <div>
      <ProductOptions options={options} selected={selected} onChange={handleOptionChange} />
      <button
        onClick={handleAddToCart}
        disabled={!canAdd || adding}
        className="w-full py-4 font-body text-sm tracking-[0.2em] transition-all duration-200 disabled:opacity-50"
        style={{
          background: adding ? "rgba(139,0,0,0.3)" : "var(--accent,#8b0000)",
          color: adding ? "var(--primary)" : "var(--bg)",
          border: adding ? "1px solid var(--primary)" : "1px solid transparent",
        }}
      >
        {adding
          ? "ADDED TO WARBAND ✓"
          : options.length > 0 && !allSelected
          ? "SELECT OPTIONS TO CONTINUE"
          : "ADD TO CART"}
      </button>
    </div>
  );
}
