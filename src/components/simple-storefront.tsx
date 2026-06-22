"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Instagram, Mail, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { storefrontCategories } from "@/lib/storefront-products";

type HeroSpotlightItem = {
  id: string;
  name: string;
  href: string;
};

type OpenerState = "checking" | "playing" | "hidden";

let openerResolvedThisSession = false;

export function SimpleStorefront() {
  const [contactOpen, setContactOpen] = useState(false);
  const [openerState, setOpenerState] = useState<OpenerState>(
    openerResolvedThisSession ? "hidden" : "checking"
  );
  const heroSpotlights: HeroSpotlightItem[] = storefrontCategories.map((category) => ({
    id: category.id,
    name: category.label,
    href: category.standaloneHref
  }));

  useEffect(() => {
    const openerKey = "luckys-loot-opener-played";

    try {
      if (window.sessionStorage.getItem(openerKey)) {
        openerResolvedThisSession = true;
        setOpenerState("hidden");
        return;
      }

      window.sessionStorage.setItem(openerKey, "true");
      openerResolvedThisSession = true;
      setOpenerState("playing");
    } catch {
      openerResolvedThisSession = true;
      setOpenerState("playing");
    }

    const hideTimer = window.setTimeout(() => setOpenerState("hidden"), 4200);

    return () => {
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="simple-storefront starry-night text-[#e7e0cf]">
      {openerState === "checking" ? <OpenerCover /> : null}
      {openerState === "playing" ? <Opener /> : null}

      <section className="relative min-h-[76vh] overflow-hidden pt-16">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.22),transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.36))]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(76vh-4rem)] max-w-7xl flex-col justify-center px-4 py-8 text-center sm:px-6 lg:py-10">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(560px,820px)_minmax(0,1fr)]">
            <aside className="hidden gap-5 text-left lg:grid">
              {heroSpotlights.slice(0, 2).map((product) => (
                <HeroSpotlight key={product.id} item={product} />
              ))}
            </aside>

            <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
              <div className="lucky-logo-glitch relative h-56 w-56 overflow-visible rounded-full sm:h-72 sm:w-72">
                <Image
                  src="/old-site/LuckysLoot-transparent.png"
                  alt="Lucky's Loot logo"
                  width={1024}
                  height={1024}
                  className="hero-logo-image lucky-logo-image h-full w-full object-contain sm:hidden"
                  priority
                  sizes="224px"
                  quality={100}
                />
                <Image
                  src="/old-site/LuckysLoot-transparent.webp"
                  alt="Lucky's Loot logo"
                  fill
                  className="hero-logo-image lucky-logo-image hidden object-contain sm:block"
                  priority
                  sizes="(min-width: 640px) 288px, 224px"
                  unoptimized
                />
              </div>

              <p className="mt-6 font-pixel text-lg leading-8 text-[#d4af37] sm:text-xl">
                Welcome to
              </p>
              <h1 className="gold-glow hero-chrome-gold mt-2 whitespace-nowrap font-pixel text-[1.5rem] font-bold text-[#d4af37] sm:text-[2.45rem] lg:text-[3.35rem] xl:text-[4.1rem]">
                Lucky&apos;s Loot
              </h1>
              <p className="mx-auto mt-5 text-center font-pixel text-[0.52rem] uppercase leading-5 text-[#d4af37] sm:text-[0.72rem]">
                Premium Trading Card Supplies
              </p>
              <div className="mt-8 flex justify-center">
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

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

function OpenerCover() {
  return <div className="fixed inset-0 z-[100] bg-black" aria-hidden="true" />;
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
      href={item.href}
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
      <div className="relative grid w-[min(94vw,54rem)] place-items-center gap-5">
        <div className="opener-logo opener-pikachu-frame relative aspect-video w-full overflow-visible">
          <Image
            src="/brand/pikachu_transparent_v2.webp"
            alt=""
            fill
            className="opener-pikachu-image object-contain"
            sizes="(min-width: 640px) 54rem, 94vw"
            unoptimized
            priority
          />
        </div>
        <p className="opener-loading-text font-pixel text-[0.96rem] uppercase leading-7 text-[#71efff] sm:text-[1.18rem]">
          Loading...
        </p>
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
