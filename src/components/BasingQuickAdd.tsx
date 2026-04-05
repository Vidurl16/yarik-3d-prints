"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/lib/products";

interface Props {
  products: Product[];
}

function BasingCard({ product }: { product: Product }) {
  const { addItem, openDrawer } = useCartStore();
  const [added, setAdded] = useState(false);

  const imageUrl = product.imageUrl ?? `https://picsum.photos/seed/${product.slug}/400/400`;
  const printType = (product.printType ?? "RESIN") as "RESIN" | "FDM" | "MULTICOLOUR";

  function handleAdd() {
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl, printType });
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div
      className="flex items-center gap-4 p-3"
      style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
    >
      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden">
        <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="64px" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm tracking-wider truncate" style={{ color: "var(--text)" }}>
          {product.name}
        </p>
        <p className="font-body text-xs mt-0.5" style={{ color: "var(--primary)" }}>
          R {product.price.toLocaleString("en-ZA")}
        </p>
      </div>
      <button
        onClick={handleAdd}
        className="font-body text-xs tracking-wider px-3 py-2 flex-shrink-0 transition-all"
        style={{
          background: added ? "rgba(74,222,128,0.15)" : "var(--accent)",
          color: added ? "rgb(74,222,128)" : "var(--bg)",
          border: added ? "1px solid rgba(74,222,128,0.4)" : "1px solid transparent",
        }}
      >
        {added ? "✓ ADDED" : "+ ADD"}
      </button>
    </div>
  );
}

export default function BasingQuickAdd({ products }: Props) {
  if (!products.length) return null;

  return (
    <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
      <p className="font-body text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "var(--muted)" }}>
        Complete the Look
      </p>
      <h3 className="font-heading text-lg mb-4" style={{ color: "var(--text)" }}>
        Suggested Basing & Effects
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {products.map((p) => <BasingCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
