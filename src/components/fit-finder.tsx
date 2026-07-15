"use client";

import { ArrowRight, CheckCircle2, RotateCcw, Ruler, TriangleAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency, getDefaultVariant, getPrimaryImage } from "@/lib/catalog";
import {
  findFit,
  type FitFinderInput,
  type FitFormat,
  type FitGoal,
  type FitItem
} from "@/lib/fitment";

const itemOptions: Array<{ value: FitItem; label: string }> = [
  { value: "etb", label: "Elite Trainer Box" },
  { value: "booster-box", label: "Booster Box" },
  { value: "booster-bundle", label: "Booster Bundle" },
  { value: "graded-slab", label: "Graded Slab" },
  { value: "toploaded-cards", label: "Toploaded Cards" },
  { value: "unsure", label: "I’m not sure" }
];

const formatOptions: Partial<Record<FitItem, Array<{ value: FitFormat; label: string }>>> = {
  etb: [
    { value: "standard", label: "Standard Pokémon ETB" },
    { value: "specialty", label: "Pokémon Center / specialty ETB" },
    { value: "unknown", label: "I do not know" }
  ],
  "booster-box": [
    { value: "english", label: "Standard English booster box" },
    { value: "japanese-specialty", label: "Japanese / specialty booster box" },
    { value: "unknown", label: "I do not know" }
  ],
  "graded-slab": [
    { value: "bare-psa", label: "Bare PSA-style slab" },
    { value: "guarded-psa", label: "Slab with a Lucky’s Loot Guard" },
    { value: "other-grader", label: "Other grading company" },
    { value: "unknown", label: "I do not know" }
  ],
  "toploaded-cards": [
    { value: "compact-binder", label: "Compact binder" },
    { value: "large-binder", label: "Larger collection binder" },
    { value: "unknown", label: "I do not know" }
  ]
};

const goalOptions: Array<{ value: FitGoal; label: string }> = [
  { value: "display", label: "Display protection" },
  { value: "edge-protection", label: "Colorful edge protection" },
  { value: "storage", label: "Organized storage" },
  { value: "event-transport", label: "Event transport" }
];

const itemValues = new Set(itemOptions.map((option) => option.value));
const formatValues = new Set(
  Object.values(formatOptions).flatMap((options) => options?.map((option) => option.value) ?? [])
);
const goalValues = new Set(goalOptions.map((option) => option.value));

