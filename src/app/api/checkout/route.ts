import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getStorefrontCartUnitPriceCents,
  getStorefrontVariant,
  isPsaGuardVariant
} from "@/lib/storefront-products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutItemInput = {
  variantId?: unknown;
  quantity?: unknown;
};

export async function POST(request: Request) {
  let payload: { items?: CheckoutItemInput[] };

  try {
    payload = (await request.json()) as { items?: CheckoutItemInput[] };
  } catch {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY to .env.local or send a cart inquiry."
      },
      { status: 503 }
    );
  }

  const items = Array.isArray(payload.items) ? payload.items : [];
  const sanitizedItems = items
    .map((item) => {
      const variantId = typeof item.variantId === "string" ? item.variantId : "";
      const variant = getStorefrontVariant(variantId);
      const quantity = Math.floor(Number(item.quantity) || 0);

      if (!variant || quantity < 1) {
        return null;
      }

      return {
        variant,
        quantity: Math.min(quantity, variant.maxQuantity)
      };
    })
    .filter(Boolean) as Array<{
    variant: NonNullable<ReturnType<typeof getStorefrontVariant>>;
    quantity: number;
  }>;

  if (sanitizedItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const psaGuardCount = sanitizedItems.reduce(
    (total, item) => total + (isPsaGuardVariant(item.variant) ? item.quantity : 0),
    0
  );

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const includeStripeImages = origin.startsWith("https://");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const cartMetadata = JSON.stringify(
    sanitizedItems.map((item) => ({
      variantId: item.variant.id,
      quantity: item.quantity
    }))
  );

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      billing_address_collection: "auto",
      phone_number_collection: {
        enabled: true
      },
      automatic_tax: {
        enabled: process.env.STRIPE_AUTOMATIC_TAX === "true"
      },
      custom_fields: [
        {
          key: "pickup_notes",
          label: {
            type: "custom",
            custom: "Pickup, color, or engraving notes"
          },
          optional: true,
          type: "text"
        }
      ],
      line_items: sanitizedItems.map(({ variant, quantity }) => ({
        quantity,
        ...(isPsaGuardVariant(variant)
          ? {}
          : {
              adjustable_quantity: {
                enabled: true,
                minimum: 1,
                maximum: variant.maxQuantity
              }
            }),
        price_data: {
          currency: "usd",
          unit_amount: getStorefrontCartUnitPriceCents(variant, psaGuardCount),
          product_data: {
            name: variant.label,
            description: variant.description,
            ...(includeStripeImages ? { images: [new URL(variant.image, origin).toString()] } : {}),
            metadata: {
              variant_id: variant.id,
              family_id: variant.familyId
            }
          }
        }
      })),
      metadata: {
        cart_items: cartMetadata
      },
      payment_intent_data: {
        metadata: {
          cart_items: cartMetadata
        }
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancelled`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Checkout could not be started."
      },
      { status: 500 }
    );
  }
}
