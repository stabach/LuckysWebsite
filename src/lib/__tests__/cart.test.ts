import { describe, expect, it } from "vitest";
import {
  mergeCartItems,
  parsePersistedCart,
  removeCartItem,
  serializeCart,
  updateCartQuantity
} from "@/lib/cart";

const etbVariant = "acrylic-etb-case-clear";
const guardArctic = "psa-guard-arctic";
const guardEmerald = "psa-guard-emerald";

describe("cart state", () => {
  it("adds and updates a canonical item quantity", () => {
    const added = mergeCartItems([], [{ variantId: etbVariant, quantity: 1 }]);
    expect(updateCartQuantity(added, etbVariant, 3)).toEqual([
      { variantId: etbVariant, quantity: 3 }
    ]);
  });

  it("removes a selected item", () => {
    const cart = [
      { variantId: etbVariant, quantity: 1 },
      { variantId: guardArctic, quantity: 2 }
    ];
    expect(removeCartItem(cart, etbVariant)).toEqual([{ variantId: guardArctic, quantity: 2 }]);
  });

  it("round-trips cart and Richmond pickup persistence", () => {
    const serialized = serializeCart({
      items: [{ variantId: etbVariant, quantity: 2 }],
      pickupMethod: "richmond",
      pickupEventId: null
    });
    expect(parsePersistedCart(serialized)).toEqual({
      items: [{ variantId: etbVariant, quantity: 2 }],
      pickupMethod: "richmond",
      pickupEventId: null
    });
  });

  it("preserves only an eligible event pickup selection", () => {
    const serialized = serializeCart({
      items: [{ variantId: guardEmerald, quantity: 1 }],
      pickupMethod: "event",
      pickupEventId: "event-123"
    });
    expect(parsePersistedCart(serialized, ["event-123"]).pickupMethod).toBe("event");
    expect(parsePersistedCart(serialized, []).pickupMethod).toBe("richmond");
  });

  it("rejects malformed persistence rather than reviving invalid lines", () => {
    expect(parsePersistedCart("not-json").items).toEqual([]);
    expect(
      parsePersistedCart(JSON.stringify({ items: [{ variantId: "unknown", quantity: 100 }] })).items
    ).toEqual([]);
  });
});
