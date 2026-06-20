"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductVisual } from "@/components/product-visual";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductShowcase({ products }: { products: Product[] }) {
  const [focusedProduct, setFocusedProduct] = useState<Product | null>(null);

  return (
    <section className="bg-[#fff8df] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f8f5b]">
              Product showcase
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-[#143a29] text-balance sm:text-5xl">
              Real sealed-product examples, cased for the shelf.
            </h2>
          </div>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#28533a]/70 transition hover:text-[#143a29] focus-ring"
            href="/products"
          >
            View products
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <motion.button
              key={product.id}
              type="button"
              className="group relative min-h-[420px] overflow-hidden rounded-[8px] border border-[#1e5f3f]/14 bg-white/82 p-5 text-left shadow-[0_16px_46px_rgba(31,95,63,0.1)] transition hover:border-[#2f8f5b]/42 focus-ring"
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setFocusedProduct(product)}
            >
              <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(47,143,91,0.75),transparent)] opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#2f8f5b]/80">
                    {product.status.replace("_", " ")}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#143a29]">{product.name}</h3>
                </div>
                <p className="text-lg font-semibold text-[#143a29]">{formatCurrency(product.price)}</p>
              </div>
              <ProductVisual product={product} size="md" />
              <p className="mt-4 text-sm leading-6 text-[#28533a]/68">{product.tagline}</p>
              <div className="mt-6 flex items-center justify-between border-t border-[#1e5f3f]/10 pt-5">
                <span className="text-xs uppercase tracking-[0.2em] text-[#28533a]/48">
                  Focus product
                </span>
                <ArrowRight size={18} className="text-[#2f8f5b] transition group-hover:translate-x-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {focusedProduct ? (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-[#143a29]/78 p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative grid max-h-[92vh] w-full max-w-6xl overflow-auto rounded-[8px] border border-[#1e5f3f]/18 bg-[#fff8df] shadow-glass lg:grid-cols-[1.1fr_0.9fr]"
              initial={{ opacity: 0, scale: 0.94, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 30 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-[8px] border border-[#1e5f3f]/14 bg-white/84 text-[#28533a]/70 transition hover:text-[#143a29] focus-ring"
                type="button"
                onClick={() => setFocusedProduct(null)}
                aria-label="Close product focus"
              >
                <X size={18} />
              </button>
              <div className="relative min-h-[430px] overflow-hidden bg-[#fff4c9]">
                <div className="absolute inset-0 museum-grid opacity-30" aria-hidden />
                <ProductVisual product={focusedProduct} size="lg" activeDemo={1} />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.22em] text-[#2f8f5b]">In focus</p>
                <h3 className="mt-4 text-3xl font-semibold text-[#143a29]">{focusedProduct.name}</h3>
                <p className="mt-4 text-sm leading-6 text-[#28533a]/68">{focusedProduct.summary}</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {focusedProduct.specs.slice(0, 4).map((spec) => (
                    <div key={spec.label} className="rounded-[8px] border border-[#1e5f3f]/12 bg-white/70 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#28533a]/48">{spec.label}</p>
                      <p className="mt-2 text-sm text-[#143a29]">{spec.value}</p>
                    </div>
                  ))}
                </div>
                <motion.div
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36, duration: 0.45 }}
                >
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#2f8f5b] bg-[#2f8f5b] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#256f48] focus-ring"
                    type="button"
                  >
                    <ShoppingBag size={18} />
                    Add to cart
                  </button>
                  <Link
                    className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#1e5f3f]/16 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#143a29] transition hover:border-[#2f8f5b]/42 focus-ring"
                    href={`/products/${focusedProduct.slug}`}
                  >
                    Product page
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
