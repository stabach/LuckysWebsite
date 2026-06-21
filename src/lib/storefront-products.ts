export type StorefrontVariant = {
  id: string;
  label: string;
  shortLabel: string;
  priceCents: number;
  description: string;
  maxQuantity: number;
  filters: ProductFilterId[];
  image?: string;
  colorName?: string;
  packSize?: number;
  requiresNotes?: boolean;
};

export type ProductFilterId =
  | "acrylic-cases"
  | "psa-guards"
  | "binders"
  | "graded-cards"
  | "sealed-product";

export type ProductFilter = {
  id: ProductFilterId;
  label: string;
  description: string;
};

export const productFilters: ProductFilter[] = [
  {
    id: "acrylic-cases",
    label: "Acrylic Cases",
    description: "Clear display cases for sealed boxes and collector shelves."
  },
  {
    id: "psa-guards",
    label: "PSA Guards",
    description: "TPU guards for standard PSA slabs."
  },
  {
    id: "binders",
    label: "Binders",
    description: "Plain diamond-texture toploader binders for protected card storage."
  },
  {
    id: "graded-cards",
    label: "Graded Cards",
    description: "Protection and display accessories for graded slabs."
  },
  {
    id: "sealed-product",
    label: "Sealed Product",
    description: "Cases sized for sealed Pokemon product display."
  }
];

export type StorefrontProductFamily = {
  id: string;
  name: string;
  subtitle: string;
  intro: string;
  details: string[];
  note: string;
  gradient: string;
  images: Array<{ src: string; alt: string }>;
  colorOptions?: Array<{ name: string; src: string }>;
  bulkDiscounts?: string[];
  variants: StorefrontVariant[];
};

export const psaGuardColors = [
  "Arctic",
  "Cosmic Pop",
  "Cotton Candy",
  "Diamond",
  "Eclipse",
  "Emerald",
  "Galaxy",
  "Glacier",
  "Gold Dust",
  "Midnight Gold",
  "Nebula",
  "Reef",
  "Solar Flare",
  "Solar Rush",
  "Void"
].map((name) => ({
  name,
  src: `/psa-guards/${encodeURIComponent(`${name}.png`)}`
}));

