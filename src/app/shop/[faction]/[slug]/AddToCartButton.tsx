"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  printType: "RESIN" | "FDM" | "MULTICOLOUR";
}

interface AddToCartButtonProps {
  product: ProductInfo;
  isOutOfStock: boolean;
}

export default function AddToCartButton({ product, isOutOfStock }: AddToCartButtonProps) {
  const { addItem, openDrawer } = useCartStore();
  const [adding, setAdding] = useState(false);

  function handleAddToCart() {
    if (isOutOfStock) return;
    addItem({ ...product });
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
    <button
      onClick={handleAddToCart}
      disabled={adding}
      className="w-full py-4 font-body text-sm tracking-[0.2em] transition-all duration-200"
      style={{
        background: adding ? "rgba(139,0,0,0.3)" : "var(--accent,#8b0000)",
        color: adding ? "var(--primary)" : "var(--bg)",
        border: adding ? "1px solid var(--primary)" : "1px solid transparent",
      }}
    >
      {adding ? "ADDED TO WARBAND ✓" : "ADD TO CART"}
    </button>
  );
}
