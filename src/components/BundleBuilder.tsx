"use client";

import { useState, useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/products";
import type { CartItem } from "@/store/cartStore";
import type { UnitRole } from "@/lib/products";

interface BuilderUnit {
  id: string;
  name: string;
  price: number;
  description: string;
  role: UnitRole;
  faction: string;
}

const BUILDER_UNITS: BuilderUnit[] = [
  // HQ
  { id: "b-sm-captain", name: "Primaris Captain", price: 180, description: "Space Marines HQ — leads from the front", role: "HQ", faction: "Space Marines" },
  { id: "b-sm-librarian", name: "Librarian", price: 220, description: "Psyker HQ — formidable in the warp", role: "HQ", faction: "Space Marines" },
  { id: "b-ork-warboss", name: "Warboss", price: 210, description: "Ork leader — biggest, meanest greenskin", role: "HQ", faction: "Orks" },
  { id: "b-ork-weirdboy", name: "Weirdboy Warphead", price: 220, description: "Ork psyker — dangerously unpredictable", role: "HQ", faction: "Orks" },
  { id: "b-csm-lord", name: "Chaos Lord", price: 180, description: "Champion of the dark gods", role: "HQ", faction: "Chaos" },
  { id: "b-tyr-hivetyrant", name: "Hive Tyrant", price: 620, description: "Apex synapse creature of the swarm", role: "HQ", faction: "Tyranids" },

  // Battleline
  { id: "b-sm-intercessors", name: "Intercessor Squad ×5", price: 350, description: "Core Space Marine battleline", role: "Battleline", faction: "Space Marines" },
  { id: "b-ork-boyz", name: "Ork Boyz ×10", price: 350, description: "The backbone of any WAAAGH!", role: "Battleline", faction: "Orks" },
  { id: "b-csm-legionaries", name: "Chaos Legionaries ×5", price: 350, description: "Veteran chaos warriors", role: "Battleline", faction: "Chaos" },
  { id: "b-tyr-termagants", name: "Termagant Brood ×10", price: 350, description: "The swarm's expendable vanguard", role: "Battleline", faction: "Tyranids" },

  // Infantry
  { id: "b-sm-banner", name: "Chapter Banner Bearer", price: 160, description: "Morale support for your brothers", role: "Infantry", faction: "Space Marines" },
  { id: "b-ork-nob", name: "Nob with Waaagh Banner", price: 160, description: "Elite ork, keeps the boyz in line", role: "Infantry", faction: "Orks" },
  { id: "b-csm-apostle", name: "Dark Apostle", price: 160, description: "Preaches ruin to the loyalists", role: "Infantry", faction: "Chaos" },
  { id: "b-tyr-venomthrope", name: "Venomthrope", price: 160, description: "Toxic support synapse", role: "Infantry", faction: "Tyranids" },

  // Vehicles
  { id: "b-sm-landraider", name: "Land Raider", price: 650, description: "Indomitable battle tank", role: "Vehicles", faction: "Space Marines" },
  { id: "b-ork-battlewagon", name: "Battlewagon", price: 650, description: "Ramshackle ork battle platform", role: "Vehicles", faction: "Orks" },
  { id: "b-csm-predator", name: "Chaos Predator", price: 650, description: "Corrupted tank of destruction", role: "Vehicles", faction: "Chaos" },
  { id: "b-tyr-tyrannofex", name: "Tyrannofex", price: 480, description: "Organic heavy weapons platform", role: "Vehicles", faction: "Tyranids" },

  // Transports
  { id: "b-sm-droppod", name: "Drop Pod", price: 480, description: "Rapid orbital deployment", role: "Transports", faction: "Space Marines" },
  { id: "b-ork-looted", name: "Looted Wagon", price: 480, description: "Repurposed enemy transport", role: "Transports", faction: "Orks" },
  { id: "b-csm-rhino", name: "Chaos Rhino", price: 480, description: "Chaos armoured transport", role: "Transports", faction: "Chaos" },
];

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

const DISCOUNT_THRESHOLD = 3;
const DISCOUNT_RATE = 0.15;

export default function BundleBuilder() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeRole, setActiveRole] = useState<UnitRole | "ALL">("ALL");
  const { addItem, openDrawer } = useCartStore();

  const toggleUnit = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const availableRoles = useMemo(() => {
    const roles = new Set(BUILDER_UNITS.map((u) => u.role));
    return ROLE_ORDER.filter((r) => roles.has(r));
  }, []);

  const filteredUnits = useMemo(
    () => activeRole === "ALL" ? BUILDER_UNITS : BUILDER_UNITS.filter((u) => u.role === activeRole),
    [activeRole]
  );

  const selectedUnits = useMemo(
    () => BUILDER_UNITS.filter((u) => selected.has(u.id)),
    [selected]
  );

  const subtotal = useMemo(
    () => selectedUnits.reduce((sum, u) => sum + u.price, 0),
    [selectedUnits]
  );

  const hasDiscount = selectedUnits.length >= DISCOUNT_THRESHOLD;
  const discountAmount = hasDiscount ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const total = subtotal - discountAmount;

  function handleAddToCart() {
    if (selectedUnits.length === 0) return;
    selectedUnits.forEach((unit) => {
      const item: Omit<CartItem, "quantity"> = {
        id: unit.id,
        name: unit.name,
        price: hasDiscount ? Math.round(unit.price * (1 - DISCOUNT_RATE)) : unit.price,
        imageUrl: `https://picsum.photos/seed/${unit.id}/400/400`,
        printType: "RESIN",
      };
      addItem(item);
    });
    openDrawer();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Unit List */}
      <div className="lg:col-span-3">
        {/* Role Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveRole("ALL")}
            className={`font-body text-[10px] tracking-[0.15em] px-3 py-1.5 transition-all duration-200 ${
              activeRole === "ALL"
                ? "bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.5)] text-[#c9a84c]"
                : "border border-[rgba(201,168,76,0.1)] text-[rgba(232,224,208,0.5)] hover:border-[rgba(201,168,76,0.3)]"
            }`}
          >
            ALL UNITS
          </button>
          {availableRoles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`font-body text-[10px] tracking-[0.15em] px-3 py-1.5 transition-all duration-200 ${
                activeRole === role
                  ? "bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.5)] text-[#c9a84c]"
                  : "border border-[rgba(201,168,76,0.1)] text-[rgba(232,224,208,0.5)] hover:border-[rgba(201,168,76,0.3)]"
              }`}
            >
              {ROLE_LABELS[role]}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredUnits.map((unit) => {
            const isSelected = selected.has(unit.id);
            return (
              <button
                key={unit.id}
                onClick={() => toggleUnit(unit.id)}
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

                {/* Unit Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className={`font-body font-semibold text-sm transition-colors ${isSelected ? "text-[#e8e0d0]" : "text-[rgba(232,224,208,0.7)] group-hover:text-[#e8e0d0]"}`}>
                        {unit.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-body text-[9px] tracking-widest text-[rgba(201,168,76,0.4)] uppercase">
                          {ROLE_LABELS[unit.role]}
                        </span>
                        <span className="text-[rgba(201,168,76,0.2)]">·</span>
                        <span className="font-body text-[9px] tracking-widest text-[#6b6b6b] uppercase">
                          {unit.faction}
                        </span>
                      </div>
                    </div>
                    <span className={`font-heading text-sm flex-shrink-0 ${isSelected ? "text-[#c9a84c]" : "text-[rgba(201,168,76,0.6)]"}`}>
                      {formatPrice(unit.price)}
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#6b6b6b] mt-1 leading-relaxed">
                    {unit.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
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
            ARMY SUMMARY
          </h2>

          {/* Role breakdown */}
          {selectedUnits.length > 0 && (
            <div className="space-y-1">
              {ROLE_ORDER.filter((r) => selectedUnits.some((u) => u.role === r)).map((role) => {
                const units = selectedUnits.filter((u) => u.role === role);
                return (
                  <div key={role} className="flex items-center justify-between">
                    <span className="font-body text-[10px] tracking-wider text-[rgba(201,168,76,0.5)]">
                      {ROLE_LABELS[role]} ×{units.length}
                    </span>
                    <span className="font-body text-[10px] text-[#6b6b6b]">
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
              <p className="font-body text-xs text-[#6b6b6b] italic">
                Select units to build your army…
              </p>
            ) : (
              selectedUnits.map((unit) => (
                <div key={unit.id} className="flex items-center justify-between">
                  <span className="font-body text-xs text-[rgba(232,224,208,0.8)] truncate pr-2">
                    {unit.name}
                  </span>
                  <span className="font-body text-xs text-[#c9a84c] flex-shrink-0">
                    {formatPrice(unit.price)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[rgba(201,168,76,0.1)] pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-[#6b6b6b] tracking-wider">SUBTOTAL</span>
              <span className="font-body text-sm text-[#e8e0d0]">{formatPrice(subtotal)}</span>
            </div>

            {hasDiscount ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[10px] tracking-wider text-[#c9a84c]">WARBAND DISCOUNT</span>
                  <span className="font-body text-[9px] bg-[rgba(201,168,76,0.2)] text-[#c9a84c] border border-[rgba(201,168,76,0.4)] px-1.5 py-0.5">
                    −15%
                  </span>
                </div>
                <span className="font-body text-sm text-[#c9a84c]">−{formatPrice(discountAmount)}</span>
              </div>
            ) : selectedUnits.length > 0 ? (
              <p className="font-body text-[10px] text-[#6b6b6b] italic">
                Select {DISCOUNT_THRESHOLD - selectedUnits.length} more unit{DISCOUNT_THRESHOLD - selectedUnits.length !== 1 ? "s" : ""} for 15% off
              </p>
            ) : null}

            <div className="flex items-center justify-between pt-2 border-t border-[rgba(201,168,76,0.1)]">
              <span className="font-heading text-xs tracking-[0.15em] text-[#e8e0d0]">TOTAL</span>
              <span className="font-heading text-xl text-[#c9a84c]">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={selectedUnits.length === 0}
            className={`w-full py-3 font-body text-sm tracking-[0.15em] transition-all duration-200 ${
              selectedUnits.length === 0
                ? "bg-[rgba(139,0,0,0.2)] text-[rgba(232,224,208,0.3)] cursor-not-allowed border border-[rgba(139,0,0,0.2)]"
                : "bg-[#8b0000] hover:bg-[#b50000] text-[#e8e0d0] border border-transparent"
            }`}
          >
            ADD ARMY TO CART
          </button>

          {selectedUnits.length > 0 && (
            <p className="font-body text-[10px] text-center text-[#6b6b6b]">
              {selectedUnits.length} unit{selectedUnits.length !== 1 ? "s" : ""} selected
              {hasDiscount && " · 15% warband discount applied"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
