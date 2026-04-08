"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import NavAuthLinks from "./NavAuthLinks";

// Brand sub-category definitions for the mega-menu
const BRAND_MENU = [
  {
    id: "grimdark-future",
    label: "Grimdark Future",
    icon: "⚙️",
    tagline: "40K-scale · Industrial war",
    href: "/grimdark-future",
    accentColor: "#8b0000",
    subcategories: [],
    factions: [
      { label: "Angels of Death", href: "/grimdark-future/space-marines" },
      { label: "Dark Angels", href: "/grimdark-future/dark-angels" },
      { label: "Bloodied Angels", href: "/grimdark-future/blood-angels" },
      { label: "Space Vikings", href: "/grimdark-future/space-wolves" },
      { label: "Templars", href: "/grimdark-future/black-templars" },
      { label: "Lords of Chaos", href: "/grimdark-future/chaos-space-marines" },
      { label: "Lords of Decay", href: "/grimdark-future/death-guard" },
      { label: "Lords of Sorcery", href: "/grimdark-future/thousand-sons" },
      { label: "Lords of Slaughter", href: "/grimdark-future/world-eaters" },
      { label: "Lords of Perfection", href: "/grimdark-future/emperors-children" },
      { label: "Greenskins", href: "/grimdark-future/orks" },
      { label: "The Swarm", href: "/grimdark-future/tyranids" },
      { label: "Undying Legion", href: "/grimdark-future/necrons" },
      { label: "Eldar", href: "/grimdark-future/eldar" },
      { label: "Dark Eldar", href: "/grimdark-future/dark-eldar" },
      { label: "The Greater Good", href: "/grimdark-future/tau" },
      { label: "Gene Cults", href: "/grimdark-future/genestealer-cults" },
      { label: "Dwarf Kin", href: "/grimdark-future/leagues-of-votann" },
      { label: "The Guard", href: "/grimdark-future/imperial-guard" },
      { label: "Custodians", href: "/grimdark-future/custodians" },
      { label: "Battle Sisters", href: "/grimdark-future/sisters-of-battle" },
      { label: "Silver Paladins", href: "/grimdark-future/grey-knights" },
      { label: "Mars Tech", href: "/grimdark-future/adeptus-mechanicus" },
      { label: "Knights Collosus", href: "/grimdark-future/knights" },
      { label: "Legio Demonica", href: "/grimdark-future/chaos-knights" },
    ],
  },
  {
    id: "age-of-fantasy",
    label: "Age of Fantasy",
    icon: "⚔️",
    tagline: "Heroic warriors · Ancient magic",
    href: "/age-of-fantasy",
    accentColor: "#2a5a3a",
    subcategories: [],
    factions: [
      { label: "Eternals", href: "/age-of-fantasy/high-elves" },
      { label: "Elves", href: "/age-of-fantasy/wood-elves" },
      { label: "Dark Elves", href: "/age-of-fantasy/dark-elves" },
      { label: "Wood Elves", href: "/age-of-fantasy/woodelves" },
      { label: "Cities", href: "/age-of-fantasy/cities" },
      { label: "Lizardmen", href: "/age-of-fantasy/lizardmen" },
      { label: "Vampire Lords", href: "/age-of-fantasy/vampire-lords" },
      { label: "The Haunted", href: "/age-of-fantasy/undead" },
      { label: "Flesh Eaters", href: "/age-of-fantasy/flesh-eaters" },
      { label: "Chaos Knights", href: "/age-of-fantasy/chaos-knights-aof" },
      { label: "Chaos Dwarves", href: "/age-of-fantasy/chaos-dwarves" },
      { label: "Rotkin", href: "/age-of-fantasy/rotkin" },
      { label: "Greenskins", href: "/age-of-fantasy/greenskins" },
      { label: "Goblins", href: "/age-of-fantasy/goblins" },
      { label: "Ogres", href: "/age-of-fantasy/ogres" },
      { label: "Giants", href: "/age-of-fantasy/giants" },
      { label: "Ratmen", href: "/age-of-fantasy/ratmen" },
    ],
  },
  {
    id: "pokemon",
    label: "Pokémon",
    icon: "⭐",
    tagline: "Gotta print 'em all",
    href: "/pokemon",
    accentColor: "#c9a84c",
    subcategories: [
      { label: "Pokéballs", href: "/pokemon/pokeballs" },
      { label: "Themed Pokéballs", href: "/pokemon/themed-pokeballs" },
      { label: "3D Cards", href: "/pokemon/3d-cards" },
      { label: "Figurines & Statues", href: "/pokemon/figurines" },
    ],
    factions: [],
  },
  {
    id: "basing-battle-effects",
    label: "Basing & Battle Effects",
    icon: "🪨",
    tagline: "Bases · Scatter · Effects",
    href: "/basing-battle-effects",
    accentColor: "#5a4a2a",
    subcategories: [
      { label: "Old World City", href: "/basing-battle-effects/old-world-city" },
      { label: "Modern City", href: "/basing-battle-effects/modern-city" },
      { label: "Jungle & Forest", href: "/basing-battle-effects/jungle-and-forest" },
      { label: "Rock & Crystals", href: "/basing-battle-effects/rock-and-crystals" },
      { label: "Alien Worlds", href: "/basing-battle-effects/alien-worlds" },
      { label: "Elemental", href: "/basing-battle-effects/elemental" },
    ],
    factions: [],
  },
  {
    id: "gaming-accessories-terrain",
    label: "Gaming & Terrain",
    icon: "🗺️",
    tagline: "Terrain · Tokens · Accessories",
    href: "/gaming-accessories-terrain",
    accentColor: "#2a3a5a",
    subcategories: [
      { label: "Terrain", href: "/gaming-accessories-terrain?filter=Terrain" },
      { label: "Accessories", href: "/gaming-accessories-terrain?filter=Accessories" },
    ],
    factions: [],
  },
  {
    id: "display-figures-busts",
    label: "Display Figures & Busts",
    icon: "🗿",
    tagline: "Comics · Games · Movies · Other",
    href: "/display-figures-busts",
    accentColor: "#8a5ab0",
    subcategories: [
      { label: "Single Figures", href: "/display-figures-busts?tag=single+figures" },
      { label: "Dioramas", href: "/display-figures-busts?tag=dioramas" },
      { label: "Busts", href: "/display-figures-busts?tag=busts" },
      { label: "Limited Edition", href: "/display-figures-busts?tag=limited+edition" },
    ],
    factions: [],
  },
];

