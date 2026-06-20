import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { formatStorefrontCurrency } from "@/lib/storefront-products";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Lucky's Loot order has been received."
};

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const session = await getCheckoutSession(sessionId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 pb-16 pt-28 text-[#e7e0cf] sm:px-6">
      <section className="mx-auto max-w-3xl rounded-[8px] border border-[#d4af37]/24 bg-[#111111] p-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.42)] sm:p-10">
        <p className="font-pixel text-[0.7rem] uppercase leading-6 text-[#d4af37]">Order confirmed</p>
        <h1 className="gold-glow mt-5 text-4xl font-bold text-[#d4af37] sm:text-5xl">
          Thank you for your purchase.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#b8b0a0] sm:text-base">
          Your order is in. Lucky&apos;s Loot will follow up with pickup details and any custom
          notes needed for engraved binders or color preferences.
        </p>

        <div className="mx-auto mt-8 grid max-w-xl gap-3 rounded-[8px] border border-[#d4af37]/16 bg-black/34 p-5 text-left">
          <OrderLine label="Checkout" value={session?.id ?? sessionId ?? "Confirmed"} />
          <OrderLine label="Email" value={session?.customer_details?.email ?? "Collected by Stripe"} />
          <OrderLine
            label="Total"
            value={
              typeof session?.amount_total === "number"
                ? formatStorefrontCurrency(session.amount_total)
                : "Shown in your Stripe receipt"
            }
          />
          <OrderLine label="Payment" value={session?.payment_status ?? "processing"} />
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-[8px] border border-[#d4af37] bg-[#d4af37] px-6 py-3 font-pixel text-[0.62rem] uppercase text-black transition hover:bg-[#fff4bd] focus-ring"
          >
            Back Home
          </Link>
          <a
            href="mailto:LuckysLootSupplies@gmail.com?subject=Order%20Pickup"
            className="inline-flex min-h-12 items-center justify-center rounded-[8px] border border-[#d4af37]/40 px-6 py-3 font-pixel text-[0.62rem] uppercase text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
          >
            Email Pickup Notes
          </a>
        </div>
      </section>
    </div>
  );
}

function OrderLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#d4af37]/10 pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs uppercase tracking-[0.18em] text-[#8d866f]">{label}</span>
      <strong className="max-w-[13rem] text-right text-sm text-white break-words">{value}</strong>
    </div>
  );
}

async function getCheckoutSession(sessionId: string | undefined) {
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}
