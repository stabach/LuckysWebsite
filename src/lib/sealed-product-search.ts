import sealedCatalog from "@/data/sealed-products.generated.json";
import { findFit, type FitFinderResult } from "@/lib/fitment";

export type SealedProductType =
  | "etb"
  | "booster-box"
  | "booster-bundle"
  | "booster-pack"
  | "premium-collection"
  | "collection-box"
  | "tin"
  | "blister"
  | "build-battle"
  | "deck-kit"
  | "collector-chest"
  | "calendar"
  | "other-bundle"
  | "sealed-case"
  | "other-sealed";

export type SealedSearchProduct = {
  id: string;
  name: string;
  set: string;
  language: string;
  type: SealedProductType;
};

const products = sealedCatalog.products as SealedSearchProduct[];

const typeLabels: Record<SealedProductType, string> = {
  etb: "Elite Trainer Box",
  "booster-box": "Booster Box",
  "booster-bundle": "Booster Bundle",
  "booster-pack": "Booster Pack",
  "premium-collection": "Premium Collection",
  "collection-box": "Collection Box",
  tin: "Tin",
  blister: "Blister",
  "build-battle": "Build & Battle",
  "deck-kit": "Deck or Kit",
  "collector-chest": "Collector Chest",
  calendar: "Calendar",
  "other-bundle": "Sealed Bundle",
  "sealed-case": "Factory Case or Display",
  "other-sealed": "Sealed Product"
};

const typeAliases: Record<SealedProductType, string> = {
  etb: "etb elite trainer box trainer box",
  "booster-box": "booster box booster display display box",
  "booster-bundle": "booster bundle six pack 6 pack",
  "booster-pack": "booster pack sleeved pack art set",
  "premium-collection": "ultra premium collection upc premium box",
  "collection-box": "collection box ex box special collection poster collection binder collection",
  tin: "tin mini tin collector tin",
  blister: "blister checklane three pack single pack",
  "build-battle": "build battle stadium prerelease",
  "deck-kit": "deck toolkit starter set",
  "collector-chest": "collector chest lunchbox",
  calendar: "calendar holiday advent",
  "other-bundle": "bundle sealed bundle",
  "sealed-case": "case display bulk case factory case",
  "other-sealed": "sealed product"
};

export const sealedCatalogSummary = {
  productCount: products.length,
  languages: sealedCatalog.categories,
  source: sealedCatalog.source
} as const;

export function getSealedProductById(id: string | null) {
  return id ? products.find((product) => product.id === id) ?? null : null;
}

export function getSealedProductTypeLabel(product: Pick<SealedSearchProduct, "name" | "type">) {
  if (/booster bundle.*display|display.*booster bundle/i.test(product.name)) {
    return "Booster Bundle Display";
  }
  return typeLabels[product.type];
}

export function searchSealedProducts(query: string, limit = 8): SealedSearchProduct[] {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) return [];

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const results = products
    .map((product) => {
      const name = normalize(product.name);
      const set = normalize(product.set);
      const aliases = typeAliases[product.type];
      const haystack = `${name} ${set} ${aliases} ${normalize(product.language)}`;
      if (!queryTokens.every((token) => haystack.includes(token))) return null;

      let score = 50;
      if (name === normalizedQuery) score = 0;
      else if (name.startsWith(normalizedQuery)) score = 5;
      else if (name.includes(normalizedQuery)) score = 10;
      else if (aliases.split(" ").includes(normalizedQuery)) score = 14;
      else if (set.startsWith(normalizedQuery)) score = 20;
      else if (set.includes(normalizedQuery)) score = 25;
      if (product.language !== "English") score += 3;

      return { product, score };
    })
    .filter((entry): entry is { product: SealedSearchProduct; score: number } => Boolean(entry))
    .sort(
      (left, right) =>
        left.score - right.score ||
        left.product.name.localeCompare(right.product.name) ||
        left.product.set.localeCompare(right.product.set)
    );

  const seen = new Set<string>();
  const unique: SealedSearchProduct[] = [];
  for (const result of results) {
    const key = `${normalize(result.product.name)}:${result.product.language}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(result.product);
    if (unique.length === limit) break;
  }

  if (unique.length < limit) {
    const typed = createTypedSealedProduct(query);
    if (typed && !unique.some((product) => normalize(product.name) === normalize(typed.name))) {
      unique.push(typed);
    }
  }

  return unique.slice(0, limit);
}

export function createTypedSealedProduct(query: string): SealedSearchProduct | null {
  const name = query.trim().replace(/\s+/g, " ");
  if (name.length < 3) return null;
  const type = classifyTypedProduct(name);
  if (!type) return null;

  return {
    id: `typed-${normalize(name).replaceAll(" ", "-")}`,
    name,
    set: "Product title entered by customer",
    language: /japan(?:ese)?|\bjp\b/i.test(name) ? "Japanese" : "Unspecified",
    type
  };
}

export function findSealedProductFit(product: SealedSearchProduct): FitFinderResult {
  const specialty = isSpecialtyProduct(product);

  if (product.type === "etb") {
    return findFit({ item: "etb", format: specialty ? "specialty" : "standard", goal: "display" });
  }

  if (product.type === "booster-box") {
    return findFit({
      item: "booster-box",
      format: specialty ? "japanese-specialty" : "english",
      goal: "display"
    });
  }

  if (product.type === "booster-bundle" && !/\bdisplay\b|\bcase\b/i.test(product.name)) {
    return findFit({ item: "booster-bundle", format: specialty ? "specialty" : "standard", goal: "display" });
  }

  return {
    confidence: "unsupported",
    product: null,
    reason: `Lucky’s Loot does not currently have a verified acrylic fit for this ${getSealedProductTypeLabel(product).toLowerCase()} format.`,
    warnings: ["Do not force this product into an ETB, booster-box, or booster-bundle case."]
  };
}

function classifyTypedProduct(name: string): SealedProductType | null {
  const value = normalize(name);
  if (/\bcase\b|bulk case|factory case/.test(value)) return "sealed-case";
  if (/elite trainer box|\betb\b/.test(value)) return "etb";
  if (/booster bundle/.test(value)) return "booster-bundle";
  if (/booster (?:display )?box|booster display|display box/.test(value)) return "booster-box";
  if (/booster|\bpack\b/.test(value)) return "booster-pack";
  if (/ultra premium|\bupc\b|premium collection/.test(value)) return "premium-collection";
  if (/collection|\bbox\b/.test(value)) return "collection-box";
  if (/\btin\b/.test(value)) return "tin";
  if (/blister/.test(value)) return "blister";
  if (/build (?:and|&) battle|battle stadium/.test(value)) return "build-battle";
  if (/deck|trainer toolkit|starter set/.test(value)) return "deck-kit";
  if (/chest|lunchbox/.test(value)) return "collector-chest";
  if (/calendar/.test(value)) return "calendar";
  if (/bundle/.test(value)) return "other-bundle";
  return null;
}

function isSpecialtyProduct(product: SealedSearchProduct) {
  return (
    product.language === "Japanese" ||
    /pokemon center|pokémon center|exclusive|enhanced|specialty|japan(?:ese)?|\bjp\b/i.test(product.name)
  );
}

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/pok[eé]mon/g, "pokemon")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
