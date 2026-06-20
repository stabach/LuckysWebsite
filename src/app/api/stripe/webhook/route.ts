import { NextResponse } from "next/server";
import Stripe from "stripe";
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

  await supabase.from("orders").upsert(
    {
      status: "paid",
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
      total_cents: session.amount_total ?? 0,
      billing_address: session.customer_details?.address ?? null,
      updated_at: new Date().toISOString()
    },
    {
      onConflict: "stripe_checkout_session_id"
    }
  );
}

function parseCheckoutItems(raw: string | undefined) {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
