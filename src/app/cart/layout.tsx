import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart — The Dexarium",
  description: "Review your items and proceed to checkout.",
  robots: { index: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
