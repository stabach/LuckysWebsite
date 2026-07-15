"use client";

import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuckyLogo } from "@/components/brand/lucky-logo";
import { useCart } from "@/components/cart-provider";
import { DesktopMegaMenu } from "@/components/navigation/desktop-mega-menu";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { SearchDialog } from "@/components/navigation/search-dialog";
import { primaryNavigation } from "@/data/navigation";
import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [condensed, setCondensed] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountHref, setAccountHref] = useState("/login");
  const [accountLabel, setAccountLabel] = useState("Sign in");
  const megaTriggerRef = useRef<HTMLButtonElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 22);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!hasSupabaseEnv()) return;
    const supabase = createSupabaseBrowserClient();
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const signedIn = Boolean(data.session?.user);
      setAccountHref(signedIn ? "/account" : "/login");
      setAccountLabel(signedIn ? "Account" : "Sign in");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const signedIn = Boolean(session?.user);
      setAccountHref(signedIn ? "/account" : "/login");
      setAccountLabel(signedIn ? "Account" : "Sign in");
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className={cn("site-header", condensed && "site-header-condensed")}>
      <div className="section-shell header-inner">
        <Link className="header-brand" href="/" aria-label="Lucky’s Loot home">
          <LuckyLogo priority className="header-logo" />
          <span className="header-wordmark">
            <strong>Lucky’s Loot</strong>
            <small>Collector supplies</small>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Primary navigation">
          <DesktopMegaMenu open={megaOpen} onOpenChange={setMegaOpen} triggerRef={megaTriggerRef} />
          {primaryNavigation.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("primary-nav-link", pathname === link.href && "is-active")}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            ref={searchTriggerRef}
            className="header-action"
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search products"
          >
            <Search size={19} aria-hidden="true" />
          </button>
          <Link className="header-action account-action" href={accountHref} aria-label={accountLabel}>
            <UserRound size={19} aria-hidden="true" />
          </Link>
          <button
            className="header-action cart-action"
            type="button"
            onClick={openCart}
            aria-label={`Open Your Loot with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            <ShoppingBag size={19} aria-hidden="true" />
            <span className="cart-count" aria-hidden="true">{itemCount}</span>
          </button>
          <button
            ref={menuTriggerRef}
            className="header-action menu-action"
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={21} aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={closeMobile}
        onSearch={() => setSearchOpen(true)}
        menuTriggerRef={menuTriggerRef}
        accountHref={accountHref}
        accountLabel={accountLabel}
      />
      <SearchDialog open={searchOpen} onClose={closeSearch} triggerRef={searchTriggerRef} />
    </header>
  );
}
