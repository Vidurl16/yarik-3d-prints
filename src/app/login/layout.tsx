import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — The Dexarium",
  description: "Sign in or create an account to track your orders and save your cart.",
  robots: { index: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
