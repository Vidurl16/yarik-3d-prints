import type { Metadata } from "next";
import { Cinzel_Decorative, Rajdhani } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import CartDrawer from "@/components/CartDrawer";
import CartSyncProvider from "@/components/CartSyncProvider";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

const cinzel = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Dexarium — From Spark to Legend",
  description:
    "South African 3D prints: unique Pokémon merchandise, Warhammer minis, basing & terrain. Medical-grade resin & multicolour FDM. Custom orders welcome.",
  keywords: ["pokemon merchandise", "3d printing", "miniatures", "resin", "FDM", "South Africa", "warhammer", "custom prints"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${rajdhani.variable}`}>
      <body
        data-theme="dexarium"
        className="font-body antialiased"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Navigation */}
        <Nav />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* Cart ↔ Supabase sync (auth-triggered merge + ongoing debounce save) */}
        <CartSyncProvider />

        {/* Page Content */}
        <main>{children}</main>

        <Analytics />

        {/* Footer */}
        <footer
          className="mt-auto py-10 px-4"
          style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-heading text-xs tracking-[0.2em]" style={{ color: "var(--primary)" }}>
              THE DEXARIUM
            </p>
            <nav aria-label="Footer navigation" className="flex items-center gap-6">
              {[
                { href: "/shop", label: "Shop" },
                { href: "/preorders", label: "Preorders" },
                { href: "/contact", label: "Contact" },
                { href: "/terms", label: "Terms" },
                { href: "/privacy", label: "Privacy" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-body text-xs tracking-[0.1em] transition-colors hover:opacity-100"
                  style={{ color: "var(--muted)" }}
                >
                  {label.toUpperCase()}
                </Link>
              ))}
            </nav>
            <p className="font-body text-xs" style={{ color: "var(--muted)" }}>
              © {new Date().getFullYear()} The Dexarium
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
