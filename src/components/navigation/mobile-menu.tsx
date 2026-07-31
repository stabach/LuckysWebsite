"use client";

import { ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { useCallback, useRef } from "react";
import { LuckyLogo } from "@/components/brand/lucky-logo";
import { shopNavigationGroups } from "@/data/navigation";
import { useDialogFocus } from "@/hooks/use-dialog-focus";
import { cn } from "@/lib/utils";

const phoneNavigation = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/shop" },
  { label: "Acrylic Cases", href: "/collections/acrylic-cases" },
  { label: "PSA Guards", href: "/collections/slab-protection" },
  { label: "Binders", href: "/collections/toploader-binders" },
  { label: "Sealed Product", href: "/collections/protect-sealed-product" },
  { label: "Upcoming Events", href: "/events" },
  { label: "Pickup & Returns", href: "/pickup-and-returns" },
  { label: "Contact", href: "/contact" }
] as const;

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
  menuTriggerRef: RefObject<HTMLButtonElement | null>;
  accountHref: string;
  accountLabel: string;
};

export function MobileMenu({
  open,
  onClose,
  onSearch,
  menuTriggerRef,
  accountHref,
  accountLabel
}: MobileMenuProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useDialogFocus(open, drawerRef, close, menuTriggerRef);

  if (!open) return null;

  function openSearch() {
    onClose();
    window.setTimeout(onSearch, 0);
  }

  return (
    <div className="mobile-menu-layer" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <div
        ref={drawerRef}
        className="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="mobile-menu-head">
          <Link className="mobile-menu-brand mobile-menu-brand-phone" href="/" onClick={onClose} aria-label="Lucky’s Loot home">
            <LuckyLogo />
            <span>Lucky’s Loot</span>
          </Link>
          <div className="mobile-menu-brand mobile-menu-brand-legacy">
            <LuckyLogo />
            <span id="mobile-menu-title">Lucky’s Loot</span>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close menu">
            <X size={21} aria-hidden="true" />
          </button>
        </div>
        <button className="mobile-search-button" type="button" onClick={openSearch}>
          <Search size={18} aria-hidden="true" /> Search products
        </button>
        <nav className="mobile-phone-nav" aria-label="Phone navigation">
          {phoneNavigation.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                className={cn(active && "is-active")}
                href={link.href}
                key={link.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            className={cn(pathname.startsWith(accountHref) && "is-active")}
            href={accountHref}
            onClick={onClose}
          >
            {accountLabel}
          </Link>
        </nav>
        <nav className="mobile-nav mobile-nav-legacy" aria-label="Mobile navigation">
          <details open>
            <summary>Shop <ChevronDown size={16} aria-hidden="true" /></summary>
            <div>
              {shopNavigationGroups[0].links.map((link) => (
                <Link href={link.href} key={link.href} onClick={onClose}>{link.label}</Link>
              ))}
            </div>
          </details>
          <details>
            <summary>Shop by fit <ChevronDown size={16} aria-hidden="true" /></summary>
            <div>
              {shopNavigationGroups[1].links.map((link) => (
                <Link href={link.href} key={link.href} onClick={onClose}>{link.label}</Link>
              ))}
            </div>
          </details>
          <Link href="/events" onClick={onClose}>Events</Link>
          <Link href="/pickup-and-returns" onClick={onClose}>Pickup information</Link>
          <Link href="/contact" onClick={onClose}>Contact</Link>
          <Link href={accountHref} onClick={onClose}>{accountLabel}</Link>
        </nav>
        <div className="mobile-menu-foot">
          <p>Richmond / Houston-area pickup</p>
          <span>Instagram profile link pending verification</span>
        </div>
      </div>
    </div>
  );
}
