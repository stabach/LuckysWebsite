"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { psaGuardColors } from "@/data/catalog";

type GuardColor = (typeof psaGuardColors)[number];

type GuardColorTransitionProps = {
  color: GuardColor;
  sizes: string;
  alt: string;
};

function GuardArtwork({ color, sizes, alt }: GuardColorTransitionProps) {
  return (
    <span className="guard-color-artwork">
      <Image className="guard-color-product-image" src={color.image} alt={alt} fill sizes={sizes} />
      <span className="guard-color-face" aria-hidden="true" />
      <Image
        className="guard-color-reflection-image"
        src={color.image}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
      />
    </span>
  );
}

export function GuardColorTransition({ color, sizes, alt }: GuardColorTransitionProps) {
  const [renderedColor, setRenderedColor] = useState(color);
  const [previousColor, setPreviousColor] = useState<GuardColor | null>(null);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    if (color.slug === renderedColor.slug) return;

    setPreviousColor(renderedColor);
    setRenderedColor(color);
    setTransitionKey((current) => current + 1);
  }, [color, renderedColor]);

  return (
    <div className="guard-color-transition">
      {previousColor ? (
        <span className="guard-color-frame guard-color-frame-previous" aria-hidden="true">
          <GuardArtwork color={previousColor} alt="" sizes={sizes} />
        </span>
      ) : null}

      <span
        key={`${renderedColor.slug}-${transitionKey}`}
        className={`guard-color-frame${previousColor ? " is-revealing" : ""}`}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) setPreviousColor(null);
        }}
      >
        <GuardArtwork color={renderedColor} alt={alt} sizes={sizes} />
      </span>

      {previousColor ? <span key={`sweep-${transitionKey}`} className="guard-color-sweep" aria-hidden="true" /> : null}
    </div>
  );
}
