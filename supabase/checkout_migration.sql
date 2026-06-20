-- Lucky's Loot checkout migration
-- Run this in Supabase SQL editor if you already created the original schema.

alter table public.orders
  add column if not exists stripe_checkout_session_id text unique,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_payment_status text,
  add column if not exists customer_email text,
  add column if not exists customer_name text,
  add column if not exists pickup_notes text,
  add column if not exists checkout_items jsonb not null default '[]'::jsonb;

create index if not exists orders_stripe_checkout_idx
  on public.orders(stripe_checkout_session_id);
