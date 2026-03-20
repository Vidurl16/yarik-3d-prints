"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, factions, type Product } from "@/lib/products";
import type { CartItem } from "@/store/cartStore";
import type { UnitRole } from "@/lib/products";

interface Props {
  products: Product[];
}

const ROLE_ORDER: UnitRole[] = ["HQ", "Battleline", "Infantry", "Cavalry", "Vehicles", "Transports", "Support"];
const ROLE_LABELS: Record<UnitRole, string> = {
  HQ: "⚔ HQ",
  Battleline: "🛡 Battleline",
  Infantry: "🪖 Infantry",
  Cavalry: "🐎 Cavalry",
  Vehicles: "🔧 Vehicles",
  Transports: "🚛 Transports",
  Support: "✦ Support",
};

export default function BundleBuilder({ products }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeRole, setActiveRole] = useState<UnitRole | "ALL">("ALL");
  const { addItem, openDrawer } = useCartStore();

  const builderUnits = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.role != null &&
            (p.siteCategory === "grimdark-future" || p.siteCategory === "age-of-fantasy")
        )
        .map((p) => {
          const factionName =
            factions.find((f) => f.id === p.faction)?.name ?? p.faction;
          const tagDesc = p.tags?.slice(0, 3).join(", ") ?? "";
          return {
            id: "b-" + p.id,
            name: p.name,
            price: p.price,
            description: `${factionName} ${p.role} — ${tagDesc || p.printType.toLowerCase() + " print"}`,
            role: p.role as UnitRole,
            faction: factionName,
            printType: p.printType,
            imageUrl: p.imageUrl,
          };
        }),
    [products]
  );

  const toggleUnit = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const availableRoles = useMemo(() => {
    const roles = new Set(builderUnits.map((u) => u.role));
    return ROLE_ORDER.filter((r) => roles.has(r));
  }, [builderUnits]);

  const filteredUnits = useMemo(
    () => activeRole === "ALL" ? builderUnits : builderUnits.filter((u) => u.role === activeRole),
    [activeRole, builderUnits]
  );

  const selectedUnits = useMemo(
    () => builderUnits.filter((u) => selected.has(u.id)),
    [selected, builderUnits]
  );

  const subtotal = useMemo(
    () => selectedUnits.reduce((sum, u) => sum + u.price, 0),
    [selectedUnits]
  );

  function handleAddToCart() {
    if (selectedUnits.length === 0) return;
    selectedUnits.forEach((unit) => {
      const item: Omit<CartItem, "quantity"> = {
        id: unit.id,
        name: unit.name,
        price: unit.price,
        imageUrl: unit.imageUrl,
        printType: unit.printType,
      };
      addItem(item);
    });
    openDrawer();
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
      {/* Unit List */}
      <div>
        {/* Role Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveRole("ALL")}
            className={`font-body text-[10px] tracking-[0.15em] px-3 py-2 transition-all duration-200 ${
              activeRole === "ALL"
                ? "text-[var(--bg)]"
                : "hover:opacity-100"
            }`}
            style={{
              background: activeRole === "ALL" ? "var(--primary)" : "var(--surface)",
              border: "1px solid var(--border)",
              color: activeRole === "ALL" ? "var(--bg)" : "var(--muted)",
              opacity: activeRole === "ALL" ? 1 : 0.9,
            }}
          >
            ALL UNITS
          </button>
          {availableRoles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className="font-body text-[10px] tracking-[0.15em] px-3 py-2 transition-all duration-200 hover:opacity-100"
              style={{
                background: activeRole === role ? "var(--primary)" : "var(--surface)",
                border: "1px solid var(--border)",
                color: activeRole === role ? "var(--bg)" : "var(--muted)",
                opacity: activeRole === role ? 1 : 0.9,
              }}
            >
              {ROLE_LABELS[role]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredUnits.map((unit) => {
            const isSelected = selected.has(unit.id);
            return (
              <button
                key={unit.id}
                onClick={() => toggleUnit(unit.id)}
                className="w-full text-left p-4 sm:p-5 transition-all duration-200 flex flex-col sm:flex-row items-stretch sm:items-start gap-4 group"
                style={{
                  background: isSelected
                    ? "color-mix(in srgb, var(--primary) 10%, var(--surface))"
                    : "var(--surface)",
                  border: isSelected
                    ? "1px solid var(--primary)"
                    : "1px solid var(--border)",
                  boxShadow: isSelected
                    ? "0 0 0 1px color-mix(in srgb, var(--primary) 25%, transparent)"
                    : "none",
                }}
              >
                <div className="flex items-start gap-4 sm:w-[calc(100%-6.5rem)]">
                  <div
                    className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden"
                    style={{
                      background: "color-mix(in srgb, var(--surface) 82%, black)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Image
                      src={unit.imageUrl}
                      alt={unit.name}
                      fill
                      className="product-thumb-image opacity-90"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <h3
                          className="font-body font-semibold text-base leading-tight"
                          style={{ color: "var(--text)" }}
                        >
                          {unit.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span
                            className="font-body text-[10px] tracking-[0.18em] uppercase px-2 py-1"
                            style={{
                              background: "color-mix(in srgb, var(--primary) 10%, transparent)",
                              border: "1px solid var(--border)",
                              color: "var(--primary)",
                            }}
                          >
                            {ROLE_LABELS[unit.role]}
                          </span>
                          <span
                            className="font-body text-[10px] tracking-[0.18em] uppercase"
                            style={{ color: "var(--muted)" }}
                          >
                            {unit.faction}
                          </span>
                        </div>
                      </div>
                      <span
                        className="font-heading text-lg flex-shrink-0"
                        style={{ color: "var(--primary)" }}
                      >
                        {formatPrice(unit.price)}
                      </span>
                    </div>

                    <p
                      className="font-body text-sm leading-relaxed"
                      style={{ color: "var(--muted)" }}
                    >
                      {unit.description}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <span
                        className="font-body text-[10px] tracking-[0.18em] uppercase px-2 py-1"
                        style={{
                          border: "1px solid var(--border)",
                          color: "var(--muted)",
                        }}
                      >
                        {unit.printType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:ml-auto flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                  <span
                    className="font-body text-[10px] tracking-[0.18em] uppercase"
                    style={{ color: isSelected ? "var(--primary)" : "var(--muted)" }}
                  >
                    {isSelected ? "Selected" : "Click to add"}
                  </span>
                  <div
                    className="w-6 h-6 flex-shrink-0 border flex items-center justify-center transition-all duration-200"
                    style={{
                      background: isSelected ? "var(--primary)" : "transparent",
                      borderColor: isSelected ? "var(--primary)" : "var(--border)",
                      color: isSelected ? "var(--bg)" : "var(--muted)",
                    }}
                  >
                    {isSelected ? (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                        <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Order Summary — Sticky */}
      <div>
        <div
          className="xl:sticky xl:top-24 p-6 space-y-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h2 className="font-heading text-sm tracking-[0.2em]" style={{ color: "var(--primary)" }}>
            ARMY SUMMARY
          </h2>

          {/* Role breakdown */}
          {selectedUnits.length > 0 && (
            <div className="space-y-1">
              {ROLE_ORDER.filter((r) => selectedUnits.some((u) => u.role === r)).map((role) => {
                const units = selectedUnits.filter((u) => u.role === role);
                return (
                  <div key={role} className="flex items-center justify-between">
                    <span className="font-body text-[10px] tracking-wider" style={{ color: "var(--muted)" }}>
                      {ROLE_LABELS[role]} ×{units.length}
                    </span>
                    <span className="font-body text-[10px]" style={{ color: "var(--muted)" }}>
                      {formatPrice(units.reduce((s, u) => s + u.price, 0))}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected units */}
          <div className="space-y-2 min-h-[80px]">
            {selectedUnits.length === 0 ? (
              <p className="font-body text-xs italic" style={{ color: "var(--muted)" }}>
                Select units to build your army…
              </p>
            ) : (
              selectedUnits.map((unit) => (
                <div key={unit.id} className="flex items-center justify-between">
                  <span className="font-body text-xs truncate pr-2" style={{ color: "var(--text)" }}>
                    {unit.name}
                  </span>
                  <span className="font-body text-xs flex-shrink-0" style={{ color: "var(--primary)" }}>
                    {formatPrice(unit.price)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 space-y-2" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <span className="font-body text-xs tracking-wider" style={{ color: "var(--muted)" }}>SUBTOTAL</span>
              <span className="font-body text-sm" style={{ color: "var(--text)" }}>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--border)" }}>
              <span className="font-heading text-xs tracking-[0.15em]" style={{ color: "var(--text)" }}>TOTAL</span>
              <span className="font-heading text-xl" style={{ color: "var(--primary)" }}>{formatPrice(subtotal)}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={selectedUnits.length === 0}
            className="w-full py-3 font-body text-sm tracking-[0.15em] transition-all duration-200"
            style={
              selectedUnits.length === 0
                ? {
                    background: "var(--bg)",
                    color: "var(--muted)",
                    cursor: "not-allowed",
                    border: "1px solid var(--border)",
                  }
                : {
                    background: "var(--accent)",
                    color: "var(--bg)",
                    border: "1px solid transparent",
                  }
            }
          >
            ADD ARMY TO CART
          </button>

          {selectedUnits.length > 0 && (
            <p className="font-body text-[10px] text-center" style={{ color: "var(--muted)" }}>
              {selectedUnits.length} unit{selectedUnits.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
