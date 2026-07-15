import { getVariantById } from "@/lib/catalog";
import { isVariantPurchasable } from "@/lib/inventory";
import type { CartLineInput } from "@/lib/pricing";

export type CartItem = CartLineInput;
export type PickupMethod = "richmond" | "event";

export const CART_STORAGE_KEY = "luckys-loot-cart-v2";
export const LEGACY_CART_STORAGE_KEY = "luckys-loot-cart-v1";

export type PersistedCart = {
  items: CartItem[];
  pickupMethod: PickupMethod;
  pickupEventId: string | null;
};

export function mergeCartItems(
  current: ReadonlyArray<CartItem>,
  incoming: ReadonlyArray<CartItem>
) {
  const quantities = new Map(current.map((item) => [item.variantId, item.quantity]));
  for (const item of incoming) {
    const resolved = getVariantById(item.variantId);
    const maximum = getVariantMaximum(item.variantId);
    if (!maximum || !resolved) continue;
    const existing = quantities.get(item.variantId) ?? 0;
    const next = existing + Math.max(1, Math.floor(item.quantity));

    if (resolved.product.id === "psa-guards") {
      const guardTotal = Array.from(quantities).reduce((total, [variantId, quantity]) => {
        return total + (getVariantById(variantId)?.product.id === "psa-guards" ? quantity : 0);
      }, 0);
      const otherGuardQuantity = guardTotal - existing;
      quantities.set(
        item.variantId,
        Math.min(next, maximum, Math.max(0, resolved.product.maxPerOrder - otherGuardQuantity))
      );
    } else {
      quantities.set(item.variantId, Math.min(next, maximum));
    }
  }
  return Array.from(quantities, ([variantId, quantity]) => ({ variantId, quantity })).filter(
    (item) => item.quantity > 0
  );
}

export function updateCartQuantity(
  items: ReadonlyArray<CartItem>,
  variantId: string,
  quantity: number
) {
  const maximum = getVariantMaximum(variantId);
  return items
    .map((item) =>
      item.variantId === variantId
        ? { ...item, quantity: Math.min(Math.max(Math.floor(quantity), 0), maximum) }
        : item
    )
    .filter((item) => item.quantity > 0);
}

export function removeCartItem(items: ReadonlyArray<CartItem>, variantId: string) {
  return items.filter((item) => item.variantId !== variantId);
}

export function sanitizeCartItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];
  const sanitized = items.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as { variantId?: unknown; quantity?: unknown };
    if (typeof candidate.variantId !== "string") return [];
    const maximum = getVariantMaximum(candidate.variantId);
    const quantity = Math.floor(Number(candidate.quantity));
    if (!maximum || !Number.isFinite(quantity) || quantity < 1) return [];
    return [{ variantId: candidate.variantId, quantity: Math.min(quantity, maximum) }];
  });
  return mergeCartItems([], sanitized);
}

export function serializeCart(cart: PersistedCart) {
  return JSON.stringify(cart);
}

export function parsePersistedCart(
  value: string | null,
  eligiblePickupEventIds: ReadonlyArray<string> = []
): PersistedCart {
  const fallback: PersistedCart = {
    items: [],
    pickupMethod: "richmond",
    pickupEventId: null
  };
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value) as {
      items?: unknown;
      pickupMethod?: unknown;
      pickupEventId?: unknown;
    };
    const pickupEventId =
      typeof parsed.pickupEventId === "string" && eligiblePickupEventIds.includes(parsed.pickupEventId)
        ? parsed.pickupEventId
        : null;
    return {
      items: sanitizeCartItems(parsed.items),
      pickupMethod: parsed.pickupMethod === "event" && pickupEventId ? "event" : "richmond",
      pickupEventId: parsed.pickupMethod === "event" ? pickupEventId : null
    };
  } catch {
    return fallback;
  }
}

function getVariantMaximum(variantId: string) {
  const resolved = getVariantById(variantId);
  if (!resolved || !isVariantPurchasable(resolved.product, resolved.variant)) return 0;
  return Math.min(
    resolved.product.maxPerOrder,
    resolved.variant.stockQuantity ?? resolved.product.stockQuantity ?? resolved.product.maxPerOrder
  );
}
