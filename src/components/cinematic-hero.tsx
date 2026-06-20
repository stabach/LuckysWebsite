"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Boxes, Sparkles } from "lucide-react";
import { ThreeShowroom } from "@/components/three-showroom";

export function CinematicHero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#fff8df] pt-16 text-[#143a29]">
      <div className="absolute inset-0 museum-grid opacity-35" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_75%_24%,rgba(255,179,138,0.28),transparent_26%),radial-gradient(circle_at_18%_18%,rgba(47,143,91,0.22),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.56),rgba(255,248,223,0.88))]"
        aria-hidden
      />

      <div className="absolute inset-0 hidden opacity-[0.82] md:block">
        <ThreeShowroom />
      </div>
      <Image
        src="/brand/mascot-shelf-clean.png"
        alt=""
        width={430}
        height={430}
        className="pointer-events-none absolute bottom-4 right-0 hidden max-w-[34vw] object-contain md:block"
        priority
      />
      <Image
        src="/brand/mascot-shelf-clean.png"
        alt=""
        width={340}
        height={340}
        className="pointer-events-none absolute bottom-3 right-[-5rem] block w-80 max-w-none object-contain opacity-25 mix-blend-multiply md:hidden"
        priority
      />

      <div className="relative z-10 mx-auto flex min-h-[690px] max-w-7xl items-center px-4 py-16 sm:min-h-[calc(92vh-4rem)] sm:px-6 lg:px-8">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-[8px] border border-[#1e5f3f]/16 bg-white/76 px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#2f8f5b] shadow-[0_12px_30px_rgba(31,95,63,0.08)] backdrop-blur-xl">
            <Sparkles size={14} />
            Pokemon sealed product display
          </div>
          <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-[0.94] text-[#143a29] text-balance sm:text-6xl lg:text-7xl">
            Lucky&apos;s Loot
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#28533a]/78 sm:text-lg">
            Acrylic cases for Pokemon ETBs, booster boxes, and booster bundles, plus Phantom
            PSA displays, gradient PSA guards, and topload binders for shelves that feel alive.
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/virtual-shelf"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-[8px] border border-[#2f8f5b] bg-[#2f8f5b] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#256f48] focus-ring sm:w-auto"
            >
              <Boxes size={18} />
              Build a Shelf
            </Link>
            <Link
              href="/collection-builder"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-[8px] border border-[#1e5f3f]/16 bg-white/76 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#143a29] transition hover:border-[#2f8f5b]/48 focus-ring sm:w-auto"
            >
              Case Calculator
              <ArrowRight size={17} className="transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-12 hidden max-w-xl grid-cols-1 gap-3 sm:grid sm:grid-cols-3">
            {[
              ["ETB", "acrylic cases"],
              ["BB", "booster box cases"],
              ["PSA", "guards + displays"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-[8px] border border-[#1e5f3f]/14 bg-white/68 px-4 py-4 backdrop-blur-md">
                <p className="text-xl font-semibold text-[#143a29]">{value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#28533a]/54">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 pb-7 sm:px-6 lg:px-8">
        <div className="hairline" />
      </div>
    </section>
  );
}
