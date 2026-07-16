import type { Metadata } from "next";
import { Suspense } from "react";
import { FitFinder } from "@/components/fit-finder";

export const metadata: Metadata = {
  title: "Find Your Fit",
  description:
    "Search Pokémon sealed products, compare PSA slab accessories, and choose a Lucky’s Loot Toploader binder.",
  alternates: { canonical: "/find-your-fit" }
};

export default function FindYourFitPage() {
  return (
    <div className="info-page fit-finder-page">
      <header className="info-hero section-shell">
        <p className="eyebrow">Search-first fit finder</p>
        <h1>Find protection made for your kind of loot.</h1>
        <p>
          Search a sealed Pokémon product by name, compare PSA slab accessories, or browse binder
          choices. The guide recommends only verified Lucky’s Loot formats and flags specialty sizes.
        </p>
      </header>
      <section className="info-section section-shell" aria-label="Product fit guide">
        <Suspense fallback={<div className="fit-finder-loading">Loading the fit guide…</div>}>
          <FitFinder />
        </Suspense>
      </section>
    </div>
  );
}
