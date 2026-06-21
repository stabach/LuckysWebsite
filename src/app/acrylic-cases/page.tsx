import type { Metadata } from "next";
import { ProductCategoryPage } from "@/components/product-category-page";

export const metadata: Metadata = {
  title: "Acrylic Cases",
  description: "Lucky's Loot acrylic display cases for sealed Pokemon product and collector shelves."
};

export default function AcrylicCasesPage() {
  return <ProductCategoryPage categoryId="acrylic-cases" />;
}
