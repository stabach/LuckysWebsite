import type { Metadata } from "next";
import { ProductCategoryPage } from "@/components/product-category-page";

export const metadata: Metadata = {
  title: "Sealed Product",
  description: "Lucky's Loot acrylic protection for sealed Pokemon ETBs, booster boxes, and booster bundles."
};

export default function SealedProductPage() {
  return <ProductCategoryPage categoryId="sealed-product" />;
}
