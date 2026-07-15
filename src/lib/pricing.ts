import { guardPricingTiers } from "@/data/catalog";
import { getVariantById } from "@/lib/catalog";
import type { Product, ProductVariant } from "@/lib/catalog-schema";

export type CartLineInput = {
  variantId: string;
  quantity: number;
};

export type PricedCartLine = {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  variantName: string;
  quantity: number;
  baseUnitPriceCents: number;
  unitPriceCents: number;
  lineTotalCents: number;
  discountCents: number;
};

export type CartPricing = {
  lines: PricedCartLine[];
  itemCount: number;
  guardQuantity: number;
  baseSubtotalCents: number;
  discountCents: number;
  subtotalCents: number;
};

export function getGuardUnitPriceCents(totalGuardQuantity: number) {
  const quantity = Math.max(0, Math.floor(totalGuardQuantity));
  const eligibleTiers = guardPricingTiers.filter((tier) => quantity >= tier.minimumQuantity);
  return eligibleTiers.at(-1)?.unitPriceCents ?? guardPricingTiers[0].unitPriceCents;
}

export function getUnitPriceCents(
  product: Product,
  variant: ProductVariant,
  totalGuardQuantity: number
) {
  if (product.id === "psa-guards") {
    return getGuardUnitPriceCents(totalGuardQuantity);
  }

  return variant.priceCents ?? product.priceCents;
}

export function calculateCartPricing(rawLines: ReadonlyArray<CartLineInput>): CartPricing {
  const normalizedLines = normalizeCartLines(rawLines);
  const resolvedLines = normalizedLines.map((line) => {
    const resolved = getVariantById(line.variantId);
    if (!resolved || resolved.product.status !== "active" || !resolved.variant.active) {
      throw new Error(`Unavailable product variant: ${line.variantId}`);
    }
    if (resolved.variant.status === "out_of_stock") {
      throw new Error(`Out-of-stock product variant: ${line.variantId}`);
    }

    const maxQuantity = Math.min(
      resolved.product.maxPerOrder,
      resolved.variant.stockQuantity ?? resolved.product.stockQuantity ?? resolved.product.maxPerOrder
    );

    if (line.quantity > maxQuantity) {
      throw new Error(`Quantity exceeds the allowed maximum for ${line.variantId}`);
    }

    return { ...line, ...resolved };
  });

  const guardQuantity = resolvedLines.reduce(
    (total, line) => total + (line.product.id === "psa-guards" ? line.quantity : 0),
    0
  );

  const lines = resolvedLines.map<PricedCartLine>(({ product, variant, quantity }) => {
    const baseUnitPriceCents = variant.priceCents ?? product.priceCents;
    const unitPriceCents = getUnitPriceCents(product, variant, guardQuantity);
    const productImage =
      variant.image ?? product.images.find((media) => media.type === "image")?.src ?? "";
    const lineTotalCents = unitPriceCents * quantity;

    return {
      variantId: variant.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productImage,
      variantName: variant.label,
      quantity,
      baseUnitPriceCents,
      unitPriceCents,
      lineTotalCents,
      discountCents: (baseUnitPriceCents - unitPriceCents) * quantity
    };
  });

  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const baseSubtotalCents = lines.reduce(
    (total, line) => total + line.baseUnitPriceCents * line.quantity,
    0
  );
  const discountCents = lines.reduce((total, line) => total + line.discountCents, 0);
  const subtotalCents = lines.reduce((total, line) => total + line.lineTotalCents, 0);

  return {
    lines,
    itemCount,
    guardQuantity,
    baseSubtotalCents,
    discountCents,
    subtotalCents
  };
}

export function calculateCheckoutAmountCents(lines: ReadonlyArray<CartLineInput>) {
  return calculateCartPricing(lines).subtotalCents;
}

function normalizeCartLines(lines: ReadonlyArray<CartLineInput>) {
  const quantities = new Map<string, number>();

  for (const line of lines) {
    const variantId = typeof line.variantId === "string" ? line.variantId.trim() : "";
    const quantity = Math.floor(Number(line.quantity));

    if (!variantId || !Number.isFinite(quantity) || quantity < 1) {
      throw new Error("Cart lines require a valid variant id and positive whole-number quantity.");
    }

    quantities.set(variantId, (quantities.get(variantId) ?? 0) + quantity);
  }

  return Array.from(quantities, ([variantId, quantity]) => ({ variantId, quantity }));
}
