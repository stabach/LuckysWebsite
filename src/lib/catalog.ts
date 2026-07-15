import { catalog } from "@/data/catalog";
import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import type { Product, ProductMedia, ProductVariant } from "@/lib/catalog-schema";

export const products = catalog;
export const activeProducts = catalog
  .filter((product) => product.status === "active")
  .sort((left, right) => left.sortOrder - right.sortOrder);

export function getProductById(id: string) {
  return catalog.find((product) => product.id === id);
}

export function getProductBySlug(slug: string) {
  return catalog.find((product) => product.slug === slug);
}

export function getProductsByCategory(categoryId: string) {
  return activeProducts.filter((product) => product.categoryId === categoryId);
}

export function getProductsByCollection(collectionId: string) {
  return activeProducts.filter((product) => product.collectionIds.includes(collectionId));
}

export function getCategoryById(categoryId: string) {
  return categories.find((category) => category.id === categoryId);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getCollectionById(collectionId: string) {
  return collections.find((collection) => collection.id === collectionId);
}

export function getCollectionBySlug(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getVariantById(variantId: string):
  | { product: Product; variant: ProductVariant }
  | undefined {
  for (const product of catalog) {
    const variant = product.variants.find((candidate) => candidate.id === variantId);
    if (variant) {
      return { product, variant };
    }
  }

  return undefined;
}

export function getDefaultVariant(product: Product) {
  return product.variants.find((variant) => variant.active && variant.status !== "out_of_stock");
}

export function getPrimaryImage(product: Product): Extract<ProductMedia, { type: "image" }> {
  const image = product.images.find(
    (media): media is Extract<ProductMedia, { type: "image" }> => media.type === "image"
  );

  if (!image) {
    throw new Error(`Product ${product.id} has no image media.`);
  }

  return image;
}

export function getVerifiedSpecifications(product: Product) {
  return product.specifications.filter((specification) => specification.verified);
}

export function getVerifiedFeatures(product: Product) {
  return product.features.filter((feature) => feature.verified);
}

export function getRelatedProducts(product: Product) {
  const relatedIds = new Set(product.relatedProductIds);
  return activeProducts.filter((candidate) => relatedIds.has(candidate.id));
}

export function searchCatalog(query: string) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) {
    return [];
  }

  return activeProducts.filter((product) => {
    const category = getCategoryById(product.categoryId);
    const haystack = [
      product.name,
      product.shortName,
      product.summary,
      category?.name ?? "",
      ...product.fitment,
      ...product.keywords,
      ...product.variants.map((variant) => variant.color ?? variant.label)
    ]
      .join(" ")
      .toLocaleLowerCase();

    return haystack.includes(normalized);
  });
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}
