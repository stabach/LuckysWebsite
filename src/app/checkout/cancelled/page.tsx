import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout Paused",
  description: "Return to your Lucky's Loot cart.",
  robots: { index: false, follow: false }
};

export default function CheckoutCancelledPage() {
  return (
    <div className="checkout-state-page section-shell">
      <section className="checkout-state-card" aria-labelledby="checkout-cancelled-title">
        <p className="eyebrow">Checkout paused</p>
        <h1 id="checkout-cancelled-title">Your Loot is still waiting.</h1>
        <p className="checkout-state-lede">
          Nothing was charged and your saved cart is unchanged. You can keep shopping, adjust your
          Guard mix, or ask a product-fit question before returning to secure checkout.
        </p>
        <div className="button-row checkout-state-actions">
          <Link href="/shop" className="button button-primary">
            Keep shopping
          </Link>
          <Link href="/contact?topic=cart" className="button button-secondary">
            Ask a cart question
          </Link>
        </div>
      </section>
    </div>
  );
}
