-- Lucky's Loot customer account migration
-- Run this in the Supabase SQL editor after the existing schema/checkout migration.

alter table public.customers
  add column if not exists first_name text,
  add column if not exists last_name text;

update public.customers
set
  first_name = coalesce(first_name, nullif(split_part(coalesce(full_name, ''), ' ', 1), '')),
  last_name = coalesce(
    last_name,
    nullif(trim(regexp_replace(coalesce(full_name, ''), '^[^ ]+ ?', '')), '')
  )
where full_name is not null;

alter table public.orders
  add column if not exists order_number text,
  add column if not exists payment_status text,
  add column if not exists fulfillment_status text,
  add column if not exists discount_cents integer not null default 0 check (discount_cents >= 0),
  add column if not exists shipping_method text,
  add column if not exists tracking_number text,
  add column if not exists tracking_url text;

alter table public.order_items
  alter column product_id drop not null,
  drop constraint if exists order_items_product_id_fkey,
  add constraint order_items_product_id_fkey
    foreign key (product_id) references public.products(id) on delete set null,
  add column if not exists variant_id text,
  add column if not exists product_name text not null default '',
  add column if not exists product_image text,
  add column if not exists variant_name text,
  add column if not exists options jsonb not null default '{}'::jsonb,
  add column if not exists total_price_cents integer not null default 0 check (total_price_cents >= 0);

update public.order_items
set total_price_cents = unit_price_cents * quantity
where total_price_cents = 0;

create unique index if not exists orders_order_number_unique_idx
  on public.orders(order_number)
  where order_number is not null;

create index if not exists orders_order_number_idx on public.orders(order_number);
create index if not exists order_items_order_idx on public.order_items(order_id);

create or replace function public.sync_auth_user_customer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_first_name text := nullif(new.raw_user_meta_data ->> 'first_name', '');
  profile_last_name text := nullif(new.raw_user_meta_data ->> 'last_name', '');
  profile_full_name text := nullif(trim(concat_ws(' ', profile_first_name, profile_last_name)), '');
begin
  insert into public.customers (id, email, first_name, last_name, full_name, updated_at)
  values (
    new.id,
    coalesce(new.email, ''),
    profile_first_name,
    profile_last_name,
    profile_full_name,
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = coalesce(excluded.first_name, public.customers.first_name),
    last_name = coalesce(excluded.last_name, public.customers.last_name),
    full_name = coalesce(excluded.full_name, public.customers.full_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_auth_user_customer_profile on auth.users;
create trigger sync_auth_user_customer_profile
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.sync_auth_user_customer();

drop policy if exists "Customers insert own profile" on public.customers;
create policy "Customers insert own profile"
on public.customers for insert with check (id = auth.uid());
