import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/info/content-page";

export const metadata: Metadata = {
  title: "Terms",
  description: "Operational terms for using the Lucky's Loot storefront.",
  alternates: { canonical: "/terms" }
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Store terms"
      title="Clear storefront expectations."
      intro="These operational terms describe the implemented V2 experience and require owner and legal approval before production publication."
    >
      <ContentSection title="Products and fitment">
        <p>
          Product photos may include collectibles for fitment context; collectibles are not included
          unless explicitly listed. Specialty boxes and non-PSA grading formats vary, so customers
          should review warnings, measure when directed, and ask before purchasing if compatibility
          is uncertain.
        </p>
      </ContentSection>
      <ContentSection title="Pricing and payment">
        <p>
          Displayed prices are in U.S. dollars. PSA Guard tiers are calculated across all Guard colors
          in the cart and recalculated on the server before Stripe creates checkout. Tax treatment is
          controlled by the verified production Stripe configuration and remains a launch check.
        </p>
      </ContentSection>
      <ContentSection title="Pickup and order status">
        <p>
          Current checkout is pickup-based. Exact pickup details are private and shared after payment.
          An event option is valid only while its published event and cutoff remain eligible. A paid
          order may still require handoff coordination before it is ready.
        </p>
      </ContentSection>
      <ContentSection title="Returns and custom work">
        <p>
          The return window, complete eligibility rules, and custom-engraving limitations are not yet
          approved for publication. Engraving is therefore not an active checkout option. Confirm any
          return-sensitive requirement before purchase.
        </p>
      </ContentSection>
      <ContentSection title="Site use">
        <p>
          Do not misuse the storefront, attempt unauthorized access, interfere with checkout or account
          services, or submit unlawful content. Product availability and storefront content may change
          as inventory and verified information are updated.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
