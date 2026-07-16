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
- Copied Phantom-branded files formerly under `public/product-images/phantom-*`; these are archived
  outside public delivery under `design-source/legacy-public/` and are never referenced by V2.
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

Legacy public asset trees were moved intact to `design-source/legacy-public/` during final cleanup.
This preserves source history while preventing stale imagery, Phantom-branded files, and old event
flyers from being served by the V2 application.

Unreferenced raw acrylic and PSA Guard PNG directories plus the retired Pokémon opener and legacy
mascot composites were archived there as well. Their optimized canonical WebP derivatives remain
under `public/products/`; the active public asset tree is about 9.3 MB instead of about 55 MB.

### Supplied media findings

- Neon mascot sign: 1254 × 1254 RGB PNG. A full-image WebP, poster, and dimmed off-state were
  generated. Separate color segmentation was intentionally skipped because the full composite
  preserves the supplied character and tube edges more cleanly.
- Flat mascot mark: 1024 × 1024 RGBA PNG. Transparent WebP and 192/512 PNG application marks were
  generated.
- Acrylic media: 720 × 1280, 10.084 seconds, H.264, no audio. The MP4 was copied with fast-start
  metadata and paired with an extracted poster. The rotation is useful for scrubbing but is not
  confidently seamless, so V2 presents it as a video preview, never `360°`.
- The supplied video contains a Runway watermark near the lower-right edge. A clean launch export
  remains a verification item.
- Canonical acrylic, binder, and all 15 PSA Guard images were converted to stable WebP derivatives
  under `public/products/` while their existing source files remain preserved.

## Environment baseline

The production clone expects Supabase, Stripe, and Resend configuration. V2 keeps those integration
patterns but validates missing configuration safely and documents the exact required keys in
`.env.example`.

## V2 order migration

Before enabling V2 checkout in production, apply `supabase/v2_storefront_migration.sql` after the
existing schema. It adds the server-verified pickup method and eligible event identifier, immutable
pricing snapshot, canonical catalog product identifier, and order-history indexes used by the V2 webhook and account routes.
The migration is additive and safe to rerun; it does not delete legacy order data.
