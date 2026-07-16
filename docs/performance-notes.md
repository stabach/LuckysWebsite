# Lucky’s Loot V2 performance notes

## Implemented safeguards

- Marketing and catalog pages are Server Components unless interaction requires client state.
- Product imagery uses explicit aspect ratios and `next/image` AVIF/WebP negotiation.
- The homepage headline and actions render independently of product video.
- The PSA Graded Guard Fit Acrylic Case media starts with a compact poster. Its audio-free,
  fast-start MP4 is requested only after explicit interaction; reduced-motion and Save-Data users
  remain on the poster until they opt in.
- The neon opener uses optimized 23–166 KB WebP layers, lasts less than two seconds, and never
  blocks server rendering or data loading.
- Below-fold product imagery is lazy-loaded. Responsive screenshot automation scrolls the page and
  decodes those images before capture so blank lazy states are not mistaken for final rendering.
- Static brand, product, and media paths receive immutable caching headers.
- Three.js, Framer Motion, and their unused type packages were removed. Site motion uses scoped CSS
  and small requestAnimationFrame updates only where direct interaction needs them.
- Public assets were reduced from roughly 55 MB to roughly 9.3 MB by moving unreferenced raw PNGs,
  the retired Pokémon opener media, old event flyers, and Phantom-branded reference files into the
  non-public `design-source/legacy-public/` archive. Active optimized product WebPs total under 1 MB.
- The generated social card is an optimized 1200 × 630 JPEG of roughly 251 KB.

## Launch infrastructure checks

- Move the 5.9 MB interactive MP4 to versioned object storage or a CDN if deployment platform
  limits, regional latency, or real-user monitoring justify it.
- Keep immutable filenames versioned whenever an active media file is replaced.
- Validate real-user Core Web Vitals after deployment; local build and browser automation cannot
  reproduce production network, CDN, or third-party checkout latency.
- Replace the in-process API rate-limit store with a shared durable provider before running multiple
  application instances.
