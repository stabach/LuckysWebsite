import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GuardColorTransition } from "@/components/guard-color-transition";
import { HomeCartAction } from "@/components/home/cart-action";
import { psaGuardColors } from "@/data/catalog";
import type { Product } from "@/lib/catalog-schema";
import { formatCurrency, getDefaultVariant, getPrimaryImage } from "@/lib/catalog";

const catalogGuardColor = psaGuardColors.find((color) => color.slug === "diamond") ?? psaGuardColors[0]!;

export function HomeProductCard({ product }: { product: Product }) {
  const image = getPrimaryImage(product);
  const defaultVariant = getDefaultVariant(product);
  const isGuard = product.id === "psa-guards";
  const isAcrylic = product.categoryId === "acrylic-cases";
  const needsOptions = isGuard || product.categoryId === "toploader-binders";
  const optionLabel = isGuard ? "Choose colors" : "Choose options";

  return (
    <article className={`home-product-card${isGuard || isAcrylic ? " home-product-card-neutral" : ""}`}>
      <Link
        className={`home-product-media${isGuard ? " home-product-media-guard" : ""}${isAcrylic ? ` home-product-media-acrylic is-${product.id}` : ""}`}
        href={`/products/${product.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        {isGuard ? (
          <GuardColorTransition
            color={catalogGuardColor}
            alt=""
            sizes="(max-width: 640px) 92vw, (max-width: 1080px) 46vw, 23vw"
          />
        ) : (
          <Image
            src={image.src}
            alt=""
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1080px) 46vw, 23vw"
          />
        )}
        {product.badges?.[0] ? <span className="product-badge">{product.badges[0]}</span> : null}
      </Link>
      <div className="home-product-copy">
        <p className="product-fit"><Check size={14} aria-hidden="true" /> {product.fitment[0]}</p>
        <h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3>
        <div className="product-price-row">
          <strong>{product.bulkPricing ? `From ${formatCurrency(product.bulkPricing.at(-1)?.unitPriceCents ?? product.priceCents)}` : formatCurrency(product.priceCents)}</strong>
          <span>{product.stockStatus === "in_stock" ? "In stock" : "Check availability"}</span>
        </div>
        {needsOptions ? (
          <Link className="button button-secondary product-card-action" href={`/products/${product.slug}`}>
            {optionLabel} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        ) : defaultVariant ? (
          <HomeCartAction variantId={defaultVariant.id} className="product-card-action" />
        ) : null}
      </div>
    </article>
  );
}
