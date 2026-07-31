import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import {
  ProductSchema,
  type BulkPricingTier,
  type Product,
  type ProductVariant
} from "@/lib/catalog-schema";

export const guardPricingTiers = [
  { minimumQuantity: 1, unitPriceCents: 700, label: "1–9 guards" },
  { minimumQuantity: 10, unitPriceCents: 600, label: "10–24 guards" },
  { minimumQuantity: 25, unitPriceCents: 400, label: "25+ guards" }
] as const satisfies ReadonlyArray<BulkPricingTier>;

const psaGuardColorData = [
  ["Arctic", "#e7f4f2"],
  ["Cosmic Pop", "#8f4bc3"],
  ["Cotton Candy", "#f09bc1"],
  ["Diamond", "#d8e1e3"],
  ["Eclipse", "#2c2436"],
  ["Emerald", "#0a8b61"],
  ["Galaxy", "#51469c"],
  ["Glacier", "#71c6df"],
  ["Gold Dust", "#c99d38"],
  ["Midnight Gold", "#5a4730"],
  ["Nebula", "#8c5aa8"],
  ["Reef", "#2ca9a1"],
  ["Solar Flare", "#d35d3d"],
  ["Solar Rush", "#e18c27"],
  ["Void", "#202126"]
] as const;

export const psaGuardColors = psaGuardColorData.map(([name, colorHex]) => ({
  name,
  colorHex,
  slug: slugify(name),
  image: `/products/psa-guards/${slugify(name)}.webp`
}));

const psaGuardVariants = psaGuardColors.map(
  (color): ProductVariant => ({
    id: `psa-guards-${color.slug}`,
    sku: `LL-PSAG-${color.slug.replaceAll("-", "").toUpperCase()}`,
    label: color.name,
    color: color.name,
    colorHex: color.colorHex,
    image: color.image,
    stockQuantity: null,
    status: "in_stock",
    active: true
  })
);

const binderColors = [
  ["Red", "#d9423f"],
  ["Pink", "#f19ab5"],
  ["Black", "#171918"],
  ["Aqua", "#2fb8b6"],
  ["Purple", "#7850a8"],
  ["Yellow", "#e5b52b"]
] as const;

const fourPocketBinderColors = [
  ...binderColors,
  ["Lime Green", "#82b944"] as const
] as const;

function createBinderVariants(size: "4" | "9", priceCents: number): ProductVariant[] {
  const colors = size === "4" ? fourPocketBinderColors : binderColors;

  return colors.map(([label, colorHex]) => {
    const colorSlug = slugify(label);

    return {
      id: `toploader-binder-${size}-pocket-${colorSlug}`,
      sku: `LL-BDR-${size}P-${colorSlug.replaceAll("-", "").toUpperCase()}`,
      label,
      color: label,
      colorHex,
      image: `/products/binders/${size}-pocket/${colorSlug}.webp`,
      priceCents,
      stockQuantity: null,
      status: "in_stock",
      active: true
    };
  });
}

