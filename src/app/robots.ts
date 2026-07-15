import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/api",
        "/auth",
        "/checkout",
        "/forgot-password",
        "/login",
        "/reset-password",
        "/sign-up"
      ]
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
