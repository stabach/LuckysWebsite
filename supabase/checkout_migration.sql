-- Lucky's Loot checkout migration
-- Run this in Supabase SQL editor if you already created the original schema.

alter table public.orders
  add column if not exists order_number text,
  add column if not exists payment_status text,
  add column if not exists fulfillment_status text,
  add column if not exists stripe_checkout_session_id text unique,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_payment_status text,
  add column if not exists customer_email text,
  add column if not exists customer_name text,
  add column if not exists pickup_notes text,
  add column if not exists checkout_items jsonb not null default '[]'::jsonb,
  add column if not exists discount_cents integer not null default 0 check (discount_cents >= 0),
  add column if not exists shipping_method text,
  add column if not exists tracking_number text,
  add column if not exists tracking_url text;

create index if not exists orders_stripe_checkout_idx
  on public.orders(stripe_checkout_session_id);

create index if not exists orders_order_number_idx
  on public.orders(order_number);
