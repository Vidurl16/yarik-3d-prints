import { BRAND_SLUGS, BRAND_THEME_MAP, THEMES } from "@/components/theme/themes";
import { getBrandFactionById, getBrandFactions } from "@/lib/products";
import { getCatalogProductsByFactionInBrand } from "@/lib/data/products";
import FactionProductPage from "@/components/FactionProductPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface Props {
  params: Promise<{ brand: string; faction: string }>;
}

export function generateStaticParams() {
  const params: { brand: string; faction: string }[] = [];
  for (const brand of BRAND_SLUGS) {
    const factions = getBrandFactions(brand as Parameters<typeof getBrandFactions>[0]);
    for (const f of factions) {
      params.push({ brand, faction: f.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, faction: factionId } = await params;
  const faction = getBrandFactionById(brand as Parameters<typeof getBrandFactionById>[0], factionId);
  if (!faction) return {};
  const themeId = BRAND_THEME_MAP[brand] ?? "dexarium";
  const theme = THEMES[themeId];
  return {
    title: `${faction.name} — ${theme.label} | The Dexarium`,
    description: `${faction.flavorText} Shop ${faction.name} 3D prints at The Dexarium.`,
  };
}

export default async function FactionPage({ params }: Props) {
  const { brand, faction: factionId } = await params;

  const faction = getBrandFactionById(brand as Parameters<typeof getBrandFactionById>[0], factionId);
  if (!faction) notFound();

  const themeId = BRAND_THEME_MAP[brand] ?? "dexarium";
  const theme = THEMES[themeId];

  const products = await getCatalogProductsByFactionInBrand(brand, factionId);

  return (
    <FactionProductPage
      theme={theme}
      brandSlug={brand}
      faction={faction}
      products={products}
    />
  );
}
