import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lucky's Loot - TCG Supplies",
    template: "%s | Lucky's Loot"
  },
  description:
    "Pokemon trading card supplies, acrylic cases, PSA guards, and toploader binders available for local pickup.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/old-site/luckysloot-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/old-site/luckysloot-icon-192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/old-site/luckysloot-icon-180.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    title: "Lucky's Loot",
    description:
      "A simple local storefront for Pokemon trading card supplies, acrylic cases, PSA guards, and toploader binders.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="luxury-page">
            <SiteNavigation />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
