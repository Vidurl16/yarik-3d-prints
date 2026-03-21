"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DbProduct } from "@/lib/data/types";

const BRANDS = [
  "grimdark-future",
  "age-of-fantasy",
  "pokemon",
  "basing-battle-effects",
  "gaming-accessories-terrain",
];

const TYPES = [
  "infantry", "vehicle", "character", "terrain",
  "basing", "effect", "accessory", "other",
];

const PRINT_TYPES = ["RESIN", "FDM", "MULTICOLOUR"];

const FACTIONS = [
  "space-marines",
  "orks",
  "tyranids",
  "chaos-space-marines",
  "high-elves",
  "undead",
  "pokemon-merch",
  "custom-projects",
];

const ROLES = ["HQ", "Battleline", "Infantry", "Cavalry", "Vehicles", "Transports", "Support"];

interface Props {
  product?: DbProduct;
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEditing = !!product;

  const [form, setForm] = useState({
    slug: product?.slug ?? "",
    name: product?.name ?? "",
    brand: product?.brand ?? BRANDS[0],
    type: product?.type ?? TYPES[0],
    print_type: product?.print_type ?? "RESIN",
    faction: product?.faction ?? "",
    role: product?.role ?? "",
    price_cents: product?.price_cents ? String(product.price_cents / 100) : "",
    currency: product?.currency ?? "ZAR",
    tags: (product?.tags ?? []).join(", "),
    is_new: product?.is_new ?? false,
    is_preorder: product?.is_preorder ?? false,
    is_active: product?.is_active ?? true,
    preorder_date: product?.preorder_date ?? "",
    image_url: product?.image_url ?? "",
    stock_quantity: product?.stock_quantity != null ? String(product.stock_quantity) : "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let imageUrl = form.image_url;

      // Upload image if selected
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("productId", product?.id ?? "new");

        const uploadRes = await fetch("/api/admin/upload-image", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
        setUploading(false);
      }

      const payload = {
        ...form,
        price_cents: Math.round(Number(form.price_cents) * 100),
        stock_quantity: form.stock_quantity !== "" ? Number(form.stock_quantity) : null,
        image_url: imageUrl || null,
      };

      const url = isEditing
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  const inputClass =
    "w-full bg-[#140e06] border border-[rgba(196,160,69,0.2)] px-3 py-2.5 font-body text-sm text-[#f0e8d8] focus:outline-none focus:border-[rgba(196,160,69,0.5)] transition-colors";
  const labelClass =
    "block font-body text-xs tracking-[0.1em] text-[rgba(240,232,216,0.7)] mb-1.5 uppercase";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Slug *</label>
          <input name="slug" value={form.slug} onChange={handleChange} required className={inputClass} placeholder="unique-url-slug" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Brand *</label>
          <select name="brand" value={form.brand} onChange={handleChange} className={inputClass}>
            {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Type *</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Print Type</label>
          <select name="print_type" value={form.print_type} onChange={handleChange} className={inputClass}>
            {PRINT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Faction</label>
          <select name="faction" value={form.faction} onChange={handleChange} className={inputClass}>
            <option value="">None</option>
            {FACTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
            <option value="">None</option>
            {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price (ZAR) *</label>
          <input
            name="price_cents"
            type="number"
            step="0.01"
            min="0"
            value={form.price_cents}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="99.99"
          />
        </div>
        <div>
          <label className={labelClass}>Stock Qty (blank = unlimited)</label>
          <input
            name="stock_quantity"
            type="number"
            min="0"
            step="1"
            value={form.stock_quantity}
            onChange={handleChange}
            className={inputClass}
            placeholder="Leave blank for unlimited"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Currency</label>
          <input name="currency" value={form.currency} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tags (comma-separated)</label>
        <input name="tags" value={form.tags} onChange={handleChange} className={inputClass} placeholder="resin, infantry, exclusive" />
      </div>

      <div>
        <label className={labelClass}>Image URL (or upload below)</label>
        <input name="image_url" value={form.image_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
      </div>

      <div>
        <label className={labelClass}>Upload Image (max 5 MB)</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="font-body text-xs text-[rgba(240,232,216,0.6)] file:mr-3 file:px-3 file:py-1.5 file:bg-[#1c1508] file:border file:border-[rgba(196,160,69,0.2)] file:text-[#c4a045] file:text-xs file:cursor-pointer"
        />
        {uploading && <p className="font-body text-xs text-[#c4a045] mt-1">Uploading...</p>}
      </div>

      <div className="flex items-center gap-6">
        {[
          { name: "is_new", label: "New Arrival" },
          { name: "is_preorder", label: "Pre-order" },
          { name: "is_active", label: "Active (visible)" },
        ].map(({ name, label }) => (
          <label key={name} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={name}
              checked={form[name as keyof typeof form] as boolean}
              onChange={handleChange}
              className="accent-[#c4a045]"
            />
            <span className="font-body text-xs text-[rgba(240,232,216,0.6)]">{label}</span>
          </label>
        ))}
      </div>

      {form.is_preorder && (
        <div>
          <label className={labelClass}>Preorder Date (optional)</label>
          <input name="preorder_date" value={form.preorder_date} onChange={handleChange} className={inputClass} placeholder="Q2 2025" />
        </div>
      )}

      {error && (
        <p className="font-body text-xs text-red-400 bg-red-900/20 border border-red-900/30 px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="font-body text-xs tracking-[0.2em] px-8 py-3 bg-[#8b0000] hover:bg-[#b50000] text-[#f0e8d8] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="font-body text-xs tracking-wider text-[rgba(240,232,216,0.65)] hover:text-[rgba(240,232,216,0.9)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
