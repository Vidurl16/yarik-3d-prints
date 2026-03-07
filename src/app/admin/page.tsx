import Link from "next/link";

export default function AdminDashboard() {
  const tiles = [
    { href: "/admin/products", label: "Products", desc: "Create, edit, deactivate listings" },
    { href: "/admin/orders", label: "Orders", desc: "View and filter customer orders" },
    { href: "/admin/analytics", label: "Analytics", desc: "Revenue, AOV, top products" },
  ];

  return (
    <div>
      <h1 className="font-heading text-xl tracking-[0.15em] text-[#c4a045] mb-8">
        ADMIN DASHBOARD
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="block border border-[rgba(196,160,69,0.15)] bg-[#110d05] p-6 hover:border-[rgba(196,160,69,0.4)] transition-colors group"
          >
            <h2 className="font-heading text-sm tracking-widest text-[#c4a045] group-hover:text-[#ddb95a] transition-colors mb-2">
              {tile.label}
            </h2>
            <p className="font-body text-xs text-[rgba(240,232,216,0.4)]">{tile.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
