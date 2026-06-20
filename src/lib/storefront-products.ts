export type StorefrontVariant = {
  id: string;
  label: string;
  shortLabel: string;
  priceCents: number;
  description: string;
  maxQuantity: number;
  filters: ProductFilterId[];
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
  variants: StorefrontVariant[];
};

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
      { src: "/old-site/LLAC1.png", alt: "Acrylic card display cases" },
      { src: "/old-site/LLAC3.png", alt: "Lucky's Loot acrylic case detail" },
      { src: "/old-site/LLAC5.png", alt: "Acrylic case product lineup" }
    ],
    variants: [
      {
        id: "acrylic-etb-case",
        label: "ETB Acrylic Case",
        shortLabel: "ETB Acrylic Case",
        priceCents: 1500,
        description: "8mm acrylic display case for Pokemon Elite Trainer Boxes.",
        maxQuantity: 20,
        filters: ["acrylic-cases", "sealed-product"]
      },
      {
        id: "acrylic-crystal-slab-case",
        label: "Crystal Slab Acrylic Case",
        shortLabel: "Crystal Slab Case",
        priceCents: 1300,
        description: "Acrylic display case for crystal slab-style card displays.",
        maxQuantity: 20,
        filters: ["acrylic-cases", "graded-cards"]
      },
      {
        id: "acrylic-booster-box-case",
        label: "Booster Box Acrylic Case",
        shortLabel: "Booster Box Case",
        priceCents: 1200,
        description: "8mm acrylic display case for sealed Pokemon booster boxes.",
        maxQuantity: 20,
        filters: ["acrylic-cases", "sealed-product"]
      },
      {
        id: "acrylic-booster-bundle-case",
        label: "Booster Bundle Acrylic Case",
        shortLabel: "Booster Bundle Case",
        priceCents: 800,
        description: "Acrylic display case for sealed Pokemon booster bundles.",
        maxQuantity: 20,
        filters: ["acrylic-cases", "sealed-product"]
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
      "Single guard and 10-pack options"
    ],
    note: "Clean fit, solid protection, and a clear backplate that keeps the slab presentation sharp.",
    gradient: "from-[#1565c0] to-[#42a5f5]",
    images: [
      { src: "/old-site/psaguards.png", alt: "Colorful PSA slab guards" },
      { src: "/old-site/psaguards2.png", alt: "Two-tone PSA guard collection" },
      { src: "/old-site/psaguards1.png", alt: "PSA guard closeup" }
    ],
    variants: [
      {
        id: "psa-gradient-guard",
        label: "PSA Guard",
        shortLabel: "PSA Guard",
        priceCents: 700,
        description: "TPU plastic PSA guard with a clear protective backplate.",
        maxQuantity: 99,
        filters: ["psa-guards", "graded-cards"]
      },
      {
        id: "psa-guard-10-pack",
        label: "(10) PSA Guards",
        shortLabel: "10 PSA Guards",
        priceCents: 5000,
        description: "Ten TPU plastic PSA guards with clear protective backplates.",
        maxQuantity: 20,
        filters: ["psa-guards", "graded-cards"]
      }
    ]
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
        priceCents: 1100,
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
    image: family.images[0]?.src ?? "/old-site/LuckysLoot.png",
    images: family.images,
    familyDetails: family.details,
    familyNote: family.note
  }))
);

export type StorefrontCartVariant = (typeof storefrontVariants)[number];

export function getStorefrontVariant(variantId: string) {
  return storefrontVariants.find((variant) => variant.id === variantId);
}

export function formatStorefrontCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}
