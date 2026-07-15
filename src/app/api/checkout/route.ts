import { NextResponse } from "next/server";
import Stripe from "stripe";
import { storeEvents } from "@/data/events";
import { encodeCheckoutMetadata, type CheckoutPickupMethod } from "@/lib/checkout-metadata";
import { getVariantById } from "@/lib/catalog";
import { getEventById, isEventPickupEligible } from "@/lib/events";
import { calculateCartPricing, type CartLineInput } from "@/lib/pricing";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutItemInput = {
  variantId?: unknown;
  quantity?: unknown;
};

export async function POST(request: Request) {
  let payload: { items?: CheckoutItemInput[]; pickupMethod?: unknown; pickupEventId?: unknown };

  try {
    payload = (await request.json()) as {
      items?: CheckoutItemInput[];
      pickupMethod?: unknown;
      pickupEventId?: unknown;
    };
  } catch {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error: "Secure checkout is temporarily unavailable. Please try again or contact Lucky’s Loot."
      },
      { status: 503 }
    );
  }

  const pickupMethod = parsePickupMethod(payload.pickupMethod);
  if (!pickupMethod) {
    return NextResponse.json({ error: "Choose an available pickup method." }, { status: 400 });
  }
  const pickupEventId =
    typeof payload.pickupEventId === "string" ? payload.pickupEventId.trim() : "";
  const pickupEvent = pickupEventId ? getEventById(storeEvents, pickupEventId) : undefined;
  if (pickupMethod === "event" && (!pickupEvent || !isEventPickupEligible(pickupEvent))) {
    return NextResponse.json(
      { error: "Event pickup is not available without an eligible verified event." },
      { status: 400 }
    );
  }

  const rawItems = Array.isArray(payload.items) ? payload.items : [];
  if (rawItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  let pricing: ReturnType<typeof calculateCartPricing>;
  try {
    pricing = calculateCartPricing(
      rawItems.map<CartLineInput>((item) => ({
        variantId: typeof item.variantId === "string" ? item.variantId : "",
        quantity: Math.floor(Number(item.quantity))
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
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const checkoutCustomer = await getCheckoutCustomer();
  const checkoutMetadata = {
    ...encodeCheckoutMetadata(pricing.lines, pickupMethod, pickupEvent?.id),
    ...(checkoutCustomer?.id ? { customer_id: checkoutCustomer.id } : {})
  };

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

function parsePickupMethod(value: unknown): CheckoutPickupMethod | null {
  return value === "richmond" || value === "event" ? value : null;
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
