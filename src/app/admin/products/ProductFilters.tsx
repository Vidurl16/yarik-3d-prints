"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const BRANDS = [
  { value: "", label: "All Brands" },
  { value: "grimdark-future", label: "Grimdark Future" },
  { value: "age-of-fantasy", label: "Age of Fantasy" },
  { value: "pokemon", label: "Pokémon" },
  { value: "basing-battle-effects", label: "Basing & Battle Effects" },
  { value: "gaming-accessories-terrain", label: "Gaming Accessories & Terrain" },
  { value: "display-figures-busts", label: "Display Figures & Busts" },
];

const STATUSES = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const SELECT_CLASS =
  "font-body text-xs tracking-[0.1em] bg-[rgba(20,20,20,0.95)] border border-[rgba(196,160,69,0.2)] text-[rgba(240,232,216,0.8)] px-3 py-2 focus:outline-none focus:border-[rgba(196,160,69,0.5)] hover:border-[rgba(196,160,69,0.35)] transition-colors";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [brand, setBrand] = useState(searchParams.get("brand") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const merged = {
        search,
        brand,
        status,
        ...overrides,
      };
      if (merged.search) params.set("search", merged.search);
      if (merged.brand) params.set("brand", merged.brand);
      if (merged.status) params.set("status", merged.status);
      router.replace(`/admin/products?${params.toString()}`, { scroll: false });
    },
    [search, brand, status, router]
  );

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ search });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleBrand = (value: string) => {
    setBrand(value);
    pushParams({ brand: value });
  };

  const handleStatus = (value: string) => {
    setStatus(value);
    pushParams({ status: value });
  };

  const clearAll = () => {
    setSearch("");
    setBrand("");
    setStatus("");
    router.replace("/admin/products", { scroll: false });
  };

  const hasFilters = search || brand || status;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(196,160,69,0.45)] text-xs pointer-events-none">
          ⌕
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full font-body text-xs tracking-[0.1em] bg-[rgba(20,20,20,0.95)] border border-[rgba(196,160,69,0.2)] text-[rgba(240,232,216,0.8)] pl-8 pr-3 py-2 focus:outline-none focus:border-[rgba(196,160,69,0.5)] hover:border-[rgba(196,160,69,0.35)] transition-colors placeholder:text-[rgba(240,232,216,0.25)]"
        />
      </div>

      {/* Brand filter */}
      <select
        value={brand}
        onChange={(e) => handleBrand(e.target.value)}
        className={SELECT_CLASS}
      >
        {BRANDS.map((b) => (
          <option key={b.value} value={b.value}>
            {b.label}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => handleStatus(e.target.value)}
        className={SELECT_CLASS}
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="font-body text-xs tracking-[0.1em] text-[rgba(196,160,69,0.55)] hover:text-[#c4a045] transition-colors underline underline-offset-2"
        >
          Clear
        </button>
      )}
    </div>
  );
}
