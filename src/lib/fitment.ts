import { getProductById } from "@/lib/catalog";
import type { Product } from "@/lib/catalog-schema";

export type FitItem =
  | "etb"
  | "booster-box"
  | "booster-bundle"
  | "graded-slab"
  | "toploaded-cards"
  | "unsure";

export type FitFormat =
  | "standard"
  | "specialty"
  | "english"
  | "japanese-specialty"
  | "bare-psa"
  | "guarded-psa"
  | "other-grader"
  | "compact-binder"
  | "large-binder"
  | "unknown";

export type FitGoal = "display" | "edge-protection" | "storage" | "event-transport";

export type FitFinderInput = {
  item: FitItem;
  format?: FitFormat;
  goal: FitGoal;
};

export type FitConfidence = "exact" | "measure-first" | "unsupported";

export type FitFinderResult = {
  confidence: FitConfidence;
  product: Product | null;
  reason: string;
  warnings: string[];
};

export function findFit(input: FitFinderInput): FitFinderResult {
  if (input.item === "etb" && input.goal === "display") {
    if (input.format === "standard") {
      return match("acrylic-etb-case", "exact", "Built for the standard ETB format.");
    }
    return match(
      "acrylic-etb-case",
      "measure-first",
      "Specialty and Pokémon Center ETBs vary in size.",
      ["Measure the box before ordering or submit a Product Fit Question."]
    );
  }

  if (input.item === "booster-box" && input.goal === "display") {
    if (input.format === "english") {
      return match(
        "acrylic-booster-box-case",
        "exact",
        "Built for the standard English booster-box format."
      );
    }
    return match(
      "acrylic-booster-box-case",
      "measure-first",
      "Japanese and specialty boxes vary in size.",
      ["Measure the box before ordering; universal fit is not claimed."]
    );
  }

  if (input.item === "booster-bundle" && input.goal === "display") {
    return match(
      "acrylic-booster-bundle-case",
      input.format === "specialty" ? "measure-first" : "exact",
      "This is the compact display option for a standard booster bundle."
    );
  }

  if (input.item === "graded-slab") {
    if (input.goal === "edge-protection" && input.format === "bare-psa") {
      return match("psa-guards", "exact", "Lucky’s Loot Guards fit standard PSA-style slabs.");
    }

    if (input.goal === "display" && (input.format === "guarded-psa" || input.format === "bare-psa")) {
      return match(
        "acrylic-crystal-slab-case",
        "exact",
        input.format === "guarded-psa"
          ? "The PSA Graded Guard Fit Acrylic Case supports a PSA-style slab wearing a Lucky’s Loot Guard."
          : "The PSA Graded Guard Fit Acrylic Case supports a standard PSA-style slab presentation."
      );
    }

    return unsupported("Other grading-company slabs are not forced into a PSA-sized product.");
  }

  if (input.item === "toploaded-cards" && ["storage", "event-transport"].includes(input.goal)) {
    if (input.format === "compact-binder") {
      return match("toploader-binder-4-pocket", "exact", "The compact four-pocket format matches this goal.");
    }
    if (input.format === "large-binder") {
      return match("toploader-binder-9-pocket", "exact", "The nine-pocket format holds a larger collection.");
    }
    return match(
      "toploader-binder-9-pocket",
      "measure-first",
      "Either binder may work; choose by collection size after reviewing the page layouts."
    );
  }

  return unsupported("No verified product matches every selected requirement.");
}

function match(
  productId: string,
  confidence: Exclude<FitConfidence, "unsupported">,
  reason: string,
  warnings: string[] = []
): FitFinderResult {
  const product = getProductById(productId);
  if (!product) {
    throw new Error(`Fit Finder references missing product ${productId}.`);
  }

  return { confidence, product, reason, warnings };
}

function unsupported(reason: string): FitFinderResult {
  return {
    confidence: "unsupported",
    product: null,
    reason,
    warnings: ["Measure your item and send a Product Fit Question for help."]
  };
}
