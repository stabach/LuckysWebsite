import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/info/content-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How the Lucky's Loot storefront handles account, checkout, and contact information.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Privacy"
      title="The data needed to run the storefront."
      intro="This notice describes the V2 storefront’s implemented data flows. It should receive owner and legal review before production publication."
    >
      <ContentSection title="Information you provide">
        <p>
          Checkout may collect contact, billing, payment, pickup, and order-note information through
          Stripe. Customer accounts use Supabase authentication and may store profile and order
          history. The contact form collects the fields you submit and sends them through Resend.
        </p>
      </ContentSection>
      <ContentSection title="Storefront storage">
        <p>
          Your Loot and opener preference use browser storage on your device. The storefront may use
          essential cookies required for Supabase account sessions. Do not put payment-card details
          in product notes or contact messages.
        </p>
      </ContentSection>
      <ContentSection title="Service providers">
        <p>
          Stripe supports checkout and payment processing, Supabase supports authentication and order
          records, and Resend supports contact email delivery. Each provider processes data under its
          own terms and privacy practices.
        </p>
      </ContentSection>
      <ContentSection title="Requests and retention">
        <p>
          Retention periods and a formal privacy-request procedure require owner review. Until those
          details are finalized, send an Existing Order or General Question through the contact page
          for help locating the correct record.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
