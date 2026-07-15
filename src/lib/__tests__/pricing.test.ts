import { describe, expect, it } from "vitest";
import {
  calculateCartPricing,
  calculateCheckoutAmountCents,
  getGuardPricingMessage,
  getGuardUnitPriceCents
} from "@/lib/pricing";

describe("PSA Guard bulk pricing", () => {
  it.each([
    [1, 700],
    [9, 700],
    [10, 600],
    [24, 600],
    [25, 400]
  ])("prices quantity %i at %i cents each", (quantity, expectedUnitPrice) => {
    expect(getGuardUnitPriceCents(quantity)).toBe(expectedUnitPrice);
  });

  it("aggregates mixed colors before choosing the tier", () => {
    const pricing = calculateCartPricing([
      { variantId: "psa-guards-arctic", quantity: 5 },
      { variantId: "psa-guards-emerald", quantity: 3 },
      { variantId: "psa-guards-void", quantity: 2 }
    ]);

    expect(pricing.guardQuantity).toBe(10);
    expect(pricing.lines.every((line) => line.unitPriceCents === 600)).toBe(true);
    expect(pricing.subtotalCents).toBe(6000);
  });

  it("reprices every guard line at the 25-unit tier", () => {
    const pricing = calculateCartPricing([
      { variantId: "psa-guards-cosmic-pop", quantity: 12 },
      { variantId: "psa-guards-gold-dust", quantity: 13 }
    ]);

    expect(pricing.lines.every((line) => line.unitPriceCents === 400)).toBe(true);
    expect(pricing.discountCents).toBe(7500);
    expect(pricing.subtotalCents).toBe(10000);
  });

  it("enforces the aggregate Guard maximum across mixed colors", () => {
    expect(() =>
      calculateCartPricing([
        { variantId: "psa-guards-arctic", quantity: 50 },
        { variantId: "psa-guards-emerald", quantity: 50 }
      ])
    ).toThrow("PSA Guard quantity exceeds the allowed cart maximum");
  });

  it.each([
    [1, "Add 9 more guards to unlock $6 each."],
    [9, "Add 1 more guards to unlock $6 each."],
    [10, "$6 pricing unlocked. Add 15 more to unlock $4 each."],
    [24, "$6 pricing unlocked. Add 1 more to unlock $4 each."],
    [25, "Best bulk price unlocked: $4 each."]
  ])("returns the required tier progress message at %i", (quantity, expected) => {
    expect(getGuardPricingMessage(quantity)).toBe(expected);
  });
});

describe("canonical cart pricing", () => {
  it("retains the base price for non-guard products", () => {
    const pricing = calculateCartPricing([
      { variantId: "acrylic-etb-case-clear", quantity: 2 },
      { variantId: "acrylic-booster-bundle-case-clear", quantity: 1 }
    ]);

    expect(pricing.lines.map((line) => line.unitPriceCents)).toEqual([1500, 800]);
    expect(pricing.subtotalCents).toBe(3800);
  });

  it("uses the same subtotal for the client summary and server checkout amount", () => {
    const lines = [
      { variantId: "psa-guards-arctic", quantity: 6 },
      { variantId: "psa-guards-emerald", quantity: 4 },
      { variantId: "acrylic-crystal-slab-case-clear", quantity: 1 }
    ];

    expect(calculateCartPricing(lines).subtotalCents).toBe(calculateCheckoutAmountCents(lines));
  });
});
