import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Lucky’s Loot | Collector Display & Protection",
    template: "%s | Lucky’s Loot"
  },
  description:
    "Acrylic display cases, colorful slab protection, and Toploader binders for collectors, with Houston-area pickup.",
  applicationName: "Lucky’s Loot",
  category: "shopping",
  icons: {
    icon: [
      { url: "/brand/luckys-loot-mark-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/luckys-loot-mark-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: "/brand/luckys-loot-mark-192.png"
  }
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#040806"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <StorefrontShell>{children}</StorefrontShell>
      </body>
    </html>
  );
}
