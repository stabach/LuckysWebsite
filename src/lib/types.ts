export type CategoryId =
  | "acrylic-etb-cases"
  | "acrylic-booster-box-cases"
  | "acrylic-booster-bundle-cases"
  | "phantom-display-psa-cases"
  | "psa-slab-guards"
  | "topload-binders";

export type ProductStatus = "in_stock" | "low_stock" | "preorder" | "sold_out";

export type Category = {
  id: CategoryId;
  name: string;
  navLabel: string;
  description: string;
  href: string;
  accent: string;
  materialCue: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categoryId: CategoryId;
  tagline: string;
  summary: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  status: ProductStatus;
  dimensions: string;
  finish: string;
  accent: string;
  image: string;
  imageAlt: string;
  imageSource?: string;
  productInsideLabel?: string;
  colorways?: string[];
  featured?: boolean;
  bestSeller?: boolean;
  materials: string[];
  specs: Array<{ label: string; value: string }>;
  fitment: string[];
  demoSteps: Array<{ label: string; description: string }>;
  pairings: string[];
  faq: Array<{ question: string; answer: string }>;
};

export type InspirationSetup = {
  id: string;
  title: string;
  room: string;
  palette: string;
  description: string;
  protectedItems: string[];
};

export type ShelfItemKind =
  | "etb"
  | "boosterBox"
  | "boosterBundle"
  | "slab"
  | "binder"
  | "accessory";

export type ShelfLayoutPreset = "gallery" | "vault" | "compact";

export type ShelfItem = {
  id: string;
  kind: ShelfItemKind;
  label: string;
  protectedBy?: CategoryId;
  image?: string;
  colorway?: string;
  shelf: number;
  span: number;
};

export type CollectionCounts = {
  etbs: number;
  boosterBoxes: number;
  boosterBundles: number;
  gradedCards: number;
  binders: number;
};

export type CollectionRecommendation = {
  productName: string;
  quantity: number;
  reason: string;
};

export type CollectionPlan = {
  shelfRows: ShelfItem[][];
  recommendations: CollectionRecommendation[];
  estimatedWidthInches: number;
  estimatedShelfRows: number;
  upgradeNotes: string[];
};