const navLinks = [
  { href: "/new-arrivals", label: "NEW" },
  { href: "/preorders", label: "PREORDERS" },
  { href: "/contact", label: "CONTACT" },
];

export default function Nav() {
  const router = useRouter();
  const openDrawer = useCartStore((state) => state.openDrawer);
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState(BRAND_MENU[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const builderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (builderRef.current && !builderRef.current.contains(e.target as Node)) {
        setBuilderOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeBrandData = BRAND_MENU.find((b) => b.id === activeBrand) ?? BRAND_MENU[0];

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(12,9,2,0.98)] border-b border-[rgba(196,160,69,0.2)]"
          : "bg-[rgba(12,9,2,0.8)] border-b border-[rgba(196,160,69,0.08)]"
      }`}
      style={{ backdropFilter: "blur(16px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
            <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-[rgba(196,160,69,0.3)] group-hover:ring-[rgba(196,160,69,0.7)] transition-all duration-300">
              <Image
                src="/logo.jpg"
                alt="The Dexarium"
                fill
                className="object-cover"
                sizes="40px"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-heading text-sm tracking-[0.14em] text-[#c4a045] group-hover:text-[#ddb95a] transition-colors">
                THE DEXARIUM
              </span>
              <span className="hidden sm:block font-body text-[10px] tracking-[0.14em] text-[rgba(196,160,69,0.6)] uppercase">
                From Spark to Legend
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Shop Mega-Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShopOpen((v) => !v)}
                onMouseEnter={() => setShopOpen(true)}
                aria-expanded={shopOpen}
                aria-haspopup="true"
                className="flex items-center gap-1.5 font-body text-sm tracking-[0.15em] text-[#f0e8d8] hover:text-[#c4a045] transition-colors relative group"
              >
                SHOP
                <motion.svg
                  animate={{ rotate: shopOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-3 h-3"
                  viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}
                >
                  <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#c4a045] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>

              <AnimatePresence>
                {shopOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 flex"
                    style={{
                      background: "linear-gradient(160deg, #161009 0%, #1e1810 100%)",
                      border: "1px solid rgba(196,160,69,0.22)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 24px 48px rgba(0,0,0,0.7)",
                      width: "920px",
                    }}
                  >
                    {/* Left: Brand list */}
                    <div className="w-80 flex-shrink-0 py-4 border-r border-[rgba(196,160,69,0.08)]">
                      <p className="font-body text-[13px] tracking-[0.2em] text-[rgba(196,160,69,0.75)] uppercase px-5 pb-3">
                        Browse by Brand
                      </p>
                      {BRAND_MENU.map((brand) => (
                        <button
                          key={brand.id}
                          onMouseEnter={() => setActiveBrand(brand.id)}
                          onClick={() => { setShopOpen(false); router.push(brand.href); }}
                          className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors group"
                          style={{
                            background: activeBrand === brand.id
                              ? `rgba(${brand.accentColor.slice(1).match(/../g)!.map(h => parseInt(h, 16)).join(",")}, 0.12)`
                              : "transparent",
                            borderLeft: activeBrand === brand.id
                              ? `2px solid ${brand.accentColor}`
                              : "2px solid transparent",
                          }}
                        >
                          <span className="text-xl leading-none flex-shrink-0">{brand.icon}</span>
                          <div className="min-w-0">
                            <p
                              className="font-body text-base tracking-wider truncate"
                              style={{ color: activeBrand === brand.id ? "#f0e8d8" : "rgba(240,232,216,0.9)" }}
                            >
                              {brand.label}
                            </p>
                            <p className="font-body text-[13px] text-[rgba(240,232,216,0.6)] truncate mt-0.5">
                              {brand.tagline}
                            </p>
                          </div>
                          <svg className="w-3 h-3 flex-shrink-0 text-[rgba(196,160,69,0.4)]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            <path d="M4 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      ))}
                      <div className="border-t border-[rgba(196,160,69,0.08)] mt-2 pt-2 px-4">
                        <Link
                          href="/shop"
                          onClick={() => setShopOpen(false)}
                          className="font-body text-[11px] tracking-[0.1em] text-[rgba(196,160,69,0.7)] hover:text-[#c4a045] transition-colors"
                        >
                          VIEW ALL →
                        </Link>
                      </div>
                    </div>

                    {/* Right: Sub-categories for active brand */}
                    <motion.div
                      key={activeBrand}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 py-6 px-7 overflow-y-auto"
                      style={{ maxHeight: "calc(100vh - 120px)" }}
                    >
                      <Link
                        href={activeBrandData.href}
                        onClick={() => setShopOpen(false)}
                        className="block mb-5 group"
                      >
                        <p className="font-heading text-xl tracking-wider text-[#f0e8d8] group-hover:text-[#c4a045] transition-colors">
                          {activeBrandData.label.toUpperCase()}
                        </p>
                        <p className="font-body text-sm text-[rgba(240,232,216,0.65)] mt-1">
                          {activeBrandData.tagline}
                        </p>
                      </Link>

                      {activeBrandData.factions.length > 0 && (
                        <>
                          <p className="font-body text-[13px] tracking-[0.2em] text-[rgba(196,160,69,0.75)] uppercase mb-3">
                            Browse by Faction
                          </p>
                          <div className="grid grid-cols-2 gap-1 mb-5">
                            {activeBrandData.factions.map((faction) => (
                              <Link
                                key={faction.href}
                                href={faction.href}
                                onClick={() => setShopOpen(false)}
                                className="font-body text-base tracking-wider text-[rgba(240,232,216,0.88)] hover:text-[#c4a045] transition-colors py-2.5 px-3 hover:bg-[rgba(196,160,69,0.06)]"
                              >
                                {faction.label}
                              </Link>
                            ))}
                          </div>
                        </>
                      )}

                      {activeBrandData.subcategories.length > 0 && (
                        <>
                          <p className="font-body text-[13px] tracking-[0.2em] text-[rgba(196,160,69,0.75)] uppercase mb-3">
                            Product Types
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {activeBrandData.subcategories.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setShopOpen(false)}
                                className="font-body text-sm tracking-wider px-5 py-2.5 transition-all duration-150"
                                style={{
                                  border: "1px solid rgba(196,160,69,0.2)",
                                  color: "rgba(240,232,216,0.7)",
                                }}
                                onMouseEnter={(e) => {
                                  (e.currentTarget as HTMLElement).style.borderColor = activeBrandData.accentColor;
                                  (e.currentTarget as HTMLElement).style.color = activeBrandData.accentColor;
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,160,69,0.2)";
                                  (e.currentTarget as HTMLElement).style.color = "rgba(240,232,216,0.7)";
                                }}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Army Builder dropdown */}
            <div
              className="relative"
              ref={builderRef}
              onMouseEnter={() => setBuilderOpen(true)}
              onMouseLeave={() => setBuilderOpen(false)}
            >
              <button
                aria-expanded={builderOpen}
                aria-haspopup="true"
                className="flex items-center gap-1.5 font-body text-sm tracking-[0.15em] text-[#f0e8d8] hover:text-[#c4a045] transition-colors relative group"
              >
                ARMY BUILDER
                <motion.svg
                  animate={{ rotate: builderOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-3 h-3"
                  viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}
                >
                  <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#c4a045] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>
              <AnimatePresence>
                {builderOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2"
                    style={{
                      background: "linear-gradient(160deg, #161009 0%, #1e1810 100%)",
                      border: "1px solid rgba(196,160,69,0.22)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 24px 48px rgba(0,0,0,0.7)",
                      width: "280px",
                    }}
                  >
                    <div className="px-5 pt-4 pb-2 border-b border-[rgba(196,160,69,0.12)]">
                      <p className="font-body text-[13px] tracking-[0.2em] text-[rgba(196,160,69,0.75)] uppercase">Select Game System</p>
                    </div>
                    <div className="p-3 space-y-1">
                      <Link
                        href="/grimdark-future/army-builder"
                        onClick={() => setBuilderOpen(false)}
                        className="flex items-center gap-4 px-4 py-3.5 transition-all duration-150 group/item"
                        style={{ borderLeft: "2px solid transparent" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderLeftColor = "#9b4060";
                          (e.currentTarget as HTMLElement).style.background = "rgba(155,64,96,0.06)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        <span className="text-xl">⚙️</span>
                        <div>
                          <p className="font-body text-sm tracking-[0.12em] text-[#f0e8d8] group-hover/item:text-[#c4a045] transition-colors">GRIMDARK FUTURE</p>
                          <p className="font-body text-[13px] text-[rgba(240,232,216,0.6)] mt-0.5">40K-scale · Industrial war</p>
                        </div>
                      </Link>
                      <Link
                        href="/age-of-fantasy/army-builder"
                        onClick={() => setBuilderOpen(false)}
                        className="flex items-center gap-4 px-4 py-3.5 transition-all duration-150 group/item"
                        style={{ borderLeft: "2px solid transparent" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderLeftColor = "#5ca85c";
                          (e.currentTarget as HTMLElement).style.background = "rgba(92,168,92,0.06)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        <span className="text-xl">⚔️</span>
                        <div>
                          <p className="font-body text-sm tracking-[0.12em] text-[#f0e8d8] group-hover/item:text-[#c4a045] transition-colors">AGE OF FANTASY</p>
                          <p className="font-body text-[13px] text-[rgba(240,232,216,0.6)] mt-0.5">Heroic warriors · Ancient magic</p>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-sm tracking-[0.15em] text-[#f0e8d8] hover:text-[#c4a045] transition-colors relative group"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#c4a045] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
            <NavAuthLinks />
          </div>

          {/* Right: Cart + Mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={openDrawer}
              aria-label={`Open cart — ${itemCount} items`}
              className="relative flex items-center gap-2 px-4 py-2 border border-[rgba(196,160,69,0.25)] hover:border-[rgba(196,160,69,0.7)] transition-all duration-200 group"
            >
              <CartIcon className="w-4 h-4 text-[#c4a045] group-hover:text-[#ddb95a] transition-colors" />
              <span className="font-body text-xs tracking-wider text-[#f0e8d8] group-hover:text-[#c4a045] transition-colors hidden sm:block">
                CART
              </span>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-[#8b0000] text-[#f0e8d8] text-[10px] font-bold rounded-full flex items-center justify-center font-body"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </motion.span>
              )}
            </button>

            <button
              className="lg:hidden flex flex-col gap-1.5 px-2 py-2 text-[#c4a045]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="block w-5 h-px bg-current origin-center"
                style={{ display: "block", height: "1px", background: "currentColor" }}
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-5 h-px bg-current"
                style={{ display: "block", height: "1px", background: "currentColor" }}
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="block w-5 h-px bg-current origin-center"
                style={{ display: "block", height: "1px", background: "currentColor" }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="lg:hidden border-t border-[rgba(196,160,69,0.1)] overflow-hidden"
            style={{ background: "rgba(10,7,1,0.99)" }}
          >
            <div className="py-4 px-4">
              {/* Brand accordion items */}
              {BRAND_MENU.map((brand) => (
                <div key={brand.id} className="border-b border-[rgba(196,160,69,0.06)] last:border-0">
                  <button
                    className="w-full flex items-center justify-between px-2 py-3"
                    onClick={() => setMobileExpanded(mobileExpanded === brand.id ? null : brand.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{brand.icon}</span>
                      <span className="font-body text-sm tracking-wider text-[rgba(240,232,216,0.85)]">
                        {brand.label}
                      </span>
                    </div>
                    <motion.svg
                      animate={{ rotate: mobileExpanded === brand.id ? 180 : 0 }}
                      className="w-3 h-3 text-[rgba(196,160,69,0.5)]"
                      viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}
                    >
                      <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </button>

                  <AnimatePresence>
                    {mobileExpanded === brand.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-9 pb-3 overflow-hidden"
                      >
                        <Link
                          href={brand.href}
                          onClick={() => setMobileOpen(false)}
                          className="block font-body text-xs tracking-[0.1em] text-[#c4a045] py-1.5"
                        >
                          VIEW ALL {brand.label.toUpperCase()} →
                        </Link>
                        {brand.factions.map((f) => (
                          <Link
                            key={f.href}
                            href={f.href}
                            onClick={() => setMobileOpen(false)}
                            className="block font-body text-sm tracking-wider text-[rgba(240,232,216,0.82)] hover:text-[#c4a045] py-2 transition-colors"
                          >
                            {f.label}
                          </Link>
                        ))}
                        {brand.factions.length > 0 && (
                          <div className="my-1 border-t border-[rgba(196,160,69,0.06)]" />
                        )}
                        {brand.subcategories.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className="block font-body text-sm tracking-wider text-[rgba(240,232,216,0.7)] hover:text-[rgba(240,232,216,0.9)] py-2 transition-colors"
                          >
                            — {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Utility links */}
              <div className="pt-3 space-y-0.5">
                <Link
                  href="/grimdark-future/army-builder"
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2.5 font-body text-sm tracking-[0.15em] text-[#f0e8d8] hover:text-[#c4a045] transition-colors"
                >
                  ⚙️ ARMY BUILDER — GRIMDARK
                </Link>
                <Link
                  href="/age-of-fantasy/army-builder"
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2.5 font-body text-sm tracking-[0.15em] text-[#f0e8d8] hover:text-[#c4a045] transition-colors"
                >
                  ⚔️ ARMY BUILDER — FANTASY
                </Link>
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-2 py-2.5 font-body text-sm tracking-[0.15em] text-[#f0e8d8] hover:text-[#c4a045] transition-colors"
                  >
                    {label}
                  </Link>
                ))}
                <div
                  className="border-t border-[rgba(196,160,69,0.08)] mt-2 pt-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <NavAuthLinks mobile />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}
