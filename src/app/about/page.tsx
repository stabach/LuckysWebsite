import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, MapPin, Ruler } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Lucky's Loot display and protection supplies for collectors in the Houston area."
};

export default function AboutPage() {
  return (
    <div className="info-page about-page">
      <section className="about-hero section-shell">
        <div>
          <p className="eyebrow">About Lucky’s Loot</p>
          <h1>Collector supplies with display energy.</h1>
          <p>
            Lucky’s Loot brings together acrylic cases, colorful slab protection, and Toploader
            binders in a pickup-first storefront built around verified fitment and clear pricing.
          </p>
          <div className="button-row">
            <Link className="button button-primary" href="/shop">Shop supplies</Link>
            <Link className="button button-secondary" href="/find-your-fit">Find Your Fit</Link>
          </div>
        </div>
        <div className="about-mark">
          <Image src="/brand/luckys-loot-logo.webp" alt="Lucky's Loot mascot" fill sizes="(min-width: 900px) 38vw, 80vw" priority />
        </div>
      </section>

      <section className="about-values section-shell" aria-label="Lucky's Loot operating principles">
        <article><Eye aria-hidden="true" size={22} /><h2>Display stays visible</h2><p>Protection products are presented around the collection, not as a substitute for it.</p></article>
        <article><Ruler aria-hidden="true" size={22} /><h2>Fit before hype</h2><p>Standard matches are stated clearly; uncertain specialty formats are sent to measurements.</p></article>
        <article><MapPin aria-hidden="true" size={22} /><h2>Local handoff</h2><p>Orders use Richmond / Houston-area pickup or a verified eligible event.</p></article>
      </section>
    </div>
  );
}
