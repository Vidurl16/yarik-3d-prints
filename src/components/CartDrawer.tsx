"use client";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/products";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    getTotal,
  } = useCartStore();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  const total = getTotal();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[100] bg-black/70"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md flex flex-col"
            style={{
              background: "linear-gradient(160deg, #141414 0%, #1a1010 100%)",
              borderLeft: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,168,76,0.15)]">
              <h2 className="font-heading text-lg tracking-widest text-[#c9a84c]">
                YOUR WARBAND
              </h2>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 flex items-center justify-center text-[#c9a84c] hover:text-[#e0c878] hover:bg-[rgba(201,168,76,0.1)] transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <p className="font-heading text-base tracking-widest text-[rgba(201,168,76,0.75)]">
                    YOUR CART IS EMPTY
                  </p>
                  <p className="font-body text-sm text-[rgba(240,232,216,0.55)]">
                    Add some miniatures to begin your warband.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeDrawer}
                    className="font-body text-xs tracking-widest px-6 py-2 border border-[rgba(201,168,76,0.4)] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)] transition-all"
                  >
                    BROWSE FACTIONS
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-4 border-b border-[rgba(255,255,255,0.06)]"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 border border-[rgba(201,168,76,0.2)]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-[#e8e0d0] leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="font-body text-xs text-[#c9a84c] mt-0.5">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-[rgba(201,168,76,0.25)] text-[#c9a84c] hover:border-[rgba(201,168,76,0.7)] text-sm leading-none transition-all"
                          >
                            −
                          </button>
                          <span className="font-body text-sm text-[#e8e0d0] w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border border-[rgba(201,168,76,0.25)] text-[#c9a84c] hover:border-[rgba(201,168,76,0.7)] text-sm leading-none transition-all"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-body text-sm text-[#e8e0d0]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#6b6b6b] hover:text-[#8b0000] transition-colors"
                            aria-label="Remove item"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-[rgba(201,168,76,0.15)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-[rgba(240,232,216,0.55)] tracking-wider">
                    SUBTOTAL
                  </span>
                  <span className="font-heading text-lg text-[#c9a84c]">
                    {formatPrice(total)}
                  </span>
                </div>

                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="block w-full text-center py-3 bg-[#8b0000] hover:bg-[#b50000] text-[#e8e0d0] font-body text-sm tracking-[0.15em] transition-all duration-200"
                >
                  VIEW CART & CHECKOUT
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
