"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useRef } from "react";

type AcrylicFeature = {
  title: string;
  description: string;
  icon: ReactNode;
};

const acrylicFeatures: AcrylicFeature[] = [
  {
    title: "Rounded, Polished Edges",
    description: "Smooth to the touch, premium finish.",
    icon: <RoundedEdgeIcon />
  },
  {
    title: "UV Resistant",
    description: "Built to resist fading and yellowing.",
    icon: <UvIcon />
  },
  {
    title: "Strong Top Magnets",
    description: "High-grade magnets for a secure fit.",
    icon: <MagnetIcon />
  },
  {
    title: "Crystal Clear Display",
    description: "Ultra-clear acrylic for maximum visibility.",
    icon: <DiamondIcon />
  },
  {
    title: "PVC & Acid Free",
    description: "Safe for collectibles and long-term use.",
    icon: <CheckLeafIcon />
  },
  {
    title: "Virgin Acrylic Materials",
    description: "Made from pure acrylic to resist stains, dust, and cracks.",
    icon: <LeafIcon />
  },
  {
    title: "Display & Protect",
    description: "Showcase with confidence. Built to protect what matters.",
    icon: <ShieldIcon />
  }
];

export function AcrylicCaseInteractiveFeatures() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.34 });
  const reduceMotion = useReducedMotion();
  const shouldAnimate = Boolean(isInView || reduceMotion);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden rounded-[8px] border border-[#d4af37]/18 bg-[linear-gradient(135deg,#050505,#111111_44%,#070707)] px-4 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.46)] sm:px-6 sm:py-10 lg:px-9"
      aria-labelledby="acrylic-feature-title"
    >
      <div className="relative grid gap-6 lg:grid-cols-[minmax(390px,0.66fr)_minmax(560px,1fr)] lg:items-center">
        <motion.div
          className="acrylic-reference-panel relative min-h-[360px] overflow-visible sm:min-h-[500px] lg:-ml-9 lg:min-h-[720px]"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute bottom-0 left-0 right-[-12rem] top-[-6%] lg:right-[-14rem]">
            <Image
              src="/acrylic-cases/AcrylicCaseTransparent.png"
              alt="Clear acrylic display case with polished edges and magnetic lid"
              fill
              className="acrylic-reference-image object-contain object-left opacity-100 brightness-105 contrast-110 saturate-[0.78]"
              sizes="(min-width: 1024px) 48vw, 100vw"
              priority
            />
          </div>
        </motion.div>

        <div>
          <div className="max-w-2xl">
            <p className="font-pixel text-[0.62rem] uppercase leading-5 text-[#d4af37]">
              Built for display
            </p>
            <h2 id="acrylic-feature-title" className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Acrylic protection with a premium finish.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#a9a196] sm:text-base">
              Clear, sturdy protection built to display sealed products with a polished collectible look.
            </p>
          </div>

          <div className="mt-5 grid gap-2">
            {acrylicFeatures.map((feature, index) => (
              <FeatureRow
                key={feature.title}
                feature={feature}
                index={index}
                isActive={shouldAnimate}
                reduceMotion={Boolean(reduceMotion)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  feature,
  index,
  isActive,
  reduceMotion
}: {
  feature: AcrylicFeature;
  index: number;
  isActive: boolean;
  reduceMotion: boolean;
}) {
  const delay = 0.88 + index * 0.18;
  const rowStyle = {
    "--feature-delay": `${delay}s`
  } as CSSProperties;

  return (
    <motion.article
      tabIndex={0}
      style={rowStyle}
      className={`acrylic-feature-row group rounded-[8px] border border-white/[0.08] bg-white/[0.025] p-2 outline-none transition hover:border-[#d4af37]/30 hover:bg-white/[0.045] focus-visible:border-[#d4af37]/60 sm:p-2.5 ${
        isActive ? "is-active" : ""
      }`}
      initial={reduceMotion ? false : { opacity: 0, x: 22 }}
      animate={isActive || reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 22 }}
      transition={{ delay: reduceMotion ? 0 : delay, duration: 0.42, ease: "easeOut" }}
    >
      <div className="grid grid-cols-[3.25rem_1fr] gap-3 sm:grid-cols-[3.75rem_1fr]">
        <div className="acrylic-feature-icon grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full border border-white/52 text-[#f2f2f2] sm:h-[3.75rem] sm:w-[3.75rem]">
          {feature.icon}
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="acrylic-feature-title text-base font-semibold leading-6 text-white sm:text-lg">
            {feature.title}
          </h3>
          <p className="text-xs leading-5 text-[#aaa39b] sm:text-[0.82rem]">{feature.description}</p>
        </div>
      </div>
      <div className="acrylic-feature-line mt-2">
        <span />
      </div>
    </motion.article>
  );
}

function IconSvg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" aria-hidden>
      {children}
    </svg>
  );
}

function RoundedEdgeIcon() {
  return (
    <IconSvg>
      <path d="M14 34V18a4 4 0 0 1 4-4h16" stroke="#ff9f43" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
      <path d="M20 34V21a1 1 0 0 1 1-1h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 8l1.7 4.3L42 14l-4.3 1.7L36 20l-1.7-4.3L30 14l4.3-1.7L36 8Z" stroke="currentColor" strokeWidth="2" />
    </IconSvg>
  );
}

function UvIcon() {
  return (
    <IconSvg>
      <circle cx="22" cy="19" r="7" stroke="#ff9f43" strokeWidth="2" />
      <path d="M22 7v4M22 27v4M10 19H6M38 19h4M13.5 10.5l-3-3M33.5 10.5l3-3" stroke="#ff9f43" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 36h24M14 32l7-7 6 6 9-12" stroke="#7cc8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 19v-4M27 15v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconSvg>
  );
}

function MagnetIcon() {
  return (
    <IconSvg>
      <path d="M14 15v14a10 10 0 0 0 20 0V15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 15h7M27 15h7" stroke="#ff9f43" strokeWidth="3" strokeLinecap="round" />
      <path d="M31 7l-3 6h5l-3 6M19 7l-3 6h5l-3 6" stroke="#ff9f43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </IconSvg>
  );
}

function DiamondIcon() {
  return (
    <IconSvg>
      <path d="M10 20h28L31 36H17L10 20Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M15 13h18l5 7H10l5-7ZM19 20l5 16 5-16M18 13l6 7 6-7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M38 30l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3ZM10 8l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" stroke="#ff9f43" strokeWidth="1.8" />
    </IconSvg>
  );
}

function CheckLeafIcon() {
  return (
    <IconSvg>
      <path d="M34 24a15 15 0 1 1-6-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 24l7 7 13-17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31 35c7-1 10-7 9-15-8-1-14 3-15 10-1 4 2 6 6 5Z" stroke="#7cc8ff" strokeWidth="2" strokeLinejoin="round" />
      <path d="M29 34l9-10" stroke="#ff9f43" strokeWidth="2" strokeLinecap="round" />
    </IconSvg>
  );
}

function LeafIcon() {
  return (
    <IconSvg>
      <path d="M10 34c3-17 15-25 28-24 0 13-8 25-24 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 33 34 14" stroke="#ff9f43" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 38c5-1 11-4 16-9" stroke="#7cc8ff" strokeWidth="2" strokeLinecap="round" />
    </IconSvg>
  );
}

function ShieldIcon() {
  return (
    <IconSvg>
      <path d="M24 7 38 13v10c0 9-6 15-14 18-8-3-14-9-14-18V13l14-6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m17 24 5 5 10-12" stroke="#ff9f43" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </IconSvg>
  );
}
