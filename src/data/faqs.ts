export type StoreFaq = {
  id: string;
  question: string;
  answer: string;
  category: "fit" | "pricing" | "pickup" | "orders";
};

export const storeFaqs: ReadonlyArray<StoreFaq> = [
  {
    id: "specialty-fit",
    question: "Will an acrylic case fit a Pokémon Center ETB or specialty booster box?",
    answer:
      "Those formats vary, so Lucky’s Loot does not claim a universal fit. Measure the box and use the Product Fit Question form before ordering when the format is not standard.",
    category: "fit"
  },
  {
    id: "slab-fit",
    question: "Which slabs are supported?",
    answer:
      "PSA Guards are listed for standard PSA-style slabs. The Crystal Slab Acrylic Case supports a standard PSA-style slab with or without a Lucky’s Loot Guard. Other grading-company sizes are not verified.",
    category: "fit"
  },
  {
    id: "guard-pricing",
    question: "How does mixed-color PSA Guard pricing work?",
    answer:
      "All Guard colors in Your Loot count together: 1–9 are $7 each, 10–24 are $6 each, and 25 or more are $4 each. The server recalculates the tier before Stripe checkout.",
    category: "pricing"
  },
  {
    id: "pickup-location",
    question: "Where is local pickup?",
    answer:
      "The general area is Richmond / Houston. Exact private instructions are sent directly after payment and order confirmation; a street-level pickup location is not published on the storefront.",
    category: "pickup"
  },
  {
    id: "event-pickup",
    question: "Can I pick up at a card show?",
    answer:
      "Event pickup appears only when a published future event has pickup enabled and its cutoff has not passed. If no eligible event exists, the option stays unavailable.",
    category: "pickup"
  },
  {
    id: "shipping",
    question: "Can my order be shipped?",
    answer:
      "The current storefront checkout is configured for Richmond / Houston-area pickup and eligible event pickup. A shipping option is not currently advertised.",
    category: "orders"
  },
  {
    id: "engraving",
    question: "Can I add custom engraving to a binder?",
    answer:
      "Engraving pricing, turnaround, and return limitations are still awaiting owner verification, so engraving is not an active purchasable option. Use the contact form for a custom request.",
    category: "orders"
  },
  {
    id: "returns",
    question: "What is the return policy?",
    answer:
      "The complete return window and eligibility rules still require owner approval. Contact Lucky’s Loot before purchasing if return eligibility affects your decision, and report any damage promptly with order details and photos.",
    category: "orders"
  }
];
