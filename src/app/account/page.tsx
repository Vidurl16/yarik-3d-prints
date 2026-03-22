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
                      <span
                        className={`inline-block font-body text-xs tracking-wider px-2 py-0.5 mt-1 ${
                          order.payment_status === "paid"
                            ? "bg-green-900/30 text-green-400 border border-green-800/40"
                            : order.payment_status === "pending"
                            ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800/40"
                            : "bg-red-900/30 text-red-400 border border-red-800/40"
                        }`}
                      >
                        {order.payment_status.toUpperCase()}
                      </span>
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
