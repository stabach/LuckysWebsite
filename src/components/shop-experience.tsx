"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { ProductVisual } from "@/components/product-visual";
import { categories, products } from "@/lib/catalog";
import type { CategoryId, Product } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

type SortMode = "featured" | "price-asc" | "price-desc" | "inventory";

export function ShopExperience({ initialCategory }: { initialCategory?: CategoryId }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">(initialCategory ?? "all");
  const [sort, setSort] = useState<SortMode>("featured");

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = category === "all" || product.categoryId === category;
      const matchesQuery =
        normalized.length === 0 ||
        [product.name, product.tagline, product.summary, product.categoryId]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return matchesCategory && matchesQuery;
    });

    return result.sort((left, right) => {
      if (sort === "price-asc") {
        return left.price - right.price;
      }

      if (sort === "price-desc") {
        return right.price - left.price;
      }

      if (sort === "inventory") {
        return right.inventory - left.inventory;
      }

      return Number(Boolean(right.featured || right.bestSeller)) - Number(Boolean(left.featured || left.bestSeller));
    });
  }, [category, query, sort]);

  return (
    <div className="bg-[#fff8df] pt-16 text-[#143a29]">
      <section className="border-b border-[#1e5f3f]/10 bg-[#f5efcf] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f8f5b]">
            Shop cases
          </p>
          <div className="mt-5 grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <h1 className="text-4xl font-semibold text-[#143a29] text-balance sm:text-6xl">
              Find the right case for the shelf you are building.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[#28533a]/68">
              Search ETB cases, booster box cases, booster bundle cases, Phantom PSA displays,
              gradient PSA guards, and topload binders with real fitment imagery.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[8px] border border-[#1e5f3f]/14 bg-white/76 p-4 shadow-[0_14px_38px_rgba(31,95,63,0.08)] lg:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#28533a]/42" size={18} />
            <input
              className="h-12 w-full rounded-[7px] border border-[#1e5f3f]/14 bg-[#fffdf3] pl-10 pr-3 text-sm text-[#143a29] outline-none transition placeholder:text-[#28533a]/40 focus:border-[#2f8f5b]"
              placeholder="Search acrylic cases, slab guards, binders..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <label className="relative block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#28533a]/42">
              <SlidersHorizontal size={18} />
            </span>
            <select
              className="h-12 min-w-56 appearance-none rounded-[7px] border border-[#1e5f3f]/14 bg-[#fffdf3] pl-10 pr-9 text-sm text-[#143a29] outline-none transition focus:border-[#2f8f5b]"
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryId | "all")}
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <select
            className="h-12 min-w-48 rounded-[7px] border border-[#1e5f3f]/14 bg-[#fffdf3] px-3 text-sm text-[#143a29] outline-none transition focus:border-[#2f8f5b]"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
          >
            <option value="featured">Featured first</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
            <option value="inventory">Inventory available</option>
          </select>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-[8px] border border-[#1e5f3f]/14 bg-white/76 p-8 text-center">
            <p className="text-lg font-semibold text-[#143a29]">No products matched that view.</p>
            <p className="mt-2 text-sm text-[#28533a]/60">Try a broader search or another category.</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      className="group relative overflow-hidden rounded-[8px] border border-[#1e5f3f]/14 bg-white/82 p-5 shadow-[0_16px_46px_rgba(31,95,63,0.08)] transition hover:border-[#2f8f5b]/42 focus-ring"
      href={`/products/${product.slug}`}
    >
      <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(47,143,91,0.75),transparent)] opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            {product.featured ? <Badge>Featured</Badge> : null}
            {product.bestSeller ? <Badge>Best seller</Badge> : null}
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-[#143a29]">{product.name}</h2>
        </div>
        <p className="text-lg font-semibold text-[#143a29]">{formatCurrency(product.price)}</p>
      </div>
      <ProductVisual product={product} size="md" />
      <p className="mt-4 text-sm leading-6 text-[#28533a]/66">{product.summary}</p>
      <div className="mt-5 flex items-center justify-between border-t border-[#1e5f3f]/10 pt-4">
        <span
          className={cn(
            "text-xs uppercase tracking-[0.16em]",
            product.status === "low_stock" ? "text-[#9b6b25]" : "text-[#28533a]/48"
          )}
        >
          {product.status.replace("_", " ")} | {product.inventory}
        </span>
        <ArrowRight size={17} className="text-[#2f8f5b] transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-[7px] border border-[#2f8f5b]/34 bg-[#2f8f5b]/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#2f8f5b]">
      {children}
    </span>
  );
}
