import type { Metadata } from "next";
import { ImageIcon, MessageSquareQuote, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ContentPage } from "@/components/info/content-page";
import { storeReviews } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Collector Displays",
  description: "Lucky's Loot customer display stories and review publication policy.",
  alternates: { canonical: "/reviews" }
};

export default function ReviewsPage() {
  const publishedReviews = storeReviews.filter((review) => review.moderationStatus === "published");

  return (
    <ContentPage
      eyebrow="Collector displays"
      title="Real collections, only with permission."
      intro="Lucky’s Loot does not import third-party reviews or invent social proof. Ratings and customer photos appear only after the source and publication permission are verified."
    >
      {publishedReviews.length ? (
        <div className="review-grid">
          {publishedReviews.map((review) => (
            <article key={review.id}>
              <p>{review.body}</p>
              <h2>{review.title}</h2>
              <span>{review.verifiedPurchase ? "Verified purchase" : "Customer submission"}</span>
            </article>
          ))}
        </div>
      ) : (
        <section className="review-ready-state">
          <MessageSquareQuote aria-hidden="true" size={34} />
          <h2>Review publishing is ready; verified stories are not yet available.</h2>
          <p>
            The schema supports ratings, product links, display photos, verified-purchase state,
            dates, and moderation. Counts and stars stay hidden until a real review is approved.
          </p>
          <div className="review-principles">
            <span><ShieldCheck aria-hidden="true" size={17} /> Verified source</span>
            <span><ImageIcon aria-hidden="true" size={17} /> Photo permission</span>
          </div>
          <Link className="button button-secondary" href="/contact?topic=general">
            Share a collector display
          </Link>
        </section>
      )}
    </ContentPage>
  );
}
