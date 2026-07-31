import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="state-page section-shell">
      <p className="eyebrow">404 · Not found</p>
      <h1>This loot wandered off.</h1>
      <p>Try the shop or send us a product question if you need help choosing a collector supply.</p>
      <div className="button-row">
        <ButtonLink href="/shop">Shop all</ButtonLink>
        <ButtonLink href="/contact?topic=product-fit" variant="secondary">
          Ask a product question
        </ButtonLink>
      </div>
    </section>
  );
}
