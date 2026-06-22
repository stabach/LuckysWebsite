import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStorefrontCartUnitPriceCents, getStorefrontVariant } from "@/lib/storefront-products";
import { createSupabaseServiceClient, hasSupabaseServiceEnv } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true, skipped: "Stripe webhook is not configured." });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    await recordPaidCheckoutSession(event.data.object as Stripe.Checkout.Session);
  }

  return NextResponse.json({ received: true });
}

async function recordPaidCheckoutSession(session: Stripe.Checkout.Session) {
  if (!hasSupabaseServiceEnv()) {
    return;
  }

  const supabase = createSupabaseServiceClient();
  const pickupNotes = session.custom_fields?.find((field) => field.key === "pickup_notes")?.text
    ?.value;
  const checkoutItems = parseCheckoutItems(session.metadata?.cart_items);
  const customerId = isUuid(session.metadata?.customer_id) ? session.metadata?.customer_id : null;
  const shippingDetails = (
    session as Stripe.Checkout.Session & {
      shipping_details?: { address?: Stripe.Address | null } | null;
    }
  ).shipping_details;

  const { data: order } = await supabase.from("orders").upsert(
    {
      order_number: buildOrderNumber(session),
      customer_id: customerId,
      status: "paid",
      payment_status: session.payment_status,
      fulfillment_status: "unfulfilled",
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      stripe_payment_status: session.payment_status,
      customer_email: session.customer_details?.email ?? session.customer_email ?? null,
      customer_name: session.customer_details?.name ?? null,
      pickup_notes: pickupNotes ?? null,
      checkout_items: checkoutItems,
      subtotal_cents: session.amount_subtotal ?? 0,
      shipping_cents: session.total_details?.amount_shipping ?? 0,
      tax_cents: session.total_details?.amount_tax ?? 0,
      discount_cents: session.total_details?.amount_discount ?? 0,
      total_cents: session.amount_total ?? 0,
      shipping_method:
        typeof session.shipping_cost?.shipping_rate === "string" ? session.shipping_cost.shipping_rate : null,
      shipping_address: shippingDetails?.address ?? null,
      billing_address: session.customer_details?.address ?? null,
      updated_at: new Date().toISOString()
    },
    {
      onConflict: "stripe_checkout_session_id"
    }
  ).select("id").maybeSingle();

  if (order?.id) {
    await syncOrderItems(order.id, checkoutItems);
  }
}

type CheckoutMetadataItem = {
  variantId: string;
  quantity: number;
};

type OrderItemInsert = {
  order_id: string;
  variant_id: string;
  product_name: string;
  product_image: string;
  variant_name: string;
  options: Record<string, unknown>;
  quantity: number;
  unit_price_cents: number;
  total_price_cents: number;
};

function parseCheckoutItems(raw: string | undefined): CheckoutMetadataItem[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const candidate = item as Record<string, unknown>;
        const variantId = typeof candidate.variantId === "string" ? candidate.variantId : "";
        const quantity = Math.floor(Number(candidate.quantity) || 0);

        return variantId && quantity > 0 ? { variantId, quantity } : null;
      })
      .filter(Boolean) as CheckoutMetadataItem[];
  } catch {
    return [];
  }
}

async function syncOrderItems(orderId: string, checkoutItems: CheckoutMetadataItem[]) {
  if (checkoutItems.length === 0) {
    return;
  }

  const supabase = createSupabaseServiceClient();
  const totalGuardQuantity = checkoutItems.reduce((total, item) => {
    const variant = getStorefrontVariant(item.variantId);
    return variant?.familyId === "psa-guards" ? total + item.quantity : total;
  }, 0);
  const rows = checkoutItems.flatMap<OrderItemInsert>((item) => {
      const variant = getStorefrontVariant(item.variantId);

      if (!variant) {
        return [];
      }

      const unitPriceCents = getStorefrontCartUnitPriceCents(variant, totalGuardQuantity);

      return [{
        order_id: orderId,
        variant_id: variant.id,
        product_name: variant.label,
        product_image: variant.image,
        variant_name: variant.familyName,
        options: variant.colorName ? { color: variant.colorName } : {},
        quantity: item.quantity,
        unit_price_cents: unitPriceCents,
        total_price_cents: unitPriceCents * item.quantity
      }];
    });

  if (rows.length === 0) {
    return;
  }

  await supabase.from("order_items").delete().eq("order_id", orderId);
  await supabase.from("order_items").insert(rows);
}

function buildOrderNumber(session: Stripe.Checkout.Session) {
  const date = new Date((session.created || Math.floor(Date.now() / 1000)) * 1000)
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");
  const suffix = session.id.slice(-8).replace(/[^a-z0-9]/gi, "").toUpperCase();

  return `LL-${date}-${suffix}`;
}

function isUuid(value: string | undefined) {
  return Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
      )
  );
}
