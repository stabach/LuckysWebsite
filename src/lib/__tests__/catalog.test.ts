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

  it("ships the acrylic slab homepage boomerang as an autoplaying product preview", () => {
    const product = getProductById("acrylic-crystal-slab-case");
    const video = product?.images.find((media) => media.type === "video");
    expect(video?.type).toBe("video");
    if (video?.type === "video") {
      expect(video.autoplayPreview).toBe(true);
      expect(video.mp4).toBe("/media/homepage-acrylic-boomerang.mp4");
      expect(existsSync(`public${video.poster}`)).toBe(true);
      expect(existsSync(`public${video.mp4}`)).toBe(true);
    }
  });

  it("offers the verified binder color sets with matching artwork", () => {
    const fourPocket = getProductById("toploader-binder-4-pocket");
    const ninePocket = getProductById("toploader-binder-9-pocket");

    expect(fourPocket?.variants.map((variant) => variant.label)).toEqual([
      "Black",
      "Pink",
      "Red",
      "Aqua",
      "Purple",
      "Yellow",
      "Lime Green"
    ]);
    expect(ninePocket?.variants.map((variant) => variant.label)).toEqual([
      "Black",
      "Pink",
      "Red",
      "Aqua",
      "Purple",
      "Yellow"
    ]);
    expect(fourPocket && getPrimaryImage(fourPocket).src).toBe(
      "/products/binders/4-pocket-cutout.png"
    );
    expect(ninePocket && getPrimaryImage(ninePocket).src).toBe(
      "/products/binders/9-pocket-cutout.png"
    );

    for (const variant of [...(fourPocket?.variants ?? []), ...(ninePocket?.variants ?? [])]) {
      expect(variant.active).toBe(true);
      expect(variant.status).toBe("in_stock");
      expect(variant.image).toMatch(/^\/products\/binders\/[49]-pocket\/.+\.webp$/);
      expect(existsSync(`public${variant.image}`)).toBe(true);
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
