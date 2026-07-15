"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { psaGuardColors } from "@/data/catalog";

export function GuardColorShowcase() {
  const [selectedSlug, setSelectedSlug] = useState("emerald");
  const selected = psaGuardColors.find((color) => color.slug === selectedSlug) ?? psaGuardColors[0];

  return (
    <section className="guard-showcase section-pad" aria-labelledby="guard-colors-title">
      <div className="section-shell guard-showcase-grid">
        <div className="guard-showcase-media">
          <div className="guard-orbit" aria-hidden="true" />
          <Image
            key={selected.slug}
            src={selected.image}
            alt={`${selected.name} Lucky’s Loot PSA Guard`}
            fill
            sizes="(max-width: 840px) 82vw, 42vw"
          />
          <span className="selected-color-label"><i style={{ backgroundColor: selected.colorHex }} /> {selected.name}</span>
        </div>
        <div className="guard-showcase-copy">
          <p className="eyebrow">15 ways to frame the grade</p>
          <h2 id="guard-colors-title">Build a color mix that looks like your collection.</h2>
          <p className="section-lede">
            Every color counts toward one shared quantity tier. Mix the full palette and the cart applies the unlocked price automatically.
          </p>
          <div className="guard-pricing-steps" aria-label="PSA Guard bulk pricing">
            <span><strong>$7</strong><small>1–9 guards</small></span>
            <span><strong>$6</strong><small>10–24 guards</small></span>
            <span><strong>$4</strong><small>25+ guards</small></span>
          </div>
          <div className="guard-swatches" aria-label="Choose a PSA Guard color">
            {psaGuardColors.map((color) => (
              <button
                key={color.slug}
                type="button"
                className={color.slug === selected.slug ? "is-selected" : undefined}
                style={{ "--swatch-color": color.colorHex } as React.CSSProperties}
                onClick={() => setSelectedSlug(color.slug)}
                aria-label={`Show ${color.name}`}
                aria-pressed={color.slug === selected.slug}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
          <Link className="button button-primary" href="/products/psa-guards#bundle-builder">
            Open Guard Bundle Builder <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
