"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  productId: string;
  isActive: boolean;
}

export default function AdminProductActions({ productId, isActive }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleActive() {
    setLoading(true);
    await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !isActive }),
    });
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this product permanently?")) return;
    setLoading(true);
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={toggleActive}
        disabled={loading}
        className="font-body text-xs tracking-wider text-[rgba(196,160,69,0.75)] hover:text-[#c4a045] transition-colors disabled:opacity-40"
      >
        {isActive ? "Deactivate" : "Activate"}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="font-body text-xs tracking-wider text-red-600 hover:text-red-400 transition-colors disabled:opacity-40"
      >
        Delete
      </button>
    </>
  );
}
