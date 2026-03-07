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

export default async function AccountPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/account");

  const orders = await getOrdersByUser(user.id);

  return (
    <div className="min-h-screen bg-[#0c0902] pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="font-heading text-2xl tracking-[0.15em] text-[#c4a045] mb-1">
              YOUR ACCOUNT
            </h1>
            <p className="font-body text-xs text-[rgba(240,232,216,0.4)] tracking-wider">
              {user.email}
            </p>
          </div>
          <AccountSignOut />
        </div>

        <section>
          <h2 className="font-heading text-sm tracking-[0.2em] text-[rgba(196,160,69,0.6)] mb-4 uppercase border-b border-[rgba(196,160,69,0.1)] pb-2">
            Order History
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-sm text-[rgba(240,232,216,0.3)]">No orders yet.</p>
              <Link href="/shop" className="font-body text-xs text-[#c4a045] hover:underline mt-3 inline-block tracking-wider">
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-[rgba(196,160,69,0.1)] p-4 bg-[#110d05]"
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="font-body text-xs text-[rgba(240,232,216,0.5)] mb-1">
                        {formatDate(order.created_at)}
                      </p>
                      <p className="font-body text-xs font-mono text-[rgba(196,160,69,0.4)] truncate max-w-[180px]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-sm text-[#f0e8d8]">
                        {formatPrice(order.total_amount_cents ?? 0, order.currency ?? "ZAR")}
                      </p>
                      <span
                        className={`inline-block font-body text-[10px] tracking-wider px-2 py-0.5 mt-1 ${
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
