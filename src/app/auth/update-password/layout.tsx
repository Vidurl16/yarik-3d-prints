import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Password — The Dexarium",
  robots: { index: false },
};

export default function UpdatePasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
