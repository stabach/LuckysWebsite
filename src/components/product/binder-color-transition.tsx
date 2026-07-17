"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProductVariant } from "@/lib/catalog-schema";

type BinderColorTransitionProps = {
  variant: ProductVariant;
  productName: string;
};

function BinderArtwork({
  variant,
  productName
}: BinderColorTransitionProps) {
  if (!variant.image) return null;

  return (
    <span className="binder-color-artwork">
      <Image
        className="binder-color-product-image"
        src={variant.image}
        alt={`${variant.label} ${productName}`}
        fill
        priority
        sizes="(max-width: 900px) 92vw, 54vw"
      />
      <Image
        className="binder-color-reflection-image"
        src={variant.image}
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 900px) 92vw, 54vw"
      />
    </span>
  );
}

export function BinderColorTransition({
  variant,
  productName
}: BinderColorTransitionProps) {
  const [renderedVariant, setRenderedVariant] = useState(variant);
  const [previousVariant, setPreviousVariant] = useState<ProductVariant | null>(null);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    if (variant.id === renderedVariant.id) return;

    setPreviousVariant(renderedVariant);
    setRenderedVariant(variant);
    setTransitionKey((current) => current + 1);
  }, [renderedVariant, variant]);

  return (
    <div className="binder-color-transition">
      {previousVariant ? (
        <span className="binder-color-frame binder-color-frame-previous" aria-hidden="true">
          <BinderArtwork variant={previousVariant} productName={productName} />
        </span>
      ) : null}

      <span
        key={`${renderedVariant.id}-${transitionKey}`}
        className={`binder-color-frame${previousVariant ? " is-revealing" : ""}`}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) setPreviousVariant(null);
        }}
      >
        <BinderArtwork variant={renderedVariant} productName={productName} />
      </span>

      {previousVariant ? (
        <span key={`sweep-${transitionKey}`} className="binder-color-sweep" aria-hidden="true" />
      ) : null}
    </div>
  );
}
