"use client";

import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, PackageCheck, Shield, ShoppingBag, ZoomIn } from "lucide-react";
import { AddToCartButton } from "@/components/cart-provider";
import { ProductVisual } from "@/components/product-visual";
import { products } from "@/lib/catalog";
import { psaGuardColors, storefrontVariants } from "@/lib/storefront-products";
import type { Product } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

const purchasableVariantsBySlug: Record<string, string> = {
  "pokemon-etb-acrylic-case": "acrylic-etb-case",
  "pokemon-booster-box-acrylic-case": "acrylic-booster-box-case",
  "gradient-psa-guard": "psa-guard-arctic",
  "9-pocket-topload-binder": "toploader-binder-basic",
  "4-pocket-topload-binder": "toploader-binder-basic"
};

export function ProductDetailExperience({ product }: { product: Product }) {
  const [demoStep, setDemoStep] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [selectedPsaColor, setSelectedPsaColor] = useState(psaGuardColors[0]?.name ?? "Arctic");
  const isPsaGuardProduct = product.slug === "gradient-psa-guard";
  const purchasableVariantId = purchasableVariantsBySlug[product.slug];
  const selectedPsaVariantId = storefrontVariants.find(
    (variant) => variant.familyId === "psa-guards" && variant.colorName === selectedPsaColor
  )?.id;
  const selectedVariantId = isPsaGuardProduct ? selectedPsaVariantId : purchasableVariantId;
  const related = useMemo(
    () =>
      products.filter((candidate) => product.pairings.includes(candidate.name)).slice(0, 3),
    [product]
  );
  const trustSignals: Array<{ icon: ComponentType<{ size?: number; className?: string }>; label: string }> = [
    { icon: Shield, label: "Protected display" },
    { icon: PackageCheck, label: "Fitment checked" },
    { icon: Check, label: "Premium finish" }
  ];
  const contactHref = `mailto:LuckysLootSupplies@gmail.com?subject=${encodeURIComponent(
    `Question about ${product.name}`
  )}&body=${encodeURIComponent(`Hi, I have a question about ${product.name}.`)}`;

  return (
    <div className="bg-[#fff8df] pt-16 text-[#143a29]">
      <section className="relative overflow-hidden border-b border-[#1e5f3f]/10 bg-[#f5efcf]">
        <div className="absolute inset-0 museum-grid opacity-30" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
          <div className="relative min-h-[520px] overflow-hidden rounded-[8px] border border-[#1e5f3f]/14 bg-[#fff8df] shadow-[0_20px_60px_rgba(31,95,63,0.12)]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,214,90,0.18),transparent_40%)]" />
            <div
              className={cn(
                "grid h-full place-items-center transition duration-500",
                zoomed && "scale-110"
              )}
            >
              <ProductVisual product={product} size="lg" activeDemo={demoStep} />
            </div>
            <button
              className="absolute bottom-4 right-4 inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#1e5f3f]/14 bg-white/82 px-4 text-sm text-[#28533a]/72 transition hover:border-[#2f8f5b]/44 focus-ring"
              type="button"
              onClick={() => setZoomed((value) => !value)}
            >
              <ZoomIn size={17} />
              {zoomed ? "Reset" : "Zoom"}
            </button>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f8f5b]">
              {product.status.replace("_", " ")} | {product.inventory} available
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-[#143a29] text-balance sm:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#28533a]/72">{product.summary}</p>
            <div className="mt-7 flex items-end gap-3">
              <p className="text-3xl font-semibold text-[#143a29]">{formatCurrency(product.price)}</p>
              {product.compareAtPrice ? (
                <p className="pb-1 text-sm text-[#28533a]/42 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </p>
              ) : null}
            </div>

            {isPsaGuardProduct ? (
              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2f8f5b]">
                  Select Guard Color
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {psaGuardColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedPsaColor(color.name)}
                      className={cn(
                        "flex min-h-12 items-center gap-2 rounded-[8px] border px-2 py-2 text-left text-xs font-semibold uppercase leading-4 tracking-[0.06em] transition focus-ring",
                        selectedPsaColor === color.name
                          ? "border-[#2f8f5b] bg-[#2f8f5b] text-white"
                          : "border-[#1e5f3f]/14 bg-white/72 text-[#143a29] hover:border-[#2f8f5b]/42"
                      )}
                      aria-pressed={selectedPsaColor === color.name}
                    >
                      <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[6px] border border-current/30 bg-white">
                        <Image src={color.src} alt="" fill className="object-contain p-0.5" sizes="32px" />
                      </span>
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {selectedVariantId ? (
                <AddToCartButton
                  variantId={selectedVariantId}
                  label={isPsaGuardProduct ? `Add ${selectedPsaColor} Guard` : "Add to Cart"}
                  className="w-full justify-center sm:w-auto"
                />
              ) : (
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#2f8f5b] bg-[#2f8f5b] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#256f48] focus-ring"
                  href={contactHref}
                >
                  <ShoppingBag size={18} />
                  Ask about this item
                </Link>
              )}
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#1e5f3f]/16 bg-white/72 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#143a29] transition hover:border-[#2f8f5b]/42 focus-ring"
                href={contactHref}
              >
                Ask about pickup
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {trustSignals.map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-[8px] border border-[#1e5f3f]/12 bg-white/72 p-4">
                  <Icon size={18} className="text-[#2f8f5b]" />
                  <p className="mt-3 text-xs uppercase tracking-[0.15em] text-[#28533a]/62">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f8f5b]">
            Acrylic demonstration
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-[#143a29] text-balance">
            Inspect the details that change the shelf.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#28533a]/68">
            Step through the product interaction to see lid behavior, insertion spacing,
            acrylic thickness, and how the case changes the presentation.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {product.demoSteps.map((step, index) => (
            <button
              key={step.label}
              className={cn(
                "border p-5 text-left transition focus-ring",
                demoStep === index
                  ? "rounded-[8px] border-[#2f8f5b] bg-[#2f8f5b] text-white"
                  : "rounded-[8px] border-[#1e5f3f]/14 bg-white/72 text-[#143a29] hover:border-[#2f8f5b]/32"
              )}
              type="button"
              onClick={() => setDemoStep(index)}
            >
              <p className="text-sm font-semibold">{step.label}</p>
              <p
                className={cn(
                  "mt-3 text-sm leading-6",
                  demoStep === index ? "text-white/76" : "text-[#28533a]/62"
                )}
              >
                {step.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="border-y border-[#1e5f3f]/10 bg-[#f5efcf] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <InfoBlock title="Specifications">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex justify-between gap-4 border-b border-[#1e5f3f]/10 py-3">
                <span className="text-sm text-[#28533a]/54">{spec.label}</span>
                <span className="text-right text-sm text-[#143a29]">{spec.value}</span>
              </div>
            ))}
          </InfoBlock>

          <InfoBlock title="Fitment">
            <div className="grid gap-3">
              {product.fitment.map((item) => (
                <p key={item} className="rounded-[8px] border border-[#1e5f3f]/12 bg-white/72 px-4 py-3 text-sm text-[#28533a]/70">
                  {item}
                </p>
              ))}
            </div>
          </InfoBlock>

          <InfoBlock title="FAQ">
            <div className="grid gap-4">
              {product.faq.map((item) => (
                <div key={item.question}>
                  <p className="text-sm font-semibold text-[#143a29]">{item.question}</p>
                  <p className="mt-2 text-sm leading-6 text-[#28533a]/64">{item.answer}</p>
                </div>
              ))}
            </div>
          </InfoBlock>
        </div>
      </section>

      {related.length ? (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f8f5b]">
            Recommended pairings
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                className="group rounded-[8px] border border-[#1e5f3f]/14 bg-white/76 p-5 transition hover:border-[#2f8f5b]/42 focus-ring"
                href={`/products/${item.slug}`}
              >
                <ProductVisual product={item} size="sm" />
                <h3 className="mt-4 text-xl font-semibold text-[#143a29]">{item.name}</h3>
                <p className="mt-2 text-sm text-[#28533a]/62">{item.tagline}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-[#2f8f5b]">
                  View pairing
                  <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#143a29]">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}
