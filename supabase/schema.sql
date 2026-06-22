-- Lucky's Loot Supabase schema
-- Run this in the Supabase SQL editor after creating the project.

create extension if not exists pgcrypto;

create type public.product_status as enum ('in_stock', 'low_stock', 'preorder', 'sold_out');
create type public.order_status as enum ('draft', 'paid', 'fulfillment', 'shipped', 'cancelled', 'refunded');
create type public.layout_visibility as enum ('private', 'shared', 'public');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  accent text not null default '#d6b35f',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  compare_at_price_cents integer check (compare_at_price_cents >= 0),
  status public.product_status not null default 'in_stock',
  featured boolean not null default false,
  best_seller boolean not null default false,
  specs jsonb not null default '[]'::jsonb,
  fitment jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt text not null,
  angle_label text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.inventory (
  product_id uuid primary key references public.products(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  low_stock_threshold integer not null default 10 check (low_stock_threshold >= 0),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  full_name text,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'fulfillment', 'analyst')),
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  order_number text unique,
  status public.order_status not null default 'draft',
  payment_status text,
  fulfillment_status text,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  stripe_payment_status text,
  customer_email text,
  customer_name text,
  pickup_notes text,
  checkout_items jsonb not null default '[]'::jsonb,
  subtotal_cents integer not null default 0 check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  shipping_method text,
  shipping_address jsonb,
  billing_address jsonb,
  tracking_number text,
  tracking_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id text,
  product_name text not null default '',
  product_image text,
  variant_name text,
  options jsonb not null default '{}'::jsonb,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  total_price_cents integer not null default 0 check (total_price_cents >= 0),
  created_at timestamptz not null default now()
);

create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

create table public.saved_shelf_layouts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  title text not null,
  visibility public.layout_visibility not null default 'private',
  share_slug text unique,
  layout jsonb not null,
  preview_image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_collection_builds (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  title text not null,
  visibility public.layout_visibility not null default 'private',
  share_slug text unique,
  counts jsonb not null,
  generated_plan jsonb not null,
  preview_image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inspiration_gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  storage_path text not null,
  alt text not null,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_recommendations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  recommended_product_id uuid not null references public.products(id) on delete cascade,
  reason text not null default '',
  sort_order integer not null default 0,
  unique (product_id, recommended_product_id)
);

create table public.product_notifications (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  notify_when text not null check (notify_when in ('restocked', 'price_drop', 'launch')),
  created_at timestamptz not null default now(),
  unique (customer_id, product_id, notify_when)
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

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

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory enable row level security;
alter table public.customers enable row level security;
alter table public.admin_users enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.saved_shelf_layouts enable row level security;
alter table public.saved_collection_builds enable row level security;
alter table public.inspiration_gallery enable row level security;
alter table public.product_recommendations enable row level security;
alter table public.product_notifications enable row level security;

create policy "Public can read categories"
on public.categories for select using (true);

create policy "Public can read active products"
on public.products for select using (true);

create policy "Public can read product images"
on public.product_images for select using (true);

create policy "Public can read inspiration"
on public.inspiration_gallery for select using (true);

create policy "Public can read recommendations"
on public.product_recommendations for select using (true);

create policy "Public can read inventory quantities"
on public.inventory for select using (true);

create policy "Admins manage catalog"
on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage products"
on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage product images"
on public.product_images for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage inventory"
on public.inventory for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage inspiration"
on public.inspiration_gallery for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage recommendations"
on public.product_recommendations for all using (public.is_admin()) with check (public.is_admin());

create policy "Customers read own profile"
on public.customers for select using (id = auth.uid() or public.is_admin());

create policy "Customers insert own profile"
on public.customers for insert with check (id = auth.uid());

create policy "Customers update own profile"
on public.customers for update using (id = auth.uid()) with check (id = auth.uid());

create policy "Customers read own orders"
on public.orders for select using (customer_id = auth.uid() or public.is_admin());

create policy "Admins manage orders"
on public.orders for all using (public.is_admin()) with check (public.is_admin());

create policy "Customers read own order items"
on public.order_items for select using (
  public.is_admin()
  or exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and orders.customer_id = auth.uid()
  )
);

create policy "Admins manage order items"
on public.order_items for all using (public.is_admin()) with check (public.is_admin());

create policy "Customers manage own wishlist"
on public.wishlist_items for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create policy "Customers manage own shelf layouts"
on public.saved_shelf_layouts for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create policy "Shared shelf layouts can be read"
on public.saved_shelf_layouts for select using (visibility in ('shared', 'public'));

create policy "Customers manage own collection builds"
on public.saved_collection_builds for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create policy "Shared collection builds can be read"
on public.saved_collection_builds for select using (visibility in ('shared', 'public'));

create policy "Customers manage own notifications"
on public.product_notifications for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create policy "Admins read all customers"
on public.customers for select using (public.is_admin());

create policy "Admins manage admin users"
on public.admin_users for all using (public.is_admin()) with check (public.is_admin());

create index categories_slug_idx on public.categories(slug);
create index products_slug_idx on public.products(slug);
create index products_category_idx on public.products(category_id);
create index orders_customer_idx on public.orders(customer_id);
create index orders_order_number_idx on public.orders(order_number);
create index orders_stripe_checkout_idx on public.orders(stripe_checkout_session_id);
create index order_items_order_idx on public.order_items(order_id);
create index wishlist_customer_idx on public.wishlist_items(customer_id);
create index saved_shelf_customer_idx on public.saved_shelf_layouts(customer_id);
create index saved_collection_customer_idx on public.saved_collection_builds(customer_id);
