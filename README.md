# Lucky's Loot

A premium collector showroom built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Three.js, and Supabase architecture.

## Experience

- Cinematic homepage with an interactive acrylic display case
- Floating product showcases with focus reveals and delayed add-to-cart actions
- Searchable shop with category filtering, sorting, inventory signals, and product recommendations
- Product pages with interactive viewer states, specs, fitment, FAQ, pairings, and shelf preview entry
- Virtual Shelf Mode with adjustable layouts, before/after protection mode, zoom, save, and share hooks
- Collection Builder with collection inputs, generated shelf layouts, product recommendations, drag rearrangement, and PNG export
- Display inspiration gallery for aspirational collector setups
- Admin architecture route and Supabase schema for secure management

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js
- Supabase Auth, database, and RLS schema
- Lucide icons

## Getting Started

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Create at least one authenticated user.
6. Insert that user's auth id into `public.admin_users` with the `owner` role.

Public catalog data remains readable. Customer profiles, wishlists, orders, saved shelf layouts, saved collection builds, notifications, and admin management tables are protected with RLS policies.

## Useful Commands

```bash
npm run typecheck
npm run lint
npm run build
```

## Notes

The first implementation uses typed local catalog data so the showroom can run before Supabase content is populated. The schema is ready for moving catalog, gallery, inventory, orders, and saved layout data into Supabase.
