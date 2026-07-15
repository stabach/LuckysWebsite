import type { Product, ProductVariant } from "@/lib/catalog-schema";

export function isVariantPurchasable(product: Product, variant: ProductVariant) {
  return (
    product.status === "active" &&
    variant.active &&
    product.stockStatus !== "out_of_stock" &&
    variant.status !== "out_of_stock" &&
    (variant.stockQuantity === null || variant.stockQuantity === undefined || variant.stockQuantity > 0)
  );
}

export function getPurchasableVariants(product: Product) {
  return product.variants.filter((variant) => isVariantPurchasable(product, variant));
}

export function getStockLabel(status: Product["stockStatus"]) {
  switch (status) {
    case "in_stock":
      return "Available for pickup";
    case "low_stock":
      return "Limited pickup availability";
    case "made_to_order":
      return "Made to order";
    case "out_of_stock":
      return "Currently unavailable";
  }
}
