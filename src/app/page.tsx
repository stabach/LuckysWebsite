import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarDays,
  Check,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Ruler,
  Sparkles,
  Store,
  SwatchBook
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GuardColorShowcase } from "@/components/home/guard-color-showcase";
import { HeroMedia } from "@/components/home/hero-media";
import { HomeProductCard } from "@/components/home/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { activeProducts, getProductById } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" }
};

const collectionCards = [
  {
    title: "Protect Sealed Product",
    description: "Display-ready acrylic cases for standard ETBs, booster boxes, and booster bundles.",
    href: "/collections/protect-sealed-product",
    image: "/products/acrylic/etb-case.webp",
    alt: "Clear ETB acrylic case on a dark studio background",
    productIds: ["acrylic-etb-case", "acrylic-booster-box-case", "acrylic-booster-bundle-case"]
  },
  {
    title: "Protect Graded Cards",
    description: "A clear slab display and a full palette of PSA-style edge protection.",
    href: "/collections/protect-graded-cards",
    image: "/products/psa-guards/color-lineup.webp",
    alt: "Colorful Lucky’s Loot PSA Guards arranged on a dark background",
    productIds: ["acrylic-crystal-slab-case", "psa-guards"]
  },
  {
    title: "Store Your Collection",
    description: "Zippered, side-loading binders for cards already protected in Toploaders.",
    href: "/collections/toploader-binders",
    image: "/products/binders/4-pocket.webp",
    alt: "Lineup of zippered collector binders",
    productIds: ["toploader-binder-4-pocket", "toploader-binder-9-pocket"]
  }
] as const;

const bestSellerIds = [
  "acrylic-etb-case",
  "acrylic-booster-box-case",
  "psa-guards",
  "toploader-binder-9-pocket"
];

const faqs = [
  {
    question: "Where does pickup happen?",
    answer:
      "Orders use Richmond / Houston-area pickup or an eligible event pickup. Exact private pickup details are sent after payment and order confirmation."
  },
  {
    question: "How soon will my order be ready?",
    answer:
      "A universal readiness window is not published yet. Lucky’s Loot confirms timing for each order after checkout."
  },
  {
    question: "Does the product include the collectible shown?",
    answer:
      "No. Display photos demonstrate the protection product; cards, slabs, sealed boxes, and other collectibles are not included unless a listing explicitly says otherwise."
  },
  {
    question: "How do I determine the right fit?",
    answer:
      "Use Find Your Fit for verified matches. If your item is a specialty format or different grader, measure it and send a Product Fit Question before ordering."
  },
  {
    question: "How does PSA Guard bulk pricing work?",
    answer:
      "Guards are $7 each for 1–9, $6 each for 10–24, and $4 each at 25 or more. The active tier applies automatically to every guard in the cart."
  },
  {
    question: "Can I mix PSA Guard colors?",
    answer: "Yes. All 15 colorways combine toward the same cart-wide quantity tier."
  },
  {
    question: "What happens if an item is damaged or needs to be returned?",
    answer:
      "Use the contact form promptly with your order details. Eligibility and next steps follow the published Pickup & Returns policy."
  },
  {
    question: "Can I request custom binder engraving?",
    answer:
      "Yes. Engraving is handled as a quote request while exact pricing, artwork limits, eligible variants, and turnaround are confirmed."
  }
] as const;

