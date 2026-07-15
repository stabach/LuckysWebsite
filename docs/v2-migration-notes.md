# Lucky's Loot V2 migration notes

## Production baseline

- Source repository: `stabach/LuckysWebsite`
- Production branch inspected: `master`
- Production commit inspected before V2 work: `a3fc34aebdc501cc2c12c1a601eaf64e22bfa91f`
- V2 working branch: `codex/redesign/luckys-loot-v2`

## Reusable foundations

- Stripe Checkout session creation with server-owned prices.
- Stripe webhook signature verification and idempotent order upserts.
- Supabase SSR authentication, customer profiles, order history, and RLS policies.
- Resend contact delivery with customer reply-to handling.
- Existing Lucky's Loot acrylic, PSA Guard, binder, and event assets after provenance and claim review.
- The 15 named PSA Guard color images.

## Retired systems and content

The legacy application contains two incompatible product catalogs: `src/lib/catalog.ts` and
`src/lib/storefront-products.ts`. They use different IDs, slugs, prices, dimensions, and claims.
V2 replaces both with one immutable, runtime-validated catalog under `src/data/catalog.ts`.

The following will not remain customer-facing:

- Legacy green/cream product detail presentation and pixel-heavy storefront architecture.
- Phantom Display product names, product photography, image-source links, reviews, and claims.
- Copied Phantom-branded files under `public/product-images/phantom-*`.
- Stale event strings without machine-readable dates.
- Unverified UV-resistance, acid-free, PVC-free, drop-protection, and universal-fit claims.
- Third-party binder product images that show conflicting brands or capacities.
- The Pikachu opener and its multi-second `Loading...` screen.
- The unused Three.js showroom and legacy shelf/collection-builder experiments.

## Asset preservation

Supplied originals are stored outside public delivery under `design-source/`. Optimized derivatives
are delivered from `public/brand/` and `public/media/`. Existing source assets are retained until
replacement provenance and launch approval are documented. No original source media is deleted as
part of the V2 rebuild.

## Environment baseline

The production clone expects Supabase, Stripe, and Resend configuration. V2 keeps those integration
patterns but validates missing configuration safely and documents the exact required keys in
`.env.example`.
