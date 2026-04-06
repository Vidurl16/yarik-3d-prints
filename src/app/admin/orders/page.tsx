"use client";

import { useState, useEffect } from "react";
import type { DbOrder } from "@/lib/data/types";

const DEFAULT_DATE_RANGE = getDefaultDateRange();

const FULFILLMENT_STATUSES = ["pending", "processing", "dispatched", "fulfilled", "cancelled"];
const FILTER_STATUSES = ["", "pending", "paid", "processing", "dispatched", "fulfilled", "failed", "refunded", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  paid:        "bg-green-900/30 text-green-400 border border-green-800/40",
  fulfilled:   "bg-green-900/30 text-green-400 border border-green-800/40",
  dispatched:  "bg-blue-900/30 text-blue-400 border border-blue-800/40",
  processing:  "bg-blue-900/30 text-blue-300 border border-blue-800/40",
  pending:     "bg-yellow-900/30 text-yellow-400 border border-yellow-800/40",
  failed:      "bg-red-900/30 text-red-400 border border-red-800/40",
  refunded:    "bg-red-900/30 text-red-300 border border-red-800/40",
  cancelled:   "bg-red-900/30 text-red-300 border border-red-800/40",
};

function formatPrice(cents: number, currency = "ZAR") {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(cents / 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function getDefaultDateRange() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  return { today: today.toISOString().slice(0, 10), thirtyDaysAgo: thirtyDaysAgo.toISOString().slice(0, 10) };
}

function ShippingDetail({ metadata }: { metadata: Record<string, unknown> | null }) {
  const s = metadata?.shipping_address as Record<string, string> | undefined;
  if (!s) return <span className="text-[rgba(240,232,216,0.3)]">No shipping address</span>;
  return (
    <span>
      {s.name} — {s.line1}{s.line2 ? `, ${s.line2}` : ""}, {s.city}, {s.province} {s.postal_code}, {s.country}
    </span>
  );
}

function OrderRow({ order, onUpdated }: { order: DbOrder; onUpdated: (id: string, changes: Partial<DbOrder>) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localStatus, setLocalStatus] = useState(order.status ?? "pending");
  const [localPaymentStatus, setLocalPaymentStatus] = useState(order.payment_status ?? "pending");
  const [saved, setSaved] = useState(false);

  async function patchOrder(body: Record<string, string>) {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      const { order: updated } = await res.json();
      setSaved(true);
      onUpdated(order.id, updated);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function updateStatus(newStatus: string) {
    setLocalStatus(newStatus);
    await patchOrder({ status: newStatus });
  }

  async function markAsPaid() {
    setLocalPaymentStatus("paid");
    await patchOrder({ payment_status: "paid" });
  }

  const meta = order.payment_metadata as Record<string, unknown> | null;

  return (
    <>
      <tr
        className="border-b border-[rgba(196,160,69,0.06)] hover:bg-[rgba(196,160,69,0.02)] cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        <td className="py-3 pr-3 font-body text-xs text-[rgba(240,232,216,0.5)] whitespace-nowrap">
          <span className="mr-1 text-[rgba(196,160,69,0.4)]">{expanded ? "▼" : "▶"}</span>
          {formatDate(order.created_at)}
        </td>
        <td className="py-3 pr-3 font-mono text-xs text-[rgba(196,160,69,0.7)]">
          #{order.id.slice(0, 8).toUpperCase()}
        </td>
        <td className="py-3 pr-3 font-body text-xs text-[rgba(240,232,216,0.7)]">
          {order.email ?? "—"}
        </td>
        <td className="py-3 pr-3 font-body text-xs text-[#f0e8d8]">
          {formatPrice(order.total_amount_cents ?? 0, order.currency ?? "ZAR")}
        </td>
        <td className="py-3 pr-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-body text-xs px-2 py-0.5 ${STATUS_COLORS[localPaymentStatus] ?? STATUS_COLORS.pending}`}>
              {localPaymentStatus.toUpperCase()}
            </span>
            {localPaymentStatus === "pending" && (
              <button
                onClick={(e) => { e.stopPropagation(); markAsPaid(); }}
                disabled={saving}
                className="font-body text-xs px-2 py-0.5 bg-green-900/40 text-green-400 border border-green-800/50 hover:bg-green-900/60 disabled:opacity-50 transition-colors"
              >
                Mark Paid
              </button>
            )}
          </div>
        </td>
        <td className="py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <select
              value={localStatus}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={saving}
              className="bg-[#140e06] border border-[rgba(196,160,69,0.3)] px-2 py-1 font-body text-xs text-[#f0e8d8] focus:outline-none focus:border-[rgba(196,160,69,0.6)] disabled:opacity-50"
            >
              {FULFILLMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            {saving && <span className="font-body text-xs text-[rgba(196,160,69,0.5)]">Saving…</span>}
            {saved && <span className="font-body text-xs text-green-400">✓ Saved</span>}
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-[rgba(196,160,69,0.06)] bg-[rgba(196,160,69,0.03)]">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
              <div>
                <p className="text-[rgba(196,160,69,0.65)] uppercase tracking-[0.1em] mb-1">Shipping Address</p>
                <p className="text-[rgba(240,232,216,0.7)]"><ShippingDetail metadata={meta} /></p>
              </div>
              <div>
                <p className="text-[rgba(196,160,69,0.65)] uppercase tracking-[0.1em] mb-1">Payment</p>
                <p className="text-[rgba(240,232,216,0.7)]">
                  Provider: {order.payment_provider ?? "—"}<br />
                  Session: <span className="font-mono text-[rgba(196,160,69,0.6)]">{order.payment_session_id?.slice(0, 20)}…</span><br />
                  Paid at: {order.paid_at ? formatDate(order.paid_at) : "—"}
                </p>
              </div>
              {(() => {
                const pd = ((order as unknown as Record<string, unknown>).postnet_details as Record<string, string> | undefined);
                if (!pd) return null;
                return (
                  <div>
                    <p className="text-[rgba(196,160,69,0.65)] uppercase tracking-[0.1em] mb-1">PostNet Details</p>
                    <p className="text-[rgba(240,232,216,0.7)]">
                      Branch: {pd.branch_name}<br />Number: {pd.number}<br />Email: {pd.email}
                    </p>
                  </div>
                );
              })()}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminOrdersPage() {
  const [from, setFrom] = useState(DEFAULT_DATE_RANGE.thirtyDaysAgo);
  const [to, setTo] = useState(DEFAULT_DATE_RANGE.today);
  const [statusFilter, setStatusFilter] = useState("");
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchOrders() {
    setLoading(true);
    const params = new URLSearchParams({ from, to });
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }

  function handleUpdated(id: string, changes: Partial<DbOrder>) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, ...changes } : o));
  }

  useEffect(() => { fetchOrders(); }, []); // eslint-disable-line

  const inputClass =
    "bg-[#140e06] border border-[rgba(196,160,69,0.2)] px-3 py-2 font-body text-xs text-[#f0e8d8] focus:outline-none focus:border-[rgba(196,160,69,0.5)] transition-colors";

  return (
    <div>
      <h1 className="font-heading text-xl tracking-[0.15em] text-[#c4a045] mb-6">ORDERS</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-6 p-4 border border-[rgba(196,160,69,0.1)] bg-[#110d05]">
        <div>
          <label className="block font-body text-xs tracking-[0.1em] text-[rgba(196,160,69,0.65)] mb-1.5 uppercase">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block font-body text-xs tracking-[0.1em] text-[rgba(196,160,69,0.65)] mb-1.5 uppercase">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block font-body text-xs tracking-[0.1em] text-[rgba(196,160,69,0.65)] mb-1.5 uppercase">Payment Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
            {FILTER_STATUSES.map((s) => (
              <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}</option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="font-body text-xs tracking-[0.2em] px-5 py-2 bg-[#8b0000] hover:bg-[#b50000] text-[#f0e8d8] transition-colors disabled:opacity-50"
        >
          {loading ? "Loading…" : "Apply"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[rgba(196,160,69,0.15)]">
              {["Date", "Order ID", "Email", "Total", "Payment", "Fulfilment Status"].map((h) => (
                <th key={h} className="text-left font-body text-xs tracking-[0.1em] text-[rgba(196,160,69,0.65)] pb-3 pr-3 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} onUpdated={handleUpdated} />
            ))}
          </tbody>
        </table>

        {orders.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="font-body text-sm text-[rgba(240,232,216,0.3)]">No orders found.</p>
          </div>
        )}
        {loading && (
          <div className="text-center py-16">
            <p className="font-body text-sm text-[rgba(240,232,216,0.3)]">Loading orders…</p>
          </div>
        )}
      </div>

      <p className="font-body text-xs text-[rgba(240,232,216,0.45)] mt-4">
        Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
