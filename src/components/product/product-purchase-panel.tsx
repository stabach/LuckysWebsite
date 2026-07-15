"use client";

import { Check, Minus, Plus, Ruler, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/catalog-schema";
import { formatCurrency } from "@/lib/catalog";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const availableVariants = useMemo(
    () => product.variants.filter((variant) => variant.active && variant.status !== "out_of_stock"),
    [product.variants]
  );
  const [variantId, setVariantId] = useState(availableVariants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const selectedVariant = availableVariants.find((variant) => variant.id === variantId);
  const price = selectedVariant?.priceCents ?? product.priceCents;
  const isGuard = product.id === "psa-guards";

  function addToCart() {
    if (!selectedVariant) return;
    addItem(selectedVariant.id, quantity);
  }

  return (
    <div className="product-purchase-panel">
      <div className="product-status-line"><span><i /> In stock</span><span>SKU {product.sku}</span></div>
      <p className="product-purchase-price">{product.bulkPricing ? `From ${formatCurrency(product.bulkPricing.at(-1)?.unitPriceCents ?? price)}` : formatCurrency(price)}</p>
      {product.bulkPricing ? <p className="product-price-note">$7 each for 1–9 • $6 each for 10–24 • $4 each for 25+</p> : null}

      <div className="purchase-fit-box">
        <strong><Ruler size={17} aria-hidden="true" /> Verified fit</strong>
        <ul>{product.fitment.map((fit) => <li key={fit}><Check size={14} aria-hidden="true" /> {fit}</li>)}</ul>
      </div>

      {isGuard ? (
        <div className="guard-builder-bridge">
          <strong>Mix all 15 colors</strong>
          <p>Build quantities by color and unlock one cart-wide price tier.</p>
          <Link className="button button-primary" href="#bundle-builder">Choose colors</Link>
        </div>
      ) : (
        <>
          {availableVariants.length > 1 || product.categoryId === "toploader-binders" ? (
            <fieldset className="purchase-variants">
              <legend>Available color</legend>
              <div>
                {availableVariants.map((variant) => (
                  <label key={variant.id}>
                    <input type="radio" name={`${product.id}-variant`} value={variant.id} checked={variant.id === variantId} onChange={() => setVariantId(variant.id)} />
                    <span style={{ backgroundColor: variant.colorHex }} aria-hidden="true" /> {variant.label}
                  </label>
                ))}
              </div>
              {product.categoryId === "toploader-binders" ? <p>Only active, in-stock size/color combinations are shown.</p> : null}
            </fieldset>
          ) : null}
          <div className="purchase-action-row">
            <div className="quantity-control" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity"><Minus size={16} aria-hidden="true" /></button>
              <span aria-live="polite">{quantity}</span>
              <button type="button" onClick={() => setQuantity((current) => Math.min(product.maxPerOrder, current + 1))} aria-label="Increase quantity"><Plus size={16} aria-hidden="true" /></button>
            </div>
            <button className="button button-primary purchase-add-button" type="button" onClick={addToCart} disabled={!selectedVariant}>
              Add to Loot <ShoppingBag size={17} aria-hidden="true" />
            </button>
          </div>
        </>
      )}

      <div className="purchase-microcopy">
        <p><Check size={14} aria-hidden="true" /> Secure Stripe checkout</p>
        <p><Check size={14} aria-hidden="true" /> Richmond / Houston-area pickup</p>
        <p><Check size={14} aria-hidden="true" /> Exact pickup details after payment</p>
      </div>
      {product.categoryId === "toploader-binders" ? (
        <Link className="engraving-link" href={`/contact?topic=engraving&product=${product.slug}`}>Ask about custom engraving · Quote required</Link>
      ) : null}
      <Link className="product-fit-question" href={`/contact?topic=product-fit&product=${product.slug}`}>Ask a Product Fit Question</Link>

      {!isGuard && selectedVariant ? (
        <div className="mobile-sticky-add">
          <span><strong>{product.shortName}</strong><small>{formatCurrency(price)}</small></span>
          <button className="button button-primary" type="button" onClick={addToCart}>Add to Loot</button>
        </div>
      ) : null}
    </div>
  );
}
