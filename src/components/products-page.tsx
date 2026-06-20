"use client";

import {
  ChevronLeft,
  ChevronRight,
  Mail,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AddToCartButton } from "@/components/cart-provider";
import {
  formatStorefrontCurrency,
  productFilters,
  storefrontVariants,
  type ProductFilterId
} from "@/lib/storefront-products";
import { cn } from "@/lib/utils";

type ActiveFilter = "all" | ProductFilterId;
type StorefrontProduct = (typeof storefrontVariants)[number];

export function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") {
      return storefrontVariants;
    }

    return storefrontVariants.filter((product) => product.filters.includes(activeFilter));
  }, [activeFilter]);

  const activeDescription =
    activeFilter === "all"
      ? "Browse every Lucky's Loot product currently available for checkout."
      : productFilters.find((filter) => filter.id === activeFilter)?.description;

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e7e0cf]">
      <section className="relative overflow-hidden border-b border-[#d4af37]/18 bg-[#050505] px-4 pb-14 pt-28 sm:px-6 sm:pb-16">
        <div className="absolute inset-0 retro-stars opacity-40" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.18),transparent_68%)]" />
        <div className="relative mx-auto max-w-7xl text-center">
          <p className="font-pixel text-[0.66rem] uppercase leading-6 text-[#d4af37]">
            Products
          </p>
          <div className="mt-5 grid gap-6">
            <h1 className="gold-glow mx-auto max-w-4xl text-4xl font-bold leading-tight text-[#d4af37] sm:text-6xl">
              Shop Lucky&apos;s Collection
            </h1>
          </div>

          <div className="mt-10 rounded-[8px] border border-[#d4af37]/18 bg-black/36 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em] text-[#8d866f]">
              <Search size={15} className="text-[#d4af37]" />
              Filter products
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <FilterBubble
                active={activeFilter === "all"}
                label="All Products"
                onClick={() => setActiveFilter("all")}
              />
              {productFilters.map((filter) => (
                <FilterBubble
                  key={filter.id}
                  active={activeFilter === filter.id}
                  label={filter.label}
                  onClick={() => setActiveFilter(filter.id)}
                />
              ))}
            </div>
            <div className="mt-5 grid justify-items-center gap-2 border-t border-[#d4af37]/10 pt-4 text-sm text-[#b8b0a0]">
              <p>{activeDescription}</p>
              <p className="font-semibold text-[#d4af37]">
                {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group relative flex min-h-[520px] flex-col overflow-hidden rounded-[8px] border border-[#d4af37]/18 bg-[#1a1a1a] shadow-[0_10px_34px_rgba(0,0,0,0.42)] transition duration-300 hover:border-[#d4af37]/70 hover:shadow-[0_18px_48px_rgba(212,175,55,0.22)]"
            >
              <button
                type="button"
                className="absolute inset-0 z-10 cursor-pointer rounded-[8px] focus-ring"
                onClick={() => openProduct(product)}
                aria-label={`Open ${product.label} details`}
              >
                <span className="sr-only">Open {product.label} details</span>
              </button>

              <div className="relative h-64 overflow-hidden border-b border-[#d4af37]/12 bg-black">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.78))]" />
                <div className="absolute bottom-4 left-4 rounded-full border border-[#d4af37]/46 bg-black/74 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#d4af37]">
                  {product.familyName}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-pixel text-base leading-7 text-[#d4af37]">
                      {product.shortLabel}
                    </h2>
                    <p className="mt-3 text-xl font-semibold text-white">{product.label}</p>
                  </div>
                  <p className="shrink-0 text-xl font-bold text-[#d4af37]">
                    {formatStorefrontCurrency(product.priceCents)}
                  </p>
                </div>

                <p className="mt-5 text-sm leading-7 text-[#b8b0a0]">{product.description}</p>

                <div className="mt-5 grid gap-2 text-xs text-[#cfc6b5]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-[#d4af37]" />
                    Secure checkout available
                  </div>
                  <div className="flex items-center gap-2">
                    <PackageCheck size={15} className="text-[#d4af37]" />
                    Local pickup details confirmed after purchase
                  </div>
                  {product.requiresNotes ? (
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-[#d4af37]" />
                      Engraving details confirmed after checkout
                    </div>
                  ) : null}
                </div>

                <div className="relative z-20 mt-auto pt-6">
                  <AddToCartButton
                    variantId={product.id}
                    label={`Add to Cart - ${formatStorefrontCurrency(product.priceCents)}`}
                    className="justify-between"
                  />
                </div>
              </div>
            </article>
          ))}
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

