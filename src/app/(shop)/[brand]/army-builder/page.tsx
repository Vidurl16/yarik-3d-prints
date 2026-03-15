import { ARMY_BUILDER_BRANDS, BRAND_THEME_MAP, THEMES } from "@/components/theme/themes";
import { products } from "@/lib/products";
import ArmyBuilderClient from "@/components/ArmyBuilderClient";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

  // Filter main products for this brand
  const siteCategory = brand;
  const mainProducts = products.filter((p) => p.siteCategory === siteCategory);

  // Pick brand-appropriate basing upsell (urban rubble for grimdark, dead forest for fantasy)
  const basingSuggestionId =
    brand === "grimdark-future" ? "bas-1" : "bas-4";
  const basingSuggestion = products.find((p) => p.id === basingSuggestionId)!;
  const battleEffectsSuggestion = products.find((p) => p.id === "bas-6")!;

  return (
    <ArmyBuilderClient
      theme={theme}
      mainProducts={mainProducts}
      basingSuggestion={basingSuggestion}
      battleEffectsSuggestion={battleEffectsSuggestion}
    />
  );
}
