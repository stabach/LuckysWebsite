import type { Category, InspirationSetup, Product, ShelfItem } from "@/lib/types";

export const productImages = {
  etb: "/product-images/acrylic-etb.png",
  boosterBox: "/product-images/acrylic-booster-box.png",
  boosterBundle: "/product-images/acrylic-booster-bundle.png",
  psaGuardAcrylic: "/product-images/acrylic-psa-guard.png",
  phantomRuby: "/product-images/phantom-ruby-gradedguard.webp",
  phantomEmerald: "/product-images/phantom-emerald-gradedguard.webp",
  phantomFrosted: "/product-images/phantom-frosted-psa-gradedguard.webp",
  binder9: "/product-images/toploader-binder-9-pocket.jpg",
  binder4: "/product-images/toploader-binder-4-pocket.jpg",
  mascotGuide: "/brand/mascot-shelf-clean.png",
  logo: "/brand/logo.png"
};

export const imageSources = {
  etb: "https://stonebrookcollectibles.com/products/pokemon-black-bolt-etb",
  boosterBox:
    "https://stonebrookcollectibles.com/products/pokemon-tcg-scarlet-violet-destined-rivals-booster-display-box-36-packs-sealed",
  boosterBundle: "https://stonebrookcollectibles.com/products/destined-rivals-booster-bundle",
  phantom: "https://phantomdisplay.com/products/gradedguard",
  binder9: "https://tcgprotectors.com/products/premium-9-pocket-toploader-binder",
  binder4: "https://www.cardshellz.com/products/toploader-binder-black"
};

export const categories: Category[] = [
  {
    id: "acrylic-etb-cases",
    name: "Pokemon ETB Acrylic Cases",
    navLabel: "ETB Cases",
    href: "/shop/acrylic-etb-cases",
    description:
      "Clear, friendly display cases built around Pokemon Elite Trainer Boxes, with smooth edges and a case-on-shelf look.",
    accent: "#2f8f5b",
    materialCue: "Clear acrylic, magnetic lid, ETB fit"
  },
  {
    id: "acrylic-booster-box-cases",
    name: "Pokemon Booster Box Acrylic Cases",
    navLabel: "Booster Boxes",
    href: "/shop/acrylic-booster-box-cases",
    description:
      "Acrylic protection for sealed Pokemon booster boxes that keeps the box art visible and shelf-ready.",
    accent: "#44a7d8",
    materialCue: "Low-distortion panels, stackable shelf profile"
  },
  {
    id: "acrylic-booster-bundle-cases",
    name: "Pokemon Booster Bundle Acrylic Cases",
    navLabel: "Booster Bundles",
    href: "/shop/acrylic-booster-bundle-cases",
    description:
      "Compact acrylic cases for booster bundles, perfect for bright front rows and playful shelf layouts.",
    accent: "#ffb84d",
    materialCue: "Compact shell, magnetic lid, front-row display"
  },
  {
    id: "phantom-display-psa-cases",
    name: "Phantom Display PSA Guard Acrylic Cases",
    navLabel: "Phantom PSA",
    href: "/shop/phantom-display-psa-cases",
    description:
      "Acrylic display cases for PSA slabs wearing colorful guards, built for desk, shelf, and showcase displays.",
    accent: "#8d5cf6",
    materialCue: "Acrylic slab display, guard-compatible fit"
  },
  {
    id: "psa-slab-guards",
    name: "Gradient PSA Guards",
    navLabel: "PSA Guards",
    href: "/shop/psa-slab-guards",
    description:
      "Soft, colorful PSA slab guards in gradient-style colorways for collectors who want protection with personality.",
    accent: "#ff6fb1",
    materialCue: "Impact corners, gradient colorways, PSA fit"
  },
  {
    id: "topload-binders",
    name: "Topload Binders",
    navLabel: "Binders",
    href: "/shop/topload-binders",
    description:
      "9-pocket and 4-pocket toploader binders for protected card pages, set builds, and favorite-hit collections.",
    accent: "#5fbf77",
    materialCue: "Toploader pockets, zipper closure, page display"
  }
];

