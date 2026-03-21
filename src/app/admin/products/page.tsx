import { getServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import AdminProductActions from "./AdminProductActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = getServiceClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl tracking-[0.15em] text-[#c4a045]">PRODUCTS</h1>
        <Link
          href="/admin/products/new"
          className="font-body text-xs tracking-[0.2em] px-5 py-2.5 bg-[#8b0000] hover:bg-[#b50000] text-[#f0e8d8] transition-colors"
        >
          + NEW PRODUCT
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[rgba(196,160,69,0.15)]">
              {["Name", "Brand", "Faction / Role", "Price", "Status", "Tags", "Actions"].map((h) => (
                <th key={h} className="text-left font-body text-xs tracking-[0.1em] text-[rgba(196,160,69,0.65)] pb-3 pr-4 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product) => (
              <tr key={product.id} className="border-b border-[rgba(196,160,69,0.06)] hover:bg-[rgba(196,160,69,0.03)]">
                <td className="py-3 pr-4">
                  <div>
                    <p className="font-body text-sm text-[#f0e8d8]">{product.name}</p>
                    <p className="font-body text-xs text-[rgba(240,232,216,0.55)]">{product.slug}</p>
                  </div>
                </td>
                <td className="py-3 pr-4 font-body text-xs text-[rgba(240,232,216,0.5)]">
                  {product.brand}
                </td>
                <td className="py-3 pr-4 font-body text-xs text-[rgba(240,232,216,0.65)]">
                  {[product.faction, product.role].filter(Boolean).join(" / ") || "—"}
                </td>
                <td className="py-3 pr-4 font-body text-xs text-[rgba(240,232,216,0.7)]">
                  R{(product.price_cents / 100).toFixed(2)}
                </td>
                <td className="py-3 pr-4">
                  <span className={`font-body text-xs px-2 py-0.5 ${
                    product.is_active
                      ? "bg-green-900/30 text-green-400 border border-green-800/40"
                      : "bg-red-900/30 text-red-400 border border-red-800/40"
                  }`}>
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 pr-4 font-body text-xs text-[rgba(240,232,216,0.55)] max-w-[120px] truncate">
                  {(product.tags ?? []).join(", ")}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="font-body text-xs tracking-wider text-[#c4a045] hover:underline"
                    >
                      Edit
                    </Link>
                    <AdminProductActions productId={product.id} isActive={product.is_active} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!products || products.length === 0) && (
          <div className="text-center py-16">
            <p className="font-body text-sm text-[rgba(240,232,216,0.3)]">No products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
