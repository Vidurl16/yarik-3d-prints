"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function Nav() {
  const { getItemCount, openDrawer } = useCartStore();
  const [itemCount, setItemCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Hydration-safe: sync item count after mount
  useEffect(() => {
    setItemCount(getItemCount());
    return useCartStore.subscribe(() => setItemCount(getItemCount()));
  }, [getItemCount]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-heading text-xl tracking-[0.15em] text-[#c9a84c] group-hover:text-[#e0c878] transition-colors">
              YARIK
            </span>
            <span className="hidden sm:block text-[rgba(201,168,76,0.4)] text-xs tracking-widest font-body uppercase mt-0.5">
              3D Prints
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "/shop", label: "SHOP" },
              { href: "/builder", label: "BUILD" },
            ].map(({ href, label }) => (
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
        </div>
      </div>
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
