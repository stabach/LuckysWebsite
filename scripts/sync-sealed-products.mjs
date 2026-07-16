import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const SOURCE = "https://tcgcsv.com/tcgplayer";
const OUTPUT = resolve("src/data/sealed-products.generated.json");
const USER_AGENT = "LuckysLootFitFinder/2.0 (catalog sync)";
const categories = [
  { id: 3, language: "English" },
  { id: 85, language: "Japanese" }
];

const sealedNamePattern = new RegExp(
  [
    "booster",
    "elite trainer",
    "trainer box",
    "collection",
    "tin\\b",
    "blister",
    "build (?:&|and) battle",
    "battle stadium",
    "battle arena",
    "battle deck",
    "theme deck",
    "starter deck",
    "starter set",
    "half deck",
    "deck\\b",
    "trainer toolkit",
    "collector(?:'s)? chest",
    "lunchbox",
    "calendar",
    "box\\b",
    "bundle",
    "pack\\b",
    "portfolio",
    "gift set",
    "premium",
    "case\\b",
    "display\\b",
    "special set"
  ].join("|"),
  "i"
);

const accessoryOnlyPattern = new RegExp(
  [
    "playmat",
    "card sleeves?",
    "deck sleeves?",
    "deck box",
    "storage box",
    "card binder",
    "pages?\\b",
    "dice set",
    "coin\\b",
    "pin collection series",
    "figure collection series"
  ].join("|"),
  "i"
);

function wait(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

function isCard(product) {
  return (product.extendedData ?? []).some((field) =>
    ["Number", "Rarity"].includes(field.name)
  );
}

function classifyProduct(name) {
  const normalized = name.toLowerCase();

  if (/\bcase\b/.test(normalized)) return "sealed-case";
  if (/elite trainer box|\betb\b/.test(normalized)) return "etb";
  if (/booster bundle/.test(normalized)) return "booster-bundle";
  if (/booster (?:display )?box|booster display|display box/.test(normalized)) return "booster-box";
  if (/booster|\bpack\b/.test(normalized)) return "booster-pack";
  if (/ultra[ -]?premium|premium collection/.test(normalized)) return "premium-collection";
  if (/collection|\bbox\b/.test(normalized)) return "collection-box";
  if (/\btin\b/.test(normalized)) return "tin";
  if (/blister/.test(normalized)) return "blister";
  if (/build (?:&|and) battle|battle stadium/.test(normalized)) return "build-battle";
  if (/deck|trainer toolkit|starter set/.test(normalized)) return "deck-kit";
  if (/chest|lunchbox/.test(normalized)) return "collector-chest";
  if (/calendar/.test(normalized)) return "calendar";
  if (/bundle/.test(normalized)) return "other-bundle";
  return "other-sealed";
}

function cleanGroupName(value) {
  return value.replace(/^[A-Z0-9.]+:\s*/, "").trim();
}

const products = [];

for (const category of categories) {
  const groupsPayload = await fetchJson(`${SOURCE}/${category.id}/groups`);
  const groups = groupsPayload?.results ?? [];

  for (const [index, group] of groups.entries()) {
    const payload = await fetchJson(`${SOURCE}/${category.id}/${group.groupId}/products`);

    for (const product of payload?.results ?? []) {
      if (isCard(product)) continue;
      if (!sealedNamePattern.test(product.name) || accessoryOnlyPattern.test(product.name)) continue;

      products.push({
        id: `tcg-${category.id}-${product.productId}`,
        name: product.name.trim(),
        set: cleanGroupName(group.name),
        language: category.language,
        type: classifyProduct(product.name)
      });
    }

    if (index < groups.length - 1) await wait(125);
  }
}

products.sort((left, right) =>
  left.name.localeCompare(right.name) || left.set.localeCompare(right.set)
);

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(
  OUTPUT,
  `${JSON.stringify(
    {
      source: "TCGCSV daily TCGplayer catalog export",
      sourceUrl: "https://tcgcsv.com/",
      syncedAt: new Date().toISOString(),
      categories: categories.map((category) => category.language),
      products
    },
    null,
    2
  )}\n`
);

console.log(`Saved ${products.length} sealed-product search records to ${OUTPUT}.`);