export const products: Product[] = [
  {
    id: "ll-etb-case",
    slug: "pokemon-etb-acrylic-case",
    name: "Pokemon ETB Acrylic Case",
    categoryId: "acrylic-etb-cases",
    tagline: "Your sealed ETB, inside a Lucky's Loot display case.",
    summary:
      "A clear acrylic case for Pokemon Elite Trainer Boxes that lets the box art stay loud while the shelf feels protected and organized.",
    price: 34,
    compareAtPrice: 42,
    inventory: 86,
    status: "in_stock",
    dimensions: "7.7 x 6.8 x 3.7 in",
    finish: "Clear acrylic with soft polished edges and magnetic lid",
    accent: "#2f8f5b",
    image: productImages.etb,
    imageAlt: "Clear acrylic case for Pokemon Elite Trainer Boxes",
    imageSource: imageSources.etb,
    productInsideLabel: "Pokemon ETB shown for fitment",
    featured: true,
    bestSeller: true,
    materials: ["4 mm acrylic", "magnetic closure", "soft polished corners"],
    specs: [
      { label: "Designed for", value: "Standard Pokemon ETBs" },
      { label: "Acrylic thickness", value: "4 mm" },
      { label: "Closure", value: "Magnetic lid" },
      { label: "Display orientation", value: "Vertical shelf display" }
    ],
    fitment: ["Pokemon Elite Trainer Boxes", "standard sealed ETBs", "many specialty trainer boxes"],
    demoSteps: [
      {
        label: "Drop in the ETB",
        description: "Place the sealed box inside without squeezing the wrap or hiding the front art."
      },
      {
        label: "Close the lid",
        description: "The magnetic top settles into place so the case feels simple and secure."
      },
      {
        label: "Shelf it",
        description: "The clear case turns the ETB into a neat display block with visible protection."
      }
    ],
    pairings: ["Pokemon Booster Bundle Acrylic Case", "9-Pocket Topload Binder"],
    faq: [
      {
        question: "Is the Pokemon product included?",
        answer: "No. Pokemon sealed product images are shown as fitment examples for the acrylic case."
      },
      {
        question: "Will this fit Pokemon Center ETBs?",
        answer: "The standard case is tuned for mainline ETBs. Oversized Pokemon Center editions should use an XL size when offered."
      }
    ]
  },
  {
    id: "ll-booster-box-case",
    slug: "pokemon-booster-box-acrylic-case",
    name: "Pokemon Booster Box Acrylic Case",
    categoryId: "acrylic-booster-box-cases",
    tagline: "A crystal-clear home for sealed booster boxes.",
    summary:
      "A Lucky's Loot acrylic case that frames a sealed Pokemon booster box without hiding the art, set name, or premium shelf presence.",
    price: 12,
    inventory: 52,
    status: "in_stock",
    dimensions: "5.5 x 4.9 x 3.0 in",
    finish: "Clear acrylic with magnetic lid and stacked-shelf profile",
    accent: "#44a7d8",
    image: productImages.boosterBox,
    imageAlt: "Clear acrylic case for sealed Pokemon booster boxes",
    imageSource: imageSources.boosterBox,
    productInsideLabel: "Booster box shown for fitment",
    featured: true,
    materials: ["3.5 mm acrylic", "magnetic lid", "clear shelf face"],
    specs: [
      { label: "Designed for", value: "English Pokemon booster boxes" },
      { label: "Acrylic thickness", value: "3.5 mm" },
      { label: "Closure", value: "Magnetic top" },
      { label: "Shelf profile", value: "Stackable display block" }
    ],
    fitment: ["standard Pokemon booster boxes", "Scarlet & Violet booster displays", "Sword & Shield booster displays"],
    demoSteps: [
      {
        label: "Slide in the box",
        description: "The booster box centers inside the acrylic with room for clean removal."
      },
      {
        label: "Protect the corners",
        description: "The case creates a clear buffer around sealed edges and shrink wrap."
      },
      {
        label: "Stack cleanly",
        description: "Multiple boxes line up into a consistent shelf row."
      }
    ],
    pairings: ["Pokemon ETB Acrylic Case", "Pokemon Booster Bundle Acrylic Case"],
    faq: [
      {
        question: "Does this fit Japanese booster boxes?",
        answer: "Japanese boxes vary by set and are usually smaller. This size is focused on standard English Pokemon booster boxes."
      }
    ]
  },
  {
    id: "ll-booster-bundle-case",
    slug: "pokemon-booster-bundle-acrylic-case",
    name: "Pokemon Booster Bundle Acrylic Case",
    categoryId: "acrylic-booster-bundle-cases",
    tagline: "Small sealed products deserve a proper case too.",
    summary:
      "A compact acrylic case for Pokemon booster bundles so smaller sealed pieces can sit confidently in the front row of a shelf.",
    price: 22,
    inventory: 38,
    status: "low_stock",
    dimensions: "4.7 x 3.5 x 2.5 in",
    finish: "Clear acrylic with playful gold lid detail",
    accent: "#ffb84d",
    image: productImages.boosterBundle,
    imageAlt: "Clear acrylic case for sealed Pokemon booster bundles",
    imageSource: imageSources.boosterBundle,
    productInsideLabel: "Booster bundle shown for fitment",
    featured: true,
    materials: ["3 mm acrylic", "magnetic lid", "front-row shelf footprint"],
    specs: [
      { label: "Designed for", value: "Pokemon booster bundles" },
      { label: "Acrylic thickness", value: "3 mm" },
      { label: "Closure", value: "Magnetic lid" },
      { label: "Display orientation", value: "Front-row shelf display" }
    ],
    fitment: ["Pokemon booster bundles", "6-pack sealed bundle formats"],
    demoSteps: [
      {
        label: "Case the bundle",
        description: "The acrylic outline gives compact sealed product a finished display shape."
      },
      {
        label: "Build a front row",
        description: "Bundles can sit in front of ETBs and booster boxes without looking loose."
      }
    ],
    pairings: ["Pokemon ETB Acrylic Case", "Pokemon Booster Box Acrylic Case"],
    faq: [
      {
        question: "Can this sit in front of ETB cases?",
        answer: "Yes. Booster bundle cases are designed to work as a lower front row on deeper shelves."
      }
    ]
  },
  {
    id: "ll-phantom-psa-display",
    slug: "phantom-display-psa-guard-acrylic-case",
    name: "Phantom Display PSA Guard Acrylic Case",
    categoryId: "phantom-display-psa-cases",
    tagline: "Acrylic display for guarded PSA slabs.",
    summary:
      "Acrylic display housing inspired by Phantom-style slab displays, built for PSA slabs wearing colorful guards.",
    price: 30,
    inventory: 44,
    status: "in_stock",
    dimensions: "PSA display footprint",
    finish: "Clear acrylic display with guard-friendly slab channel",
    accent: "#8d5cf6",
    image: productImages.psaGuardAcrylic,
    imageAlt: "Clear acrylic case for PSA Guard slab displays",
    imageSource: imageSources.phantom,
    productInsideLabel: "Guarded PSA slab shown for style",
    colorways: ["Ruby", "Emerald", "Sapphire", "Amethyst", "Frosted"],
    featured: true,
    materials: ["clear acrylic", "slab display channel", "guard-compatible spacing"],
    specs: [
      { label: "Designed for", value: "PSA slabs with guards" },
      { label: "Display mode", value: "Desk or shelf" },
      { label: "Case feel", value: "Acrylic showcase" }
    ],
    fitment: ["PSA standard slabs", "PSA slabs with compatible guards"],
    demoSteps: [
      {
        label: "Set the slab",
        description: "The guarded PSA slab sits upright for easy desk or shelf viewing."
      },
      {
        label: "Match the color",
        description: "Pair the display with Ruby, Emerald, Sapphire, Amethyst, or frosted guard looks."
      }
    ],
    pairings: ["Gradient PSA Guard", "4-Pocket Topload Binder"],
    faq: [
      {
        question: "Does this include a graded card?",
        answer: "No. The slab imagery is used as an example of how guarded PSA cards can display."
      }
    ]
  },
  {
    id: "ll-gradient-psa-guard",
    slug: "gradient-psa-guard",
    name: "Gradient PSA Guard",
    categoryId: "psa-slab-guards",
    tagline: "Color-match your slab without hiding the card.",
    summary:
      "A PSA slab guard line with 15 colorways for collectors who want protection that feels expressive.",
    price: 7,
    inventory: 140,
    status: "in_stock",
    dimensions: "Fits standard PSA slab",
    finish: "Soft-touch guard with colorful edge treatment",
    accent: "#ff6fb1",
    image: productImages.phantomEmerald,
    imageAlt: "Emerald style PSA graded guard example showing colorful slab protection",
    imageSource: imageSources.phantom,
    productInsideLabel: "Gradient guard colorway example",
    colorways: [
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
    ],
    bestSeller: true,
    materials: ["impact-resistant guard", "raised lip", "soft-touch edge"],
    specs: [
      { label: "Fitment", value: "Standard PSA slab" },
      { label: "Frame", value: "15 color options" },
      { label: "Protection", value: "Raised front and corner guard" }
    ],
    fitment: ["PSA standard slabs"],
    demoSteps: [
      {
        label: "Press fit",
        description: "The slab seats into a colorful perimeter guard."
      },
      {
        label: "Colorway match",
        description: "Choose a gradient that complements the card art or shelf theme."
      }
    ],
    pairings: ["Phantom Display PSA Guard Acrylic Case", "4-Pocket Topload Binder"],
    faq: [
      {
        question: "Are these similar to GradedGuard color styles?",
        answer: "Available colors are Arctic, Cosmic Pop, Cotton Candy, Diamond, Eclipse, Emerald, Galaxy, Glacier, Gold Dust, Midnight Gold, Nebula, Reef, Solar Flare, Solar Rush, and Void."
      },
      {
        question: "How does bulk pricing work?",
        answer: "Bulk pricing applies automatically in cart and checkout. 1-9 guards are $7 each, 10-24 guards are $6 each, and 25+ guards are $4 each."
      }
    ]
  },
  {
    id: "ll-topload-binder-9",
    slug: "9-pocket-topload-binder",
    name: "9-Pocket Topload Binder",
    categoryId: "topload-binders",
    tagline: "A big binder for protected master-set pages.",
    summary:
      "A 9-pocket toploader binder for collectors who want protected cards to still flip and display beautifully.",
    price: 39,
    inventory: 24,
    status: "low_stock",
    dimensions: "9-pocket page format",
    finish: "Soft green cover with zipper closure",
    accent: "#5fbf77",
    image: productImages.binder9,
    imageAlt: "9-pocket toploader binder product image",
    imageSource: imageSources.binder9,
    productInsideLabel: "9-pocket toploader binder",
    featured: true,
    materials: ["toploader pocket pages", "zip closure", "soft protective cover"],
    specs: [
      { label: "Page format", value: "9-pocket" },
      { label: "Use case", value: "Sets and larger collections" },
      { label: "Closure", value: "Zipper" }
    ],
    fitment: ["standard 3 x 4 in toploaders", "Pokemon cards in toploaders"],
    demoSteps: [
      {
        label: "Load toploaders",
        description: "Cards stay in rigid holders while still living in page form."
      },
      {
        label: "Zip and shelve",
        description: "The binder closes cleanly and sits next to sealed product displays."
      }
    ],
    pairings: ["Gradient PSA Guard", "Pokemon ETB Acrylic Case"],
    faq: [
      {
        question: "Does this replace penny sleeves?",
        answer: "No. Cards should still be sleeved before going into toploaders."
      }
    ]
  },
  {
    id: "ll-topload-binder-4",
    slug: "4-pocket-topload-binder",
    name: "4-Pocket Topload Binder",
    categoryId: "topload-binders",
    tagline: "A smaller binder for favorite hits.",
    summary:
      "A compact 4-pocket toploader binder for favorite cards, trade-night pages, and smaller premium collections.",
    price: 29,
    inventory: 31,
    status: "in_stock",
    dimensions: "4-pocket page format",
    finish: "Compact black cover with zipper closure",
    accent: "#2f8f5b",
    image: productImages.binder4,
    imageAlt: "4-pocket toploader binder product image",
    imageSource: imageSources.binder4,
    productInsideLabel: "4-pocket toploader binder",
    materials: ["toploader pocket pages", "compact cover", "zip closure"],
    specs: [
      { label: "Page format", value: "4-pocket" },
      { label: "Use case", value: "Hits, favorites, travel" },
      { label: "Closure", value: "Zipper" }
    ],
    fitment: ["standard 3 x 4 in toploaders", "smaller favorite-hit collections"],
    demoSteps: [
      {
        label: "Curate favorites",
        description: "Use the smaller format for higher-value cards you want to revisit often."
      },
      {
        label: "Keep it portable",
        description: "The compact format is easier to pull from the shelf or take to trades."
      }
    ],
    pairings: ["Gradient PSA Guard", "Phantom Display PSA Guard Acrylic Case"],
    faq: [
      {
        question: "Who is the 4-pocket format for?",
        answer: "It works best for favorite hits, compact collections, and cards you handle more often."
      }
    ]
  }
];

