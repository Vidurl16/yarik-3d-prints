import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { resolveTheme } from "@/components/theme/themes";

interface BrandLayoutProps {
  children: React.ReactNode;
  params: Promise<{ brand: string }>;
}

export default async function BrandLayout({ children, params }: BrandLayoutProps) {
  const { brand } = await params;
  const themeId = resolveTheme(brand);

  return (
    <ThemeProvider themeId={themeId}>
      <div
        data-theme={themeId}
        style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}
      >
        {children}
      </div>
    </ThemeProvider>
  );
}
