export type NavigationLink = {
  href: string;
  label: string;
  description?: string;
};

export const primaryNavigation: ReadonlyArray<NavigationLink> = [
  { href: "/shop", label: "Shop" },
  { href: "/collections/acrylic-cases", label: "Acrylic Cases" },
  { href: "/collections/slab-protection", label: "PSA Guards" },
  { href: "/collections/toploader-binders", label: "Binders" },
  { href: "/find-your-fit", label: "Find Your Fit" },
  { href: "/events", label: "Events" }
];

export const shopNavigationGroups: ReadonlyArray<{
  title: string;
  links: ReadonlyArray<NavigationLink>;
}> = [
  {
    title: "Shop by product",
    links: [
      { href: "/shop", label: "Shop All" },
      { href: "/collections/acrylic-cases", label: "Acrylic Cases" },
      { href: "/collections/slab-protection", label: "PSA Guards" },
      { href: "/collections/toploader-binders", label: "Toploader Binders" }
    ]
  },
  {
    title: "Shop by what you protect",
    links: [
      { href: "/collections/protect-sealed-product?fit=etb", label: "Elite Trainer Boxes" },
      { href: "/collections/protect-sealed-product?fit=booster-box", label: "Booster Boxes" },
      { href: "/collections/protect-sealed-product?fit=booster-bundle", label: "Booster Bundles" },
      { href: "/collections/protect-graded-cards", label: "Graded Slabs" },
      { href: "/collections/toploader-binders", label: "Toploaded Cards" }
    ]
  },
  {
    title: "Helpful tools",
    links: [
      { href: "/find-your-fit", label: "Find Your Fit" },
      { href: "/pickup-and-returns", label: "Pickup & Returns" },
      { href: "/events", label: "Upcoming Events" }
    ]
  }
];

export const footerNavigation: ReadonlyArray<{
  title: string;
  links: ReadonlyArray<NavigationLink>;
}> = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "Shop All" },
      { href: "/collections/acrylic-cases", label: "Acrylic Cases" },
      { href: "/collections/slab-protection", label: "PSA Guards" },
      { href: "/collections/toploader-binders", label: "Toploader Binders" }
    ]
  },
  {
    title: "Help",
    links: [
      { href: "/find-your-fit", label: "Find Your Fit" },
      { href: "/faq", label: "FAQ" },
      { href: "/pickup-and-returns", label: "Pickup & Returns" },
      { href: "/contact", label: "Contact" }
    ]
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/events", label: "Events" },
      { href: "/reviews", label: "Collector Displays" },
      { href: "/accessibility", label: "Accessibility" }
    ]
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign In" },
      { href: "/account", label: "Your Account" },
      { href: "/account/orders", label: "Order History" }
    ]
  },
  {
    title: "Policies",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/pickup-and-returns", label: "Pickup & Returns" }
    ]
  }
];