export default function HomePage() {
  const bestSellers = bestSellerIds
    .map((id) => getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <div className="home-page">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Lucky’s Loot",
            url: absoluteUrl("/"),
            logo: absoluteUrl("/brand/luckys-loot-mark-512.png")
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Lucky’s Loot",
            url: absoluteUrl("/"),
            potentialAction: {
              "@type": "SearchAction",
              target: `${absoluteUrl("/shop")}?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          }
        ]}
      />
      <section className="home-hero section-shell" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="eyebrow">Collector display and protection</p>
          <h1 id="home-title" aria-label="Protect the collection. Show off the chase.">
            <span className="home-title-opening" aria-hidden="true">
              <span className="home-title-line is-protect">Protect the</span>
              <span className="home-title-line">collection.</span>
            </span>
            <span className="home-title-closing" aria-hidden="true">
              <span className="home-title-line">Show off</span>
              <span className="home-title-line">the chase.</span>
            </span>
          </h1>
          <p className="lede">
            Crystal-clear acrylic cases, colorful slab protection, and Toploader binders built for collectors who care how their setup looks.
          </p>
          <div className="button-row">
            <ButtonLink href="/shop">Shop Supplies</ButtonLink>
            <ButtonLink href="/find-your-fit" variant="secondary">Find Your Fit</ButtonLink>
          </div>
          <Link className="text-link" href="/contact?topic=product-fit">
            Ask a Product Question <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <p className="hero-pickup-line"><MapPin size={15} aria-hidden="true" /> Houston-area pickup • Event pickup when available</p>
        </div>
        <HeroMedia />
      </section>

      <section className="trust-strip" aria-label="Why shop Lucky’s Loot">
        <div className="section-shell trust-grid">
          <span><Store size={19} aria-hidden="true" /><strong>Collector-owned</strong></span>
          <span><LockKeyhole size={19} aria-hidden="true" /><strong>Secure Stripe checkout</strong></span>
          <span><MapPin size={19} aria-hidden="true" /><strong>Houston-area pickup</strong></span>
          <span><SwatchBook size={19} aria-hidden="true" /><strong>Mixed-color bulk pricing</strong></span>
        </div>
      </section>

      <section className="collection-section section-pad" aria-labelledby="collections-title">
        <div className="section-shell">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Shop with a purpose</p>
              <h2 id="collections-title">Start with what you collect.</h2>
            </div>
            <Link className="text-link" href="/shop">Shop all 7 products <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className="collection-card-grid">
            {collectionCards.map((collection) => {
              const productIds = collection.productIds as ReadonlyArray<string>;
              const count = activeProducts.filter((product) => productIds.includes(product.id)).length;
              return (
                <Link className="collection-card" href={collection.href} key={collection.title}>
                  <span className="collection-card-media">
                    <Image src={collection.image} alt={collection.alt} fill sizes="(max-width: 840px) 94vw, 32vw" />
                  </span>
                  <span className="collection-card-copy">
                    <small>{count} product{count === 1 ? "" : "s"}</small>
                    <strong>{collection.title}</strong>
                    <span>{collection.description}</span>
                    <em>Explore collection <ArrowRight size={16} aria-hidden="true" /></em>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="best-sellers section-pad" aria-labelledby="best-sellers-title">
        <div className="section-shell">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Collector favorites</p>
              <h2 id="best-sellers-title">Build the shelf from here.</h2>
            </div>
            <Link className="text-link" href="/shop">See every product <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className="home-product-grid">
            {bestSellers.map((product) => <HomeProductCard product={product} key={product.id} />)}
          </div>
        </div>
      </section>

      <GuardColorShowcase />

      <section className="acrylic-story section-pad" aria-labelledby="acrylic-story-title">
        <div className="section-shell acrylic-story-grid">
          <div className="acrylic-story-copy">
            <p className="eyebrow">Verified on the ETB Acrylic Case</p>
            <h2 id="acrylic-story-title">Protection that stays out of the artwork’s way.</h2>
            <p className="section-lede">
              The ETB case pairs a substantial clear build with display-friendly finishing. Claims shown here come from the verified launch catalog.
            </p>
            <ButtonLink href="/products/etb-acrylic-case" variant="secondary">Explore the ETB case</ButtonLink>
          </div>
          <div className="acrylic-feature-grid">
            <article><Ruler aria-hidden="true" /><strong>8 mm</strong><span>Acrylic construction</span></article>
            <article><Sparkles aria-hidden="true" /><strong>Polished</strong><span>Rounded edges</span></article>
            <article><PackageCheck aria-hidden="true" /><strong>Removable</strong><span>Magnetic lid</span></article>
            <article><Check aria-hidden="true" /><strong>Clear</strong><span>Display-first view</span></article>
          </div>
        </div>
      </section>

      <section className="pickup-section section-pad" aria-labelledby="pickup-title">
        <div className="section-shell">
          <div className="pickup-heading">
            <p className="eyebrow">Local checkout, clear expectations</p>
            <h2 id="pickup-title">How pickup works.</h2>
            <p className="section-lede">Choose the pickup option before paying. Exact private details follow only after checkout and order confirmation.</p>
          </div>
          <ol className="pickup-steps">
            <li><span>01</span><strong>Add products to Your Loot</strong><p>Build your order and review fit notes before checkout.</p></li>
            <li><span>02</span><strong>Choose your pickup</strong><p>Select Richmond / Houston-area pickup or an eligible future event.</p></li>
            <li><span>03</span><strong>Receive exact details</strong><p>Pickup instructions and order timing are confirmed after payment.</p></li>
          </ol>
          <Link className="text-link pickup-policy-link" href="/pickup-and-returns">Read Pickup & Returns <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="event-empty-section section-pad" aria-labelledby="event-title">
        <div className="section-shell event-empty-card">
          <div className="event-empty-icon"><CalendarDays size={30} aria-hidden="true" /></div>
          <div>
            <p className="eyebrow">See Lucky’s Loot in person</p>
            <h2 id="event-title">The next event is being lined up.</h2>
            <p>No verified future event is published right now. Check the event page for newly confirmed dates and pickup eligibility.</p>
          </div>
          <ButtonLink href="/events" variant="secondary">View events</ButtonLink>
        </div>
      </section>

      <section className="home-faq section-pad" aria-labelledby="home-faq-title">
        <div className="section-shell faq-grid">
          <div className="faq-heading">
            <p className="eyebrow">Good to know</p>
            <h2 id="home-faq-title">Questions before checkout.</h2>
            <p className="section-lede">Fit, pickup, tiers, and quotes—without buried fine print.</p>
            <ButtonLink href="/faq" variant="secondary">Visit full FAQ</ButtonLink>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