export const featuredShelfItems: ShelfItem[] = [
  {
    id: "shelf-etb-1",
    kind: "etb",
    label: "Black Bolt ETB",
    protectedBy: "acrylic-etb-cases",
    image: productImages.etb,
    shelf: 0,
    span: 2
  },
  {
    id: "shelf-box-1",
    kind: "boosterBox",
    label: "Destined Rivals Box",
    protectedBy: "acrylic-booster-box-cases",
    image: productImages.boosterBox,
    shelf: 0,
    span: 2
  },
  {
    id: "shelf-bundle-1",
    kind: "boosterBundle",
    label: "Bundle Front Row",
    protectedBy: "acrylic-booster-bundle-cases",
    image: productImages.boosterBundle,
    shelf: 1,
    span: 1
  },
  {
    id: "shelf-slab-1",
    kind: "slab",
    label: "Ruby PSA Guard",
    protectedBy: "phantom-display-psa-cases",
    image: productImages.phantomRuby,
    colorway: "Ruby",
    shelf: 1,
    span: 1
  },
  {
    id: "shelf-binder-1",
    kind: "binder",
    label: "9-Pocket Binder",
    protectedBy: "topload-binders",
    image: productImages.binder9,
    shelf: 2,
    span: 2
  },
  {
    id: "shelf-slab-2",
    kind: "slab",
    label: "Emerald PSA Guard",
    protectedBy: "psa-slab-guards",
    image: productImages.phantomEmerald,
    colorway: "Emerald",
    shelf: 2,
    span: 1
  }
];

