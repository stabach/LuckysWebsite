"use client";

import { Instagram, Mail, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartButton } from "@/components/cart-provider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/events", label: "Upcoming Events" },
  { href: "/#contact", label: "Contact" }
];

export function SiteNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d4af37]/24 bg-black/88 text-[#e7e0cf] shadow-[0_8px_24px_rgba(0,0,0,0.36)] backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3 focus-ring" href="/" aria-label="Lucky's Loot home">
          <span className="relative block h-12 w-12 shrink-0 overflow-visible rounded-full shadow-[0_0_20px_rgba(212,175,55,0.26)]">
            <Image
              src="/old-site/LuckysLoot-transparent.webp"
              alt=""
              fill
              className="lucky-logo-image object-contain"
              sizes="48px"
              unoptimized
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-pixel text-[0.62rem] uppercase leading-4 text-[#d4af37]">
              Lucky&apos;s Loot
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#b8b0a0]">
              TCG Supplies
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c8c0ad] transition hover:text-[#d4af37] focus-ring"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <CartButton />
          <a
            href="https://ig.me/m/LuckysLootSupplies"
            target="_blank"
            rel="noreferrer"
            className="grid h-10 w-10 place-items-center rounded-[8px] border border-[#d4af37]/28 text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
            aria-label="Message Lucky's Loot on Instagram"
            title="Instagram"
          >
            <Instagram size={17} />
          </a>
          <a
            href="mailto:LuckysLootSupplies@gmail.com?subject=Product%20Inquiry"
            className="grid h-10 w-10 place-items-center rounded-[8px] border border-[#d4af37]/28 text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
            aria-label="Email Lucky's Loot"
            title="Email"
          >
            <Mail size={17} />
          </a>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-[8px] border border-[#d4af37]/30 text-[#d4af37] md:hidden focus-ring"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        className={cn(
          "border-t border-[#d4af37]/18 bg-black/96 px-4 py-5 backdrop-blur-xl md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="grid gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              className="rounded-[8px] border border-[#d4af37]/16 bg-[#111111] px-4 py-3 text-sm uppercase tracking-[0.16em] text-[#c8c0ad]"
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <CartButton compact className="col-span-2" />
          <a
            href="https://ig.me/m/LuckysLootSupplies"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-[#d4af37]/18 bg-[#111111] px-3 text-xs uppercase tracking-[0.14em] text-[#d4af37]"
            onClick={() => setOpen(false)}
          >
            <Instagram size={16} />
            Instagram
          </a>
          <a
            href="mailto:LuckysLootSupplies@gmail.com?subject=Product%20Inquiry"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-[#d4af37]/18 bg-[#111111] px-3 text-xs uppercase tracking-[0.14em] text-[#d4af37]"
            onClick={() => setOpen(false)}
          >
            <Mail size={16} />
            Email
          </a>
        </div>
      </div>
    </header>
  );
}
