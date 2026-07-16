import type { Metadata } from "next";
import { ChevronRight, Check, MapPin, Ruler } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HomeProductCard } from "@/components/home/product-card";
import { GuardBundleBuilder } from "@/components/product/guard-bundle-builder";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { JsonLd } from "@/components/seo/json-ld";
import {
  activeProducts,
  formatCurrency,
  getCategoryById,
  getProductBySlug,
  getRelatedProducts,
  getVerifiedFeatures,
  getVerifiedSpecifications
} from "@/lib/catalog";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getProductStructuredData
} from "@/lib/seo";

export function generateStaticParams() {
  return activeProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.status !== "active") return {};
  const primaryImage = product.images.find((media) => media.type === "image");

  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: primaryImage
      ? {
          title: product.name,
          description: product.summary,
          images: [{ url: primaryImage.src, width: primaryImage.width, height: primaryImage.height, alt: primaryImage.alt }]
        }
      : undefined
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.status !== "active") notFound();

  const category = getCategoryById(product.categoryId);
  const verifiedFeatures = getVerifiedFeatures(product);
  const verifiedSpecifications = getVerifiedSpecifications(product);
  const relatedProducts = getRelatedProducts(product);

  return (
    <article className="product-page">
      <JsonLd
        data={[
          getProductStructuredData(product),
          getBreadcrumbStructuredData([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.name, path: `/products/${product.slug}` }
          ]),
          getFaqStructuredData(product.faq)
        ]}
      />
      <div className="section-shell product-breadcrumb-wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><ChevronRight size={14} aria-hidden="true" />
          <Link href="/shop">Shop</Link><ChevronRight size={14} aria-hidden="true" />
          {category ? <><Link href={`/collections/${category.slug}`}>{category.name}</Link><ChevronRight size={14} aria-hidden="true" /></> : null}
          <span aria-current="page">{product.shortName}</span>
        </nav>
      </div>

      {product.id === "psa-guards" ? (
        <GuardBundleBuilder />
      ) : (
        <section className="section-shell product-hero" aria-labelledby="product-title">
          <ProductGallery media={product.images} productName={product.name} />
          <div className="product-hero-copy">
            <p className="eyebrow">{product.eyebrow}</p>
            <h1 id="product-title">{product.name}</h1>
            <p className="product-summary">{product.summary}</p>
            <p className="product-description">{product.description}</p>
            <ProductPurchasePanel product={product} />
          </div>
        </section>
      )}

      <section className="product-benefits section-pad" aria-labelledby="benefits-title">
        <div className="section-shell">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Verified product details</p>
              <h2 id="benefits-title">Designed for the display, explained plainly.</h2>
            </div>
            <p className="section-lede">Only launch-catalog claims marked as verified are shown here.</p>
          </div>
          <div className="product-benefit-grid">
            {verifiedFeatures.map((feature, index) => (
              <article key={feature.title}>
                <span>0{index + 1}</span>
                <Check size={21} aria-hidden="true" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="product-detail-section section-pad" aria-labelledby="fit-spec-title">
        <div className="section-shell product-detail-grid">
          <div className="product-fit-panel">
            <Ruler size={26} aria-hidden="true" />
            <p className="eyebrow">Fit before checkout</p>
            <h2 id="fit-spec-title">Know what this product supports.</h2>
            <ul>
              {product.fitment.map((fit) => <li key={fit}><Check size={16} aria-hidden="true" /> {fit}</li>)}
            </ul>
            {product.fitmentWarnings?.map((warning) => <p className="fitment-warning" key={warning}>{warning}</p>)}
            <Link className="button button-secondary" href={`/contact?topic=product-fit&product=${product.slug}`}>Ask a Product Fit Question</Link>
          </div>
          <div className="product-spec-panel">
            <p className="eyebrow">Specifications</p>
            <dl>
              {verifiedSpecifications.map((specification) => (
                <div key={specification.label}><dt>{specification.label}</dt><dd>{specification.value}</dd></div>
              ))}
              <div><dt>Price</dt><dd>{product.bulkPricing ? `${formatCurrency(product.priceCents)} starting unit price` : formatCurrency(product.priceCents)}</dd></div>
              <div><dt>Fulfillment</dt><dd>Houston-area or eligible event pickup</dd></div>
            </dl>
            <div className="private-pickup-note"><MapPin size={17} aria-hidden="true" /><span>Exact private pickup details are sent after payment and order confirmation.</span></div>
          </div>
        </div>
      </section>

      <section className="product-faq-section section-pad" aria-labelledby="product-faq-title">
        <div className="section-shell product-faq-grid">
          <div>
            <p className="eyebrow">Product questions</p>
            <h2 id="product-faq-title">Before it joins the shelf.</h2>
          </div>
          <div className="faq-list">
            {product.faq.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>{item.question}<span aria-hidden="true">+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="related-products section-pad" aria-labelledby="related-title">
          <div className="section-shell">
            <div className="section-heading-row">
              <div><p className="eyebrow">Keep building</p><h2 id="related-title">Related protection.</h2></div>
              <Link className="text-link" href="/shop">Shop all products</Link>
            </div>
            <div className="related-product-grid">
              {relatedProducts.map((related) => <HomeProductCard product={related} key={related.id} />)}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
