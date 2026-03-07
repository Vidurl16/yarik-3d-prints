"use client";

import { useState, useEffect } from "react";
import type { DbOrder } from "@/lib/data/types";

function formatPrice(cents: number, currency = "ZAR") {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(cents / 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

const STATUS_OPTIONS = ["", "pending", "paid", "failed", "refunded"];

export default function AdminOrdersPage() {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const [from, setFrom] = useState(thirtyDaysAgo);
  const [to, setTo] = useState(today);
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchOrders() {
    setLoading(true);
    const params = new URLSearchParams({ from, to });
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
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
          <label className="block font-body text-[10px] tracking-[0.2em] text-[rgba(196,160,69,0.4)] mb-1.5 uppercase">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block font-body text-[10px] tracking-[0.2em] text-[rgba(196,160,69,0.4)] mb-1.5 uppercase">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block font-body text-[10px] tracking-[0.2em] text-[rgba(196,160,69,0.4)] mb-1.5 uppercase">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s || "All"}</option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="font-body text-xs tracking-[0.2em] px-5 py-2 bg-[#8b0000] hover:bg-[#b50000] text-[#f0e8d8] transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : "Apply"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[rgba(196,160,69,0.15)]">
              {["Date", "Order ID", "Email", "Provider", "Total", "Status"].map((h) => (
                <th key={h} className="text-left font-body text-[10px] tracking-[0.2em] text-[rgba(196,160,69,0.4)] pb-3 pr-4 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[rgba(196,160,69,0.06)] hover:bg-[rgba(196,160,69,0.02)]">
                <td className="py-3 pr-4 font-body text-xs text-[rgba(240,232,216,0.5)] whitespace-nowrap">
                  {formatDate(order.created_at)}
                </td>
                <td className="py-3 pr-4 font-mono text-[10px] text-[rgba(196,160,69,0.4)]">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="py-3 pr-4 font-body text-xs text-[rgba(240,232,216,0.7)]">
                  {order.email ?? "—"}
                </td>
                <td className="py-3 pr-4 font-body text-[10px] text-[rgba(240,232,216,0.4)]">
                  {order.payment_provider ?? "—"}
                </td>
                <td className="py-3 pr-4 font-body text-xs text-[#f0e8d8]">
                  {formatPrice(order.total_amount_cents ?? 0, order.currency ?? "ZAR")}
                </td>
                <td className="py-3">
                  <span className={`font-body text-[10px] px-2 py-0.5 ${
                    order.payment_status === "paid"
                      ? "bg-green-900/30 text-green-400 border border-green-800/40"
                      : order.payment_status === "pending"
                      ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800/40"
                      : "bg-red-900/30 text-red-400 border border-red-800/40"
                  }`}>
                    {order.payment_status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="font-body text-sm text-[rgba(240,232,216,0.3)]">No orders found.</p>
          </div>
        )}
      </div>

      <p className="font-body text-[10px] text-[rgba(240,232,216,0.2)] mt-4">
        Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
