import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ProductVisual } from "@/components/product-visual";
import { categories, products } from "@/lib/catalog";

export function CategoryShowcase() {
  return (
    <section className="border-y border-[#1e5f3f]/10 bg-[#f5efcf] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f8f5b]">
          Featured categories
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <h2 className="text-3xl font-semibold text-[#143a29] text-balance sm:text-5xl">
            Every product family starts with a shelf problem.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[#28533a]/68">
            ETBs, booster boxes, booster bundles, PSA slabs, and toploaders all need different
            protection. Lucky&apos;s Loot turns each one into an easy display choice.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const representativeProduct = products.find((product) => product.categoryId === category.id);

            return (
              <Link
                key={category.id}
                className="group relative min-h-72 overflow-hidden rounded-[8px] border border-[#1e5f3f]/14 bg-white/78 p-6 shadow-[0_16px_46px_rgba(31,95,63,0.08)] transition hover:border-[#2f8f5b]/42 focus-ring"
                href={category.href}
                style={{ "--accent": category.accent } as CSSProperties & { "--accent": string }}
              >
                <div className="absolute inset-x-8 top-0 h-px bg-[color:var(--accent)] opacity-70" />
                <div className="relative grid min-h-60 gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className="flex min-h-56 flex-col justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#28533a]/46">
                        {category.materialCue}
                      </p>
                      <h3 className="mt-5 max-w-xs text-2xl font-semibold text-[#143a29]">{category.name}</h3>
                      <p className="mt-4 max-w-sm text-sm leading-6 text-[#28533a]/66">{category.description}</p>
                    </div>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#2f8f5b]">
                      Explore
                      <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                    </span>
                  </div>
                  {representativeProduct ? <ProductVisual product={representativeProduct} size="sm" /> : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
