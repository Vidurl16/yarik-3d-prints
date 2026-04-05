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

const FACTIONS: { group: string; ids: string[] }[] = [
  { group: "Grimdark Future — Imperial", ids: ["space-marines","dark-angels","blood-angels","space-wolves","black-templars","custodians","imperial-guard","sisters-of-battle","grey-knights","adeptus-mechanicus","knights"] },
  { group: "Grimdark Future — Chaos",    ids: ["chaos-space-marines","death-guard","thousand-sons","world-eaters","emperors-children","chaos-knights","chaos-titans"] },
  { group: "Grimdark Future — Xenos",    ids: ["orks","necrons","tyranids","eldar","dark-eldar","tau","leagues-of-votann","genestealer-cults"] },
  { group: "Age of Fantasy — Order",     ids: ["high-elves","wood-elves","dark-elves","woodelves","lizardmen","cities"] },
  { group: "Age of Fantasy — Death",     ids: ["undead","vampire-lords","flesh-eaters"] },
  { group: "Age of Fantasy — Chaos",     ids: ["rotkin","chas-knights","chaos-dwarves"] },
  { group: "Age of Fantasy — Destruction", ids: ["greenskins","goblins","ogres","giants","ratmen"] },
  { group: "Basing",                     ids: ["old-world-city","modern-city","jungle-and-forest","rock-and-crystals","alien-worlds","elemental","caves-and-swamps","desert","oceanic","chaos-wastes","animal-life","misc-and-skulls","unique-debris"] },
  { group: "Pokémon",                    ids: ["pokeballs","themed-pokeballs","3d-cards","figurines"] },
  { group: "Display Figures",            ids: ["comics","games","movies","other"] },
  { group: "General",                    ids: ["custom-projects"] },
];

const ROLES = ["HQ", "Battleline", "Infantry", "Cavalry", "Vehicles", "Transports", "Support"];

