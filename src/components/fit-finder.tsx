"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  PackageSearch,
  RotateCcw,
  Search,
  ShieldCheck,
  TriangleAlert,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type CSSProperties, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { GuardColorTransition } from "@/components/guard-color-transition";
import { psaGuardColors } from "@/data/catalog";
import { formatCurrency, getDefaultVariant, getPrimaryImage, getProductById } from "@/lib/catalog";
import type { Product } from "@/lib/catalog-schema";
import type { FitFinderResult } from "@/lib/fitment";
import {
  createTypedSealedProduct,
  findSealedProductFit,
  getSealedProductById,
  getSealedProductTypeLabel,
  searchSealedProducts,
  sealedCatalogSummary,
  type SealedSearchProduct
} from "@/lib/sealed-product-search";

type FinderMode = "sealed" | "slabs" | "binders";

const finderModes: Array<{
  value: FinderMode;
  label: string;
  description: string;
  icon: typeof PackageSearch;
}> = [
  {
    value: "sealed",
    label: "Sealed Products",
    description: "Search ETBs, booster boxes, bundles, tins, collections, and more.",
    icon: PackageSearch
  },
  {
    value: "slabs",
    label: "PSA Slab Accessories",
    description: "Compare PSA Guards and the PSA Graded Guard Fit Acrylic Case.",
    icon: ShieldCheck
  },
  {
    value: "binders",
    label: "Binders",
    description: "Choose between compact and large Toploader binder formats.",
    icon: BookOpen
  }
];

const popularSearches = [
  "Surging Sparks Elite Trainer Box",
  "Prismatic Evolutions Booster Bundle",
  "151 Booster Bundle",
  "Evolving Skies Booster Box"
];

const fitFinderGuardColor = psaGuardColors.find((color) => color.slug === "emerald") ?? psaGuardColors[0]!;

