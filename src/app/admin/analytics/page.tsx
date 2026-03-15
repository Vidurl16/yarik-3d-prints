"use client";

import { useState, useEffect } from "react";

const DEFAULT_DATE_RANGE = getDefaultDateRange();

interface Analytics {
  from: string;
  to: string;
  totalRevenueCents: number;
  orderCount: number;
  aovCents: number;
  topByRevenue: { name: string; totalCents: number; totalQty: number }[];
  topByQuantity: { name: string; totalCents: number; totalQty: number }[];
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

function getDefaultDateRange() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  return {
    today: today.toISOString().slice(0, 10),
    thirtyDaysAgo: thirtyDaysAgo.toISOString().slice(0, 10),
  };
}

export default function AdminAnalyticsPage() {
  const [from, setFrom] = useState(DEFAULT_DATE_RANGE.thirtyDaysAgo);
  const [to, setTo] = useState(DEFAULT_DATE_RANGE.today);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchAnalytics() {
    setLoading(true);
    const res = await fetch(`/api/admin/analytics?from=${from}&to=${to}`);
    const result = await res.json();
    setData(result);
    setLoading(false);
  }

  useEffect(() => { fetchAnalytics(); }, []); // eslint-disable-line

  const inputClass =
    "bg-[#140e06] border border-[rgba(196,160,69,0.2)] px-3 py-2 font-body text-xs text-[#f0e8d8] focus:outline-none focus:border-[rgba(196,160,69,0.5)] transition-colors";

  return (
    <div>
      <h1 className="font-heading text-xl tracking-[0.15em] text-[#c4a045] mb-6">ANALYTICS</h1>

      {/* Date range controls */}
      <div className="flex flex-wrap items-end gap-4 mb-8 p-4 border border-[rgba(196,160,69,0.1)] bg-[#110d05]">
        <div>
          <label className="block font-body text-[10px] tracking-[0.2em] text-[rgba(196,160,69,0.4)] mb-1.5 uppercase">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block font-body text-[10px] tracking-[0.2em] text-[rgba(196,160,69,0.4)] mb-1.5 uppercase">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputClass} />
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="font-body text-xs tracking-[0.2em] px-5 py-2 bg-[#8b0000] hover:bg-[#b50000] text-[#f0e8d8] transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : "Apply"}
        </button>
      </div>

      {/* KPI Cards */}
      {data && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: formatPrice(data.totalRevenueCents) },
              { label: "Orders", value: data.orderCount.toString() },
              { label: "Avg. Order Value", value: formatPrice(data.aovCents) },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="border border-[rgba(196,160,69,0.15)] bg-[#110d05] p-5"
              >
                <p className="font-body text-[10px] tracking-[0.2em] text-[rgba(196,160,69,0.4)] uppercase mb-2">
                  {kpi.label}
                </p>
                <p className="font-heading text-xl text-[#c4a045]">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductTable title="Top by Revenue" rows={data.topByRevenue} valueKey="totalCents" formatter={formatPrice} />
            <ProductTable title="Top by Quantity" rows={data.topByQuantity} valueKey="totalQty" formatter={(v) => v.toString()} />
          </div>
        </>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="font-body text-sm text-[rgba(240,232,216,0.3)]">Loading...</p>
        </div>
      )}
    </div>
  );
}

function ProductTable({
  title,
  rows,
  valueKey,
  formatter,
}: {
  title: string;
  rows: { name: string; totalCents: number; totalQty: number }[];
  valueKey: "totalCents" | "totalQty";
  formatter: (v: number) => string;
}) {
  return (
    <div className="border border-[rgba(196,160,69,0.1)] bg-[#110d05] p-4">
      <h2 className="font-heading text-xs tracking-[0.2em] text-[rgba(196,160,69,0.6)] mb-4 uppercase">
        {title}
      </h2>
      {rows.length === 0 ? (
        <p className="font-body text-xs text-[rgba(240,232,216,0.3)]">No data</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(196,160,69,0.1)]">
              <th className="text-left font-body text-[10px] tracking-wider text-[rgba(196,160,69,0.3)] pb-2 pr-4">Product</th>
              <th className="text-right font-body text-[10px] tracking-wider text-[rgba(196,160,69,0.3)] pb-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-[rgba(196,160,69,0.05)]">
                <td className="py-2 pr-4 font-body text-xs text-[rgba(240,232,216,0.7)] truncate max-w-[200px]">
                  {row.name}
                </td>
                <td className="py-2 text-right font-body text-xs text-[#c4a045]">
                  {formatter(row[valueKey])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
