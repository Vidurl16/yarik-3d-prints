"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface PudoLocker {
  id: string;
  name: string;
  address?: string;
  suburb?: string;
  city?: string;
  hours?: string;
}

interface Props {
  selectedId: string;
  selectedName: string;
  onSelect: (id: string, name: string) => void;
  /** If true, renders a plain text input (API not configured) */
  fallback?: boolean;
}

export default function PudoLockerPicker({ selectedId, selectedName, onSelect, fallback }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PudoLocker[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(fallback ?? false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/pudo/lockers?search=${encodeURIComponent(q)}`);
      if (res.status === 503) { setApiUnavailable(true); return; }
      const data = await res.json();
      setResults(data.lockers ?? []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const inputStyle = {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  } as const;

  // Fallback: plain text input when API key not set
  if (apiUnavailable) {
    return (
      <div>
        <label className="block font-body text-xs tracking-[0.1em] mb-1" style={{ color: "var(--muted)" }}>
          PUDO LOCKER NAME <span style={{ color: "rgba(139,0,0,0.9)" }}>*</span>
        </label>
        <input
          type="text"
          value={selectedName}
          onChange={(e) => onSelect("", e.target.value)}
          placeholder="e.g. PUDO Umhlanga"
          className="w-full px-3 py-2 font-body text-xs"
          style={inputStyle}
        />
        <p className="font-body text-xs mt-1" style={{ color: "var(--muted)", opacity: 0.6 }}>
          Enter your nearest PUDO locker name. Find one at{" "}
          <a href="https://www.pudo.co.za/lockers" target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>
            pudo.co.za/lockers
          </a>
        </p>
      </div>
    );
  }

  // Locker already selected — show it with a change button
  if (selectedId) {
    return (
      <div>
        <label className="block font-body text-xs tracking-[0.1em] mb-1" style={{ color: "var(--muted)" }}>
          PUDO LOCKER <span style={{ color: "rgba(139,0,0,0.9)" }}>*</span>
        </label>
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ background: "color-mix(in srgb, var(--primary) 8%, var(--bg))", border: "1px solid var(--primary)" }}
        >
          <div>
            <p className="font-body text-xs font-semibold" style={{ color: "var(--text)" }}>{selectedName}</p>
            <p className="font-body text-xs" style={{ color: "var(--muted)" }}>Selected locker</p>
          </div>
          <button
            type="button"
            onClick={() => { onSelect("", ""); setQuery(""); setResults([]); }}
            className="font-body text-xs tracking-wider px-3 py-1 transition-all"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            CHANGE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <label className="block font-body text-xs tracking-[0.1em] mb-1" style={{ color: "var(--muted)" }}>
        SEARCH PUDO LOCKER <span style={{ color: "rgba(139,0,0,0.9)" }}>*</span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type suburb or locker name…"
          className="w-full px-3 py-2 font-body text-xs"
          style={inputStyle}
          autoComplete="off"
        />
        {loading && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs"
            style={{ color: "var(--muted)" }}
          >
            …
          </span>
        )}

        {open && results.length > 0 && (
          <div
            className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {results.map((locker) => {
              const addressLine = [locker.suburb, locker.city].filter(Boolean).join(", ") || locker.address || "";
              return (
                <button
                  key={locker.id}
                  type="button"
                  className="w-full text-left px-3 py-2.5 transition-all duration-100"
                  style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 8%, var(--surface))")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => {
                    onSelect(locker.id, locker.name);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <p className="font-body text-xs font-semibold" style={{ color: "var(--text)" }}>{locker.name}</p>
                  {addressLine && (
                    <p className="font-body text-xs" style={{ color: "var(--muted)" }}>{addressLine}</p>
                  )}
                  {locker.hours && (
                    <p className="font-body text-xs" style={{ color: "var(--muted)", opacity: 0.7 }}>{locker.hours}</p>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {open && results.length === 0 && !loading && query.length >= 2 && (
          <div
            className="absolute z-50 w-full mt-1 px-3 py-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="font-body text-xs" style={{ color: "var(--muted)" }}>
              No lockers found for &quot;{query}&quot;. Try a different suburb or area name.
            </p>
          </div>
        )}
      </div>
      <p className="font-body text-xs mt-1" style={{ color: "var(--muted)", opacity: 0.6 }}>
        Find your nearest locker at{" "}
        <a href="https://www.pudo.co.za/lockers" target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>
          pudo.co.za/lockers
        </a>
      </p>
    </div>
  );
}
