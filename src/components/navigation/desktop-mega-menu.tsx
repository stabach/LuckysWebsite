"use client";

import { ChevronDown, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { shopNavigationGroups } from "@/data/navigation";

type DesktopMegaMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export function DesktopMegaMenu({ open, onOpenChange, triggerRef }: DesktopMegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        onOpenChange(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onOpenChange, open, triggerRef]);

  return (
    <div className="mega-menu-wrap">
      <button
        ref={triggerRef}
        type="button"
        className="primary-nav-link primary-nav-shop"
        aria-expanded={open}
        aria-controls="shop-mega-menu"
        onClick={() => onOpenChange(!open)}
      >
        Shop <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open ? (
        <div
          ref={panelRef}
          id="shop-mega-menu"
          className="mega-menu-panel"
          aria-label="Shop menu"
        >
          <div className="section-shell mega-menu-grid">
            {shopNavigationGroups.map((group) => (
              <div className="mega-menu-group" key={group.title}>
                <p>{group.title}</p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} onClick={() => onOpenChange(false)}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link
              className="mega-feature"
              href="/products/crystal-slab-acrylic-case"
              onClick={() => onOpenChange(false)}
            >
              <span className="mega-feature-media">
                <Image
                  src="/media/crystal-slab-interactive-poster.webp"
                  alt="PSA Graded Guard Fit Acrylic Case product view"
                  fill
                  sizes="300px"
                />
              </span>
              <span className="mega-feature-copy">
                <strong>PSA Graded Guard Fit Acrylic Case</strong>
                <span>$13.00 · Explore the case</span>
              </span>
              <MoveUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
