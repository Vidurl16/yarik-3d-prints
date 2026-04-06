import { getSession } from "@/lib/auth/getSession";
import { getOrdersByUser } from "@/lib/data/orders";
import { redirect } from "next/navigation";
import Link from "next/link";
import AccountSignOut from "./AccountSignOut";

function formatPrice(cents: number, currency = "ZAR") {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(cents / 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric"
  });
}

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  paid:      { bg: "rgba(21,128,61,0.12)",  color: "#166534", border: "rgba(21,128,61,0.35)" },
  pending:   { bg: "rgba(161,98,7,0.12)",   color: "#92400e", border: "rgba(161,98,7,0.35)" },
  cancelled: { bg: "rgba(185,28,28,0.10)",  color: "#991b1b", border: "rgba(185,28,28,0.30)" },
  refunded:  { bg: "rgba(107,114,128,0.12)", color: "#374151", border: "rgba(107,114,128,0.3)" },
};

function OrderStatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return (
    <span
      className="inline-block font-body text-[11px] tracking-[0.1em] px-2.5 py-0.5 mt-1 uppercase"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {status}
    </span>
  );
}

interface PageProps {
  searchParams: Promise<{ updated?: string }>;
}

export default async function AccountPage({ searchParams }: PageProps) {
  const user = await getSession();
  if (!user) redirect("/login?next=/account");

  const [orders, params] = await Promise.all([
    getOrdersByUser(user.id),
    searchParams,
  ]);
  const passwordUpdated = params.updated === "true";

  return (
    <div className="min-h-screen pt-24 pb-20 px-4" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-3xl mx-auto">
        {passwordUpdated && (
          <div className="mb-6 px-4 py-3 font-body text-xs tracking-wider" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }}>
            ✓ Your password has been updated successfully.
          </div>
        )}
        <div className="mb-10 flex items-start justify-between">
          <div>
            {user.user_metadata?.full_name && (
              <p className="font-body text-sm tracking-wider mb-1" style={{ color: "var(--text)" }}>
                Welcome, {(user.user_metadata.full_name as string).split(" ")[0]}
              </p>
            )}
            <h1 className="font-heading text-2xl tracking-[0.15em] mb-1" style={{ color: "var(--primary)" }}>
              YOUR ACCOUNT
            </h1>
            <p className="font-body text-xs tracking-wider" style={{ color: "var(--muted)" }}>
              {user.email}
            </p>
          </div>
          <AccountSignOut />
        </div>

        <section>
          <h2 className="font-heading text-sm tracking-[0.2em] mb-4 uppercase pb-2" style={{ color: "var(--primary)", opacity: 0.9, borderBottom: "1px solid var(--border)" }}>
            Order History
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-sm" style={{ color: "var(--muted)" }}>No orders yet.</p>
              <Link href="/shop" className="font-body text-xs hover:underline mt-3 inline-block tracking-wider" style={{ color: "var(--primary)" }}>
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4"
                  style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="font-body text-xs mb-1" style={{ color: "var(--muted)" }}>
                        {formatDate(order.created_at)}
                      </p>
                      <p className="font-body text-xs font-mono truncate max-w-[180px]" style={{ color: "var(--primary)", opacity: 0.8 }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-sm" style={{ color: "var(--text)" }}>
                        {formatPrice(order.total_amount_cents ?? 0, order.currency ?? "ZAR")}
                      </p>
                      <OrderStatusBadge status={order.payment_status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
