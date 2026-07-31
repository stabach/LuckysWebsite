import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ShopCatalog } from "@/components/catalog/shop-catalog";
import type { Product } from "@/lib/catalog-schema";

type CatalogPageProps = {
  title: string;
  description: string;
  products: ReadonlyArray<Product>;
  breadcrumb?: string;
  initialQuery?: string;
  initialFit?: string;
};

export function CatalogPage({
  title,
  description,
  products,
  breadcrumb,
  initialQuery,
  initialFit
}: CatalogPageProps) {
  return (
    <div className="catalog-page">
      <header className="catalog-hero section-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><ChevronRight size={14} aria-hidden="true" />
          {breadcrumb ? <><Link href="/shop">Shop</Link><ChevronRight size={14} aria-hidden="true" /></> : null}
          <span aria-current="page">{breadcrumb ?? title}</span>
        </nav>
        <div className="catalog-hero-row">
          <div>
            <p className="eyebrow">Collector supplies</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
      </header>
      <ShopCatalog
        products={products}
        initialQuery={initialQuery}
        initialFit={initialFit}
      />
    </div>
  );
}
