# Lucky’s Loot V2 final verification

## Delivery summary

Lucky’s Loot V2 is a ground-up Next.js storefront on `codex/redesign/luckys-loot-v2`.
It uses one Zod-validated catalog and server-owned pricing across discovery, product pages, Fit
Finder, Your Loot, Stripe Checkout, webhook order snapshots, account history, metadata, and
structured data. The UI is an original dark collector-showroom system based on the supplied Lucky’s
Loot brand media; no Phantom source, copy, reviews, claims, marks, or customer-facing imagery is
served.

## Canonical public routes

- Store: `/`, `/shop`
- Collections: `/collections/acrylic-cases`, `/collections/slab-protection`,
  `/collections/toploader-binders`, `/collections/protect-sealed-product`,
  `/collections/protect-graded-cards`
- Products: `/products/etb-acrylic-case`, `/products/crystal-slab-acrylic-case`,
  `/products/booster-box-acrylic-case`, `/products/booster-bundle-acrylic-case`,
  `/products/psa-guards`, `/products/4-pocket-toploader-binder`,
  `/products/9-pocket-toploader-binder`
- Guidance and content: `/find-your-fit`, `/events`, `/reviews`, `/about`, `/contact`, `/faq`,
  `/pickup-and-returns`, `/privacy`, `/terms`, `/accessibility`
- Authentication and account: `/login`, `/sign-up`, `/forgot-password`, `/reset-password`,
  `/account`, `/account/orders`, `/account/orders/[orderId]`, `/account/profile`
- Checkout: `/checkout/success`, `/checkout/cancelled`
- Machine-readable: `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/favicon.ico`
- APIs: `/api/checkout`, `/api/contact`, `/api/stripe/webhook`, `/auth/callback`,
  `/events/[slug]/calendar`

Compatibility routes `/products`, `/acrylic-cases`, `/psa-guards`, `/binders`, `/sealed-product`,
`/inspiration`, and `/shop/[category]` issue temporary redirects into the canonical V2 routes and do
not expose a second catalog.

## Canonical prices

| Product | Price |
| --- | ---: |
| ETB Acrylic Case | $15.00 |
| Crystal Slab Acrylic Case | $13.00 |
| Booster Box Acrylic Case | $12.00 |
| Booster Bundle Acrylic Case | $8.00 |
| PSA Guards, 1–9 total | $7.00 each |
| PSA Guards, 10–24 total | $6.00 each |
| PSA Guards, 25+ total | $4.00 each |
| 4-Pocket Toploader Binder | $12.00 |
| 9-Pocket Toploader Binder | $15.00 |

## Media implementation

- The supplied 720 × 1280, 10.084-second acrylic MP4 has no audio, carries fast-start metadata,
  and is delivered as a 5.9 MB launch derivative with a 51 KB poster.
- The footage is labeled `Interactive View`, not `360°`, because a seamless full rotation and exact
  launch-SKU match are not verified.
- `/src/components/media/spin-viewer.tsx` dispatches reusable `video-scrub` and future
  `image-sequence` modes. The launch view is poster-first and loads its video only after the shopper
  selects the interactive gallery media and it nears the viewport.
- Pointer drag, range input, arrows, Shift+arrows, Home, End, Space, reset, retry, reduced-motion
  opt-in, static fallback, bounded requestAnimationFrame updates, and accessible slider state are
  implemented.

## Neon opener

- Uses the supplied Lucky’s Loot neon sign with optimized full, poster, and dimmed WebP derivatives.
- Runs once per session through `sessionStorage["luckys-neon-intro-v2"]` for 1.7 seconds.
- The skip action appears after 250 ms; the homepage is already rendered beneath the overlay.
- Reduced-motion mode shows a static lit sign for 250 ms. Storage and image failure paths reveal the
  storefront without trapping focus, shifting scroll, playing audio, or showing a fake loader.

## Integrations

- Stripe hosted Checkout: server-recomputed canonical prices, aggregate Guard tiers, validated
  pickup metadata, safe redirects, Zod payload validation, rate limiting, webhook signatures, and
  idempotent order writes.
- Supabase SSR: guest-capable storefront, customer authentication, profile and protected order
  history, additive V2 migration, RLS-compatible server access, and generic production errors.
- Resend: conditional contact form, Zod validation, honeypot, sanitization, rate limiting, reply-to,
  text and escaped HTML bodies, and safe provider failures.
- Provider-agnostic no-op analytics emits the specified ecommerce, fitment, media, pickup, purchase,
  and contact events without names, emails, notes, engraving text, or private addresses.

## Verification results

- `npm install`: completed; 412 packages audited.
- `npm audit --omit=dev`: 0 vulnerabilities.
- `npm run typecheck`: passed with strict TypeScript.
- `npm run lint`: passed with zero warnings.
- `npm run test`: 10 files and 50 unit tests passed.
- `npm run test:e2e`: Playwright projects at 390 × 844, 768 × 1024, and 1440 × 900; 14 applicable
  scenarios passed and 16 viewport-specific cases skipped.
- Axe WCAG A/AA scan: no serious or critical violations on home, shop, Crystal Slab product, Fit
  Finder result, conditional contact, FAQ, login, and missing-provider account routes at all three
  viewports.
- `npm run build`: Next.js 15.5.20 production build compiled, typechecked, and generated 40 pages.
- Production route probe: every canonical page, machine-readable route, and representative account
  detail returned 200; compatibility routes returned 307.
- Structured-data probe: canonical and Open Graph metadata plus Organization, WebSite, Product,
  Breadcrumb, visible FAQ, and conditional Event JSON-LD were present; sitemap contained 24 URLs.
- API failure probes: malformed contact and checkout payloads returned safe 4xx JSON errors.

Failures found during QA—product-benefit contrast, checkout-success hydration order, an ambiguous
mobile selector, and a stale legacy favicon reference—were fixed and retested.

## Screenshots

- `artifacts/screenshots/home-mobile-390x844.png`
- `artifacts/screenshots/home-tablet-768x1024.png`
- `artifacts/screenshots/home-desktop-1440x900.png`
- `artifacts/screenshots/product-crystal-desktop-1440x900.png`
- `artifacts/screenshots/fit-mobile-390x844.png`

These are recaptured from the final production build with lazy images decoded before capture.

## Deployment environment

- Public/runtime: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPPORT_EMAIL`,
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-only: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`
- Commerce configuration: `STRIPE_AUTOMATIC_TAX`, `PRICES_INCLUDE_TAX`

`E2E_MOCK_CHECKOUT` and `NEXT_PUBLIC_E2E_FIXTURES` are test-only seams guarded from production and
must not be deployment environment variables. Stripe should send checkout events to
`/api/stripe/webhook`. Apply `supabase/v2_storefront_migration.sql` before enabling V2 checkout.

## Remaining launch verification

The owner-content list is maintained in `docs/content-verification.md`. It includes dimensions and
specialty fitment, binder capacity/inventory, acrylic claims and magnet layouts, engraving,
pickup/returns/tax policy, branded email and Instagram, legal policy review, real reviews/photos,
event schedules, and approval or replacement of the watermarked interactive video.

Operationally, production launch still requires real provider credentials, the Supabase migration,
a signed Stripe test purchase and webhook replay, a Resend domain-delivery test, owner content signoff,
and real-device smoke testing. Multi-instance hosting should replace the in-process rate-limit store
with a shared durable provider. No deployment was performed by this task.
