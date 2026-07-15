import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { storeEvents } from "@/data/events";
import { encodeCheckoutMetadata } from "@/lib/checkout-metadata";
import { getVariantById } from "@/lib/catalog";
import { createE2ECheckoutSession, isE2ECheckoutEnabled } from "@/lib/e2e-checkout";
import { getEventById, isEventPickupEligible } from "@/lib/events";
import { calculateCartPricing, type CartLineInput } from "@/lib/pricing";
import { consumeRateLimit, getRequestClientKey } from "@/lib/rate-limit";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CheckoutPayloadSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().min(1).max(128),
        quantity: z.number().int().positive()
      })
    )
    .min(1)
    .max(50),
  pickupMethod: z.enum(["richmond", "event"]),
  pickupEventId: z.string().max(128).nullable().optional()
});

export async function POST(request: Request) {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  const parsed = CheckoutPayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the items and pickup method in Your Loot." }, { status: 400 });
  }

  if (!consumeRateLimit("checkout", getRequestClientKey(request), Date.now(), {
    maximum: 12,
    windowMs: 60_000
  })) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  const payload = parsed.data;
  const pickupMethod = payload.pickupMethod;
  const pickupEventId =
    typeof payload.pickupEventId === "string" ? payload.pickupEventId.trim() : "";
  const pickupEvent = pickupEventId ? getEventById(storeEvents, pickupEventId) : undefined;
  if (pickupMethod === "event" && (!pickupEvent || !isEventPickupEligible(pickupEvent))) {
    return NextResponse.json(
      { error: "Event pickup is not available without an eligible verified event." },
      { status: 400 }
    );
  }

  let pricing: ReturnType<typeof calculateCartPricing>;
  try {
    pricing = calculateCartPricing(
      payload.items.map<CartLineInput>((item) => ({
        variantId: item.variantId,
        quantity: item.quantity
      }))
    );
  } catch {
    return NextResponse.json(
      { error: "Your cart contains an unavailable item or invalid quantity." },
      { status: 400 }
    );
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const includeStripeImages = origin.startsWith("https://");
  const checkoutCustomer = await getCheckoutCustomer();
  const checkoutMetadata = {
    ...encodeCheckoutMetadata(pricing.lines, pickupMethod, pickupEvent?.id),
    ...(checkoutCustomer?.id ? { customer_id: checkoutCustomer.id } : {})
  };

  if (isE2ECheckoutEnabled()) {
    const mockSession = createE2ECheckoutSession(pricing.subtotalCents, checkoutMetadata);
    return NextResponse.json({
      url: `${origin}/checkout/success?session_id=${mockSession?.id}`
    });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error: "Secure checkout is temporarily unavailable. Please try again or contact Lucky’s Loot."
      },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      line_items: pricing.lines.map((line) => {
        const resolved = getVariantById(line.variantId);
        if (!resolved) throw new Error("Checkout catalog changed before session creation.");

        return {
          quantity: line.quantity,
          price_data: {
            currency: "usd",
            unit_amount: line.unitPriceCents,
            product_data: {
              name: line.productName,
              description: `${line.variantName}. ${resolved.product.summary}`,
              ...(includeStripeImages
                ? { images: [new URL(line.productImage, origin).toString()] }
                : {}),
              metadata: {
                variant_id: line.variantId,
                catalog_product_id: line.productId
              }
            }
          }
        };
      }),
      ...(checkoutCustomer?.id ? { client_reference_id: checkoutCustomer.id } : {}),
      ...(checkoutCustomer?.email ? { customer_email: checkoutCustomer.email } : {}),
      metadata: checkoutMetadata,
      payment_intent_data: {
        metadata: checkoutMetadata
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancelled`
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Secure checkout could not be started. Please try again." },
      { status: 500 }
    );
  }
}

async function getCheckoutCustomer() {
  if (!hasSupabaseServerEnv()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const firstName = typeof user.user_metadata?.first_name === "string" ? user.user_metadata.first_name : "";
    const lastName = typeof user.user_metadata?.last_name === "string" ? user.user_metadata.last_name : "";

    await supabase.from("customers").upsert(
      {
        id: user.id,
        email: user.email ?? "",
        first_name: firstName,
        last_name: lastName,
        full_name: [firstName, lastName].filter(Boolean).join(" "),
        updated_at: new Date().toISOString()
      },
      { onConflict: "id" }
    );

    return {
      id: user.id,
      email: user.email ?? ""
    };
  } catch {
    return null;
  }
}
