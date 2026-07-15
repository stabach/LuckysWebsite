"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <section className="state-page section-shell" role="alert">
      <p className="eyebrow">Something interrupted the hunt</p>
      <h1>We couldn’t load this loot.</h1>
      <p>Try again. If it keeps happening, the contact page can help.</p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