export function FitFinder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const startedRef = useRef(false);
  const mode = parseMode(searchParams.get("mode"));
  const selectedProductId = searchParams.get("product");
  const selectedQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(selectedQuery);
  const [listOpen, setListOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const deferredQuery = useDeferredValue(query);

  const selectedProduct = useMemo(() => {
    if (mode !== "sealed") return null;
    return (
      getSealedProductById(selectedProductId) ??
      createTypedSealedProduct(selectedQuery)
    );
  }, [mode, selectedProductId, selectedQuery]);

  const visibleSelection =
    selectedProduct && selectedProduct.name === query.trim() ? selectedProduct : null;
  const suggestions = useMemo(
    () => searchSealedProducts(deferredQuery, 8),
    [deferredQuery]
  );
  const result = useMemo(
    () => (visibleSelection ? findSealedProductFit(visibleSelection) : null),
    [visibleSelection]
  );

  useEffect(() => {
    setQuery(selectedQuery);
    setListOpen(false);
  }, [selectedQuery]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [deferredQuery]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackFitEvent("fit_finder_started", {});
  }, []);

  useEffect(() => {
    if (!visibleSelection || !result) return;
    trackFitEvent(result.product ? "fit_finder_completed" : "fit_finder_no_match", {
      itemType: visibleSelection.type,
      language: visibleSelection.language,
      confidence: result.confidence,
      productId: result.product?.id ?? "none"
    });
  }, [result, visibleSelection]);

  function chooseMode(nextMode: FinderMode) {
    router.push(`/find-your-fit?mode=${nextMode}`, { scroll: false });
    trackFitEvent("fit_finder_step_completed", { step: "mode", value: nextMode });
  }

  function chooseSealedProduct(product: SealedSearchProduct) {
    const parameters = new URLSearchParams({ mode: "sealed", q: product.name });
    if (!product.id.startsWith("typed-")) parameters.set("product", product.id);
    setQuery(product.name);
    setListOpen(false);
    router.push(`/find-your-fit?${parameters.toString()}`, { scroll: false });
    trackFitEvent("fit_finder_step_completed", {
      step: "sealed-product",
      value: product.type,
      language: product.language
    });
  }

  function clearSearch() {
    setQuery("");
    setListOpen(false);
    router.push("/find-your-fit?mode=sealed", { scroll: false });
  }

  return (
    <div className="fit-finder-shell">
      <div className="fit-mode-tabs" role="group" aria-label="Choose what you want to protect">
        {finderModes.map((option) => {
          const Icon = option.icon;
          const selected = mode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              className={selected ? "is-selected" : ""}
              onClick={() => chooseMode(option.value)}
            >
              <Icon aria-hidden="true" size={20} />
              <span>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </span>
            </button>
          );
        })}
      </div>

      {mode === "sealed" ? (
        <div className="fit-search-layout">
          <section className="fit-search-panel" aria-labelledby="sealed-search-title">
            <p className="eyebrow">Search the sealed catalog</p>
            <h2 id="sealed-search-title">Name the product. We’ll match the format.</h2>
            <p>
              Search {new Intl.NumberFormat("en-US").format(sealedCatalogSummary.productCount)} English
              and Japanese sealed-product listings. Results appear while you type.
            </p>

            <div className="fit-combobox">
              <label htmlFor="sealed-product-search">Pokémon sealed product</label>
              <div className="fit-search-input">
                <Search aria-hidden="true" size={22} />
                <input
                  id="sealed-product-search"
                  type="search"
                  role="combobox"
                  autoComplete="off"
                  placeholder="Search for any sealed product!..."
                  value={query}
                  aria-autocomplete="list"
                  aria-controls="sealed-product-suggestions"
                  aria-expanded={listOpen && suggestions.length > 0}
                  aria-activedescendant={
                    activeIndex >= 0 ? `sealed-product-option-${activeIndex}` : undefined
                  }
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setListOpen(true);
                  }}
                  onFocus={() => setListOpen(query.trim().length >= 2)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setListOpen(true);
                      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setActiveIndex((index) => Math.max(index - 1, 0));
                    } else if (event.key === "Enter" && suggestions.length) {
                      event.preventDefault();
                      chooseSealedProduct(suggestions[Math.max(activeIndex, 0)]);
                    } else if (event.key === "Escape") {
                      setListOpen(false);
                    }
                  }}
                />
                {query ? (
                  <button type="button" aria-label="Clear sealed-product search" onClick={clearSearch}>
                    <X aria-hidden="true" size={18} />
                  </button>
                ) : null}
              </div>

              {listOpen && query.trim().length >= 2 ? (
                <div className="fit-suggestion-popover">
                  {suggestions.length ? (
                    <ul id="sealed-product-suggestions" role="listbox">
                      {suggestions.map((product, index) => (
                        <li
                          key={product.id}
                          id={`sealed-product-option-${index}`}
                          role="option"
                          aria-selected={index === activeIndex}
                        >
                          <button
                            type="button"
                            className={index === activeIndex ? "is-active" : ""}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => chooseSealedProduct(product)}
                          >
                            <span>
                              <strong>{product.name}</strong>
                              <small>{product.set} · {product.language}</small>
                            </span>
                            <em>{getSealedProductTypeLabel(product)}</em>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="fit-suggestion-empty">
                      Include a format such as “ETB,” “booster box,” “booster bundle,” “tin,” or “collection.”
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="fit-popular-searches" aria-label="Popular sealed-product searches">
              <span>Try a search</span>
              <div>
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    type="button"
                    onClick={() => {
                      setQuery(search);
                      setListOpen(true);
                    }}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            <div className="fit-search-note">
              <CheckCircle2 aria-hidden="true" size={18} />
              <p>
                The title identifies the product format; it does not prove dimensions. Pokémon Center,
                Japanese, enhanced, specialty, display, and factory-case formats are flagged before purchase.
              </p>
            </div>
          </section>

          <aside className="fit-result-panel" aria-live="polite">
            {visibleSelection && result ? (
              <SealedFitResult
                selection={visibleSelection}
                result={result}
                onAdd={(variantId) => {
                  if (!result.product) return;
                  trackFitEvent("fit_finder_product_selected", { productId: result.product.id });
                  addItem(variantId);
                }}
                onReset={clearSearch}
              />
            ) : (
              <div className="fit-result-empty">
                <PackageSearch aria-hidden="true" size={34} />
                <p className="eyebrow">Your recommendation</p>
                <h2>Start typing a sealed product.</h2>
                <p>
                  Choose a result to see the matching Lucky’s Loot acrylic case—or a clear warning when no
                  verified case exists.
                </p>
              </div>
            )}
          </aside>
        </div>
      ) : mode === "slabs" ? (
        <RecommendationMode
          eyebrow="PSA slab accessories"
          title="Choose edge protection, acrylic display, or both."
          description="These recommendations are for standard PSA-style slabs. Other grading-company formats require measurements."
          productIds={["psa-guards", "acrylic-crystal-slab-case"]}
        />
      ) : (
        <RecommendationMode
          eyebrow="Toploader binders"
          title="Choose the page format that fits your collection."
          description="Both choices are designed for standard 3 × 4 inch Toploaders. Review current color availability on each product page."
          productIds={["toploader-binder-4-pocket", "toploader-binder-9-pocket"]}
        />
      )}

      <p className="fit-independence-note">
        Lucky’s Loot is an independent accessories retailer and is not affiliated with or endorsed by The
        Pokémon Company, PSA, CGC, Collectr, or other grading and catalog companies.
      </p>
    </div>
  );
}

function SealedFitResult({
  selection,
  result,
  onAdd,
  onReset
}: {
  selection: SealedSearchProduct;
  result: FitFinderResult;
  onAdd: (variantId: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="fit-sealed-result">
      <header className="fit-selected-product">
        <span>{getSealedProductTypeLabel(selection)}</span>
        <h2>{selection.name}</h2>
        <p>{selection.set} · {selection.language}</p>
      </header>

      {result.product ? (
        <FitProductResult result={result} onAdd={onAdd} />
      ) : (
        <NoFitResult reason={result.reason} warnings={result.warnings} />
      )}

      <button className="fit-reset" type="button" onClick={onReset}>
        <RotateCcw aria-hidden="true" size={15} /> Search another product
      </button>
    </div>
  );
}

function FitProductResult({
  result,
  onAdd
}: {
  result: FitFinderResult;
  onAdd: (variantId: string) => void;
}) {
  const product = result.product;
  if (!product) return null;
  const image = getPrimaryImage(product);
  const variant = getDefaultVariant(product);
  const verifiedDimensions = product.specifications.filter(
    (specification) => specification.verified && /dimension/i.test(specification.label)
  );
  const confidenceLabel = result.confidence === "exact" ? "Exact format match" : "Measure before ordering";

  return (
    <div className="fit-product-result">
      <div className="fit-result-image">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1000px) 28vw, 100vw" />
      </div>
      <div className="fit-result-copy">
        <span className={`fit-confidence is-${result.confidence}`}>{confidenceLabel}</span>
        <p className="eyebrow">Recommended protection</p>
        <h3>{product.name}</h3>
        <strong>{formatCurrency(product.priceCents)}</strong>
        <p>{result.reason}</p>

        <div className="fit-dimensions">
          <h4>Verified dimensions</h4>
          {verifiedDimensions.length ? (
            <dl>
              {verifiedDimensions.map((specification) => (
                <div key={specification.label}>
                  <dt>{specification.label}</dt>
                  <dd>{specification.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p>Exact dimensions are not published until measurement verification is complete.</p>
          )}
        </div>

        {[...result.warnings, ...(product.fitmentWarnings ?? [])].length ? (
          <ul className="fit-warnings">
            {[...new Set([...result.warnings, ...(product.fitmentWarnings ?? [])])].map((warning) => (
              <li key={warning}>
                <TriangleAlert aria-hidden="true" size={15} /> {warning}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="fit-result-actions">
          {variant ? (
            <button className="button button-primary" type="button" onClick={() => onAdd(variant.id)}>
              Add to Loot
            </button>
          ) : null}
          <Link className="button button-secondary" href={`/products/${product.slug}`}>
            View product <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function NoFitResult({ reason, warnings }: { reason: string; warnings: string[] }) {
  return (
    <div className="fit-no-result">
      <TriangleAlert aria-hidden="true" size={30} />
      <span className="fit-confidence is-unsupported">No verified case</span>
      <p className="eyebrow">Unsupported format</p>
      <h3>Don’t force the wrong fit.</h3>
      <p>{reason}</p>
      <ul>
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
      <div className="fit-measurement-tip">
        Measure the sealed product at its widest, tallest, and deepest points, including its factory wrap.
      </div>
      <Link className="button button-primary" href="/contact?topic=product-fit">
        Ask a Product Fit Question
      </Link>
    </div>
  );
}

function RecommendationMode({
  eyebrow,
  title,
  description,
  productIds
}: {
  eyebrow: string;
  title: string;
  description: string;
  productIds: string[];
}) {
  const products = productIds
    .map((productId) => getProductById(productId))
    .filter((product): product is Product => Boolean(product));

  return (
    <section className="fit-recommendation-mode">
      <header>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      <div className="fit-recommendation-grid">
        {products.map((product) => {
          const image = getPrimaryImage(product);
          const isGuard = product.id === "psa-guards";
          const isAcrylicCase = product.id === "acrylic-crystal-slab-case";
          return (
            <article key={product.id} className="fit-recommendation-card">
              {isGuard ? (
                <div
                  className="fit-recommendation-image fit-recommendation-guard guard-platform-stage"
                  style={{ "--guard-glow": fitFinderGuardColor.colorHex } as CSSProperties}
                >
                  <div className="guard-orbit" aria-hidden="true" />
                  <GuardColorTransition
                    color={fitFinderGuardColor}
                    alt={`${fitFinderGuardColor.name} Lucky’s Loot PSA Guard`}
                    sizes="(max-width: 760px) 82vw, 36vw"
                  />
                </div>
              ) : (
                <div className={`fit-recommendation-image${isAcrylicCase ? " fit-recommendation-acrylic" : ""}`}>
                  <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 100vw, 42vw" />
                </div>
              )}
              <div className="fit-recommendation-copy">
                <p className="eyebrow">{product.eyebrow}</p>
                <h3>{product.name}</h3>
                <strong>{formatCurrency(product.priceCents)}</strong>
                <p>{product.summary}</p>
                <ul>
                  {product.fitment.slice(0, 2).map((fit) => (
                    <li key={fit}><CheckCircle2 aria-hidden="true" size={15} /> {fit}</li>
                  ))}
                </ul>
                <Link className="button button-primary" href={`/products/${product.slug}`}>
                  View recommendation <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function parseMode(value: string | null): FinderMode {
  return value === "slabs" || value === "binders" ? value : "sealed";
}

function trackFitEvent(name: string, properties: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent("luckys:analytics", { detail: { name, properties } }));
}