function FilterBubble({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.13em] transition focus-ring",
        active
          ? "border-[#d4af37] bg-[#d4af37] text-black shadow-[0_0_22px_rgba(212,175,55,0.26)]"
          : "border-[#d4af37]/28 bg-[#111111] text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10"
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function ProductPopup({
  product,
  imageIndex,
  onClose,
  onMoveImage,
  onSelectImage
}: {
  product: StorefrontProduct;
  imageIndex: number;
  onClose: () => void;
  onMoveImage: (direction: number) => void;
  onSelectImage: (index: number) => void;
}) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const currentImage = product.images[imageIndex] ?? {
    src: product.image,
    alt: product.label
  };
  const contactHref = `mailto:LuckysLootSupplies@gmail.com?subject=${encodeURIComponent(
    `Question about ${product.label}`
  )}&body=${encodeURIComponent(`Hi, I have a question about ${product.label}.`)}`;

  function handleTouchEnd(clientX: number) {
    if (touchStartX === null) {
      return;
    }

    const delta = touchStartX - clientX;

    if (Math.abs(delta) > 42) {
      onMoveImage(delta > 0 ? 1 : -1);
    }

    setTouchStartX(null);
  }

  return (
    <div className="fixed inset-0 z-[92] grid place-items-center bg-black/84 p-3 text-[#e7e0cf] backdrop-blur-md sm:p-5">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close product details"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-popup-title"
        className="relative grid max-h-[92vh] w-full max-w-6xl overflow-auto rounded-[8px] border border-[#d4af37]/35 bg-[#101010] shadow-[0_24px_90px_rgba(0,0,0,0.72)] lg:grid-cols-[1.08fr_0.92fr]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-[8px] border border-[#d4af37]/28 bg-black/70 text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
          aria-label="Close product details"
        >
          <X size={18} />
        </button>

        <div className="border-b border-[#d4af37]/16 bg-black lg:border-b-0 lg:border-r">
          <div
            className="relative min-h-[360px] overflow-hidden sm:min-h-[520px]"
            onTouchStart={(event) => setTouchStartX(event.changedTouches[0]?.clientX ?? null)}
            onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 58vw, 100vw"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))]" />

            {product.images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => onMoveImage(-1)}
                  className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-2 border-[#d4af37]/85 bg-black/88 text-[#ffe680] shadow-[0_0_24px_rgba(0,0,0,0.78),0_0_16px_rgba(212,175,55,0.34)] transition hover:border-[#fff4bd] hover:bg-[#1a1a1a] hover:text-[#fff4bd] focus-ring"
                  aria-label="Previous product image"
                >
                  <ChevronLeft size={28} strokeWidth={2.8} />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveImage(1)}
                  className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-2 border-[#d4af37]/85 bg-black/88 text-[#ffe680] shadow-[0_0_24px_rgba(0,0,0,0.78),0_0_16px_rgba(212,175,55,0.34)] transition hover:border-[#fff4bd] hover:bg-[#1a1a1a] hover:text-[#fff4bd] focus-ring"
                  aria-label="Next product image"
                >
                  <ChevronRight size={28} strokeWidth={2.8} />
                </button>
                <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => onSelectImage(index)}
                      className={cn(
                        "h-3 w-3 rounded-full border transition focus-ring",
                        imageIndex === index
                          ? "scale-110 border-[#fff4bd] bg-[#d4af37]"
                          : "border-[#d4af37]/70 bg-black/50"
                      )}
                      aria-label={`Show product image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {product.images.length > 1 ? (
            <div className="grid grid-cols-3 gap-2 p-3">
              {product.images.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => onSelectImage(index)}
                  className={cn(
                    "relative h-20 overflow-hidden rounded-[8px] border bg-black transition focus-ring",
                    imageIndex === index ? "border-[#d4af37]" : "border-[#d4af37]/18 hover:border-[#d4af37]/55"
                  )}
                  aria-label={`Select ${image.alt}`}
                >
                  <Image src={image.src} alt="" fill className="object-cover" sizes="120px" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col p-5 sm:p-7 lg:p-9">
          <p className="w-fit rounded-full border border-[#d4af37]/38 bg-[#d4af37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
            {product.familyName}
          </p>
          <h2
            id="product-popup-title"
            className="mt-5 font-pixel text-2xl leading-9 text-[#d4af37] sm:text-3xl"
          >
            {product.shortLabel}
          </h2>
          <p className="mt-4 text-2xl font-semibold text-white">{product.label}</p>
          <p className="mt-4 text-3xl font-bold text-[#d4af37]">
            {formatStorefrontCurrency(product.priceCents)}
          </p>
          <p className="mt-5 text-sm leading-7 text-[#b8b0a0]">{product.description}</p>

          <div className="mt-6 grid gap-3 rounded-[8px] border border-[#d4af37]/14 bg-black/28 p-4 text-sm text-[#cfc6b5]">
            {product.familyDetails.map((detail) => (
              <div key={detail} className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#d4af37]" />
                <strong>{detail}</strong>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm leading-7 text-[#dad4c4]">{product.familyNote}</p>

          <div className="mt-auto grid gap-3 pt-7">
            <AddToCartButton
              variantId={product.id}
              label={`Add to Cart - ${formatStorefrontCurrency(product.priceCents)}`}
              className="justify-between"
            />
            <a
              href={contactHref}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] border border-[#d4af37]/36 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
            >
              <Mail size={17} />
              Contact with Questions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
