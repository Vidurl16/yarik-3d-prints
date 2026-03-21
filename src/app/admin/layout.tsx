import { getSession } from "@/lib/auth/getSession";
import { isAdmin } from "@/lib/auth/isAdmin";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSignOut from "./AdminSignOut";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();

  if (!user || !isAdmin(user.email)) {
    redirect("/login?next=/admin");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/analytics", label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-[#0c0902] pt-16">
      {/* Admin nav */}
      <div className="bg-[#110d05] border-b border-[rgba(196,160,69,0.1)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-body text-xs text-[rgba(196,160,69,0.7)] tracking-wider">
              ADMIN
            </span>
            <div className="flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-body text-xs tracking-wider text-[rgba(240,232,216,0.6)] hover:text-[#c4a045] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-body text-xs text-[rgba(240,232,216,0.55)]">{user.email}</span>
            <AdminSignOut />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
