import type { CartLineInput, PricedCartLine } from "@/lib/pricing";

export type CheckoutPickupMethod = "richmond" | "event";

export type CheckoutMetadataLine = CartLineInput & {
  unitPriceCents: number;
};

export type DecodedCheckoutMetadata = {
  items: CheckoutMetadataLine[];
  pickupMethod: CheckoutPickupMethod;
};

const CART_CHUNK_PREFIX = "cart_";
const MAX_CHUNK_LENGTH = 440;
const MAX_CART_CHUNKS = 20;

export function encodeCheckoutMetadata(
  lines: ReadonlyArray<Pick<PricedCartLine, "variantId" | "quantity" | "unitPriceCents">>,
  pickupMethod: CheckoutPickupMethod
) {
  const serialized = JSON.stringify(
    lines.map((line) => [line.variantId, line.quantity, line.unitPriceCents])
  );
  const chunks = chunkString(serialized, MAX_CHUNK_LENGTH);

  if (chunks.length > MAX_CART_CHUNKS) {
    throw new Error("Cart metadata exceeds the supported checkout size.");
  }

  return chunks.reduce<Record<string, string>>(
    (metadata, chunk, index) => {
      metadata[`${CART_CHUNK_PREFIX}${index}`] = chunk;
      return metadata;
    },
    {
      cart_chunks: String(chunks.length),
      pickup_method: pickupMethod,
      pricing_version: "v2"
    }
  );
}

export function decodeCheckoutMetadata(
  metadata: Readonly<Record<string, string | null | undefined>> | null | undefined
): DecodedCheckoutMetadata | null {
  if (!metadata) return null;

  const chunkCount = Number(metadata.cart_chunks);
  if (!Number.isInteger(chunkCount) || chunkCount < 1 || chunkCount > MAX_CART_CHUNKS) {
    return null;
  }

  const pickupMethod = metadata.pickup_method;
  if (pickupMethod !== "richmond" && pickupMethod !== "event") {
    return null;
  }

  const serialized = Array.from({ length: chunkCount }, (_, index) => {
    const value = metadata[`${CART_CHUNK_PREFIX}${index}`];
    return typeof value === "string" ? value : "";
  }).join("");

  if (!serialized) return null;

  try {
    const parsed = JSON.parse(serialized) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    const items = parsed.flatMap<CheckoutMetadataLine>((candidate) => {
      if (!Array.isArray(candidate) || candidate.length !== 3) return [];
      const [variantId, rawQuantity, rawUnitPrice] = candidate;
      const quantity = Number(rawQuantity);
      const unitPriceCents = Number(rawUnitPrice);

      if (
        typeof variantId !== "string" ||
        !variantId ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isInteger(unitPriceCents) ||
        unitPriceCents < 0
      ) {
        return [];
      }

      return [{ variantId, quantity, unitPriceCents }];
    });

    return items.length === parsed.length ? { items, pickupMethod } : null;
  } catch {
    return null;
  }
}

function chunkString(value: string, chunkLength: number) {
  const chunks: string[] = [];
  for (let index = 0; index < value.length; index += chunkLength) {
    chunks.push(value.slice(index, index + chunkLength));
  }
  return chunks;
}