const psaGuardColorVariants: StorefrontVariant[] = psaGuardColors.map((color) => ({
  id: `psa-guard-${color.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  label: `${color.name} PSA Guard`,
  shortLabel: color.name,
  priceCents: 700,
  description:
    `${color.name} TPU plastic PSA guard with a clear protective backplate. ` +
    "Bulk pricing automatically applies in cart and checkout: 1-9 guards are $7 each, 10-24 guards are $6 each, and 25+ guards are $4 each.",
  maxQuantity: 99,
  filters: ["psa-guards", "graded-cards"],
  image: color.src,
  colorName: color.name,
  packSize: 1
}));

export const storefrontProductFamilies: StorefrontProductFamily[] = [
  {
    id: "acrylic-cases",
    name: "Acrylic Cases",
    subtitle: "ETB, Crystal Slab, Booster Box, and Booster Bundle cases",
    intro: "These premium acrylic cases feature:",
    details: [
      "8mm ultra-thick walls",
      "Precision-rounded edges",
      "Strong magnetic closures",
      "Snug, display-ready perfect fit"
    ],
    note: "If you're done settling for thin, loose, mass-produced acrylic, this is the upgrade.",
    gradient: "from-[#4a148c] to-[#7b1fa2]",
    images: [
      { src: "/product-images/acrylic-etb.png", alt: "ETB acrylic case" },
      { src: "/product-images/acrylic-booster-box.png", alt: "Booster Box acrylic case" },
      { src: "/product-images/acrylic-booster-bundle.png", alt: "Booster Bundle acrylic case" },
      { src: "/product-images/acrylic-psa-guard.png", alt: "Crystal Slab acrylic case" }
    ],
    variants: [
      {
        id: "acrylic-etb-case",
        label: "ETB Acrylic Case",
        shortLabel: "ETB Acrylic Case",
        priceCents: 1500,
        description: "8mm acrylic display case for Pokemon Elite Trainer Boxes.",
        maxQuantity: 20,
        filters: ["acrylic-cases", "sealed-product"],
        image: "/product-images/acrylic-etb.png"
      },
      {
        id: "acrylic-crystal-slab-case",
        label: "Crystal Slab Acrylic Case",
        shortLabel: "Crystal Slab Case",
        priceCents: 1300,
        description: "Acrylic display case for crystal slab-style card displays.",
        maxQuantity: 20,
        filters: ["acrylic-cases", "graded-cards"],
        image: "/product-images/acrylic-psa-guard.png"
      },
      {
        id: "acrylic-booster-box-case",
        label: "Booster Box Acrylic Case",
        shortLabel: "Booster Box Case",
        priceCents: 1200,
        description: "8mm acrylic display case for sealed Pokemon booster boxes.",
        maxQuantity: 20,
        filters: ["acrylic-cases", "sealed-product"],
        image: "/product-images/acrylic-booster-box.png"
      },
      {
        id: "acrylic-booster-bundle-case",
        label: "Booster Bundle Acrylic Case",
        shortLabel: "Booster Bundle Case",
        priceCents: 800,
        description: "Acrylic display case for sealed Pokemon booster bundles.",
        maxQuantity: 20,
        filters: ["acrylic-cases", "sealed-product"],
        image: "/product-images/acrylic-booster-bundle.png"
      }
    ]
  },
  {
    id: "psa-guards",
    name: "PSA Guards",
    subtitle: "TPU Plastic + Clear Backplate",
    intro: "These presentation-ready PSA guards feature:",
    details: [
      "Durable TPU plastic",
      "Clear protective backplate",
      "Full-edge slab coverage",
      "Choose from 15 colorways",
      "Bulk Discounts"
    ],
    bulkDiscounts: ["1-9 guards = $7 each", "10-24 guards = $6 each", "25+ guards = $4 each"],
    note: "",
    gradient: "from-[#050505] via-[#0d0d0d] to-[#17130a]",
    images: psaGuardColors.map((color) => ({
      src: color.src,
      alt: `${color.name} PSA guard`
    })),
    colorOptions: psaGuardColors,
    variants: psaGuardColorVariants
  },
  {
    id: "toploader-binders",
    name: "Toploader Binders",
    subtitle: "Plain diamond-texture binders for 4-pocket and 9-pocket storage",
    intro: "These plain toploader binders feature:",
    details: [
      "Side-loading top-loader pockets",
      "Diamond-texture outer cover",
      "4-pocket binder holds 112 cards",
      "9-pocket binder holds 288 cards",
      "Secure zipper closure"
    ],
    note: "Simple, clean, no-logo binders built for protected storage without extra branding.",
    gradient: "from-[#ff6b9d] to-[#c44569]",
    images: [
      { src: "/old-site/binders.png", alt: "Toploader binder lineup" },
      { src: "/old-site/binders2.png", alt: "Toploader binder pages" },
      { src: "/old-site/binders3.png", alt: "Toploader binder detail" }
    ],
    variants: [
      {
        id: "toploader-binder-4-pocket",
        label: "4 Pocket Topload Binder",
        shortLabel: "4 Pocket Binder",
        priceCents: 1200,
        description: "Plain diamond-texture 4-pocket toploader binder that holds 112 cards.",
        maxQuantity: 20,
        filters: ["binders"]
      },
      {
        id: "toploader-binder-9-pocket",
        label: "9 Pocket Toploader Binder",
        shortLabel: "9 Pocket Binder",
        priceCents: 1500,
        description: "Plain diamond-texture 9-pocket toploader binder that holds 288 cards.",
        maxQuantity: 20,
        filters: ["binders"]
      }
    ]
  }
];

export const storefrontVariants = storefrontProductFamilies.flatMap((family) =>
  family.variants.map((variant) => ({
    ...variant,
    familyId: family.id,
    familyName: family.name,
    image: variant.image ?? family.images[0]?.src ?? "/old-site/LuckysLoot.png",
    images:
      variant.image && family.id !== "psa-guards"
        ? [{ src: variant.image, alt: variant.label }]
        : family.images,
    familyDetails: family.details,
    familyNote: family.note,
    familyColorOptions: family.colorOptions,
    familyBulkDiscounts: family.bulkDiscounts
  }))
);

export type StorefrontCartVariant = (typeof storefrontVariants)[number];
export type StorefrontCategoryId = "acrylic-cases" | "psa-guards" | "binders" | "sealed-product";

export type StorefrontCategory = {
  id: StorefrontCategoryId;
  label: string;
  title: string;
  description: string;
  standaloneHref: string;
  overviewHref: string;
};

export const storefrontCategories: StorefrontCategory[] = [
  {
    id: "acrylic-cases",
    label: "Acrylic Cases",
    title: "Acrylic Cases",
    description: "Display-ready acrylic protection for sealed boxes and collector shelves.",
    standaloneHref: "/acrylic-cases",
    overviewHref: "/products#acrylic-cases"
  },
  {
    id: "psa-guards",
    label: "PSA Guards",
    title: "PSA Guards",
    description: "Colorway PSA slab guards with automatic cart discounts.",
    standaloneHref: "/psa-guards",
    overviewHref: "/products#psa-guards"
  },
  {
    id: "binders",
    label: "Binders",
    title: "Binders",
    description: "Toploader binders for protected card storage and clean set browsing.",
    standaloneHref: "/binders",
    overviewHref: "/products#binders"
  },
  {
    id: "sealed-product",
    label: "Sealed Product",
    title: "Sealed Product",
    description: "Protection sized for sealed Pokemon ETBs, booster boxes, and booster bundles.",
    standaloneHref: "/sealed-product",
    overviewHref: "/products#sealed-product"
  }
];

export function getDisplayStorefrontVariants() {
  return storefrontVariants.filter(
    (product) =>
      !(
        product.familyId === "psa-guards" &&
        product.packSize === 1 &&
        product.colorName &&
        product.colorName !== "Arctic"
      )
  );
}

export function getStorefrontCategory(categoryId: StorefrontCategoryId) {
  return storefrontCategories.find((category) => category.id === categoryId);
}

export function getStorefrontCategoryProducts(categoryId: StorefrontCategoryId) {
  const products = getDisplayStorefrontVariants();

  switch (categoryId) {
    case "acrylic-cases":
      return products.filter((product) => product.familyId === "acrylic-cases");
    case "psa-guards":
      return products.filter((product) => product.familyId === "psa-guards");
    case "binders":
      return products.filter((product) => product.filters.includes("binders"));
    case "sealed-product":
      return products.filter((product) => product.filters.includes("sealed-product"));
  }
}

export function isPsaGuardVariant(variant: Pick<StorefrontCartVariant, "familyId" | "packSize">) {
  return variant.familyId === "psa-guards" && variant.packSize === 1;
}

export function getPsaGuardUnitPriceCents(totalGuardQuantity: number) {
  if (totalGuardQuantity >= 25) {
    return 400;
  }

  if (totalGuardQuantity >= 10) {
    return 600;
  }

  return 700;
}

export function getStorefrontCartUnitPriceCents(
  variant: StorefrontCartVariant,
  totalGuardQuantity: number
) {
  return isPsaGuardVariant(variant)
    ? getPsaGuardUnitPriceCents(totalGuardQuantity)
    : variant.priceCents;
}

export function getStorefrontVariant(variantId: string) {
  return storefrontVariants.find((variant) => variant.id === variantId);
}

export function formatStorefrontCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}