const TAG_GROUPS: { label: string; tags: string[] }[] = [
  { label: "Pokémon",  tags: ["pokeball", "themed-pokeball", "3d-card", "figurine"] },
  { label: "Basing",   tags: ["base", "scatter", "marker", "effect", "debris", "rubble"] },
  { label: "General",  tags: ["exclusive", "limited", "bundle", "custom", "new-arrival", "preorder"] },
];

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
    tags: product?.tags ?? [],
    is_new: product?.is_new ?? false,
    is_preorder: product?.is_preorder ?? false,
    is_active: product?.is_active ?? true,
    preorder_date: product?.preorder_date ?? "",
    image_url: product?.image_url ?? "",
    image_urls: product?.image_urls ?? [],
    stock_quantity: product?.stock_quantity != null ? String(product.stock_quantity) : "",
  });

  const [options, setOptions] = useState<Array<{ label: string; choices: string }>>(
    (product?.options ?? []).map((o) => ({ label: o.label, choices: o.choices.join(", ") }))
  );

  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null]);
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
      setUploading(true);

      // Upload primary image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("productId", product?.id ?? "new");
        const uploadRes = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        imageUrl = (await uploadRes.json()).url;
      }

      // Upload extra images (slots 1 & 2)
      const extraUrls: string[] = [...(form.image_urls ?? [])];
      for (let i = 0; i < imageFiles.length; i++) {
        const f = imageFiles[i];
        if (f) {
          const fd = new FormData();
          fd.append("file", f);
          fd.append("productId", product?.id ?? "new");
          const r = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
          if (!r.ok) throw new Error(`Extra image ${i + 1} upload failed`);
          extraUrls[i] = (await r.json()).url;
        }
      }

      setUploading(false);

      const payload = {
        ...form,
        price_cents: Math.round(Number(form.price_cents) * 100),
        stock_quantity: form.stock_quantity !== "" ? Number(form.stock_quantity) : null,
        image_url: imageUrl || null,
        image_urls: extraUrls.filter(Boolean),
        tags: form.tags,
        options: options
          .filter((o) => o.label.trim() && o.choices.trim())
          .map((o) => ({
            label: o.label.trim(),
            choices: o.choices.split(",").map((c) => c.trim()).filter(Boolean),
          })),
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
            {FACTIONS.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.ids.map((id) => <option key={id} value={id}>{id}</option>)}
              </optgroup>
            ))}
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
          <label className={labelClass}>Stock Qty <span style={{ opacity: 0.5 }}>(blank = unlimited)</span></label>
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
        <label className={labelClass}>Tags</label>
        <div className="space-y-3">
          {TAG_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="font-body text-[10px] tracking-[0.15em] text-[rgba(196,160,69,0.5)] uppercase mb-1.5">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => {
                  const selected = (form.tags as string[]).includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          tags: selected
                            ? (prev.tags as string[]).filter((t) => t !== tag)
                            : [...(prev.tags as string[]), tag],
                        }))
                      }
                      className="font-body text-xs tracking-wider px-3 py-1.5 transition-all duration-150 border"
                      style={{
                        background: selected ? "rgba(196,160,69,0.15)" : "transparent",
                        borderColor: selected ? "rgba(196,160,69,0.6)" : "rgba(196,160,69,0.18)",
                        color: selected ? "#c4a045" : "rgba(240,232,216,0.5)",
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary image */}
      <div>
        <label className={labelClass}>Image URL — Primary</label>
        <input name="image_url" value={form.image_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
      </div>
      <div>
        <label className={labelClass}>Upload Primary Image (max 5 MB)</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="font-body text-xs text-[rgba(240,232,216,0.6)] file:mr-3 file:px-3 file:py-1.5 file:bg-[#1c1508] file:border file:border-[rgba(196,160,69,0.2)] file:text-[#c4a045] file:text-xs file:cursor-pointer"
        />
        {uploading && <p className="font-body text-xs text-[#c4a045] mt-1">Uploading...</p>}
      </div>

      {/* Extra images (slots 2 & 3) */}
      {[0, 1].map((i) => (
        <div key={i}>
          <label className={labelClass}>Image {i + 2} URL (optional)</label>
          <input
            value={(form.image_urls ?? [])[i] ?? ""}
            onChange={(e) => {
              const urls = [...(form.image_urls ?? [])];
              urls[i] = e.target.value;
              setForm((prev) => ({ ...prev, image_urls: urls }));
            }}
            className={inputClass}
            placeholder="https://..."
          />
          <div className="mt-1">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const files = [...imageFiles];
                files[i] = e.target.files?.[0] ?? null;
                setImageFiles(files);
              }}
              className="font-body text-xs text-[rgba(240,232,216,0.6)] file:mr-3 file:px-3 file:py-1.5 file:bg-[#1c1508] file:border file:border-[rgba(196,160,69,0.2)] file:text-[#c4a045] file:text-xs file:cursor-pointer"
            />
          </div>
        </div>
      ))}

      {/* Options */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass}>Options (wargear, colour, etc.)</label>
          <button
            type="button"
            onClick={() => setOptions((prev) => [...prev, { label: "", choices: "" }])}
            className="font-body text-xs tracking-wider px-3 py-1 border border-[rgba(196,160,69,0.3)] text-[#c4a045] hover:border-[rgba(196,160,69,0.6)] transition-colors"
          >
            + Add Option
          </button>
        </div>
        {options.length === 0 && (
          <p className="font-body text-xs text-[rgba(240,232,216,0.3)]">No options. Click "+ Add Option" to add wargear choices, colours, etc.</p>
        )}
        <div className="space-y-3">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <input
                  value={opt.label}
                  onChange={(e) => {
                    const next = [...options];
                    next[i] = { ...next[i], label: e.target.value };
                    setOptions(next);
                  }}
                  className={inputClass}
                  placeholder="Option name (e.g. Colour)"
                />
                <input
                  value={opt.choices}
                  onChange={(e) => {
                    const next = [...options];
                    next[i] = { ...next[i], choices: e.target.value };
                    setOptions(next);
                  }}
                  className={inputClass}
                  placeholder="Choices, comma-separated (e.g. Red, Blue, Green)"
                />
              </div>
              <button
                type="button"
                onClick={() => setOptions((prev) => prev.filter((_, j) => j !== i))}
                className="font-body text-xs text-red-400 hover:text-red-300 px-2 py-2.5 mt-0.5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
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
