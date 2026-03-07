import { BRAND_SLUGS, BRAND_THEME_MAP } from "@/components/theme/themes";
import BrandPage from "@/components/BrandPage";
import type { Metadata } from "next";
import { THEMES } from "@/components/theme/themes";
import { getProductsByBrand } from "@/lib/data/products";

// ISR: revalidate every 60s so DB changes propagate within 1 minute
export const revalidate = 60;

interface Props {
  params: Promise<{ brand: string }>;
}

export function generateStaticParams() {
  return BRAND_SLUGS.map((brand) => ({ brand }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const themeId = BRAND_THEME_MAP[brand] ?? "dexarium";
  const theme = THEMES[themeId];
  return {
    title: `${theme.label} — The Dexarium`,
    description: `${theme.tagline}. Shop ${theme.label} 3D prints at The Dexarium — South African premium resin & FDM.`,
  };
}

export default async function BrandRoute({ params }: Props) {
  const { brand } = await params;
  const themeId = BRAND_THEME_MAP[brand] ?? "dexarium";
  const products = await getProductsByBrand(brand);

  return <BrandPage themeId={themeId} brandSlug={brand} products={products} />;
}
