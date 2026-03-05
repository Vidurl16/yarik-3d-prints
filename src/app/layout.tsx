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
      <body data-theme="dexarium" className="font-body bg-[#0c0902] text-[#f0e8d8] antialiased">
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
