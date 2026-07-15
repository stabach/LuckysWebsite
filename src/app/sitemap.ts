import type { MetadataRoute } from "next";
import { activeProducts } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

const publicRoutes = [
  "",
  "/shop",
  "/collections/acrylic-cases",
  "/collections/slab-protection",
  "/collections/toploader-binders",
  "/collections/protect-sealed-product",
  "/collections/protect-graded-cards",
  "/find-your-fit",
  "/events",
  "/reviews",
  "/about",
  "/contact",
  "/faq",
  "/pickup-and-returns",
  "/privacy",
  "/terms",
  "/accessibility"
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...publicRoutes.map((route) => ({
      url: absoluteUrl(route || "/"),
      changeFrequency: route === "" || route === "/shop" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.7
    })),
    ...activeProducts.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
