import type {
  CollectionCounts,
  CollectionPlan,
  CollectionRecommendation,
  ShelfItem
} from "@/lib/types";
import { productImages } from "@/lib/catalog";

const clampCount = (value: number) => Math.max(0, Math.min(999, Math.floor(value || 0)));

export function normalizeCounts(counts: CollectionCounts): CollectionCounts {
  return {
    etbs: clampCount(counts.etbs),
    boosterBoxes: clampCount(counts.boosterBoxes),
    boosterBundles: clampCount(counts.boosterBundles),
    gradedCards: clampCount(counts.gradedCards),
    binders: clampCount(counts.binders)
  };
}

export function buildCollectionPlan(rawCounts: CollectionCounts): CollectionPlan {
  const counts = normalizeCounts(rawCounts);
  const recommendations: CollectionRecommendation[] = [
    {
      productName: "Pokemon ETB Acrylic Case",
      quantity: counts.etbs,
      reason: "ETBs become the visual anchors of the shelf when protected in matching clear acrylic."
    },
    {
      productName: "Pokemon Booster Box Acrylic Case",
      quantity: counts.boosterBoxes,
      reason: "Booster boxes line up cleanly while the sealed art stays visible."
    },
    {
      productName: "Pokemon Booster Bundle Acrylic Case",
      quantity: counts.boosterBundles,
      reason: "Bundles become an easy front row instead of loose small boxes."
    },
    {
      productName: "Gradient PSA Guard",
      quantity: counts.gradedCards,
      reason: "PSA slabs gain color, corner protection, and a more intentional display frame."
    },
    {
      productName: "Topload Binder",
      quantity: counts.binders,
      reason: "Choose 9-pocket for sets and 4-pocket for favorite hits in toploaders."
    }
  ].filter((item) => item.quantity > 0);

  const items: ShelfItem[] = [];

  for (let index = 0; index < counts.etbs; index += 1) {
    items.push({
      id: `etb-${index}`,
      kind: "etb",
      label: `ETB ${index + 1}`,
      protectedBy: "acrylic-etb-cases",
      image: productImages.etb,
      shelf: 0,
      span: 2
    });
  }

  for (let index = 0; index < counts.boosterBoxes; index += 1) {
    items.push({
      id: `booster-${index}`,
      kind: "boosterBox",
      label: `Box ${index + 1}`,
      protectedBy: "acrylic-booster-box-cases",
      image: productImages.boosterBox,
      shelf: 0,
      span: 2
    });
  }

  for (let index = 0; index < counts.boosterBundles; index += 1) {
    items.push({
      id: `bundle-${index}`,
      kind: "boosterBundle",
      label: `Bundle ${index + 1}`,
      protectedBy: "acrylic-booster-bundle-cases",
      image: productImages.boosterBundle,
      shelf: 0,
      span: 1
    });
  }

  const slabColorways = ["Ruby", "Emerald", "Sapphire", "Frosted"];

  for (let index = 0; index < Math.ceil(counts.gradedCards / 3); index += 1) {
    const colorway = slabColorways[index % slabColorways.length];
    items.push({
      id: `slab-stack-${index}`,
      kind: "slab",
      label: `${Math.min(3, counts.gradedCards - index * 3)} slabs`,
      protectedBy: index % 2 === 0 ? "phantom-display-psa-cases" : "psa-slab-guards",
      image:
        colorway === "Ruby"
          ? productImages.phantomRuby
          : colorway === "Emerald"
            ? productImages.phantomEmerald
            : productImages.phantomFrosted,
      colorway,
      shelf: 0,
      span: 1
    });
  }

  for (let index = 0; index < counts.binders; index += 1) {
    items.push({
      id: `binder-${index}`,
      kind: "binder",
      label: `Binder ${index + 1}`,
      protectedBy: "topload-binders",
      image: index % 2 === 0 ? productImages.binder9 : productImages.binder4,
      shelf: 0,
      span: 2
    });
  }

  const rows: ShelfItem[][] = [];
  let currentRow: ShelfItem[] = [];
  let currentSpan = 0;
  const maxSpanPerRow = 8;

  for (const item of items) {
    if (currentSpan + item.span > maxSpanPerRow) {
      rows.push(currentRow);
      currentRow = [];
      currentSpan = 0;
    }

    const itemWithShelf = { ...item, shelf: rows.length };
    currentRow.push(itemWithShelf);
    currentSpan += item.span;
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  const totalSpan =
    counts.etbs * 7.7 +
    counts.boosterBoxes * 5.5 +
    counts.boosterBundles * 4.7 +
    Math.ceil(counts.gradedCards / 3) * 4.2 +
    counts.binders * 2.2;

  const estimatedShelfRows = Math.max(1, rows.length);
  const estimatedWidthInches = Math.max(24, Math.ceil(totalSpan / estimatedShelfRows + 8));

  return {
    shelfRows: rows.length ? rows : [[]],
    recommendations,
    estimatedWidthInches,
    estimatedShelfRows,
    upgradeNotes: [
      counts.etbs + counts.boosterBoxes > 8
        ? "Use a gallery layout with ETBs centered and booster boxes grouped by set era."
        : "Leave at least one open display gap so the collection feels curated instead of packed.",
      counts.gradedCards > 12
        ? "Create a dedicated PSA row with gradient guards and Phantom Display acrylic cases."
        : "Use PSA guards as color accents around sealed Pokemon products.",
      "Keep 9-pocket binders for set runs and 4-pocket binders for the favorite-hit section."
    ]
  };
}
