# Lucky's Loot V2 build plan

## Architecture

- Next.js 15 App Router with strict TypeScript.
- Server Components for catalog and marketing content; client components only for interaction.
- One immutable Zod-validated catalog and one pure pricing module used by UI, cart, checkout,
  webhook persistence, metadata, and tests.
- Local cart persistence with server recomputation at checkout.
- Supabase SSR auth and RLS-protected customer/order records.
- Stripe hosted Checkout with local/event pickup metadata and idempotent webhook persistence.
- Resend contact delivery with validation, honeypot protection, sanitization, and rate limiting.
- Poster-first, user-loaded video scrub media with a static fallback.
- Route data modules for catalog, collections, FAQs, and date-derived events.

## Delivery phases

1. Foundation: migration docs, new app shell, tokens, fonts, base UI, errors.
2. Canonical catalog and pricing: schemas, validation, fitment, inventory, tests.
3. Brand shell: supplied asset processing, neon opener, navigation, search, footer.
4. Homepage: product-first hero and complete retail hierarchy.
5. Shop and collections: filtering, sorting, search, responsive grid.
6. Product pages and media: gallery, scrub viewer, fitment, specs, related products.
7. PSA Guard builder and cart: mixed-color tiers, pickup selection, persistence.
8. Checkout and account: Stripe, webhook, verified success, Supabase customer views.
9. Events, contact, help, and policies: derived dates, ICS, form, static policy routes.
10. SEO, accessibility, performance, testing, and cleanup.

## Verification gate after each commit

- `npm run typecheck`
- `npm run lint`
- Relevant unit tests
- A production build whenever route or runtime behavior changes materially

Final verification adds the complete unit suite, Playwright/axe flows at 390 x 844, 768 x 1024,
and 1440 x 900, manual keyboard checks, responsive screenshots, and `npm run build`.
