import type { Metadata } from "next";
import { ProductCategoryPage } from "@/components/product-category-page";

export const metadata: Metadata = {
  title: "Binders",
  description: "Lucky's Loot toploader binders for protected card storage and clean set browsing."
};

export default function BindersPage() {
  return <ProductCategoryPage categoryId="binders" />;
}
