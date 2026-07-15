-- Lucky's Loot V2 storefront order migration
-- Apply after the base schema or the legacy checkout migration.

alter table public.orders
  add column if not exists pickup_method text not null default 'richmond',
  add column if not exists pickup_event_id text,
  add column if not exists pricing_snapshot jsonb not null default '{}'::jsonb;

alter table public.orders
  drop constraint if exists orders_pickup_method_check;

alter table public.orders
  add constraint orders_pickup_method_check
  check (pickup_method in ('richmond', 'event'));

alter table public.orders
  drop constraint if exists orders_pickup_event_check;

alter table public.orders
  add constraint orders_pickup_event_check
  check (pickup_method <> 'event' or pickup_event_id is not null);

alter table public.order_items
  add column if not exists catalog_product_id text;

create index if not exists orders_customer_created_at_idx
  on public.orders (customer_id, created_at desc);

create index if not exists order_items_order_id_idx
  on public.order_items (order_id);
