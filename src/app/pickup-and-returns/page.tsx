import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/info/content-page";

export const metadata: Metadata = {
  title: "Pickup & Returns",
  description: "How Lucky's Loot local and event pickup works, plus current return-policy status."
};

export default function PickupAndReturnsPage() {
  return (
    <ContentPage
      eyebrow="Order handoff"
      title="Private pickup, explained clearly."
      intro="Lucky’s Loot uses Richmond / Houston-area pickup and, when eligible, event pickup. Unverified timing and return rules are identified instead of guessed."
    >
      <ContentSection title="Local pickup" aside="Richmond / Houston area">
        <p>
          Choose Richmond / Houston-area pickup in Your Loot before secure checkout. The storefront
          publishes only the general service area. Exact private instructions are delivered directly
          after payment and order confirmation.
        </p>
        <p>
          Keep your Stripe receipt and order confirmation available. Any identity or handoff steps
          required for a specific pickup will be included in the private instructions.
        </p>
      </ContentSection>

      <ContentSection title="Ready time and holds" aside="Owner verification pending">
        <p>
          A typical readiness window, hold period, and pickup-rescheduling policy have not been
          confirmed for publication. Do not travel until you receive direct ready-for-pickup
          instructions. Use the contact form if the timing needs to change.
        </p>
      </ContentSection>

      <ContentSection title="Event pickup" aside="Eligibility is date-derived">
        <p>
          An event can be selected only while it is published, pickup-enabled, not past, and before
          its cutoff. If those conditions are not met, event pickup remains disabled in the cart.
        </p>
        <Link className="text-link" href="/events">
          View verified event dates
        </Link>
      </ContentSection>

      <ContentSection title="Damage and returns" aside="Complete return policy pending">
        <p>
          If an item appears damaged, keep the packaging, do not modify or use the item, and contact
          Lucky’s Loot promptly with the order number and clear photos. The owner must still approve
          the complete return window, eligibility rules, and remedy language before launch.
        </p>
        <p>
          Custom engraving is not an active checkout option. Its pricing, turnaround, and return
          limitations remain unverified.
        </p>
        <Link className="button button-primary" href="/contact?topic=order">
          Contact order support
        </Link>
      </ContentSection>
    </ContentPage>
  );
}
