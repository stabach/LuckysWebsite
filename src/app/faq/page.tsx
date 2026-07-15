import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/info/content-page";
import { storeFaqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about Lucky's Loot fitment, PSA Guard pricing, pickup, and orders."
};

export default function FaqPage() {
  return (
    <ContentPage
      eyebrow="Collector help"
      title="Straight answers before you add to Loot."
      intro="Fitment and operating details are stated only where they are verified. When a policy or measurement is still pending, the answer says so."
    >
      <section className="faq-page-list" aria-label="Frequently asked questions">
        {storeFaqs.map((faq) => (
          <details key={faq.id} id={faq.id}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>
      <div className="content-callout">
        <div>
          <h2>Still comparing a fit?</h2>
          <p>Use the guided tool first, or send measurements with a Product Fit Question.</p>
        </div>
        <div className="button-row">
          <Link className="button button-primary" href="/find-your-fit">
            Find Your Fit
          </Link>
          <Link className="button button-secondary" href="/contact?topic=product-fit">
            Ask a fit question
          </Link>
        </div>
      </div>
    </ContentPage>
  );
}