const rawCatalog = [
  {
    id: "acrylic-etb-case",
    slug: "etb-acrylic-case",
    sku: "LL-AC-ETB",
    status: "active",
    categoryId: "acrylic-cases",
    collectionIds: ["protect-sealed-product", "elite-trainer-boxes"],
    name: "ETB Acrylic Case",
    shortName: "ETB Case",
    eyebrow: "Protect sealed product",
    summary: "A clear acrylic display case sized for standard Elite Trainer Box formats.",
    description:
      "Keep a standard-size ETB visible while adding a clean acrylic layer between the box and the shelf.",
    priceCents: 1500,
    stockStatus: "in_stock",
    stockQuantity: null,
    maxPerOrder: 20,
    images: [
      {
        id: "etb-case-main",
        type: "image",
        src: "/products/acrylic/etb-case.webp",
        alt: "Clear ETB acrylic display case on a dark studio background",
        width: 1280,
        height: 720
      }
    ],
    variants: [
      {
        id: "acrylic-etb-case-clear",
        sku: "LL-AC-ETB-CLR",
        label: "Clear",
        color: "Clear",
        status: "in_stock",
        stockQuantity: null,
        active: true
      }
    ],
    fitment: ["Standard-size Pokémon Elite Trainer Boxes"],
    fitmentWarnings: [
      "Pokémon Center and specialty ETBs vary. Measure before ordering.",
      "Collectible not included."
    ],
    specifications: [
      { label: "Acrylic construction", value: "8 mm", verified: true },
      { label: "Edges", value: "Rounded and polished", verified: true },
      { label: "Lid", value: "Magnetic and removable", verified: true },
      { label: "Internal dimensions", value: "Pending measurement verification", verified: false },
      { label: "External dimensions", value: "Pending measurement verification", verified: false }
    ],
    features: [
      {
        title: "Crystal-clear display",
        description: "Keeps the sealed box artwork visible from the shelf.",
        verified: true
      },
      {
        title: "Rounded polished edges",
        description: "A clean finish built for display handling.",
        verified: true
      },
      {
        title: "Removable magnetic lid",
        description: "Open the display without permanent hardware.",
        verified: true
      }
    ],
    faq: [
      {
        question: "Is the collectible included?",
        answer: "No. Product imagery demonstrates the acrylic case only."
      },
      {
        question: "Will this fit a Pokémon Center ETB?",
        answer: "That fit is not yet verified. Measure your box before ordering or ask a Product Fit Question."
      }
    ],
    relatedProductIds: ["acrylic-booster-box-case", "acrylic-booster-bundle-case"],
    badges: ["Standard ETB fit"],
    keywords: ["ETB", "Elite Trainer Box", "sealed product", "acrylic case"],
    sortOrder: 0
  },
  {
    id: "acrylic-crystal-slab-case",
    slug: "crystal-slab-acrylic-case",
    sku: "LL-AC-SLAB",
    status: "active",
    categoryId: "acrylic-cases",
    collectionIds: ["protect-sealed-product", "protect-graded-cards", "slab-displays"],
    name: "PSA Graded Guard Fit Acrylic Case",
    shortName: "PSA Guard Fit Case",
    eyebrow: "Protect graded cards",
    summary: "A clear acrylic display case for a graded-slab presentation.",
    description:
      "Give a graded-card setup a clean presentation layer while keeping the front of the slab in view.",
    priceCents: 1300,
    stockStatus: "in_stock",
    stockQuantity: null,
    maxPerOrder: 20,
    images: [
      {
        id: "crystal-slab-main",
        type: "image",
        src: "/products/acrylic/crystal-slab-case.webp",
        alt: "Clear vertical acrylic slab display case on a dark studio background",
        width: 1280,
        height: 720
      },
      {
        id: "crystal-slab-boomerang",
        type: "video",
        mp4: "/media/homepage-acrylic-boomerang.mp4",
        poster: "/media/homepage-acrylic-poster.webp",
        alt: "Looping rotating view of the PSA Graded Guard Fit Acrylic Case",
        autoplayPreview: true
      }
    ],
    variants: [
      {
        id: "acrylic-crystal-slab-case-clear",
        sku: "LL-AC-SLAB-CLR",
        label: "Clear",
        color: "Clear",
        status: "in_stock",
        stockQuantity: null,
        active: true
      }
    ],
    fitment: ["Standard PSA-style graded slab", "PSA-style slab with a Lucky’s Loot Guard"],
    fitmentWarnings: [
      "Other grading-company slabs vary. Measure before ordering.",
      "Collectible and slab not included."
    ],
    specifications: [
      { label: "Material", value: "Clear acrylic", verified: true },
      { label: "Internal dimensions", value: "Pending measurement verification", verified: false },
      { label: "External dimensions", value: "Pending measurement verification", verified: false }
    ],
    features: [
      {
        title: "Clear presentation",
        description: "Keeps the graded-card setup visible while it is displayed.",
        verified: true
      },
      {
        title: "Shelf-ready format",
        description: "A vertical footprint designed for collector displays.",
        verified: true
      }
    ],
    faq: [
      {
        question: "Does this include a graded card?",
        answer: "No. The acrylic case is sold without a card or graded slab."
      },
      {
        question: "Does this fit every grading company?",
        answer: "No universal fit is claimed. Measure before ordering and send a Product Fit Question for non-PSA slabs."
      }
    ],
    relatedProductIds: ["psa-guards"],
    badges: [],
    keywords: ["slab", "graded card", "PSA", "acrylic case", "display"],
    sortOrder: 1
  },
  {
    id: "acrylic-booster-box-case",
    slug: "booster-box-acrylic-case",
    sku: "LL-AC-BBOX",
    status: "active",
    categoryId: "acrylic-cases",
    collectionIds: ["protect-sealed-product", "booster-boxes"],
    name: "Booster Box Acrylic Case",
    shortName: "Booster Box Case",
    eyebrow: "Protect sealed product",
    summary: "A clear acrylic display case for standard English Pokémon booster boxes.",
    description:
      "Turn a standard English booster box into a neat display block without covering the box art.",
    priceCents: 1200,
    stockStatus: "in_stock",
    stockQuantity: null,
    maxPerOrder: 20,
    images: [
      {
        id: "booster-box-main",
        type: "image",
        src: "/products/acrylic/booster-box-case.webp",
        alt: "Clear booster box acrylic display case on a dark studio background",
        width: 1280,
        height: 720
      }
    ],
    variants: [
      {
        id: "acrylic-booster-box-case-clear",
        sku: "LL-AC-BBOX-CLR",
        label: "Clear",
        color: "Clear",
        status: "in_stock",
        stockQuantity: null,
        active: true
      }
    ],
    fitment: ["Standard English Pokémon booster boxes"],
    fitmentWarnings: [
      "Japanese and specialty booster boxes vary. Measure before ordering.",
      "Collectible not included."
    ],
    specifications: [
      { label: "Material", value: "Clear acrylic", verified: true },
      { label: "Internal dimensions", value: "Pending measurement verification", verified: false },
      { label: "External dimensions", value: "Pending measurement verification", verified: false }
    ],
    features: [
      {
        title: "English booster-box fit",
        description: "Sized for the standard English box format.",
        verified: true
      },
      {
        title: "Visible box art",
        description: "Clear panels keep all sides readable on display.",
        verified: true
      }
    ],
    faq: [
      {
        question: "Does this fit Japanese booster boxes?",
        answer: "Japanese and specialty formats vary, so this case does not claim universal compatibility."
      }
    ],
    relatedProductIds: ["acrylic-etb-case", "acrylic-booster-bundle-case"],
    keywords: ["booster box", "sealed product", "English booster box", "acrylic case"],
    sortOrder: 2
  },
  {
    id: "acrylic-booster-bundle-case",
    slug: "booster-bundle-acrylic-case",
    sku: "LL-AC-BBND",
    status: "active",
    categoryId: "acrylic-cases",
    collectionIds: ["protect-sealed-product", "booster-bundles"],
    name: "Booster Bundle Acrylic Case",
    shortName: "Booster Bundle Case",
    eyebrow: "Protect sealed product",
    summary: "A compact clear acrylic display case for sealed booster bundles.",
    description:
      "Give a smaller sealed product a defined place in the front row of a collector shelf.",
    priceCents: 800,
    stockStatus: "in_stock",
    stockQuantity: null,
    maxPerOrder: 20,
    images: [
      {
        id: "booster-bundle-main",
        type: "image",
        src: "/products/acrylic/booster-bundle-case.webp",
        alt: "Clear booster bundle acrylic display case on a dark studio background",
        width: 1254,
        height: 1254
      }
    ],
    variants: [
      {
        id: "acrylic-booster-bundle-case-clear",
        sku: "LL-AC-BBND-CLR",
        label: "Clear",
        color: "Clear",
        status: "in_stock",
        stockQuantity: null,
        active: true
      }
    ],
    fitment: ["Standard sealed booster-bundle format"],
    fitmentWarnings: ["Specialty bundle formats vary. Measure before ordering.", "Collectible not included."],
    specifications: [
      { label: "Material", value: "Clear acrylic", verified: true },
      { label: "Internal dimensions", value: "Pending measurement verification", verified: false },
      { label: "External dimensions", value: "Pending measurement verification", verified: false }
    ],
    features: [
      {
        title: "Compact display footprint",
        description: "Built for a booster bundle-sized shelf position.",
        verified: true
      },
      {
        title: "Clear presentation",
        description: "Keeps the sealed-product artwork visible.",
        verified: true
      }
    ],
    faq: [
      {
        question: "Is the booster bundle included?",
        answer: "No. The collectible shown in fitment imagery is not included."
      }
    ],
    relatedProductIds: ["acrylic-etb-case", "acrylic-booster-box-case"],
    keywords: ["booster bundle", "sealed product", "acrylic case"],
    sortOrder: 3
  },
  {
    id: "psa-guards",
    slug: "psa-guards",
    sku: "LL-PSAG",
    status: "active",
    categoryId: "slab-protection",
    collectionIds: ["protect-graded-cards", "psa-accessories"],
    name: "PSA Guards",
    shortName: "PSA Guards",
    eyebrow: "Colorful slab protection",
    summary: "TPU guards with clear backplates in 15 colorways and mixed-color bulk pricing.",
    description:
      "Build a color mix for standard PSA-style slabs. Every guard in the cart shares the same unlocked quantity tier.",
    priceCents: 700,
    stockStatus: "in_stock",
    stockQuantity: null,
    maxPerOrder: 99,
    images: psaGuardColors.map((color, index) => ({
      id: `psa-guard-${color.slug}-image`,
      type: "image" as const,
      src: color.image,
      alt: `${color.name} Lucky’s Loot PSA Guard with clear backplate`,
      width: 720,
      height: index === 8 || index === 11 || index === 13 ? 1082 : 1080
    })),
    variants: psaGuardVariants,
    bulkPricing: [...guardPricingTiers],
    fitment: ["Standard PSA-style graded slabs"],
    fitmentWarnings: ["Other grading-company slab sizes are not supported by this fit."],
    specifications: [
      { label: "Guard material", value: "TPU", verified: true },
      { label: "Backplate", value: "Clear protective backplate", verified: true },
      { label: "Colorways", value: "15", verified: true }
    ],
    features: [
      {
        title: "Mix every color",
        description: "All selected color quantities combine toward the same bulk tier.",
        verified: true
      },
      {
        title: "Clear backplate",
        description: "The rear of the slab remains visible through the protection layer.",
        verified: true
      }
    ],
    faq: [
      {
        question: "Can I mix colors for bulk pricing?",
        answer: "Yes. Quantities across all 15 colors are added together before the unit price is calculated."
      },
      {
        question: "What are the price tiers?",
        answer: "Guards are $7 each for 1–9, $6 each for 10–24, and $4 each for 25 or more."
      }
    ],
    relatedProductIds: ["acrylic-crystal-slab-case"],
    badges: ["Mix colors", "Bulk pricing"],
    keywords: ["PSA", "slab", "guard", "graded card", ...psaGuardColors.map((color) => color.name)],
    sortOrder: 4
  },
  {
    id: "toploader-binder-4-pocket",
    slug: "4-pocket-toploader-binder",
    sku: "LL-BDR-4P",
    status: "active",
    categoryId: "toploader-binders",
    collectionIds: ["store-your-collection"],
    name: "4-Pocket Toploader Binder",
    shortName: "4-Pocket Binder",
    eyebrow: "Compact collection storage",
    summary: "A 128-card, zippered binder with side-loading pockets for standard Toploaders.",
    description:
      "Keep a compact Toploader collection together in a four-pocket page layout with a secure zipper closure.",
    priceCents: 1200,
    stockStatus: "in_stock",
    stockQuantity: null,
    maxPerOrder: 20,
    images: [
      {
        id: "binder-4-main",
        type: "image",
        src: "/products/binders/4-pocket-cutout.png",
        alt: "Lineup of colorful four-pocket zippered Toploader binders",
        width: 1254,
        height: 1254
      }
    ],
    variants: createBinderVariants("4", 1200),
    fitment: ["Standard 3 × 4 inch Toploaders"],
    fitmentWarnings: ["Choose from Black, Pink, Red, Aqua, Purple, Yellow, or Lime Green."],
    specifications: [
      { label: "Page layout", value: "4-pocket", verified: true },
      { label: "Capacity", value: "128 cards", verified: true },
      { label: "Pocket loading", value: "Side-loading", verified: true },
      { label: "Closure", value: "Zipper", verified: true }
    ],
    features: [
      {
        title: "128-card capacity",
        description: "A compact page layout for organized Toploader storage.",
        verified: true
      },
      {
        title: "Side-loading pockets",
        description: "Keep standard Toploaders arranged in a four-pocket grid.",
        verified: true
      },
      {
        title: "Plain exterior",
        description: "A no-logo outer design with a diamond texture.",
        verified: true
      }
    ],
    faq: [
      {
        question: "How many cards does it hold?",
        answer: "It holds up to 128 cards in standard 3 × 4 inch Toploaders."
      },
      {
        question: "Can I request engraving?",
        answer: "Yes. Custom engraving requires an inquiry and a confirmed quote before purchase."
      }
    ],
    relatedProductIds: ["toploader-binder-9-pocket"],
    keywords: ["binder", "Toploader", "4-pocket", "128 cards", "storage", "compact"],
    requiresQuote: false,
    sortOrder: 5
  },
  {
    id: "toploader-binder-9-pocket",
    slug: "9-pocket-toploader-binder",
    sku: "LL-BDR-9P",
    status: "active",
    categoryId: "toploader-binders",
    collectionIds: ["store-your-collection"],
    name: "9-Pocket Toploader Binder",
    shortName: "9-Pocket Binder",
    eyebrow: "Large collection storage",
    summary: "A 288-card, zippered binder with side-loading pockets for standard Toploaders.",
    description:
      "Keep a larger Toploader collection together in a nine-pocket page layout with a secure zipper closure.",
    priceCents: 1500,
    stockStatus: "in_stock",
    stockQuantity: null,
    maxPerOrder: 20,
    images: [
      {
        id: "binder-9-main",
        type: "image",
        src: "/products/binders/9-pocket-cutout.png",
        alt: "Stack of colorful nine-pocket zippered Toploader binders",
        width: 1254,
        height: 1254
      }
    ],
    variants: createBinderVariants("9", 1500),
    fitment: ["Standard 3 × 4 inch Toploaders"],
    fitmentWarnings: ["Choose from Black, Pink, Red, Aqua, Purple, or Yellow."],
    specifications: [
      { label: "Page layout", value: "9-pocket", verified: true },
      { label: "Capacity", value: "288 cards", verified: true },
      { label: "Pocket loading", value: "Side-loading", verified: true },
      { label: "Closure", value: "Zipper", verified: true }
    ],
    features: [
      {
        title: "288-card capacity",
        description: "A larger page layout for organized Toploader storage.",
        verified: true
      },
      {
        title: "Side-loading pockets",
        description: "Keep standard Toploaders arranged in a nine-pocket grid.",
        verified: true
      },
      {
        title: "Plain exterior",
        description: "A no-logo outer design with a diamond texture.",
        verified: true
      }
    ],
    faq: [
      {
        question: "Does it hold cards without Toploaders?",
        answer: "It is designed around standard 3 × 4 inch Toploaders. Use normal card sleeves as intended before loading a Toploader."
      },
      {
        question: "Can I request engraving?",
        answer: "Yes. Custom engraving requires an inquiry and a confirmed quote before purchase."
      }
    ],
    relatedProductIds: ["toploader-binder-4-pocket"],
    keywords: ["binder", "Toploader", "9-pocket", "288 cards", "storage"],
    requiresQuote: false,
    sortOrder: 6
  }
] satisfies Product[];

