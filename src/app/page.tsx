import Link from "next/link";
import { ArrowUpRight, Compass, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="foundation-home">
      <section className="foundation-hero section-shell" aria-labelledby="foundation-title">
        <div className="foundation-copy">
          <p className="eyebrow">Collector display and protection</p>
          <h1 id="foundation-title">Protect the collection. Show off the chase.</h1>
          <p className="lede">
            Crystal-clear acrylic cases, colorful slab protection, and Toploader binders for
            collectors who care how their setup looks.
          </p>
          <div className="button-row">
            <ButtonLink href="/shop">Shop supplies</ButtonLink>
            <ButtonLink href="/find-your-fit" variant="secondary">
              Find your fit
            </ButtonLink>
          </div>
          <Link className="text-link" href="/contact">
            Ask a product question <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <div className="foundation-preview" aria-label="Lucky’s Loot V2 preview">
          <div className="foundation-orbit" aria-hidden="true" />
          <div className="foundation-case" aria-hidden="true">
            <span />
          </div>
          <div className="foundation-facts">
            <span>
              <ShieldCheck aria-hidden="true" size={17} /> Secure Stripe checkout
            </span>
            <span>
              <Compass aria-hidden="true" size={17} /> Houston-area pickup
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
