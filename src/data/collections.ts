import { CollectionSchema, type Collection } from "@/lib/catalog-schema";

const rawCollections = [
  {
    id: "protect-sealed-product",
    slug: "protect-sealed-product",
    name: "Protect Sealed Product",
    description: "Acrylic cases for sealed products and PSA-style graded slabs.",
    intent: "Acrylic display protection",
    sortOrder: 0
  },
  {
    id: "protect-graded-cards",
    slug: "protect-graded-cards",
    name: "Protect Graded Cards",
    description: "PSA Graded Guard Fit Acrylic Cases and colorful PSA-style slab guards.",
    intent: "Graded-card display and edge protection",
    sortOrder: 1
  },
  {
    id: "elite-trainer-boxes",
    slug: "elite-trainer-boxes",
    name: "Elite Trainer Boxes",
    description: "Acrylic protection for standard-size ETBs.",
    intent: "Standard ETB fit",
    sortOrder: 2
  },
  {
    id: "booster-boxes",
    slug: "booster-boxes",
    name: "Booster Boxes",
    description: "Acrylic protection for standard English booster boxes.",
    intent: "English booster-box fit",
    sortOrder: 3
  },
  {
    id: "booster-bundles",
    slug: "booster-bundles",
    name: "Booster Bundles",
    description: "Compact acrylic protection for booster bundles.",
    intent: "Booster-bundle fit",
    sortOrder: 4
  },
  {
    id: "slab-displays",
    slug: "slab-displays",
    name: "Slab Displays",
    description: "Clear display cases for graded-card setups.",
    intent: "Graded slab presentation",
    sortOrder: 5
  },
  {
    id: "psa-accessories",
    slug: "psa-accessories",
    name: "PSA Accessories",
    description: "Colorful guard options for standard PSA-style slabs.",
    intent: "PSA-style slab protection",
    sortOrder: 6
  },
  {
    id: "store-your-collection",
    slug: "store-your-collection",
    name: "Store Your Collection",
    description: "Compact and large-format Toploader binder storage.",
    intent: "Toploaded-card organization",
    sortOrder: 7
  }
] satisfies Collection[];

export const collections = CollectionSchema.array().parse(rawCollections) as ReadonlyArray<Collection>;
