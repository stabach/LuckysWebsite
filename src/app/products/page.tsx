import type { Metadata } from "next";
import { ProductsPage } from "@/components/products-page";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Shop Lucky's Loot acrylic cases, PSA guards, binders, graded card accessories, and sealed product display supplies."
};

export default function ProductsRoute() {
  return <ProductsPage />;
}
