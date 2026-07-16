import { describe, expect, it } from "vitest";
import {
  createTypedSealedProduct,
  findSealedProductFit,
  searchSealedProducts,
  sealedCatalogSummary
} from "@/lib/sealed-product-search";

describe("sealed product search", () => {
  it("indexes a broad English and Japanese sealed catalog", () => {
    expect(sealedCatalogSummary.productCount).toBeGreaterThan(3000);
    expect(sealedCatalogSummary.languages).toEqual(["English", "Japanese"]);
  });

  it("finds products by expansion name while the customer types", () => {
    const results = searchSealedProducts("Surging Sparks", 12);
    expect(results.some((product) => /Surging Sparks/i.test(`${product.name} ${product.set}`))).toBe(true);
  });

  it("understands the ETB abbreviation", () => {
    const results = searchSealedProducts("etb", 8);
    expect(results).toHaveLength(8);
    expect(results.every((product) => product.type === "etb")).toBe(true);
  });

  it("recommends the ETB acrylic for a standard ETB", () => {
    const product = createTypedSealedProduct("Surging Sparks ETB");
    expect(product).not.toBeNull();
    const result = findSealedProductFit(product!);
    expect(result.confidence).toBe("exact");
    expect(result.product?.id).toBe("acrylic-etb-case");
  });

  it("marks Pokémon Center ETBs as measure-first", () => {
    const product = createTypedSealedProduct("Prismatic Evolutions Pokemon Center ETB");
    const result = findSealedProductFit(product!);
    expect(result.confidence).toBe("measure-first");
  });

  it("does not force unsupported tins into an acrylic case", () => {
    const product = createTypedSealedProduct("151 Mini Tin");
    const result = findSealedProductFit(product!);
    expect(result.confidence).toBe("unsupported");
    expect(result.product).toBeNull();
  });
});
