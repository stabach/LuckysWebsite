import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="state-page section-shell">
      <p className="eyebrow">404 · Not found</p>
      <h1>This loot wandered off.</h1>
      <p>Try the shop or let the Fit Finder guide you to the right collector supply.</p>
      <div className="button-row">
        <ButtonLink href="/shop">Shop all</ButtonLink>
        <ButtonLink href="/find-your-fit" variant="secondary">
          Find your fit
        </ButtonLink>
      </div>
    </section>
  );
}
