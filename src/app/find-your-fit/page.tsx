import type { Metadata } from "next";
import { Suspense } from "react";
import { FitFinder } from "@/components/fit-finder";

export const metadata: Metadata = {
  title: "Find Your Fit",
  description: "Use verified fitment guidance to choose a Lucky's Loot display or protection product."
};

export default function FindYourFitPage() {
  return (
    <div className="info-page fit-finder-page">
      <header className="info-hero section-shell">
        <p className="eyebrow">Guided fitment</p>
        <h1>Protect the right thing with the right fit.</h1>
        <p>
          Tell us what you collect and how you use it. The guide recommends only verified matches,
          flags formats that need measurements, and stops when no supported product exists.
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
