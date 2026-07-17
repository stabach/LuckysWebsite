"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { GuardColorTransition } from "@/components/guard-color-transition";
import { psaGuardColors } from "@/data/catalog";
import { formatCurrency } from "@/lib/catalog";
import { getGuardPricingMessage, getGuardUnitPriceCents } from "@/lib/pricing";

const MAX_GUARDS_PER_ORDER = 99;

export function GuardBundleBuilder() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedSlug, setSelectedSlug] = useState("emerald");
  const { addItems, psaGuardCount } = useCart();
  const selected = psaGuardColors.find((color) => color.slug === selectedSlug) ?? psaGuardColors[0];
  const total = useMemo(() => Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0), [quantities]);
  const projectedTotal = total + psaGuardCount;
  const bundleMaximum = Math.max(0, MAX_GUARDS_PER_ORDER - psaGuardCount);
  const unitPrice = getGuardUnitPriceCents(projectedTotal);
  const subtotal = unitPrice * total;
  const nextTierTarget = projectedTotal >= 25 ? 25 : projectedTotal >= 10 ? 25 : 10;
  const progress = projectedTotal >= 25 ? 100 : Math.min(100, (projectedTotal / nextTierTarget) * 100);

  function updateColor(slug: string, nextQuantity: number) {
    setSelectedSlug(slug);
    setQuantities((current) => {
      const currentTotal = Object.values(current).reduce((sum, quantity) => sum + quantity, 0);
      const existing = current[slug] ?? 0;
      const maximumForColor = Math.max(0, bundleMaximum - (currentTotal - existing));
      const quantity = Math.min(Math.max(0, Math.floor(nextQuantity)), maximumForColor);
      const next = { ...current };
      if (quantity === 0) delete next[slug];
      else next[slug] = quantity;
      return next;
    });
  }

  function addBundle() {
    const lines = Object.entries(quantities).map(([slug, quantity]) => ({
      variantId: `psa-guards-${slug}`,
      quantity
    }));
    if (!lines.length) return;
    addItems(lines);
    setQuantities({});
  }

  return (
    <section id="bundle-builder" className="guard-builder-section section-pad" aria-labelledby="guard-builder-title">
      <div className="section-shell guard-builder-layout">
        <div className="guard-builder-preview">
          <div
            className="guard-builder-image guard-platform-stage"
            style={{ "--guard-glow": selected.colorHex } as React.CSSProperties}
          >
            <GuardColorTransition color={selected} alt={`${selected.name} Lucky’s Loot PSA Guard`} sizes="(max-width: 900px) 90vw, 42vw" />
          </div>
          <span>
            <i
              className={selected.slug === "midnight-gold" ? "midnight-gold-swatch" : undefined}
              style={selected.slug === "midnight-gold" ? undefined : { backgroundColor: selected.colorHex }}
            />
            {selected.name}
          </span>
        </div>
        <div className="guard-builder-controls">
          <p className="eyebrow">Mix colors, share one tier</p>
          <h1 id="guard-builder-title">Build your PSA Guard bundle.</h1>
          <p className="section-lede">Set a quantity for every color you want. Existing Guards in Your Loot count toward the projected price shown here.</p>
          <div className="guard-builder-summary" aria-live="polite">
            <span><small>Selected</small><strong>{total}</strong></span>
            <span><small>Projected unit price</small><strong>{formatCurrency(unitPrice)}</strong></span>
            <span><small>Bundle subtotal</small><strong>{formatCurrency(subtotal)}</strong></span>
          </div>
          <div className="guard-builder-progress">
            <div><span style={{ width: `${progress}%` }} /></div>
            <p>{getGuardPricingMessage(projectedTotal)}</p>
            {psaGuardCount ? <small>{psaGuardCount} Guard{psaGuardCount === 1 ? "" : "s"} already in Your Loot.</small> : null}
          </div>
          <div className="guard-builder-color-grid">
            {psaGuardColors.map((color) => {
              const quantity = quantities[color.slug] ?? 0;
              return (
                <article className={color.slug === selected.slug ? "is-selected" : undefined} key={color.slug}>
                  <button className="guard-color-preview" type="button" onClick={() => setSelectedSlug(color.slug)} aria-label={`Preview ${color.name}`} aria-pressed={color.slug === selected.slug}>
                    <span
                      className={color.slug === "midnight-gold" ? "midnight-gold-swatch" : undefined}
                      style={color.slug === "midnight-gold" ? undefined : { backgroundColor: color.colorHex }}
                      aria-hidden="true"
                    />
                    <strong>{color.name}</strong>
                  </button>
                  <div className="guard-color-quantity" aria-label={`${color.name} quantity`}>
                    <button type="button" onClick={(event) => { event.stopPropagation(); updateColor(color.slug, quantity - 1); }} aria-label={`Decrease ${color.name}`} disabled={quantity === 0}><Minus size={14} aria-hidden="true" /></button>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={quantity}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => updateColor(color.slug, Number(event.target.value))}
                      aria-label={`${color.name} quantity`}
                    />
                    <button type="button" onClick={(event) => { event.stopPropagation(); updateColor(color.slug, quantity + 1); }} aria-label={`Increase ${color.name}`} disabled={total >= bundleMaximum}><Plus size={14} aria-hidden="true" /></button>
                  </div>
                </article>
              );
            })}
          </div>
          <button className="button button-primary guard-builder-add" type="button" onClick={addBundle} disabled={!total}>
            Add {total || "bundle"} to Your Loot <ShoppingBag size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
