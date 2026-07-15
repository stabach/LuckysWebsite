import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { activeProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop Collector Supplies",
  description: "Shop Lucky’s Loot acrylic cases, PSA Guards, and Toploader binders.",
  alternates: { canonical: "/shop" }
};

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; fit?: string }>;
}) {
  const { q, fit } = await searchParams;

  return (
    <CatalogPage
      title="Shop All"
      description="One clean catalog for acrylic display cases, colorful slab protection, and Toploader binder storage."
      products={activeProducts}
      initialQuery={q}
      initialFit={fit}
    />
  );
}
