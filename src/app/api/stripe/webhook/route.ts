import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  decodeCheckoutMetadata,
  type CheckoutMetadataLine
} from "@/lib/checkout-metadata";
import { getVariantById } from "@/lib/catalog";
import { calculateCartPricing } from "@/lib/pricing";
import { createSupabaseServiceClient, hasSupabaseServiceEnv } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true, pending: true });
    }

    try {
      await recordPaidCheckoutSession(session);
    } catch {
      return NextResponse.json({ error: "Paid order could not be recorded." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function recordPaidCheckoutSession(session: Stripe.Checkout.Session) {
  if (!hasSupabaseServiceEnv()) {
    throw new Error("Supabase service credentials are required to record paid orders.");
  }

  const decoded = decodeCheckoutMetadata(session.metadata);
  if (!decoded) {
    throw new Error("Checkout session has invalid cart metadata.");
  }

  const pricing = calculateCartPricing(decoded.items);
  assertCheckoutSnapshot(decoded.items, pricing.lines, session.amount_subtotal);

  const supabase = createSupabaseServiceClient();
  const pickupNotes = session.custom_fields?.find((field) => field.key === "pickup_notes")?.text
    ?.value;
  const customerId = isUuid(session.metadata?.customer_id) ? session.metadata?.customer_id : null;
  const shippingDetails = (
    session as Stripe.Checkout.Session & {
      shipping_details?: { address?: Stripe.Address | null } | null;
    }
  ).shipping_details;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .upsert(
      {
        order_number: buildOrderNumber(session),
        customer_id: customerId,
        status: "paid",
        payment_status: session.payment_status,
        fulfillment_status: "unfulfilled",
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
        stripe_payment_status: session.payment_status,
        customer_email: session.customer_details?.email ?? session.customer_email ?? null,
        customer_name: session.customer_details?.name ?? null,
        pickup_method: decoded.pickupMethod,
        pickup_event_id: decoded.pickupEventId,
        pickup_notes: pickupNotes ?? null,
        checkout_items: decoded.items,
        pricing_snapshot: pricing,
        subtotal_cents: session.amount_subtotal ?? pricing.subtotalCents,
        shipping_cents: session.total_details?.amount_shipping ?? 0,
        tax_cents: session.total_details?.amount_tax ?? 0,
        discount_cents: session.total_details?.amount_discount ?? 0,
        total_cents: session.amount_total ?? pricing.subtotalCents,
        shipping_method: null,
        shipping_address: shippingDetails?.address ?? null,
        billing_address: session.customer_details?.address ?? null,
        updated_at: new Date().toISOString()
      },
      { onConflict: "stripe_checkout_session_id" }
    )
    .select("id")
    .maybeSingle();

  if (orderError || !order?.id) {
    throw new Error(orderError?.message || "Paid order upsert did not return an order id.");
  }

  await syncOrderItems(supabase, order.id, decoded.items);
}

function assertCheckoutSnapshot(
  metadataItems: CheckoutMetadataLine[],
  pricingLines: ReturnType<typeof calculateCartPricing>["lines"],
  stripeSubtotal: number | null
) {
  const expectedSubtotal = metadataItems.reduce(
    (total, item) => total + item.quantity * item.unitPriceCents,
    0
  );
  const snapshotMatchesCatalog = metadataItems.every((item) => {
    const pricedLine = pricingLines.find((line) => line.variantId === item.variantId);
    return pricedLine?.unitPriceCents === item.unitPriceCents;
  });

  if (!snapshotMatchesCatalog || (stripeSubtotal !== null && stripeSubtotal !== expectedSubtotal)) {
    throw new Error("Checkout pricing snapshot does not match the paid session.");
  }
}

type SupabaseServiceClient = ReturnType<typeof createSupabaseServiceClient>;

async function syncOrderItems(
  supabase: SupabaseServiceClient,
  orderId: string,
  checkoutItems: CheckoutMetadataLine[]
) {
  const rows = checkoutItems.flatMap((item) => {
    const resolved = getVariantById(item.variantId);
    if (!resolved) return [];

    return [
      {
        order_id: orderId,
        catalog_product_id: resolved.product.id,
        variant_id: resolved.variant.id,
        product_name: resolved.product.name,
        product_image:
          resolved.variant.image ??
          resolved.product.images.find((media) => media.type === "image")?.src ??
          "/brand/luckys-loot-logo.webp",
        variant_name: resolved.variant.label,
        options: resolved.variant.color ? { color: resolved.variant.color } : {},
        quantity: item.quantity,
        unit_price_cents: item.unitPriceCents,
        total_price_cents: item.unitPriceCents * item.quantity
      }
    ];
  });

  if (rows.length !== checkoutItems.length) {
    throw new Error("A paid order contains a catalog variant that cannot be resolved.");
  }

  const { error: deleteError } = await supabase.from("order_items").delete().eq("order_id", orderId);
  if (deleteError) throw new Error(deleteError.message);

  const { error: insertError } = await supabase.from("order_items").insert(rows);
  if (insertError) throw new Error(insertError.message);
}

function buildOrderNumber(session: Stripe.Checkout.Session) {
  const date = new Date((session.created || Math.floor(Date.now() / 1000)) * 1000)
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");
  const suffix = session.id.slice(-8).replace(/[^a-z0-9]/gi, "").toUpperCase();

  return `LL-${date}-${suffix}`;
}

function isUuid(value: string | undefined): value is string {
  return Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
      )
  );
}
