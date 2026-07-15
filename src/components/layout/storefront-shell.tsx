import type { ReactNode } from "react";
import { NeonOpener } from "@/components/brand/neon-opener";
import { CartProvider } from "@/components/cart-provider";
import { AnnouncementBar } from "@/components/navigation/announcement-bar";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";

export function StorefrontShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="site-frame">
        <NeonOpener />
        <AnnouncementBar />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}
