import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/info/content-page";
import { JsonLd } from "@/components/seo/json-ld";
import { storeFaqs } from "@/data/faqs";
import { getFaqStructuredData } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about Lucky's Loot fitment, PSA Guard pricing, pickup, and orders.",
  alternates: { canonical: "/faq" }
};

export default function FaqPage() {
  return (
    <ContentPage
      eyebrow="Collector help"
      title="Straight answers before you add to Loot."
      intro="Fitment and operating details are stated only where they are verified. When a policy or measurement is still pending, the answer says so."
    >
      <JsonLd data={getFaqStructuredData(storeFaqs)} />
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
          <p>Send your product measurements with a Product Fit Question before ordering.</p>
        </div>
        <div className="button-row">
          <Link className="button button-primary" href="/contact?topic=product-fit">
            Ask a fit question
          </Link>
        </div>
      </div>
    </ContentPage>
  );
}
