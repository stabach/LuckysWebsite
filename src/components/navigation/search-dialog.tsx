"use client";

import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import type { RefObject } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDialogFocus } from "@/hooks/use-dialog-focus";
import { activeProducts, formatCurrency } from "@/lib/catalog";

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export function SearchDialog({ open, onClose, triggerRef }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useDialogFocus(open, dialogRef, close, triggerRef);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return activeProducts.slice(0, 4);

    return activeProducts.filter((product) =>
      [product.name, product.summary, ...product.fitment, ...product.keywords]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="dialog-layer" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <div
        ref={dialogRef}
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
      >
        <div className="search-dialog-head">
          <div>
            <p className="eyebrow">Search the collection</p>
            <h2 id="search-dialog-title">What are you protecting?</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close search">
            <X aria-hidden="true" size={20} />
          </button>
        </div>
        <label className="search-field">
          <Search aria-hidden="true" size={20} />
          <span className="sr-only">Search products</span>
          <input
            data-dialog-initial-focus
            type="search"
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
            placeholder="Try ETB, slab, guard, or binder"
          />
        </label>
        <div className="search-results" aria-live="polite">
          <p className="search-result-count">
            {query.trim() ? `${matches.length} result${matches.length === 1 ? "" : "s"}` : "Popular picks"}
          </p>
          {matches.length ? (
            <ul>
              {matches.map((product) => (
                <li key={product.id}>
                  <Link href={`/products/${product.slug}`} onClick={onClose}>
                    <span>
                      <strong>{product.name}</strong>
                      <small>{product.fitment[0]}</small>
                    </span>
                    <span>
                      {formatCurrency(product.priceCents)} <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-empty">
              <p>No exact match yet.</p>
              <Link href="/find-your-fit" onClick={onClose}>Use Find Your Fit</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
