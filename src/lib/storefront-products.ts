import { categories } from "@/data/categories";
import { activeProducts, formatCurrency, getPrimaryImage, getVariantById } from "@/lib/catalog";
import { getGuardUnitPriceCents, getUnitPriceCents } from "@/lib/pricing";

export type ProductFilterId =
  | "acrylic-cases"
  | "psa-guards"
  | "binders"
  | "graded-cards"
  | "sealed-product";

export type StorefrontCartVariant = (typeof storefrontVariants)[number];

export const storefrontVariants = activeProducts.flatMap((product) => {
  const primaryImage = getPrimaryImage(product);
  const imageMedia = product.images.filter((media) => media.type === "image");

  return product.variants.map((variant) => ({
    id: variant.id,
    productId: product.id,
    productSlug: product.slug,
    label:
      product.id === "psa-guards"
        ? `${variant.label} PSA Guard`
        : product.variants.filter((candidate) => candidate.active).length > 1
          ? `${product.name} — ${variant.label}`
          : product.name,
    shortLabel: product.id === "psa-guards" ? variant.label : product.shortName,
    description: product.summary,
    priceCents: variant.priceCents ?? product.priceCents,
    maxQuantity: product.maxPerOrder,
    familyId: product.id,
    familyName: product.name,
    image: variant.image ?? primaryImage.src,
    images: imageMedia.map((media) => ({ src: media.src, alt: media.alt })),
    colorName: variant.color,
    packSize: product.id === "psa-guards" ? 1 : undefined,
    filters: getCompatibilityFilters(product.id, product.categoryId, product.collectionIds),
    familyDetails: product.features.filter((feature) => feature.verified).map((feature) => feature.title),
    familyNote: product.fitmentWarnings?.[0] ?? "",
    familyColorOptions:
      product.id === "psa-guards"
        ? product.variants.map((candidate) => ({
            name: candidate.label,
            src: candidate.image ?? primaryImage.src
          }))
        : undefined,
    familyBulkDiscounts: product.bulkPricing?.map(
      (tier) => `${tier.label}: ${formatCurrency(tier.unitPriceCents)} each`
    ),
    active: variant.active,
    status: variant.status
  }));
});

export type StorefrontCategoryId = "acrylic-cases" | "psa-guards" | "binders" | "sealed-product";

export const storefrontCategories = [
  {
    id: "acrylic-cases" as const,
    label: "Acrylic Cases",
    title: "Acrylic Cases",
    description: categories.find((category) => category.id === "acrylic-cases")?.description ?? "",
    standaloneHref: "/collections/acrylic-cases",
    overviewHref: "/shop?type=acrylic-cases"
  },
  {
    id: "psa-guards" as const,
    label: "PSA Guards",
    title: "PSA Guards",
    description: categories.find((category) => category.id === "slab-protection")?.description ?? "",
    standaloneHref: "/collections/slab-protection",
    overviewHref: "/shop?type=slab-protection"
  },
  {
    id: "binders" as const,
    label: "Binders",
    title: "Toploader Binders",
    description: categories.find((category) => category.id === "toploader-binders")?.description ?? "",
    standaloneHref: "/collections/toploader-binders",
    overviewHref: "/shop?type=toploader-binders"
  },
  {
    id: "sealed-product" as const,
    label: "Sealed Product",
    title: "Protect Sealed Product",
    description: "Acrylic cases for standard sealed-product formats.",
    standaloneHref: "/collections/protect-sealed-product",
    overviewHref: "/shop?protects=sealed-product"
  }
];

export function getDisplayStorefrontVariants() {
  return storefrontVariants.filter(
    (variant) =>
      variant.active &&
      (variant.familyId !== "psa-guards" || variant.colorName === "Arctic")
  );
}

export function getStorefrontCategory(categoryId: StorefrontCategoryId) {
  return storefrontCategories.find((category) => category.id === categoryId);
}

export function getStorefrontCategoryProducts(categoryId: StorefrontCategoryId) {
  const products = getDisplayStorefrontVariants();

  switch (categoryId) {
    case "acrylic-cases":
      return products.filter((product) => product.filters.includes("acrylic-cases"));
    case "psa-guards":
      return products.filter((product) => product.filters.includes("psa-guards"));
    case "binders":
      return products.filter((product) => product.filters.includes("binders"));
    case "sealed-product":
      return products.filter((product) => product.filters.includes("sealed-product"));
  }
}

export function isPsaGuardVariant(
  variant: Pick<StorefrontCartVariant, "familyId" | "packSize">
) {
  return variant.familyId === "psa-guards" && variant.packSize === 1;
}

export function getPsaGuardUnitPriceCents(totalGuardQuantity: number) {
  return getGuardUnitPriceCents(totalGuardQuantity);
}

export function getStorefrontCartUnitPriceCents(
  variant: StorefrontCartVariant,
  totalGuardQuantity: number
) {
  const resolved = getVariantById(variant.id);
  if (!resolved) {
    throw new Error(`Unknown product variant ${variant.id}.`);
  }

  return getUnitPriceCents(resolved.product, resolved.variant, totalGuardQuantity);
}

export function getStorefrontVariant(variantId: string) {
  return storefrontVariants.find((variant) => variant.id === variantId);
}

export function formatStorefrontCurrency(cents: number) {
  return formatCurrency(cents);
}

function getCompatibilityFilters(
  productId: string,
  categoryId: string,
  collectionIds: ReadonlyArray<string>
): ProductFilterId[] {
  const filters = new Set<ProductFilterId>();

  if (categoryId === "acrylic-cases") filters.add("acrylic-cases");
  if (categoryId === "toploader-binders") filters.add("binders");
  if (productId === "psa-guards") filters.add("psa-guards");
  if (collectionIds.includes("protect-graded-cards")) filters.add("graded-cards");
  if (collectionIds.includes("protect-sealed-product")) filters.add("sealed-product");

  return Array.from(filters);
}