const parsedCatalog = ProductSchema.array().parse(rawCatalog);
assertCatalogRelationships(parsedCatalog);

export const catalog = parsedCatalog as ReadonlyArray<Product>;

function assertCatalogRelationships(products: Product[]) {
  const productIds = new Set(products.map((product) => product.id));
  const categoryIds = new Set(categories.map((category) => category.id));
  const collectionIds = new Set(collections.map((collection) => collection.id));
  const seenProductIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenVariantIds = new Set<string>();
  const seenVariantSkus = new Set<string>();

  for (const product of products) {
    if (seenProductIds.has(product.id)) {
      throw new Error(`Duplicate product id: ${product.id}`);
    }
    if (seenSlugs.has(product.slug)) {
      throw new Error(`Duplicate product slug: ${product.slug}`);
    }
    if (!categoryIds.has(product.categoryId)) {
      throw new Error(`Unknown category ${product.categoryId} for ${product.id}`);
    }

    for (const collectionId of product.collectionIds) {
      if (!collectionIds.has(collectionId)) {
        throw new Error(`Unknown collection ${collectionId} for ${product.id}`);
      }
    }

    for (const relatedProductId of product.relatedProductIds) {
      if (!productIds.has(relatedProductId)) {
        throw new Error(`Unknown related product ${relatedProductId} for ${product.id}`);
      }
    }

    for (const variant of product.variants) {
      if (seenVariantIds.has(variant.id)) {
        throw new Error(`Duplicate variant id: ${variant.id}`);
      }
      if (seenVariantSkus.has(variant.sku)) {
        throw new Error(`Duplicate variant sku: ${variant.sku}`);
      }
      seenVariantIds.add(variant.id);
      seenVariantSkus.add(variant.sku);
    }

    seenProductIds.add(product.id);
    seenSlugs.add(product.slug);
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
