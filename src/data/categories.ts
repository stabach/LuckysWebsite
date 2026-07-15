import { CategorySchema, type Category } from "@/lib/catalog-schema";

const rawCategories = [
  {
    id: "acrylic-cases",
    slug: "acrylic-cases",
    name: "Acrylic Cases",
    description: "Clear display protection for sealed products and graded-card setups.",
    image: "/products/acrylic/etb-case.webp",
    alt: "Clear acrylic display case on a dark studio background",
    sortOrder: 0
  },
  {
    id: "slab-protection",
    slug: "slab-protection",
    name: "Slab Protection",
    description: "Colorful edge protection and clear backplates for standard PSA-style slabs.",
    image: "/products/psa-guards/color-lineup.webp",
    alt: "A selection of colorful Lucky’s Loot PSA Guards",
    sortOrder: 1
  },
  {
    id: "toploader-binders",
    slug: "toploader-binders",
    name: "Toploader Binders",
    description: "Zippered, side-loading storage for cards already protected in Toploaders.",
    image: "/products/binders/4-pocket.webp",
    alt: "A lineup of zippered collector binders",
    sortOrder: 2
  }
] satisfies Category[];

export const categories = CategorySchema.array().parse(rawCategories) as ReadonlyArray<Category>;
