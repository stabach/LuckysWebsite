import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import {
  activeProducts,
  getDefaultVariant,
  getPrimaryImage,
  getProductById,
  getProductBySlug
} from "@/lib/catalog";
import { calculateCartPricing } from "@/lib/pricing";

describe("canonical catalog", () => {
  it("has unique product IDs and slugs", () => {
    expect(new Set(activeProducts.map((product) => product.id)).size).toBe(activeProducts.length);
    expect(new Set(activeProducts.map((product) => product.slug)).size).toBe(activeProducts.length);
  });

  it("has unique variant IDs", () => {
    const variantIds = activeProducts.flatMap((product) =>
      product.variants.map((variant) => variant.id)
    );
    expect(new Set(variantIds).size).toBe(variantIds.length);
  });

  it("gives every active product an image, price, and valid category", () => {
    const categoryIds = new Set(categories.map((category) => category.id));

    for (const product of activeProducts) {
      const image = getPrimaryImage(product);
      expect(product.priceCents).toBeGreaterThan(0);
      expect(categoryIds.has(product.categoryId)).toBe(true);
      expect(image.src).toMatch(/^\//);
      expect(existsSync(`public${image.src}`)).toBe(true);
    }
  });

  it("does not use unverified compare-at prices", () => {
    expect(activeProducts.every((product) => product.compareAtPriceCents === undefined)).toBe(true);
  });

  it("does not reference missing related products", () => {
    for (const product of activeProducts) {
      for (const relatedProductId of product.relatedProductIds) {
        expect(getProductById(relatedProductId)).toBeDefined();
      }
    }
  });

  it("uses the same canonical price on product pages and checkout", () => {
    for (const product of activeProducts) {
      const variant = getDefaultVariant(product);
      expect(variant).toBeDefined();
      const pricing = calculateCartPricing([{ variantId: variant!.id, quantity: 1 }]);
      expect(pricing.lines[0]?.unitPriceCents).toBe(product.priceCents);
      expect(getProductBySlug(product.slug)?.priceCents).toBe(pricing.lines[0]?.unitPriceCents);
    }
  });
});
