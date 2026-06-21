"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AcrylicCaseInteractiveFeatures } from "@/components/acrylic-case-interactive-features";
import { ProductCard, ProductPopup, type StorefrontProduct } from "@/components/products-page";
import {
  getStorefrontCategory,
  getStorefrontCategoryProducts,
  type StorefrontCategoryId
} from "@/lib/storefront-products";

export function ProductCategoryPage({ categoryId }: { categoryId: StorefrontCategoryId }) {
  const category = getStorefrontCategory(categoryId);
  const products = getStorefrontCategoryProducts(categoryId);
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct]);

  function openProduct(product: StorefrontProduct) {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
  }

  function moveSelectedImage(direction: number) {
    if (!selectedProduct) {
      return;
    }

    setSelectedImageIndex((current) => {
      const imageCount = selectedProduct.images.length;

      if (imageCount <= 1) {
        return current;
      }

      return (current + direction + imageCount) % imageCount;
    });
  }

  if (!category) {
    return null;
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#0a0a0a] text-[#e7e0cf]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[31rem] bg-[#050505]" aria-hidden>
        <div className="category-star-fade absolute inset-0 opacity-78" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.17),transparent_68%)]" />
      </div>

      <section className="relative px-4 pb-10 pt-28 sm:px-6 sm:pb-12">

        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8d866f] transition hover:text-[#d4af37] focus-ring"
          >
            <ArrowLeft size={15} />
            Home
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="font-pixel text-[0.66rem] uppercase leading-6 text-[#d4af37]">
              Lucky&apos;s Loot
            </p>
            <h1 className="gold-glow mt-4 text-4xl font-bold leading-tight text-[#d4af37] sm:text-6xl">
              {category.title}
            </h1>
            <p className="mt-5 text-base leading-8 text-[#b8b0a0] sm:text-lg">{category.description}</p>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-7xl gap-10">
          {categoryId === "acrylic-cases" ? <AcrylicCaseInteractiveFeatures /> : null}

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#d4af37]/14 pb-5">
            <div>
              <p className="font-pixel text-[0.66rem] uppercase leading-6 text-[#d4af37]">
                {category.label}
              </p>
              <p className="mt-2 text-sm text-[#8d866f]">
                {products.length} product{products.length === 1 ? "" : "s"}
              </p>
            </div>
            <Link
              href={category.overviewHref}
              className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-[#d4af37]/32 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
            >
              Product Overview
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={`${category.id}-${product.id}`} product={product} onOpen={openProduct} />
            ))}
          </div>
        </div>
      </section>

      {selectedProduct ? (
        <ProductPopup
          product={selectedProduct}
          imageIndex={selectedImageIndex}
          onClose={() => setSelectedProduct(null)}
          onMoveImage={moveSelectedImage}
          onSelectImage={setSelectedImageIndex}
        />
      ) : null}
    </div>
  );
}