export function FitFinder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const startedRef = useRef(false);
  const item = parseValue(searchParams.get("item"), itemValues);
  const format = parseValue(searchParams.get("format"), formatValues);
  const goal = parseValue(searchParams.get("goal"), goalValues);
  const formats = item ? formatOptions[item] : undefined;
  const formatComplete = Boolean(item && (!formats || (format && formats.some((option) => option.value === format))));

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackFitEvent("fit_finder_started", {});
  }, []);

  const result = useMemo(() => {
    if (!item || !goal || !formatComplete) return null;
    return findFit({ item, format, goal } as FitFinderInput);
  }, [format, formatComplete, goal, item]);

  useEffect(() => {
    if (!result) return;
    trackFitEvent(result.product ? "fit_finder_completed" : "fit_finder_no_match", {
      item,
      format: format ?? "none",
      goal,
      confidence: result.confidence,
      productId: result.product?.id ?? "none"
    });
  }, [format, goal, item, result]);

  function updateSelection(next: Partial<{ item: FitItem; format: FitFormat; goal: FitGoal }>) {
    const parameters = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) parameters.set(key, value);
      else parameters.delete(key);
    }
    router.push(`/find-your-fit?${parameters.toString()}`, { scroll: false });
    trackFitEvent("fit_finder_step_completed", {
      step: Object.keys(next)[0] ?? "unknown",
      value: Object.values(next)[0] ?? "cleared"
    });
  }

  function chooseItem(nextItem: FitItem) {
    const parameters = new URLSearchParams();
    parameters.set("item", nextItem);
    router.push(`/find-your-fit?${parameters.toString()}`, { scroll: false });
    trackFitEvent("fit_finder_step_completed", { step: "item", value: nextItem });
  }

  function startOver() {
    router.push("/find-your-fit", { scroll: false });
  }

  return (
    <div className="fit-finder-layout">
      <div className="fit-finder-steps">
        <FitStep number="01" legend="What are you protecting?" active>
          <OptionGrid
            options={itemOptions}
            selected={item}
            onSelect={(value) => chooseItem(value as FitItem)}
          />
        </FitStep>

        {item && formats ? (
          <FitStep number="02" legend="Which format?" active>
            <OptionGrid
              options={formats}
              selected={format}
              onSelect={(value) => updateSelection({ format: value as FitFormat, goal: undefined })}
            />
          </FitStep>
        ) : null}

        {formatComplete ? (
          <FitStep number={formats ? "03" : "02"} legend="What should it help you do?" active>
            <OptionGrid
              options={goalOptions}
              selected={goal}
              onSelect={(value) => updateSelection({ goal: value as FitGoal })}
            />
          </FitStep>
        ) : null}

        {item ? (
          <button className="fit-reset" type="button" onClick={startOver}>
            <RotateCcw aria-hidden="true" size={15} /> Start over
          </button>
        ) : null}
      </div>

      <aside className="fit-result-panel" aria-live="polite">
        {result ? (
          result.product ? (
            <FitProductResult
              result={result}
              onAdd={(variantId) => {
                trackFitEvent("fit_finder_product_selected", { productId: result.product?.id });
                addItem(variantId);
              }}
            />
          ) : (
            <NoFitResult reason={result.reason} warnings={result.warnings} />
          )
        ) : (
          <div className="fit-result-empty">
            <Ruler aria-hidden="true" size={30} />
            <p className="eyebrow">Your result</p>
            <h2>Answer the guide to see a verified match.</h2>
            <p>Selections stay in the URL, so you can share the result or use browser navigation.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

function FitStep({
  number,
  legend,
  active,
  children
}: {
  number: string;
  legend: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="fit-step" disabled={!active}>
      <legend>
        <span>{number}</span> {legend}
      </legend>
      {children}
    </fieldset>
  );
}

function OptionGrid({
  options,
  selected,
  onSelect
}: {
  options: Array<{ value: string; label: string }>;
  selected: string | undefined;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="fit-option-grid">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={selected === option.value ? "is-selected" : ""}
          aria-pressed={selected === option.value}
          onClick={() => onSelect(option.value)}
        >
          {selected === option.value ? <CheckCircle2 aria-hidden="true" size={17} /> : null}
          {option.label}
        </button>
      ))}
    </div>
  );
}

function FitProductResult({
  result,
  onAdd
}: {
  result: Exclude<ReturnType<typeof findFit>, { product: null }>;
  onAdd: (variantId: string) => void;
}) {
  const product = result.product;
  if (!product) return null;
  const image = getPrimaryImage(product);
  const variant = getDefaultVariant(product);
  const verifiedDimensions = product.specifications.filter(
    (specification) => specification.verified && /dimension/i.test(specification.label)
  );
  const confidenceLabel = result.confidence === "exact" ? "Exact match" : "Likely match — measure first";

  return (
    <div className="fit-product-result">
      <div className="fit-result-image">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1000px) 38vw, 100vw" />
      </div>
      <div className="fit-result-copy">
        <span className={`fit-confidence is-${result.confidence}`}>{confidenceLabel}</span>
        <p className="eyebrow">Best match</p>
        <h2>{product.name}</h2>
        <strong>{formatCurrency(product.priceCents)}</strong>
        <p>{result.reason}</p>

        <div className="fit-dimensions">
          <h3>Verified dimensions</h3>
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
      <span className="fit-confidence is-unsupported">Unsupported</span>
      <p className="eyebrow">No verified match</p>
      <h2>Let’s not force the wrong fit.</h2>
      <p>{reason}</p>
      <ul>
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
      <div className="fit-measurement-tip">
        Measure the item at its widest, tallest, and deepest points. Include any sleeve, Guard, or
        outer wrap you plan to keep on it.
      </div>
      <Link className="button button-primary" href="/contact?topic=product-fit">
        Ask a Product Fit Question
      </Link>
    </div>
  );
}

function parseValue<Value extends string>(value: string | null, allowed: Set<Value>) {
  return value && allowed.has(value as Value) ? (value as Value) : undefined;
}

function trackFitEvent(name: string, properties: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent("luckys:analytics", { detail: { name, properties } }));
}
