import { ARMY_BUILDER_BRANDS, BRAND_THEME_MAP, THEMES } from "@/components/theme/themes";
import ArmyBuilderClient from "@/components/ArmyBuilderClient";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalogProductsByBrand } from "@/lib/data/products";

interface Props {
  params: Promise<{ brand: string }>;
}

export function generateStaticParams() {
  return ARMY_BUILDER_BRANDS.map((brand) => ({ brand }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const themeId = BRAND_THEME_MAP[brand] ?? "dexarium";
  const theme = THEMES[themeId];
  return {
    title: `Army Builder — ${theme.label} | The Dexarium`,
    description: `Build your ${theme.label} army. Select units by role, add basing & battle effects upsells.`,
  };
}

export default async function ArmyBuilderPage({ params }: Props) {
  const { brand } = await params;
  if (!ARMY_BUILDER_BRANDS.includes(brand as (typeof ARMY_BUILDER_BRANDS)[number])) {
    notFound();
  }
  const themeId = BRAND_THEME_MAP[brand] ?? "dexarium";
  const theme = THEMES[themeId];

  const [mainProducts, basingProducts] = await Promise.all([
    getCatalogProductsByBrand(brand),
    getCatalogProductsByBrand("basing-battle-effects"),
  ]);

  const basingSuggestion =
    basingProducts.find((product) =>
      brand === "grimdark-future"
        ? product.tags?.includes("urban")
        : product.tags?.includes("nature")
    ) ?? basingProducts[0];
  const battleEffectsSuggestion =
    basingProducts.find((product) => product.tags?.includes("explosion")) ??
    basingProducts.find((p) => p.id !== basingSuggestion?.id) ??
    basingProducts[0];

  if (!basingSuggestion || !battleEffectsSuggestion) {
    notFound();
  }

  return (
    <ArmyBuilderClient
      brand={brand}
      theme={theme}
      mainProducts={mainProducts}
      basingSuggestion={basingSuggestion}
      battleEffectsSuggestion={battleEffectsSuggestion}
    />
  );
}
