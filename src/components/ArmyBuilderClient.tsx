"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, type Product, brandFactions } from "@/lib/products";
import type { ThemeTokens } from "@/components/theme/themes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const GAME_SYSTEMS = [
  { id: "grimdark-future",  label: "Grimdark Future", icon: "⚙️" },
  { id: "age-of-fantasy",   label: "Age of Fantasy",  icon: "⚔️" },
] as const;

const FACTION_GROUPS: Record<string, { label: string; factionIds: string[] }[]> = {
  "grimdark-future": [
    { label: "Imperial",  factionIds: ["space-marines","dark-angels","blood-angels","space-wolves","black-templars","custodians","imperial-guard","sisters-of-battle","grey-knights","adeptus-mechanicus","knights"] },
    { label: "Chaos",     factionIds: ["chaos-space-marines","death-guard","thousand-sons","world-eaters","emperors-children","chaos-knights"] },
    { label: "Xenos",     factionIds: ["orks","necrons","tyranids","eldar","dark-eldar","tau","leagues-of-votann","genestealer-cults"] },
  ],
  "age-of-fantasy": [
    { label: "Order",       factionIds: ["high-elves","wood-elves","dark-elves","woodelves","lizardmen","cities"] },
    { label: "Death",       factionIds: ["undead","vampire-lords","flesh-eaters"] },
    { label: "Chaos",       factionIds: ["rotkin","chaos-knights-aof","chaos-dwarves","ratmen"] },
    { label: "Destruction", factionIds: ["greenskins","goblins","ogres","giants"] },
  ],
};

const ROLE_SECTIONS = [
  {
    id: "HQ",
    label: "Characters",
    icon: "👑",
    description: "Commanders & Characters",
    roles: ["HQ", "Characters", "Heroes", "Hero"],
  },
  {
    id: "Battleline",
    label: "Battleline",
    icon: "🛡️",
    description: "Core troops & scoring units",
    roles: ["Battleline", "Support"],
  },
  {
    id: "Infantry",
    label: "Infantry / Mounted",
    icon: "⚔️",
    description: "Foot soldiers & mounted warriors",
    roles: ["Infantry", "Cavalry", "Infantry/Mounted"],
  },
  {
    id: "Vehicles",
    label: "Vehicles",
    icon: "🚛",
    description: "Tanks, walkers & war machines",
    roles: ["Vehicles", "Vehicle"],
  },
  {
    id: "Transports",
    label: "Transports",
    icon: "🚁",
    description: "Deployment & mobility units",
    roles: ["Transports", "Transport"],
  },
] as const;

interface Props {
  brand: string;
  theme: ThemeTokens;
  mainProducts: Product[];
  basingSuggestion: Product;
  battleEffectsSuggestion: Product;
}

interface UnitCardProps {
  product: Product;
  qty: number;
  onQtyChange: (qty: number) => void;
}

