import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lucky’s Loot",
    short_name: "Lucky’s Loot",
    description: "Collector display and protection supplies with Houston-area pickup.",
    start_url: "/",
    display: "standalone",
    background_color: "#040806",
    theme_color: "#040806",
    icons: [
      { src: "/brand/luckys-loot-mark-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/luckys-loot-mark-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
