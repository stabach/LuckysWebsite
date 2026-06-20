"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Instagram, Mail, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AddToCartButton } from "@/components/cart-provider";
import { formatStorefrontCurrency, storefrontProductFamilies } from "@/lib/storefront-products";

type HeroSpotlightItem = {
  id: string;
  name: string;
};

export function SimpleStorefront() {
  const [contactOpen, setContactOpen] = useState(false);
  const [slides, setSlides] = useState(() => storefrontProductFamilies.map(() => 0));
  const heroSpotlights: HeroSpotlightItem[] = [
    {
      id: "acrylic-cases",
      name: "Acrylic Cases"
    },
    {
      id: "psa-guards",
      name: "PSA Guards"
    },
    {
      id: "binders",
      name: "Binders"
    },
    {
      id: "pokemon-products",
      name: "Pokemon Products"
    }
  ];

  function moveSlide(productIndex: number, direction: number) {
    setSlides((current) =>
      current.map((slide, index) =>
        index === productIndex
          ? (slide + direction + storefrontProductFamilies[index].images.length) %
            storefrontProductFamilies[index].images.length
          : slide
      )
    );
  }

  function setProductSlide(productIndex: number, slideIndex: number) {
    setSlides((current) => current.map((slide, index) => (index === productIndex ? slideIndex : slide)));
  }

  return (
    <div className="simple-storefront bg-[#0a0a0a] text-[#e7e0cf]">
      <Opener />

      <section className="relative min-h-[84vh] overflow-hidden border-b border-[#d4af37]/25 bg-[#050505] pt-16">
        <div className="absolute inset-0 retro-stars opacity-70" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.22),transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent,#111111)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(84vh-4rem)] max-w-7xl flex-col justify-center px-4 py-10 text-center sm:px-6 lg:py-12">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(560px,820px)_minmax(0,1fr)]">
            <aside className="hidden gap-5 text-left lg:grid">
              {heroSpotlights.slice(0, 2).map((product) => (
                <HeroSpotlight key={product.id} item={product} />
              ))}
            </aside>

            <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
              <div className="lucky-logo-glitch relative h-56 w-56 overflow-visible rounded-full sm:h-72 sm:w-72">
                <Image
                  src="/old-site/LuckysLoot-transparent.webp"
                  alt="Lucky's Loot logo"
                  fill
                  className="hero-logo-image lucky-logo-image object-contain"
                  priority
                  sizes="(min-width: 640px) 288px, 224px"
                  unoptimized
                />
              </div>

              <h1 className="gold-glow hero-chrome-gold mt-6 whitespace-nowrap font-pixel text-[1.5rem] font-bold text-[#d4af37] sm:text-[2.45rem] lg:text-[3.35rem] xl:text-[4.1rem]">
                Lucky&apos;s Loot
              </h1>
              <div className="mx-auto mt-5 flex w-full max-w-[19rem] items-center justify-center border-2 border-[#d4af37] bg-[#d4af37]/10 px-4 py-3 text-center font-pixel text-[0.52rem] uppercase leading-5 text-[#d4af37] shadow-[0_0_22px_rgba(212,175,55,0.16)] sm:w-fit sm:max-w-none sm:px-7 sm:py-4 sm:text-[0.72rem]">
                Premium Trading Card Supplies
              </div>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex min-h-14 items-center justify-center rounded-[8px] border-2 border-[#d4af37] bg-[#d4af37] px-9 py-4 font-pixel text-[0.68rem] uppercase text-black shadow-[0_0_24px_rgba(212,175,55,0.35)] transition hover:-translate-y-0.5 hover:bg-[#fff4bd] focus-ring"
                >
                  Shop Products
                </Link>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="inline-flex min-h-14 items-center justify-center rounded-[8px] border-2 border-[#d4af37]/70 bg-transparent px-9 py-4 font-pixel text-[0.68rem] uppercase text-[#d4af37] transition hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
                >
                  Ask a Question
                </button>
              </div>
            </div>

            <aside className="hidden gap-5 text-left lg:grid">
              {heroSpotlights.slice(2, 4).map((product) => (
                <HeroSpotlight key={product.id} item={product} />
              ))}
            </aside>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:hidden">
            {heroSpotlights.map((product) => (
              <HeroSpotlight key={product.id} item={product} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#2f2a1c] bg-[#111111] px-4 py-10 text-center sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-pixel text-lg leading-8 text-[#d4af37] sm:text-xl">Welcome to Lucky&apos;s Loot</h2>
        </div>
      </section>

      <section id="collection" className="bg-[#0a0a0a] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="section-gold-title text-center font-pixel text-xl leading-9 text-[#d4af37] sm:text-2xl">
            Our Collection
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {storefrontProductFamilies.map((product, productIndex) => (
              <article
                key={product.name}
                className="group overflow-hidden rounded-[8px] border border-[#d4af37]/18 bg-[#1a1a1a] shadow-[0_10px_34px_rgba(0,0,0,0.42)] transition duration-300 hover:border-[#d4af37]/70 hover:shadow-[0_18px_48px_rgba(212,175,55,0.22)]"
              >
                <div className={`relative h-[300px] overflow-hidden bg-gradient-to-br ${product.gradient}`}>
                  {product.images.map((image, imageIndex) => (
                    <motion.div
                      key={image.src}
                      className="absolute inset-0"
                      initial={false}
                      animate={{ opacity: slides[productIndex] === imageIndex ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      aria-hidden={slides[productIndex] !== imageIndex}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                    </motion.div>
                  ))}
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-[6px] border border-black/20 bg-[#d4af37]/90 text-black shadow-lg transition hover:bg-[#fff4bd] focus-ring"
                    onClick={() => moveSlide(productIndex, -1)}
                    aria-label={`Previous ${product.name} image`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-[6px] border border-black/20 bg-[#d4af37]/90 text-black shadow-lg transition hover:bg-[#fff4bd] focus-ring"
                    onClick={() => moveSlide(productIndex, 1)}
                    aria-label={`Next ${product.name} image`}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {product.images.map((image, imageIndex) => (
                      <button
                        key={image.src}
                        type="button"
                        className={`h-3 w-3 rounded-full border-2 transition ${
                          slides[productIndex] === imageIndex
                            ? "scale-110 border-[#fff4bd] bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                            : "border-[#d4af37]/70 bg-white/45"
                        }`}
                        onClick={() => setProductSlide(productIndex, imageIndex)}
                        aria-label={`Show ${product.name} image ${imageIndex + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <h3 className="font-pixel text-base leading-7 text-[#d4af37]">{product.name}</h3>
                  <p className="mt-4 text-sm font-bold text-[#e5e0d2] underline decoration-[#d4af37]/60 underline-offset-4">
                    {product.subtitle}
                  </p>
                  <p className="mt-5 text-sm font-bold text-[#d8d1bd]">{product.intro}</p>
                  <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#b8b0a0]">
                    {product.details.map((detail) => (
                      <li key={detail} className="flex gap-2">
                        <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#d4af37]" />
                        <strong>{detail}</strong>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm leading-7 text-[#dad4c4]">{product.note}</p>
                  <div className="mt-6 grid gap-2 border-t border-[#d4af37]/14 pt-5">
                    {product.variants.map((variant) => (
                      <AddToCartButton
                        key={variant.id}
                        variantId={variant.id}
                        className="justify-between"
                        label={`${variant.shortLabel} - ${formatStorefrontCurrency(variant.priceCents)}`}
                      />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t-[3px] border-[#d4af37] bg-black px-4 py-16 text-center shadow-[0_-4px_24px_rgba(212,175,55,0.24)] sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-pixel text-xl leading-9 text-[#d4af37] sm:text-2xl">Interested in a Product?</h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#b8b0a0] sm:text-lg">
            All products are available for local pickup only. Get in touch to arrange a meetup,
            view items in person, or ask about bulk purchases.
          </p>
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[8px] border-2 border-transparent bg-[#d4af37] px-8 py-3 font-pixel text-[0.68rem] uppercase text-black shadow-[0_8px_24px_rgba(212,175,55,0.32)] transition hover:-translate-y-0.5 hover:bg-[#fff4bd] focus-ring"
          >
            Contact Me
          </button>
        </div>
      </section>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

function HeroSpotlight({
  item,
  compact = false
}: {
  item: HeroSpotlightItem;
  compact?: boolean;
}) {
  return (
    <Link
      href="/products"
      className={`hero-thought-bubble group flex min-h-28 flex-col justify-center overflow-visible border-2 border-[#d4af37]/80 bg-black/42 px-7 py-6 text-center shadow-[0_18px_44px_rgba(0,0,0,0.38)] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 hover:shadow-[0_18px_44px_rgba(212,175,55,0.16)] focus-ring ${
        compact ? "min-h-24 px-5" : ""
      }`}
    >
      <p className="font-pixel text-[0.82rem] uppercase leading-7 text-[#d4af37]">{item.name}</p>
    </Link>
  );
}

function Opener() {
  return (
    <div className="site-opener fixed inset-0 z-[100] grid place-items-center bg-black">
      <div className="relative grid h-64 w-64 place-items-center">
        <div className="opener-spark opener-spark-one absolute h-3 w-3 rounded-full bg-[#d4af37] shadow-[0_0_18px_rgba(212,175,55,0.9)]" />
        <div className="opener-spark opener-spark-two absolute h-2.5 w-2.5 rounded-full bg-[#fff4bd] shadow-[0_0_16px_rgba(255,244,189,0.9)]" />
        <div className="opener-logo relative h-44 w-44 overflow-visible rounded-full shadow-[0_0_45px_rgba(212,175,55,0.38)]">
          <Image
            src="/old-site/LuckysLoot-transparent.webp"
            alt=""
            fill
            className="lucky-logo-image object-contain"
            sizes="176px"
            unoptimized
            priority
          />
        </div>
      </div>
    </div>
  );
}

function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-black/86 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className="relative w-full max-w-md rounded-[8px] border-[3px] border-[#d4af37] bg-[linear-gradient(135deg,#1a1a1a,#292929)] p-6 text-center shadow-[0_12px_44px_rgba(212,175,55,0.34)] sm:p-9"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-[6px] text-[#8d866f] transition hover:bg-white/5 hover:text-[#d4af37] focus-ring"
              aria-label="Close contact options"
            >
              <X size={18} />
            </button>
            <h3 id="contact-title" className="font-pixel text-base leading-7 text-[#d4af37]">
              Let&apos;s Connect!
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#b8b0a0]">Choose your preferred way to get in touch:</p>
            <div className="mt-7 grid gap-4">
              <a
                href="https://ig.me/m/LuckysLootSupplies"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[8px] border-2 border-[#833ab4] bg-[linear-gradient(135deg,#833ab4,#fd1d1d_50%,#fcb045)] px-4 py-3 font-pixel text-[0.62rem] uppercase text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(131,58,180,0.44)] focus-ring"
              >
                <Instagram size={21} />
                Message on Instagram
              </a>
              <a
                href="mailto:LuckysLootSupplies@gmail.com?subject=Product%20Inquiry"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[8px] border-2 border-[#d4af37] bg-[#d4af37] px-4 py-3 font-pixel text-[0.62rem] uppercase text-black transition hover:-translate-y-0.5 hover:bg-[#fff4bd] hover:shadow-[0_8px_24px_rgba(212,175,55,0.36)] focus-ring"
              >
                <Mail size={20} />
                Send an Email
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
