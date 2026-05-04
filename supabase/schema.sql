-- ምርት tech: Supabase schema and RLS policies
-- Run this in Supabase SQL editor.

create type public.user_role as enum ('farmer', 'exporter');
alter type public.user_role add value if not exists 'admin';
create type public.verification_status as enum ('Pending', 'Verified', 'Rejected');
create type public.deal_status as enum ('Active', 'Confirmed', 'Disputed');
create type public.payment_status as enum ('Pending', 'Partial', 'Completed');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  full_name text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.farmers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  location text not null,
  status public.verification_status not null default 'Pending',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.exporters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  phone text not null,
  license_id text not null,
  certificate_name text,
  status public.verification_status not null default 'Pending',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  farmer_user_id uuid not null references auth.users(id) on delete cascade,
  exporter_user_id uuid not null references auth.users(id) on delete cascade,
  crop_type text not null,
  price_per_unit numeric(12,2) not null,
  estimated_quantity numeric(12,2) not null,
  estimated_value numeric(14,2) not null,
  contract_date date,
  delivery_date date,
  status public.deal_status not null default 'Active',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  payer_user_id uuid not null references auth.users(id) on delete cascade,
  payee_user_id uuid not null references auth.users(id) on delete cascade,
  gross_amount numeric(14,2) not null,
  commission_rate numeric(5,2) not null default 4.5,
  commission_value numeric(14,2) not null,
  payout_amount numeric(14,2) not null,
  status public.payment_status not null default 'Pending',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  farmer_user_id uuid not null references auth.users(id) on delete cascade,
  crop_type text not null,
  description text,
  quantity numeric(12,2) not null,
  price_per_unit numeric(12,2) not null,
  image_url text,
  status text not null default 'Available',
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.farmers enable row level security;
alter table public.exporters enable row level security;
alter table public.deals enable row level security;
alter table public.payments enable row level security;
alter table public.products enable row level security;

-- profiles policies
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "profiles select admin" on public.profiles;
create policy "profiles select admin" on public.profiles
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
for update using (auth.uid() = id)
with check (auth.uid() = id);

-- farmers policies (owner only)
drop policy if exists "farmers select own" on public.farmers;
create policy "farmers select own" on public.farmers
for select using (auth.uid() = user_id);

drop policy if exists "farmers select admin" on public.farmers;
create policy "farmers select admin" on public.farmers
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "farmers select exporter" on public.farmers;
create policy "farmers select exporter" on public.farmers
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'exporter'
  )
);

drop policy if exists "farmers insert own" on public.farmers;
create policy "farmers insert own" on public.farmers
for insert with check (auth.uid() = user_id);

drop policy if exists "farmers update own" on public.farmers;
create policy "farmers update own" on public.farmers
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- exporters policies (owner only)
drop policy if exists "exporters select own" on public.exporters;
create policy "exporters select own" on public.exporters
for select using (auth.uid() = user_id);

drop policy if exists "exporters select admin" on public.exporters;
create policy "exporters select admin" on public.exporters
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "exporters insert own" on public.exporters;
create policy "exporters insert own" on public.exporters
for insert with check (auth.uid() = user_id);

drop policy if exists "exporters update own" on public.exporters;
create policy "exporters update own" on public.exporters
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- deals policies (only participants can read; participant owner can create/update their side)
drop policy if exists "deals select participant" on public.deals;
create policy "deals select participant" on public.deals
for select using (auth.uid() = farmer_user_id or auth.uid() = exporter_user_id);

drop policy if exists "deals select admin" on public.deals;
create policy "deals select admin" on public.deals
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "deals insert participant" on public.deals;
create policy "deals insert participant" on public.deals
for insert with check (auth.uid() = farmer_user_id or auth.uid() = exporter_user_id);

drop policy if exists "deals update participant" on public.deals;
create policy "deals update participant" on public.deals
for update using (auth.uid() = farmer_user_id or auth.uid() = exporter_user_id)
with check (auth.uid() = farmer_user_id or auth.uid() = exporter_user_id);

-- payments policies (payer/payee can access)
drop policy if exists "payments select participant" on public.payments;
create policy "payments select participant" on public.payments
for select using (auth.uid() = payer_user_id or auth.uid() = payee_user_id);

drop policy if exists "payments select admin" on public.payments;
create policy "payments select admin" on public.payments
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "payments insert payer" on public.payments;
create policy "payments insert payer" on public.payments
for insert with check (auth.uid() = payer_user_id);

drop policy if exists "payments update participant" on public.payments;
create policy "payments update participant" on public.payments
for update using (auth.uid() = payer_user_id or auth.uid() = payee_user_id)
with check (auth.uid() = payer_user_id or auth.uid() = payee_user_id);

-- products policies (farmers can manage their own; exporters and admin can view)
drop policy if exists "products select all" on public.products;
create policy "products select all" on public.products
for select using (true);

drop policy if exists "products insert farmer" on public.products;
create policy "products insert farmer" on public.products
for insert with check (auth.uid() = farmer_user_id);

drop policy if exists "products update farmer" on public.products;
create policy "products update farmer" on public.products
for update using (auth.uid() = farmer_user_id)
with check (auth.uid() = farmer_user_id);

drop policy if exists "products delete farmer" on public.products;
create policy "products delete farmer" on public.products
for delete using (auth.uid() = farmer_user_id);
