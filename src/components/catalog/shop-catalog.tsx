"use client";

import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  CatalogFilterContent,
  emptyCatalogFilters,
  type CatalogFilters
} from "@/components/catalog/catalog-filter-content";
import { HomeProductCard } from "@/components/home/product-card";
import type { Product } from "@/lib/catalog-schema";
import { useDialogFocus } from "@/hooks/use-dialog-focus";

type SortOption = "featured" | "price-low" | "price-high";

type ShopCatalogProps = {
  products: ReadonlyArray<Product>;
  initialQuery?: string;
  initialFit?: string;
};

const mobileCategoryLinks = [
  { label: "All", href: "/shop" },
  { label: "Acrylic", href: "/acrylic-cases" },
  { label: "PSA Guards", href: "/psa-guards" },
  { label: "Binders", href: "/binders" },
  { label: "Sealed", href: "/sealed-product" }
] as const;

export function ShopCatalog({ products, initialQuery = "", initialFit = "" }: ShopCatalogProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>("featured");
  const [filters, setFilters] = useState<CatalogFilters>({
    ...emptyCatalogFilters,
    protects: initialFit ? [initialFit] : []
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const filterDialogRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const closeFilters = useCallback(() => setMobileOpen(false), []);
  useDialogFocus(mobileOpen, filterDialogRef, closeFilters, filterTriggerRef);

  const optionCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "acrylic-cases": 0,
      "slab-protection": 0,
      "toploader-binders": 0,
      etb: 0,
      "booster-box": 0,
      "booster-bundle": 0,
      "graded-slab": 0,
      "toploaded-cards": 0,
      in_stock: 0,
      interactive: 0
    };
    for (const product of products) {
      counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1;
      for (const fit of getProtects(product)) counts[fit] = (counts[fit] ?? 0) + 1;
      if (product.stockStatus === "in_stock") counts.in_stock += 1;
      if (hasInteractiveView(product)) counts.interactive += 1;
    }
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = products.filter((product) => {
      if (filters.types.length && !filters.types.includes(product.categoryId)) return false;
      if (filters.protects.length && !filters.protects.some((fit) => getProtects(product).includes(fit))) return false;
      if (filters.availability === "in_stock" && product.stockStatus !== "in_stock") return false;
      if (filters.price === "under-10" && product.priceCents >= 1000) return false;
      if (filters.price === "10-13" && (product.priceCents < 1000 || product.priceCents > 1300)) return false;
      if (filters.price === "14-plus" && product.priceCents < 1400) return false;
      if (filters.color && !product.variants.some((variant) => variant.id.endsWith(filters.color))) return false;
      if (filters.interactiveOnly && !hasInteractiveView(product)) return false;
      if (normalizedQuery) {
        const text = [product.name, product.summary, ...product.fitment, ...product.keywords, ...product.variants.map((variant) => variant.label)].join(" ").toLowerCase();
        if (!text.includes(normalizedQuery)) return false;
      }
      return true;
    });

    return [...result].sort((left, right) => {
      if (sort === "price-low") return left.priceCents - right.priceCents;
      if (sort === "price-high") return right.priceCents - left.priceCents;
      return left.sortOrder - right.sortOrder;
    });
  }, [filters, products, query, sort]);

  const selectedFilterCount =
    filters.types.length +
    filters.protects.length +
    (filters.availability === "in_stock" ? 1 : 0) +
    (filters.price !== "all" ? 1 : 0) +
    (filters.color ? 1 : 0) +
    (filters.interactiveOnly ? 1 : 0);

  function clearAll() {
    setFilters(emptyCatalogFilters);
    setQuery("");
  }

  return (
    <div className="catalog-workspace section-shell">
      <nav className="mobile-category-switcher" aria-label="Shop categories">
        {mobileCategoryLinks.map((link) => {
          const active = pathname === link.href ||
            (link.href === "/acrylic-cases" && pathname === "/collections/acrylic-cases") ||
            (link.href === "/psa-guards" && pathname === "/collections/slab-protection") ||
            (link.href === "/binders" && pathname === "/collections/toploader-binders") ||
            (link.href === "/sealed-product" && pathname === "/collections/protect-sealed-product");
          return <Link href={link.href} key={link.href} aria-current={active ? "page" : undefined}>{link.label}</Link>;
        })}
      </nav>
      <div className="catalog-toolbar">
        <label className="catalog-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search this collection</span>
          <input type="search" value={query} onInput={(event) => setQuery(event.currentTarget.value)} placeholder="Search products and fit" />
        </label>
        <button ref={filterTriggerRef} className="catalog-filter-button" type="button" onClick={() => setMobileOpen(true)}>
          <Filter size={17} aria-hidden="true" /> Filters {selectedFilterCount ? <span>{selectedFilterCount}</span> : null}
        </button>
        <label className="catalog-sort">
          <SlidersHorizontal size={17} aria-hidden="true" />
          <span className="sr-only">Sort products</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="catalog-result-summary" aria-live="polite">
        <p><strong>{filteredProducts.length}</strong> of {products.length} product{products.length === 1 ? "" : "s"}</p>
        {selectedFilterCount || query ? <button type="button" onClick={clearAll}>Clear filters</button> : null}
      </div>

      <div className="catalog-layout">
        <aside className="desktop-catalog-filters" aria-label="Product filters">
          <CatalogFilterContent filters={filters} onChange={setFilters} optionCounts={optionCounts} productCount={filteredProducts.length} onClear={clearAll} />
        </aside>
        {filteredProducts.length ? (
          <div className="catalog-product-grid">
            {filteredProducts.map((product) => <HomeProductCard product={product} key={product.id} />)}
          </div>
        ) : (
          <div className="catalog-empty-state">
            <Search size={28} aria-hidden="true" />
            <h2>No products match those filters.</h2>
            <p>Clear a filter or use Find Your Fit for a measurement-first recommendation.</p>
            <div className="button-row">
              <button className="button button-primary" type="button" onClick={clearAll}>Clear filters</button>
              <a className="button button-secondary" href="/find-your-fit">Find Your Fit</a>
            </div>
          </div>
        )}
      </div>

      {mobileOpen ? (
        <div className="mobile-filter-layer" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) closeFilters();
        }}>
          <div ref={filterDialogRef} className="mobile-filter-drawer" role="dialog" aria-modal="true" aria-labelledby="mobile-filter-title">
            <div className="mobile-filter-head">
              <div><p id="mobile-filter-title">Filters</p><span>{filteredProducts.length} results</span></div>
              <button className="icon-button" type="button" onClick={closeFilters} aria-label="Close filters"><X size={20} aria-hidden="true" /></button>
            </div>
            <CatalogFilterContent filters={filters} onChange={setFilters} optionCounts={optionCounts} productCount={filteredProducts.length} onClear={clearAll} />
            <div className="mobile-filter-apply">
              <button className="button button-primary" type="button" onClick={closeFilters}>Show {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getProtects(product: Product) {
  const protects: string[] = [];
  if (product.id === "acrylic-etb-case") protects.push("etb");
  if (product.id === "acrylic-booster-box-case") protects.push("booster-box");
  if (product.id === "acrylic-booster-bundle-case") protects.push("booster-bundle");
  if (product.id === "acrylic-crystal-slab-case" || product.id === "psa-guards") protects.push("graded-slab");
  if (product.categoryId === "toploader-binders") protects.push("toploaded-cards");
  return protects;
}

function hasInteractiveView(product: Product) {
  return product.id === "acrylic-crystal-slab-case" || product.images.some((media) => media.type === "spin" || media.type === "video");
}
