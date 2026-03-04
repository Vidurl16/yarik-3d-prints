"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useRef, useState } from "react";
import { siteCategories } from "@/lib/products";

export default function Nav() {
  const { getItemCount, openDrawer } = useCartStore();
  const [itemCount, setItemCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItemCount(getItemCount());
    return useCartStore.subscribe(() => setItemCount(getItemCount()));
  }, [getItemCount]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/new-arrivals", label: "NEW" },
    { href: "/preorders", label: "PREORDERS" },
    { href: "/builder", label: "ARMY BUILDER" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(10,10,10,0.97)] border-b border-[rgba(201,168,76,0.15)]"
          : "bg-[rgba(10,10,10,0.7)] border-b border-[rgba(201,168,76,0.08)]"
      }`}
      style={{ backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 flex-shrink-0">
            <span className="font-heading text-xl tracking-[0.15em] text-[#c9a84c] group-hover:text-[#e0c878] transition-colors">
              YARIK
            </span>
            <span className="hidden sm:block text-[rgba(201,168,76,0.4)] text-xs tracking-widest font-body uppercase mt-0.5">
              3D Prints
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Shop Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShopOpen((v) => !v)}
                className="flex items-center gap-1 font-body text-sm tracking-[0.15em] text-[#e8e0d0] hover:text-[#c9a84c] transition-colors relative group"
              >
                SHOP
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}
                >
                  <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#c9a84c] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>

              {shopOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 py-2"
                  style={{
                    background: "linear-gradient(160deg, #141414 0%, #1a1010 100%)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {siteCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop/${cat.id}`}
                      onClick={() => setShopOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[rgba(201,168,76,0.06)] transition-colors group"
                    >
                      <span className="text-lg leading-none">{cat.icon}</span>
                      <div>
                        <p className="font-body text-xs tracking-wider text-[rgba(232,224,208,0.85)] group-hover:text-[#c9a84c] transition-colors">
                          {cat.name}
                        </p>
                        <p className="font-body text-[10px] text-[#6b6b6b] leading-tight mt-0.5">
                          {cat.flavorText}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-[rgba(201,168,76,0.08)] mt-2 pt-2">
                    <Link
                      href="/shop"
                      onClick={() => setShopOpen(false)}
                      className="block px-4 py-2 font-body text-[10px] tracking-[0.2em] text-[rgba(201,168,76,0.6)] hover:text-[#c9a84c] transition-colors"
                    >
                      VIEW ALL →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-sm tracking-[0.15em] text-[#e8e0d0] hover:text-[#c9a84c] transition-colors relative group"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#c9a84c] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </div>

          {/* Right side: Cart + Mobile menu */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={openDrawer}
              aria-label={`Open cart — ${itemCount} items`}
              className="relative flex items-center gap-2 px-4 py-2 border border-[rgba(201,168,76,0.25)] hover:border-[rgba(201,168,76,0.7)] transition-all duration-200 group"
            >
              <CartIcon className="w-4 h-4 text-[#c9a84c] group-hover:text-[#e0c878] transition-colors" />
              <span className="font-body text-xs tracking-wider text-[#e8e0d0] group-hover:text-[#c9a84c] transition-colors hidden sm:block">
                CART
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#8b0000] text-[#e8e0d0] text-[10px] font-bold rounded-full flex items-center justify-center font-body">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden flex flex-col gap-1.5 px-2 py-2 text-[#c9a84c]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-px bg-current transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-px bg-current transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-px bg-current transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-[rgba(201,168,76,0.1)] py-4 px-4"
          style={{ background: "rgba(10,10,10,0.99)" }}
        >
          <p className="font-body text-[10px] tracking-[0.3em] text-[rgba(201,168,76,0.4)] mb-3 uppercase px-2">
            Shop by Category
          </p>
          {siteCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.id}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-2 py-2.5 hover:bg-[rgba(201,168,76,0.05)] transition-colors"
            >
              <span className="text-base">{cat.icon}</span>
              <span className="font-body text-sm tracking-wider text-[rgba(232,224,208,0.8)]">{cat.name}</span>
            </Link>
          ))}
          <div className="border-t border-[rgba(201,168,76,0.08)] mt-3 pt-3 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block px-2 py-2.5 font-body text-sm tracking-[0.15em] text-[#e8e0d0] hover:text-[#c9a84c] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
}
