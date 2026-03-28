"use client";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

const SHIPPING_METHODS = [
  { id: "postnet", label: "PostNet to PostNet", sub: "Drop off & collect at any PostNet branch", priceCents: 8900 },
  { id: "courier-door", label: "The Courier Guy — to the door", sub: "Delivered to your address (1–3 business days)", priceCents: 14900 },
  { id: "courier-pudo", label: "The Courier Guy — PUDO locker", sub: "Collect at your nearest PUDO locker", priceCents: 9900 },
] as const;

type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];

function CartContent() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const isCancelled = searchParams.get("cancelled") === "true";
  const orderId = searchParams.get("order");
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [address, setAddress] = useState({
    name: "", line1: "", line2: "", city: "", province: "", postal_code: "", country: "ZA",
  });
  const [showAddress, setShowAddress] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethodId>("postnet");

  async function copyOrderId() {
    if (!orderId) return;
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const subtotal = getTotal();
  const shippingMethod = SHIPPING_METHODS.find((m) => m.id === selectedShipping)!;
  const total = subtotal + shippingMethod.priceCents / 100;

  async function handleCheckout() {
    if (items.length === 0) return;
    setCheckingOut(true);
    setError(null);

    try {
      const shippingAddress = showAddress && address.name && address.line1 && address.city
        ? { ...address, country: address.country || "ZA" }
        : undefined;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: guestEmail.trim() || undefined,
          shippingAddress,
          shippingMethod: {
            id: shippingMethod.id,
            label: shippingMethod.label,
            priceCents: shippingMethod.priceCents,
          },
          items: items.map((item) => ({
            product_id: item.id.startsWith("b-") ? undefined : item.id,
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

  // Clear cart once on successful payment return
  useEffect(() => {
    if (isSuccess) clearCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="text-center max-w-md px-6">
          <div
            className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
          >
            <svg className="w-8 h-8" style={{ color: "var(--primary)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl mb-3 tracking-widest" style={{ color: "var(--primary)" }}>
            PAYMENT PROCESSING
          </h1>
          <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            Your payment is being confirmed. You will receive an email once your order is verified.
          </p>
          {orderId && (
            <div
              className="mb-6 text-left"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "12px 16px" }}
            >
              <p className="font-body text-xs tracking-[0.1em] mb-2" style={{ color: "var(--muted)" }}>
                ORDER REFERENCE
              </p>
              <div className="flex items-center gap-3">
                <code className="font-body text-xs flex-1 break-all" style={{ color: "var(--primary)", fontFamily: "monospace" }}>
                  {orderId}
                </code>
                <button
                  onClick={copyOrderId}
                  className="font-body text-xs tracking-wider px-3 py-1.5 flex-shrink-0 transition-all duration-200"
                  style={{
                    border: "1px solid var(--border)",
                    color: copied ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>
            </div>
          )}
          <p className="font-body text-xs leading-relaxed mb-8" style={{ color: "var(--muted)" }}>
            If payment succeeded but your order is not confirmed within a few minutes,{" "}
            <Link href="/contact" style={{ color: "var(--primary)" }} className="hover:underline">contact support</Link>{" "}
            with your order reference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {orderId && (
              <Link
                href={`/order-status?order=${encodeURIComponent(orderId)}`}
                className="font-body text-xs tracking-[0.2em] px-8 py-3 transition-all duration-200 inline-block"
                style={{ border: "1px solid var(--border)", color: "var(--primary)" }}
              >
                CHECK ORDER STATUS
              </Link>
            )}
            <Link
              href="/shop"
              className="font-body text-xs tracking-[0.2em] px-8 py-3 transition-all duration-200 inline-block"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="text-center max-w-md px-6">
          <div
            className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <svg className="w-8 h-8" style={{ color: "var(--muted)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <h1 className="font-heading text-xl mb-3 tracking-widest" style={{ color: "var(--primary)", opacity: 1.0 }}>
            YOUR WARBAND AWAITS
          </h1>
          <p className="font-body text-sm mb-2" style={{ color: "var(--muted)" }}>
            The battlefield is empty. No models stand ready.
          </p>
          <p className="font-body text-sm mb-8" style={{ color: "var(--muted)" }}>
            Choose your faction and begin the march.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="font-body text-xs tracking-[0.2em] px-8 py-3 transition-all duration-200 inline-block"
              style={{ border: "1px solid var(--border)", color: "var(--primary)" }}
            >
              SHOP FACTIONS
            </Link>
            <Link
              href="/builder"
              className="font-body text-xs tracking-[0.2em] px-8 py-3 transition-all duration-200 inline-block"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              BUILD A BUNDLE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Failed / cancelled payment banner */}
          {isCancelled && (
            <div
              className="mb-8 flex items-start gap-4 p-4"
              style={{ background: "rgba(139,0,0,0.12)", border: "1px solid rgba(139,0,0,0.5)" }}
            >
              <svg className="w-5 h-5 text-[#8b0000] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <div>
                <p className="font-body text-sm mb-1" style={{ color: "var(--text)" }}>
                  Payment was cancelled or declined.
                </p>
                <p className="font-body text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  Your cart is intact — review your items below and try again, or{" "}
                  <Link href="/contact" style={{ color: "var(--primary)" }} className="hover:underline">contact support</Link>{" "}
                  if the problem persists.
                </p>
              </div>
            </div>
          )}

          {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs tracking-wider font-body mb-6" style={{ color: "var(--muted)" }}>
            <Link href="/" className="transition-colors" style={{ color: "var(--muted)" }}>HOME</Link>
            <span style={{ color: "var(--border)" }}>›</span>
            <span style={{ color: "var(--text)" }}>CART</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>
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
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0" style={{ border: "1px solid var(--border)" }} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-body font-semibold text-sm mb-1" style={{ color: "var(--text)" }}>
                    {item.name}
                  </h3>
                  <span
                    className={`font-body text-xs tracking-[0.1em] px-2 py-0.5 ${
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
                        className="w-7 h-7 flex items-center justify-center transition-all text-sm"
                        style={{ border: "1px solid var(--border)", color: "var(--primary)" }}
                      >
                        −
                      </button>
                      <span className="font-body text-sm w-6 text-center" style={{ color: "var(--text)" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center transition-all text-sm"
                        style={{ border: "1px solid var(--border)", color: "var(--primary)" }}
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-heading text-sm" style={{ color: "var(--primary)" }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="transition-colors"
                        style={{ color: "var(--muted)" }}
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
              className="font-body text-xs tracking-wider transition-colors mt-2"
              style={{ color: "var(--muted)" }}
            >
              CLEAR CART
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="p-6 space-y-4 lg:sticky lg:top-24"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <h2 className="font-heading text-sm tracking-[0.2em]" style={{ color: "var(--primary)" }}>
                ORDER SUMMARY
              </h2>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs tracking-wider" style={{ color: "var(--muted)" }}>
                    SUBTOTAL
                  </span>
                  <span className="font-body text-sm" style={{ color: "var(--text)" }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs tracking-wider" style={{ color: "var(--muted)" }}>
                    SHIPPING
                  </span>
                  <span className="font-body text-sm" style={{ color: "var(--text)" }}>
                    {formatPrice(shippingMethod.priceCents / 100)}
                  </span>
                </div>
              </div>

              {/* Shipping method selector */}
              <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="font-body text-xs tracking-[0.1em] mb-3" style={{ color: "var(--muted)" }}>
                  SHIPPING METHOD
                </p>
                <div className="space-y-2">
                  {SHIPPING_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-start gap-3 p-3 cursor-pointer transition-all duration-150"
                      style={{
                        border: selectedShipping === method.id
                          ? "1px solid var(--primary)"
                          : "1px solid var(--border)",
                        background: selectedShipping === method.id
                          ? "color-mix(in srgb, var(--primary) 8%, var(--surface))"
                          : "var(--surface)",
                      }}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={selectedShipping === method.id}
                        onChange={() => setSelectedShipping(method.id as ShippingMethodId)}
                        className="sr-only"
                      />
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                        style={{
                          border: `1px solid ${selectedShipping === method.id ? "var(--primary)" : "var(--muted)"}`,
                        }}
                      >
                        {selectedShipping === method.id && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: "var(--primary)" }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-body text-xs font-semibold tracking-wider" style={{ color: "var(--text)" }}>
                            {method.label}
                          </p>
                          <span className="font-body text-xs flex-shrink-0 font-semibold" style={{ color: "var(--primary)" }}>
                            {formatPrice(method.priceCents / 100)}
                          </span>
                        </div>
                        <p className="font-body text-xs mt-0.5 leading-snug" style={{ color: "var(--muted)" }}>
                          {method.sub}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="mb-4">
                  <label
                    htmlFor="guest-email"
                    className="block font-body text-xs tracking-[0.1em] mb-2"
                    style={{ color: "var(--muted)" }}
                  >
                    EMAIL FOR ORDER UPDATES
                  </label>
                  <input
                    id="guest-email"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-3 font-body text-sm"
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                  />
                  <p
                    className="font-body text-xs mt-2 leading-relaxed"
                    style={{ color: "var(--muted)", opacity: 0.8 }}
                  >
                    Required for guest checkout. Logged-in customers can leave this blank.
                  </p>
                </div>

                {/* Shipping Address */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAddress(!showAddress)}
                    className="flex items-center gap-2 font-body text-xs tracking-[0.1em] mb-2 transition-colors"
                    style={{ color: showAddress ? "var(--primary)" : "var(--muted)" }}
                  >
                    <span>{showAddress ? "▾" : "▸"}</span>
                    ADD SHIPPING ADDRESS
                  </button>

                  {showAddress && (
                    <div className="space-y-2">
                      {[
                        { key: "name", label: "Full name", placeholder: "Recipient name" },
                        { key: "line1", label: "Address line 1", placeholder: "Street address" },
                        { key: "line2", label: "Address line 2 (optional)", placeholder: "Apt, unit, etc." },
                        { key: "city", label: "City", placeholder: "Cape Town" },
                        { key: "province", label: "Province", placeholder: "Western Cape" },
                        { key: "postal_code", label: "Postal code", placeholder: "8001" },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="block font-body text-xs tracking-[0.1em] mb-1" style={{ color: "var(--muted)" }}>
                            {label.toUpperCase()}
                          </label>
                          <input
                            type="text"
                            value={address[key as keyof typeof address]}
                            onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
                            placeholder={placeholder}
                            className="w-full px-3 py-2 font-body text-xs"
                            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="font-body text-xs tracking-[0.15em]" style={{ color: "var(--text)" }}>
                    TOTAL
                  </span>
                  <span className="font-heading text-2xl" style={{ color: "var(--primary)" }}>
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full py-3 font-body text-sm tracking-[0.15em] transition-all duration-200"
                  style={{
                    background: checkingOut ? "var(--muted)" : "var(--accent)",
                    color: "var(--bg)",
                    opacity: checkingOut ? 0.6 : 1,
                    cursor: checkingOut ? "wait" : "pointer",
                  }}
                >
                  {checkingOut ? "REDIRECTING…" : "PROCEED TO CHECKOUT"}
                </button>

                {error && (
                  <p className="font-body text-xs text-[#ff6060] mt-2 text-center">
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
        <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: "var(--bg)" }}>
          <p className="font-heading text-sm tracking-widest" style={{ color: "var(--primary)", opacity: 0.8 }}>
            LOADING…
          </p>
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