export const inspirationSetups: InspirationSetup[] = [
  {
    id: "pokemon-green-shelf",
    title: "Green Cap Collector Shelf",
    room: "Pokemon sealed shelf",
    palette: "Lucky green shelves, cream labels, gold acrylic highlights",
    description:
      "ETB and booster box cases anchor the back row, with booster bundles and PSA guards adding playful color in front.",
    protectedItems: ["ETBs", "booster boxes", "booster bundles", "PSA guards"]
  },
  {
    id: "binder-and-slab-desk",
    title: "Binder and Slab Desk",
    room: "Desk display",
    palette: "Soft black, mint green, ruby and emerald guard accents",
    description:
      "A compact setup for favorite hits: a 4-pocket binder, a guarded PSA slab, and one acrylic-cased sealed product.",
    protectedItems: ["4-pocket binder", "PSA guard", "Phantom display"]
  },
  {
    id: "sealed-front-row",
    title: "Sealed Product Front Row",
    room: "Collection room shelf",
    palette: "Cream shelf backing, clear cases, playful Pokemon product color",
    description:
      "Booster bundles step forward in compact cases while ETBs and booster boxes form a clean protected wall behind them.",
    protectedItems: ["booster bundles", "ETB cases", "booster box cases"]
  }
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(categoryId: string) {
  return products.filter((product) => product.categoryId === categoryId);
}

export function getCategoryById(categoryId: string) {
  return categories.find((category) => category.id === categoryId);
}
