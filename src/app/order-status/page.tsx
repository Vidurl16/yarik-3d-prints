import Link from "next/link";
import type { Metadata } from "next";
import { getGuestOrderWithItems } from "@/lib/data/orders";
import { normalizeEmail } from "@/lib/utils/normalizeEmail";

export const metadata: Metadata = {
  title: "Order Status — YARIK 3D Prints",
  description: "Look up a guest order with your order reference and email address.",
};

interface Props {
  searchParams: Promise<{
    order?: string;
    email?: string;
  }>;
}

function formatPrice(cents: number, currency = "ZAR") {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(cents / 100);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyles(status: string) {
  if (status === "paid") {
    return "bg-green-900/30 text-green-400 border border-green-800/40";
  }
  if (status === "pending") {
    return "bg-yellow-900/30 text-yellow-400 border border-yellow-800/40";
  }
  return "bg-red-900/30 text-red-400 border border-red-800/40";
}

export default async function OrderStatusPage({ searchParams }: Props) {
  const { order = "", email = "" } = await searchParams;
  const trimmedOrder = order.trim();
  const normalizedEmail = normalizeEmail(email);
  const canLookup = trimmedOrder.length > 0 && normalizedEmail !== null;
  const result = canLookup
    ? await getGuestOrderWithItems(trimmedOrder, normalizedEmail)
    : null;
  const hasAttemptedLookup = trimmedOrder.length > 0 || email.trim().length > 0;

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[10px] tracking-widest font-body mb-6" style={{ color: "var(--muted)" }}>
            <Link href="/" className="transition-colors" style={{ color: "var(--muted)" }}>HOME</Link>
            <span style={{ color: "var(--border)" }}>›</span>
            <span style={{ color: "var(--text)", opacity: 0.5 }}>ORDER STATUS</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl mb-3" style={{ color: "var(--text)" }}>
            CHECK ORDER STATUS
          </h1>
          <p className="font-body text-sm max-w-2xl leading-relaxed" style={{ color: "var(--muted)" }}>
            Guest orders can be checked here using the full order reference from your checkout confirmation and the email address used at checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-8">
          <section
            className="p-6 space-y-4 h-fit"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h2 className="font-heading text-sm tracking-[0.2em]" style={{ color: "var(--primary)" }}>
              LOOK UP AS GUEST
            </h2>
            <form method="get" className="space-y-4">
              <div>
                <label
                  htmlFor="order"
                  className="block font-body text-[10px] tracking-[0.2em] mb-2"
                  style={{ color: "var(--muted)" }}
                >
                  ORDER REFERENCE
                </label>
                <input
                  id="order"
                  name="order"
                  defaultValue={trimmedOrder}
                  placeholder="Paste your full order reference"
                  className="w-full px-3 py-3 font-body text-sm"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-body text-[10px] tracking-[0.2em] mb-2"
                  style={{ color: "var(--muted)" }}
                >
                  CHECKOUT EMAIL
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={email}
                  placeholder="you@example.com"
                  className="w-full px-3 py-3 font-body text-sm"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full font-body text-sm tracking-[0.18em] py-3"
                style={{ background: "var(--accent)", color: "var(--bg)" }}
              >
                CHECK STATUS
              </button>
            </form>

            <p className="font-body text-[10px] leading-relaxed" style={{ color: "var(--muted)" }}>
              We only show the order that matches both the reference and email, so you do not need an account for guest checkout follow-up.
            </p>
          </section>

          <section
            className="p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {!hasAttemptedLookup ? (
              <div className="text-center py-12">
                <p className="font-heading text-sm tracking-widest mb-3" style={{ color: "var(--primary)", opacity: 0.7 }}>
                  ENTER YOUR DETAILS
                </p>
                <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
                  Once you submit your order reference and email, we&apos;ll show the current payment status and order contents here.
                </p>
              </div>
            ) : !canLookup ? (
              <div className="text-center py-12">
                <p className="font-heading text-sm tracking-widest mb-3" style={{ color: "var(--primary)", opacity: 0.7 }}>
                  CHECK THE DETAILS
                </p>
                <p className="font-body text-sm" style={{ color: "var(--muted)" }}>
                  Please provide both a valid email address and your full order reference to look up a guest order.
                </p>
              </div>
            ) : !result ? (
              <div className="text-center py-12">
                <p className="font-heading text-sm tracking-widest mb-3" style={{ color: "var(--primary)", opacity: 0.7 }}>
                  ORDER NOT FOUND
                </p>
                <p className="font-body text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  We couldn&apos;t find an order matching that reference and email address. Double-check the values from your confirmation, or{" "}
                  <Link href="/contact" className="hover:underline" style={{ color: "var(--primary)" }}>
                    contact support
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-body text-[10px] tracking-[0.2em] mb-2" style={{ color: "var(--muted)" }}>
                      ORDER REFERENCE
                    </p>
                    <p className="font-body text-sm break-all" style={{ color: "var(--primary)", fontFamily: "monospace" }}>
                      {result.order.id}
                    </p>
                  </div>
                  <span className={`inline-block font-body text-[10px] tracking-wider px-2 py-0.5 ${getStatusStyles(result.order.payment_status)}`}>
                    {result.order.payment_status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="font-body text-[10px] tracking-[0.2em] mb-2" style={{ color: "var(--muted)" }}>
                      PLACED
                    </p>
                    <p className="font-body text-sm" style={{ color: "var(--text)" }}>
                      {formatDate(result.order.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-[10px] tracking-[0.2em] mb-2" style={{ color: "var(--muted)" }}>
                      PAID
                    </p>
                    <p className="font-body text-sm" style={{ color: "var(--text)" }}>
                      {formatDate(result.order.paid_at)}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-[10px] tracking-[0.2em] mb-2" style={{ color: "var(--muted)" }}>
                      TOTAL
                    </p>
                    <p className="font-heading text-lg" style={{ color: "var(--primary)" }}>
                      {formatPrice(result.order.total_amount_cents ?? 0, result.order.currency ?? "ZAR")}
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border)" }} className="pt-5">
                  <h2 className="font-heading text-sm tracking-[0.2em] mb-4" style={{ color: "var(--primary)" }}>
                    ORDER ITEMS
                  </h2>
                  <div className="space-y-3">
                    {result.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <p className="font-body text-sm" style={{ color: "var(--text)" }}>
                            {item.name_snapshot ?? "Custom item"}
                          </p>
                          <p className="font-body text-[10px] tracking-[0.18em]" style={{ color: "var(--muted)" }}>
                            QTY {item.quantity}
                          </p>
                        </div>
                        <p className="font-body text-sm flex-shrink-0" style={{ color: "var(--primary)" }}>
                          {formatPrice(item.unit_amount_cents * item.quantity, result.order.currency ?? "ZAR")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="font-body text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  If your payment status looks wrong or you still need help, contact support and include your order reference.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
