"use client";

import { Instagram, Mail } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="bg-[#050505] px-4 py-6 text-center text-[#b8b0a0] sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="relative block h-12 w-12 overflow-visible rounded-full">
            <Image
              src="/old-site/LuckysLoot-transparent.webp"
              alt=""
              fill
              className="lucky-logo-image object-contain"
              sizes="48px"
              unoptimized
            />
          </span>
          <div className="text-left">
            <p className="font-pixel text-[0.62rem] uppercase leading-4 text-[#d4af37]">Lucky&apos;s Loot</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8d866f]">Local sales only</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://ig.me/m/LuckysLootSupplies"
            target="_blank"
            rel="noreferrer"
            className="grid h-10 w-10 place-items-center rounded-[8px] border border-[#d4af37]/24 text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
            aria-label="Message Lucky's Loot on Instagram"
            title="Instagram"
          >
            <Instagram size={17} />
          </a>
          <a
            href="mailto:LuckysLootSupplies@gmail.com?subject=Product%20Inquiry"
            className="grid h-10 w-10 place-items-center rounded-[8px] border border-[#d4af37]/24 text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
            aria-label="Email Lucky's Loot"
            title="Email"
          >
            <Mail size={17} />
          </a>
        </div>
        <p className="text-xs">&copy; 2026 Lucky&apos;s Loot. All rights reserved. Local sales only.</p>
      </div>
    </footer>
  );
}