function UnitCard({ product, qty, onQtyChange }: UnitCardProps) {
  const isSelected = qty > 0;

  const printBadgeClass =
    product.printType === "RESIN"
      ? "print-badge-resin"
      : product.printType === "FDM"
      ? "print-badge-fdm"
      : "print-badge-multicolour";

  return (
    <div
      className="flex flex-row sm:flex-col overflow-hidden transition-all duration-200"
      style={{
        background: isSelected
          ? `linear-gradient(160deg, var(--surface) 0%, color-mix(in srgb, var(--primary) 8%, var(--surface)) 100%)`
          : "var(--surface)",
        border: isSelected
          ? "1px solid var(--primary)"
          : "1px solid var(--border)",
      }}
    >
      {/* Mobile: compact square thumbnail */}
      <div
        className="relative w-[72px] h-[72px] shrink-0 overflow-hidden sm:hidden"
        style={{ background: "color-mix(in srgb, var(--surface) 80%, black)" }}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover opacity-75"
          sizes="72px"
        />
        {isSelected && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(139,0,0,0.35)" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              className="w-5 h-5"
              style={{ color: "#fff" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
        )}
      </div>

      {/* Desktop: portrait card image */}
      <div
        className="hidden sm:block product-card-frame"
        style={{ background: "color-mix(in srgb, var(--surface) 80%, black)" }}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="product-card-image opacity-75"
          sizes="(max-width: 1024px) 33vw, 20vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }}
        />
        {product.isPreorder && (
          <span
            className="absolute top-2 left-2 font-body text-[11px] tracking-[0.1em] px-1.5 py-0.5"
            style={{ background: "rgba(139,0,0,0.8)", color: "#ff9090" }}
          >
            PREORDER
          </span>
        )}
        {isSelected && (
          <div
            className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center"
            style={{ background: "var(--primary)" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="w-3 h-3"
              style={{ color: "var(--bg)" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
        )}
      </div>

      {/* Content — shared between mobile row and desktop card */}
      <div className="flex-1 p-2 sm:p-3 flex flex-col gap-1 sm:gap-1.5 min-w-0">
        <p
          className="hidden sm:block font-body text-xs tracking-[0.1em] uppercase truncate"
          style={{ color: "var(--muted)" }}
        >
          {product.faction.replace(/-/g, " ")}
        </p>
        <h4
          className="font-body text-xs font-semibold leading-tight line-clamp-2"
          style={{ color: "var(--text)" }}
        >
          {product.name}
        </h4>
        <div className="flex items-center gap-1.5">
          <span className={`font-body text-[11px] tracking-wide ${printBadgeClass}`}>
            {product.printType}
          </span>
        </div>

        <div
          className="pt-1 sm:pt-2 mt-auto"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between gap-1">
            <span
              className="font-heading text-sm shrink-0"
              style={{ color: "var(--primary)" }}
            >
              {formatPrice(product.price)}
            </span>

            {isSelected ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onQtyChange(qty - 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-colors"
                  style={{ border: "1px solid var(--border)", color: "var(--primary)" }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span
                  className="font-body text-sm w-4 text-center"
                  style={{ color: "var(--text)" }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => onQtyChange(qty + 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-colors"
                  style={{ border: "1px solid var(--primary)", color: "var(--primary)" }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => onQtyChange(1)}
                className="font-body text-[11px] tracking-wider sm:w-full px-2 sm:px-0 py-1.5 sm:py-2.5 min-h-[36px] sm:min-h-[44px] transition-all duration-150 shrink-0"
                style={{ background: "var(--primary)", color: "var(--bg)" }}
              >
                + ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UpsellRow({
  product,
  active,
  onToggle,
}: {
  product: Product;
  active: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <label
      className="flex items-center gap-4 p-4 cursor-pointer transition-all duration-150"
      style={{
        background: active
          ? `color-mix(in srgb, var(--primary) 10%, var(--bg))`
          : "var(--bg)",
        border: active ? "1px solid var(--primary)" : "1px solid var(--border)",
      }}
    >
      <input
        type="checkbox"
        checked={active}
        onChange={(e) => onToggle(e.target.checked)}
        className="sr-only"
      />
      {/* Custom checkbox */}
      <div
        className="w-5 h-5 flex-shrink-0 flex items-center justify-center transition-all"
        style={{
          border: `1px solid ${active ? "var(--primary)" : "var(--muted)"}`,
          background: active ? "var(--primary)" : "transparent",
        }}
      >
        {active && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-3 h-3"
            style={{ color: "var(--bg)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        )}
      </div>

      {/* Thumb */}
      <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="product-thumb-image opacity-70"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="font-body text-sm font-semibold tracking-wider truncate"
          style={{ color: "var(--text)" }}
        >
          {product.name}
        </p>
        <p
          className="font-body text-xs"
          style={{ color: "var(--muted)" }}
        >
          {product.printType} · Recommended add-on
        </p>
      </div>

      <span
        className="font-heading text-sm flex-shrink-0"
        style={{ color: "var(--primary)" }}
      >
        {formatPrice(product.price)}
      </span>
    </label>
  );
}

export default function ArmyBuilderClient({
  brand,
  theme,
  mainProducts,
  basingSuggestion,
  battleEffectsSuggestion,
}: Props) {
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [basingActive, setBasingActive] = useState(false);
  const [battleEffectsActive, setBattleEffectsActive] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Faction filter — all factions defined for this brand (show even if no products yet)
  const factionList = useMemo(() => {
    const groups = FACTION_GROUPS[brand] ?? [];
    const allIds = groups.flatMap((g) => g.factionIds);
    const factionData = brandFactions[brand as keyof typeof brandFactions] ?? [];
    return allIds.map((id) => {
      const found = factionData.find((f) => f.id === id);
      return {
        id,
        label: found?.name ?? id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      };
    });
  }, [brand]);

  const [selectedFaction, setSelectedFaction] = useState<string>("all");

  // Filter mainProducts by faction when one is selected
  const filteredProducts = useMemo(() => {
    if (selectedFaction === "all") return mainProducts;
    return mainProducts.filter((p) => p.faction === selectedFaction);
  }, [mainProducts, selectedFaction]);

  const { addItem, updateQuantity, items: cartItems, openDrawer } = useCartStore();

  function setQty(productId: string, qty: number) {
    setAddedToCart(false);
    setSelections((prev) => {
      if (qty <= 0) {
        const rest = { ...prev };
        delete rest[productId];
        return rest;
      }
      return { ...prev, [productId]: qty };
    });
  }

  // Group products by role section (using faction-filtered products)
  const productsByRole = useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const section of ROLE_SECTIONS) {
      map[section.id] = filteredProducts.filter(
        (p) => p.role && (section.roles as readonly string[]).includes(p.role)
      );
    }
    return map;
  }, [filteredProducts]);

  // Summary: selected items (always look up from full mainProducts list)
  const selectedEntries = useMemo(() => {
    return Object.entries(selections)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = mainProducts.find((p) => p.id === id);
        return product ? { product, qty } : null;
      })
      .filter(Boolean) as { product: Product; qty: number }[];
  }, [selections, mainProducts]);

  // Running total
  const total = useMemo(() => {
    let sum = selectedEntries.reduce(
      (acc, { product, qty }) => acc + product.price * qty,
      0
    );
    if (basingActive) sum += basingSuggestion.price;
    if (battleEffectsActive) sum += battleEffectsSuggestion.price;
    return sum;
  }, [selectedEntries, basingActive, battleEffectsActive, basingSuggestion, battleEffectsSuggestion]);

  const hasSelection =
    selectedEntries.length > 0 || basingActive || battleEffectsActive;

  function handleAddToCart() {
    // Snapshot current cart state before mutations
    const currentCartItems = [...cartItems];

    // Helper to add one product with an explicit quantity delta
    function addProductToCart(product: Product, qty: number) {
      const existing = currentCartItems.find((i) => i.id === product.id);
      if (existing) {
        updateQuantity(product.id, existing.quantity + qty);
      } else {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          printType: product.printType,
        });
        if (qty > 1) {
          updateQuantity(product.id, qty);
        }
      }
    }

    // Add selected units
    for (const { product, qty } of selectedEntries) {
      addProductToCart(product, qty);
    }

    // Add upsells (qty 1 each)
    if (basingActive) addProductToCart(basingSuggestion, 1);
    if (battleEffectsActive) addProductToCart(battleEffectsSuggestion, 1);

    setAddedToCart(true);
    openDrawer();
  }

  const roleCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const section of ROLE_SECTIONS) {
      map[section.id] = section.roles.reduce((count, role) => {
        return (
          count +
          Object.entries(selections)
            .filter(([id, qty]) => {
              const product = mainProducts.find((p) => p.id === id); // always full list
              return qty > 0 && product?.role === role;
            })
            .reduce((s, [, qty]) => s + qty, 0)
        );
      }, 0);
    }
    return map;
  }, [selections, mainProducts]);

  return (
    <div
      style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}
    >
      {/* Page Header */}
      <div
        className="border-b pt-24 pb-8"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-body text-xs tracking-[0.15em] uppercase mb-2"
            style={{ color: "var(--primary)" }}
          >
            {theme.icon} {theme.label}
          </p>
          <h1
            className="font-heading text-3xl sm:text-5xl tracking-wider"
            style={{ color: "var(--text)" }}
          >
            ARMY BUILDER
          </h1>
          <p
            className="font-body text-sm mt-2 tracking-wide"
            style={{ color: "var(--muted)" }}
          >
            Select units by role · Add basing &amp; battle effects · Add
            warband to cart
          </p>

          {/* Game System Toggle */}
          <div className="flex gap-2 mt-6">
            {GAME_SYSTEMS.map((sys) => (
              <Link
                key={sys.id}
                href={`/${sys.id}/army-builder`}
                className="flex items-center gap-2 px-5 py-2.5 font-body text-sm tracking-[0.1em] transition-all"
                style={brand === sys.id
                  ? { background: "var(--primary)", color: "var(--bg)" }
                  : { border: "1px solid var(--border)", color: "var(--muted)" }}
              >
                <span>{sys.icon}</span>
                {sys.label.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* Faction selector — grouped by alliance */}
          <div className="mt-6">
            <span
              className="font-body text-xs tracking-[0.2em] uppercase block mb-3"
              style={{ color: "var(--muted)" }}
            >
              Faction
            </span>
            <div className="flex flex-wrap gap-2 mb-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedFaction("all")}
                className="font-body text-sm tracking-wider px-5 py-3 flex-shrink-0 transition-all"
                style={{
                  border: "1px solid var(--border)",
                  color: selectedFaction === "all" ? "var(--bg)" : "var(--muted)",
                  background: selectedFaction === "all" ? "var(--primary)" : "transparent",
                }}
              >
                All Factions
              </motion.button>
            </div>
            {(FACTION_GROUPS[brand] ?? []).map((group) => {
              const groupFactions = factionList.filter((f) => group.factionIds.includes(f.id));
              if (groupFactions.length === 0) return null;
              return (
                <div key={group.label} className="mb-4">
                  <p
                    className="font-body text-[10px] tracking-[0.25em] uppercase mb-2"
                    style={{ color: "var(--muted)", opacity: 0.55 }}
                  >
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {groupFactions.map((f) => (
                      <motion.button
                        key={f.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedFaction(f.id)}
                        className="font-body text-sm tracking-wider px-5 py-3 flex-shrink-0 transition-all capitalize"
                        style={{
                          border: selectedFaction === f.id ? "1px solid var(--primary)" : "1px solid var(--border)",
                          color: selectedFaction === f.id ? "var(--bg)" : "var(--text)",
                          background: selectedFaction === f.id ? "var(--primary)" : "transparent",
                        }}
                      >
                        {f.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-8">
        {/* Left: Role sections */}
        <div className="flex-1 min-w-0 space-y-6 pb-24 md:pb-0">
          {ROLE_SECTIONS.map((section) => {
            const sectionProducts = productsByRole[section.id] ?? [];
            return (
              <section
                key={section.id}
                className="p-6"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{section.icon}</span>
                  <div className="flex-1">
                    <h2
                      className="font-heading text-lg tracking-wider"
                      style={{ color: "var(--text)" }}
                    >
                      {section.label.toUpperCase()}
                    </h2>
                    <p
                      className="font-body text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      {section.description}
                    </p>
                  </div>
                  {roleCountMap[section.id] > 0 && (
                    <span
                      className="font-body text-xs px-2 py-0.5"
                      style={{
                        background: "var(--primary)",
                        color: "var(--bg)",
                      }}
                    >
                      {roleCountMap[section.id]} selected
                    </span>
                  )}
                </div>

                {sectionProducts.length === 0 ? (
                  <p
                    className="font-body text-xs italic"
                    style={{ color: "var(--muted)" }}
                  >
                    No units available in this category.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {sectionProducts.map((product) => (
                      <UnitCard
                        key={product.id}
                        product={product}
                        qty={selections[product.id] ?? 0}
                        onQtyChange={(qty) => setQty(product.id, qty)}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}

          {/* Upsell Add-Ons */}
          <section
            className="p-6"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className="font-heading text-lg tracking-wider mb-2"
              style={{ color: "var(--text)" }}
            >
              OPTIONAL ADD-ONS
            </h2>
            <p
              className="font-body text-xs mb-5"
              style={{ color: "var(--muted)" }}
            >
              Recommended basing &amp; battle effects to complete your army.
            </p>
            <div className="space-y-3">
              <UpsellRow
                product={basingSuggestion}
                active={basingActive}
                onToggle={setBasingActive}
              />
              <UpsellRow
                product={battleEffectsSuggestion}
                active={battleEffectsActive}
                onToggle={setBattleEffectsActive}
              />
            </div>
          </section>
        </div>

        {/* Right: Sticky Summary Panel — desktop only */}
        <aside
          className="hidden md:block md:w-[260px] lg:w-[320px] xl:w-[380px] shrink-0"
          style={{
            position: "sticky",
            top: "80px",
            alignSelf: "flex-start",
          }}
        >
          <div
            className="p-6"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="font-heading text-base tracking-wider mb-6 pb-4"
              style={{
                color: "var(--text)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              YOUR WARBAND
            </h3>

            {/* Selected units grouped by role */}
            <div className="space-y-3 mb-4 min-h-[80px]">
              {selectedEntries.length === 0 && !basingActive && !battleEffectsActive ? (
                <p
                  className="font-body text-xs italic"
                  style={{ color: "var(--muted)" }}
                >
                  No units selected. Choose from the left panel.
                </p>
              ) : (
                <>
                  {ROLE_SECTIONS.map((section) => {
                    const sectionItems = selectedEntries.filter(({ product }) =>
                      product.role ? (section.roles as readonly string[]).includes(product.role) : false
                    );
                    if (sectionItems.length === 0) return null;
                    return (
                      <div key={section.id} className="mb-2">
                        <h4
                          className="font-body text-xs uppercase tracking-widest mb-1.5"
                          style={{ color: "var(--muted)" }}
                        >
                          {section.icon} {section.label}
                        </h4>
                        {sectionItems.map(({ product, qty }) => (
                          <div
                            key={product.id}
                            className="flex items-start justify-between gap-2 mb-1"
                          >
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-body text-sm leading-snug truncate"
                                style={{ color: "var(--text)" }}
                              >
                                {product.name}
                              </p>
                              <p
                                className="font-body text-xs tracking-wider"
                                style={{ color: "var(--muted)" }}
                              >
                                ×{qty}
                              </p>
                            </div>
                            <span
                              className="font-body text-sm flex-shrink-0"
                              style={{ color: "var(--primary)" }}
                            >
                              {formatPrice(product.price * qty)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  {/* Units with no matching role → "Other" */}
                  {(() => {
                    const allRoles = ROLE_SECTIONS.flatMap((s) => s.roles as readonly string[]);
                    const other = selectedEntries.filter(({ product }) => !product.role || !allRoles.includes(product.role));
                    if (other.length === 0) return null;
                    return (
                      <div className="mb-2">
                        <h4
                          className="font-body text-xs uppercase tracking-widest mb-1.5"
                          style={{ color: "var(--muted)" }}
                        >
                          Other
                        </h4>
                        {other.map(({ product, qty }) => (
                          <div
                            key={product.id}
                            className="flex items-start justify-between gap-2 mb-1"
                          >
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-body text-sm leading-snug truncate"
                                style={{ color: "var(--text)" }}
                              >
                                {product.name}
                              </p>
                              <p
                                className="font-body text-xs tracking-wider"
                                style={{ color: "var(--muted)" }}
                              >
                                ×{qty}
                              </p>
                            </div>
                            <span
                              className="font-body text-sm flex-shrink-0"
                              style={{ color: "var(--primary)" }}
                            >
                              {formatPrice(product.price * qty)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>

            {/* Upsell rows in summary */}
            {(basingActive || battleEffectsActive) && (
              <>
                <div
                  className="my-3"
                  style={{ borderTop: "1px solid var(--border)" }}
                />
                <div className="space-y-1 mb-4">
                  {basingActive && (
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className="font-body text-xs truncate"
                        style={{ color: "var(--muted)" }}
                      >
                        🪨 {basingSuggestion.name}
                      </p>
                      <span
                        className="font-body text-xs flex-shrink-0"
                        style={{ color: "var(--primary)" }}
                      >
                        {formatPrice(basingSuggestion.price)}
                      </span>
                    </div>
                  )}
                  {battleEffectsActive && (
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className="font-body text-xs truncate"
                        style={{ color: "var(--muted)" }}
                      >
                        💥 {battleEffectsSuggestion.name}
                      </p>
                      <span
                        className="font-body text-xs flex-shrink-0"
                        style={{ color: "var(--primary)" }}
                      >
                        {formatPrice(battleEffectsSuggestion.price)}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Role summary counts */}
            <div
              className="my-4"
              style={{ borderTop: "1px solid var(--border)" }}
            />
            <div className="space-y-2 mb-4">
              {ROLE_SECTIONS.map((section) => (
                <div key={section.id} className="flex items-center justify-between">
                  <span
                    className="font-body text-xs tracking-wider flex items-center gap-1.5"
                    style={{ color: "var(--muted)" }}
                  >
                    {section.icon} {section.label}
                  </span>
                  <span
                    className="font-body text-xs"
                    style={{
                      color:
                        roleCountMap[section.id] > 0
                          ? "var(--primary)"
                          : "var(--muted)",
                    }}
                  >
                    {roleCountMap[section.id] > 0
                      ? `${roleCountMap[section.id]} unit${roleCountMap[section.id] > 1 ? "s" : ""}`
                      : "—"}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              className="my-5"
              style={{ borderTop: "1px solid var(--border)" }}
            />
            <div className="flex items-baseline justify-between mb-6">
              <span
                className="font-body text-xs tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                TOTAL
              </span>
              <span
                className="font-heading text-xl"
                style={{ color: "var(--primary)" }}
              >
                {formatPrice(total)}
              </span>
            </div>

            {/* CTA */}
            <button
              disabled={!hasSelection}
              onClick={handleAddToCart}
              className="w-full font-body text-sm tracking-[0.2em] py-4 transition-all duration-200"
              style={
                hasSelection
                  ? {
                      background: addedToCart
                        ? "color-mix(in srgb, var(--primary) 60%, transparent)"
                        : "var(--primary)",
                      color: "var(--bg)",
                      cursor: "pointer",
                    }
                  : {
                      background: "var(--surface)",
                      color: "var(--muted)",
                      cursor: "not-allowed",
                      border: "1px solid var(--border)",
                    }
              }
            >
              {addedToCart ? "ADDED ✓ — VIEW CART" : "ADD WARBAND TO CART"}
            </button>

            {hasSelection && (
              <button
                onClick={() => { setSelections({}); setAddedToCart(false); }}
                className="w-full font-body text-xs tracking-[0.15em] uppercase py-2.5 transition-colors duration-200 mt-2"
                style={{ color: "var(--muted)", border: "1px solid var(--border)", background: "transparent" }}
              >
                CLEAR WARBAND
              </button>
            )}

            {!hasSelection && (
              <p
                className="font-body text-xs text-center mt-3"
                style={{ color: "var(--muted)" }}
              >
                Select at least one unit to continue
              </p>
            )}

            {addedToCart && (
              <p
                className="font-body text-xs text-center mt-3"
                style={{ color: "var(--primary)" }}
              >
                Your warband has been added to cart.
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile warband drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
      >
        {/* Expandable warband summary */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              key="warband-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div
                className="overflow-y-auto p-4 space-y-3"
                style={{ maxHeight: "55vh", borderBottom: "1px solid var(--border)" }}
              >
                <h3
                  className="font-heading text-sm tracking-wider pb-3"
                  style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}
                >
                  YOUR WARBAND
                </h3>

                {selectedEntries.length === 0 && !basingActive && !battleEffectsActive ? (
                  <p className="font-body text-xs italic" style={{ color: "var(--muted)" }}>
                    No units selected yet.
                  </p>
                ) : (
                  <>
                    {ROLE_SECTIONS.map((section) => {
                      const items = selectedEntries.filter(({ product }) =>
                        product.role ? (section.roles as readonly string[]).includes(product.role) : false
                      );
                      if (items.length === 0) return null;
                      return (
                        <div key={section.id}>
                          <p
                            className="font-body text-[11px] uppercase tracking-widest mb-1"
                            style={{ color: "var(--muted)" }}
                          >
                            {section.icon} {section.label}
                          </p>
                          {items.map(({ product, qty }) => (
                            <div key={product.id} className="flex justify-between items-baseline gap-2 mb-1">
                              <p className="font-body text-xs truncate" style={{ color: "var(--text)" }}>
                                {product.name} <span style={{ color: "var(--muted)" }}>×{qty}</span>
                              </p>
                              <span className="font-body text-xs shrink-0" style={{ color: "var(--primary)" }}>
                                {formatPrice(product.price * qty)}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })}

                    {/* Other-role items */}
                    {(() => {
                      const allRoles = ROLE_SECTIONS.flatMap((s) => s.roles as readonly string[]);
                      const other = selectedEntries.filter(({ product }) => !product.role || !allRoles.includes(product.role));
                      return other.length > 0 ? (
                        <div>
                          <p className="font-body text-[11px] uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>Other</p>
                          {other.map(({ product, qty }) => (
                            <div key={product.id} className="flex justify-between items-baseline gap-2 mb-1">
                              <p className="font-body text-xs truncate" style={{ color: "var(--text)" }}>
                                {product.name} <span style={{ color: "var(--muted)" }}>×{qty}</span>
                              </p>
                              <span className="font-body text-xs shrink-0" style={{ color: "var(--primary)" }}>
                                {formatPrice(product.price * qty)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : null;
                    })()}

                    {/* Upsells */}
                    {(basingActive || battleEffectsActive) && (
                      <div
                        className="pt-2 space-y-1"
                        style={{ borderTop: "1px solid var(--border)" }}
                      >
                        {basingActive && (
                          <div className="flex justify-between gap-2">
                            <p className="font-body text-xs truncate" style={{ color: "var(--muted)" }}>
                              🪨 {basingSuggestion.name}
                            </p>
                            <span className="font-body text-xs shrink-0" style={{ color: "var(--primary)" }}>
                              {formatPrice(basingSuggestion.price)}
                            </span>
                          </div>
                        )}
                        {battleEffectsActive && (
                          <div className="flex justify-between gap-2">
                            <p className="font-body text-xs truncate" style={{ color: "var(--muted)" }}>
                              💥 {battleEffectsSuggestion.name}
                            </p>
                            <span className="font-body text-xs shrink-0" style={{ color: "var(--primary)" }}>
                              {formatPrice(battleEffectsSuggestion.price)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tappable handle: shows total + item count, toggles drawer */}
        <button
          onClick={() => setDrawerOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span className="font-body text-xs tracking-[0.15em]" style={{ color: "var(--muted)" }}>
            {hasSelection
              ? `${selectedEntries.length} UNIT${selectedEntries.length !== 1 ? "S" : ""} SELECTED`
              : "YOUR WARBAND"}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-heading text-base" style={{ color: "var(--primary)" }}>
              {formatPrice(total)}
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4 transition-transform duration-200"
              style={{
                color: "var(--muted)",
                transform: drawerOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </button>

        {/* Cart CTA */}
        <div className="px-4 py-3">
          <button
            disabled={!hasSelection}
            onClick={handleAddToCart}
            className="w-full font-body text-sm tracking-[0.2em] py-3 transition-all duration-200"
            style={
              hasSelection
                ? {
                    background: addedToCart
                      ? "color-mix(in srgb, var(--primary) 60%, transparent)"
                      : "var(--primary)",
                    color: "var(--bg)",
                    cursor: "pointer",
                  }
                : {
                    background: "var(--surface)",
                    color: "var(--muted)",
                    cursor: "not-allowed",
                    border: "1px solid var(--border)",
                  }
            }
          >
            {addedToCart ? "ADDED ✓ — VIEW CART" : "ADD WARBAND TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}
