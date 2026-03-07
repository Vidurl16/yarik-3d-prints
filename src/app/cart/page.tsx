"use client";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function CartContent() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = getTotal();
  const DISCOUNT_THRESHOLD = 3;
  const hasDiscount = items.length >= DISCOUNT_THRESHOLD;
  const subtotalBeforeDiscount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = hasDiscount
    ? Math.round(subtotalBeforeDiscount * 0.15)
    : 0;

  async function handleCheckout() {
    if (items.length === 0) return;
    setCheckingOut(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Checkout failed");
      }

      const { redirectUrl } = await res.json();
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setCheckingOut(false);
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div
            className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[rgba(201,168,76,0.4)]"
            style={{ background: "rgba(201,168,76,0.1)" }}
          >
            <svg className="w-8 h-8 text-[#c9a84c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl text-[#c9a84c] mb-3 tracking-widest">
            PAYMENT PROCESSING
          </h1>
          <p className="font-body text-sm text-[#6b6b6b] leading-relaxed mb-4">
            Your payment is being confirmed. You will receive an email once your order is verified.
          </p>
          <p className="font-body text-xs text-[#4a4a4a] leading-relaxed mb-8">
            If payment succeeded but your order is not confirmed within a few minutes,{" "}
            <Link href="/contact" className="text-[#c9a84c] hover:underline">contact support</Link>{" "}
            with your order reference.
          </p>
          <Link
            href="/shop"
            className="font-body text-xs tracking-[0.2em] px-8 py-3 bg-[#8b0000] hover:bg-[#b50000] text-[#e8e0d0] transition-all duration-200 inline-block"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div
            className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[rgba(201,168,76,0.15)]"
          >
            <svg className="w-8 h-8 text-[rgba(201,168,76,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <h1 className="font-heading text-xl text-[rgba(201,168,76,0.4)] mb-3 tracking-widest">
            YOUR WARBAND AWAITS
          </h1>
          <p className="font-body text-sm text-[#6b6b6b] mb-2">
            The battlefield is empty. No models stand ready.
          </p>
          <p className="font-body text-sm text-[#6b6b6b] mb-8">
            Choose your faction and begin the march.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="font-body text-xs tracking-[0.2em] px-8 py-3 border border-[rgba(201,168,76,0.4)] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)] transition-all duration-200 inline-block"
            >
              SHOP FACTIONS
            </Link>
            <Link
              href="/builder"
              className="font-body text-xs tracking-[0.2em] px-8 py-3 bg-[#8b0000] hover:bg-[#b50000] text-[#e8e0d0] transition-all duration-200 inline-block"
            >
              BUILD A BUNDLE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#6b6b6b] font-body mb-6">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">HOME</Link>
            <span className="text-[rgba(201,168,76,0.3)]">›</span>
            <span className="text-[rgba(232,224,208,0.5)]">CART</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl text-[#e8e0d0]">
            YOUR WARBAND
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Line Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4"
                style={{
                  background: "linear-gradient(135deg, #141414 0%, #1a1414 100%)",
                  border: "1px solid rgba(201,168,76,0.1)",
                }}
              >
                <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 border border-[rgba(201,168,76,0.15)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-body font-semibold text-sm text-[#e8e0d0] mb-1">
                    {item.name}
                  </h3>
                  <span
                    className={`font-body text-[9px] tracking-[0.12em] px-2 py-0.5 ${
                      item.printType === "RESIN"
                        ? "print-badge-resin"
                        : item.printType === "FDM"
                        ? "print-badge-fdm"
                        : "print-badge-multicolour"
                    }`}
                  >
                    {item.printType}
                  </span>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center border border-[rgba(201,168,76,0.25)] text-[#c9a84c] hover:border-[rgba(201,168,76,0.7)] transition-all text-sm"
                      >
                        −
                      </button>
                      <span className="font-body text-sm text-[#e8e0d0] w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-[rgba(201,168,76,0.25)] text-[#c9a84c] hover:border-[rgba(201,168,76,0.7)] transition-all text-sm"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-heading text-sm text-[#c9a84c]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#6b6b6b] hover:text-[#8b0000] transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="font-body text-[10px] tracking-widest text-[#6b6b6b] hover:text-[#8b0000] transition-colors mt-2"
            >
              CLEAR CART
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="p-6 space-y-4 lg:sticky lg:top-24"
              style={{
                background: "linear-gradient(160deg, #141414 0%, #1a1010 100%)",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <h2 className="font-heading text-sm tracking-[0.2em] text-[#c9a84c]">
                ORDER SUMMARY
              </h2>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-[#6b6b6b] tracking-wider">
                    SUBTOTAL
                  </span>
                  <span className="font-body text-sm text-[#e8e0d0]">
                    {formatPrice(subtotalBeforeDiscount)}
                  </span>
                </div>

                {hasDiscount && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-xs text-[#c9a84c] tracking-wider">
                        BUNDLE DISCOUNT
                      </span>
                      <span className="font-body text-[9px] bg-[rgba(201,168,76,0.15)] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] px-1.5 py-0.5">
                        −15%
                      </span>
                    </div>
                    <span className="font-body text-sm text-[#c9a84c]">
                      −{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-[rgba(201,168,76,0.1)] pt-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-heading text-xs tracking-[0.15em] text-[#e8e0d0]">
                    TOTAL
                  </span>
                  <span className="font-heading text-2xl text-[#c9a84c]">
                    {formatPrice(total - discountAmount)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className={`w-full py-3 font-body text-sm tracking-[0.15em] transition-all duration-200 ${
                    checkingOut
                      ? "bg-[rgba(139,0,0,0.4)] text-[rgba(232,224,208,0.5)] cursor-wait"
                      : "bg-[#8b0000] hover:bg-[#b50000] text-[#e8e0d0]"
                  }`}
                >
                  {checkingOut ? "REDIRECTING…" : "PROCEED TO CHECKOUT"}
                </button>

                {error && (
                  <p className="font-body text-[10px] text-[#ff6060] mt-2 text-center">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] pt-24 flex items-center justify-center">
          <p className="font-heading text-sm tracking-widest text-[rgba(201,168,76,0.4)]">
            LOADING…
          </p>
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
