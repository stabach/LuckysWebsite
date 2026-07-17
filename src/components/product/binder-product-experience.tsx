"use client";

import { useMemo, useState } from "react";
import { BinderColorTransition } from "@/components/product/binder-color-transition";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import type { Product } from "@/lib/catalog-schema";

export function BinderProductExperience({ product }: { product: Product }) {
  const availableVariants = useMemo(
    () => product.variants.filter((variant) => variant.active && variant.status !== "out_of_stock"),
    [product.variants]
  );
  const [selectedVariantId, setSelectedVariantId] = useState(availableVariants[0]?.id ?? "");
  const selectedVariant =
    availableVariants.find((variant) => variant.id === selectedVariantId) ?? availableVariants[0];

  if (!selectedVariant) return null;

  return (
    <section className="section-shell product-hero binder-product-hero" aria-labelledby="product-title">
      <div
        className="binder-product-stage guard-platform-stage"
        style={{ "--guard-glow": selectedVariant.colorHex ?? "#f7b733" } as React.CSSProperties}
      >
        <BinderColorTransition variant={selectedVariant} productName={product.name} />
        <span className="selected-color-label binder-selected-color">
          <i style={{ backgroundColor: selectedVariant.colorHex }} aria-hidden="true" />
          {selectedVariant.label}
        </span>
      </div>

      <div className="product-hero-copy">
        <p className="eyebrow">{product.eyebrow}</p>
        <h1 id="product-title">{product.name}</h1>
        <p className="product-summary">{product.summary}</p>
        <p className="product-description">{product.description}</p>
        <ProductPurchasePanel
          product={product}
          selectedVariantId={selectedVariant.id}
          onVariantChange={setSelectedVariantId}
        />
      </div>
    </section>
  );
}
