import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { ClearCartAfterCheckout } from "@/components/checkout/clear-cart-after-checkout";
import { storeEvents } from "@/data/events";
import { decodeCheckoutMetadata } from "@/lib/checkout-metadata";
import { formatCurrency } from "@/lib/catalog";
import { getEventById } from "@/lib/events";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Lucky's Loot order has been received.",
  robots: { index: false, follow: false }
};

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const session = await getCheckoutSession(sessionId);
  const paid = session?.payment_status === "paid";
  const checkout = decodeCheckoutMetadata(session?.metadata);
  const pickupEvent = checkout?.pickupEventId
    ? getEventById(storeEvents, checkout.pickupEventId)
    : undefined;
  const pickupLabel =
    checkout?.pickupMethod === "event"
      ? pickupEvent?.title ?? "Verified event pickup"
      : checkout?.pickupMethod === "richmond"
        ? "Richmond / Houston-area pickup"
        : "Not verified";

  return (
    <div className="checkout-state-page section-shell">
      {paid ? <ClearCartAfterCheckout /> : null}
      <section className="checkout-state-card" aria-labelledby="checkout-status-title">
        <p className="eyebrow">{paid ? "Order confirmed" : "Confirmation pending"}</p>
        <h1 id="checkout-status-title">
          {paid ? "Your Loot is secured." : "We’re checking your payment."}
        </h1>
        <p className="checkout-state-lede">
          {paid
            ? "Your payment is complete. We’ll use the contact details from checkout to coordinate private pickup details."
            : "Your cart has not been cleared. Check your Stripe receipt or return to Your Loot while payment confirmation finishes."}
        </p>

        <dl className="checkout-summary">
          <OrderLine label="Checkout" value={session?.id ?? sessionId ?? "Not available"} />
          <OrderLine
            label="Email"
            value={session?.customer_details?.email ?? "Provided securely in Stripe"}
          />
          <OrderLine
            label="Total"
            value={
              typeof session?.amount_total === "number"
                ? formatCurrency(session.amount_total)
                : "See your Stripe receipt"
            }
          />
          <OrderLine label="Pickup" value={pickupLabel} />
          <OrderLine label="Payment" value={session?.payment_status ?? "Not verified"} />
        </dl>

        <div className="button-row checkout-state-actions">
          <Link href={paid ? "/account/orders" : "/shop"} className="button button-primary">
            {paid ? "View order history" : "Return to shop"}
          </Link>
          <Link href="/contact?topic=order" className="button button-secondary">
            Ask about this order
          </Link>
        </div>
        <p className="checkout-state-note">
          For privacy, exact pickup locations are shared directly after payment and are never
          published on the storefront.
        </p>
      </section>
    </div>
  );
}

function OrderLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

async function getCheckoutSession(sessionId: string | undefined) {
  if (!sessionId || !sessionId.startsWith("cs_") || !process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}
