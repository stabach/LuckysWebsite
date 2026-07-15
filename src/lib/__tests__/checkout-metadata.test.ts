import { describe, expect, it } from "vitest";
import { psaGuardColors } from "@/data/catalog";
import { decodeCheckoutMetadata, encodeCheckoutMetadata } from "@/lib/checkout-metadata";
import { calculateCartPricing } from "@/lib/pricing";

describe("checkout metadata", () => {
  it("round-trips a full 15-color Guard mix across Stripe-safe chunks", () => {
    const pricing = calculateCartPricing(
      psaGuardColors.map((color) => ({
        variantId: `psa-guards-${color.slug}`,
        quantity: 2
      }))
    );
    const metadata = encodeCheckoutMetadata(pricing.lines, "richmond");
    const decoded = decodeCheckoutMetadata(metadata);

    expect(Number(metadata.cart_chunks)).toBeGreaterThan(1);
    expect(Object.entries(metadata).every(([, value]) => value.length <= 500)).toBe(true);
    expect(decoded).toEqual({
      items: pricing.lines.map((line) => ({
        variantId: line.variantId,
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents
      })),
      pickupMethod: "richmond",
      pickupEventId: null
    });
  });

  it("requires and preserves an event id for event pickup", () => {
    const pricing = calculateCartPricing([
      { variantId: "psa-guards-arctic", quantity: 1 }
    ]);
    expect(() => encodeCheckoutMetadata(pricing.lines, "event")).toThrow(/event id/i);
    expect(decodeCheckoutMetadata(encodeCheckoutMetadata(pricing.lines, "event", "event-123")))
      .toMatchObject({ pickupMethod: "event", pickupEventId: "event-123" });
  });

  it("rejects incomplete, malformed, and unsupported metadata", () => {
    expect(decodeCheckoutMetadata(undefined)).toBeNull();
    expect(decodeCheckoutMetadata({ cart_chunks: "2", cart_0: "[]", pickup_method: "richmond" })).toBeNull();
    expect(decodeCheckoutMetadata({ cart_chunks: "1", cart_0: "[]", pickup_method: "delivery" })).toBeNull();
    expect(decodeCheckoutMetadata({ cart_chunks: "1", cart_0: "not-json", pickup_method: "richmond" })).toBeNull();
  });
});
