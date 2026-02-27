import type { Metadata } from "next";
import { Cinzel_Decorative, Rajdhani } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import CartDrawer from "@/components/CartDrawer";

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
  title: "YARIK 3D Prints — Warhammer 40K Miniatures",
  description:
    "Medical-grade resin & multicolour FDM printing. Warhammer 40K miniatures, Pokémon merch, and custom projects. Built to battlefield standard.",
  keywords: ["warhammer 40k", "3d printing", "miniatures", "resin", "FDM", "South Africa"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${rajdhani.variable}`}>
      <body className="font-body bg-[#0a0a0a] text-[#e8e0d0] antialiased">
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Navigation */}
        <Nav />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
