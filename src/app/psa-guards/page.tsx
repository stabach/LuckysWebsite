import type { Metadata } from "next";
import { ProductCategoryPage } from "@/components/product-category-page";

export const metadata: Metadata = {
  title: "PSA Guards",
  description: "Lucky's Loot PSA slab guards with selectable colorways and automatic bulk cart discounts."
};

export default function PsaGuardsPage() {
  return <ProductCategoryPage categoryId="psa-guards" />;
}
