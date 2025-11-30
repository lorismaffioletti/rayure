-- Add fields to products table
alter table products
  add column if not exists initial_price_ht numeric,
  add column if not exists initial_vat_rate numeric,
  add column if not exists initial_quantity integer default 0,
  add column if not exists unit text default 'unité';

-- Create product deliveries table
create table if not exists product_deliveries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  delivery_date date not null,
  quantity integer not null,
  purchase_price_ht numeric not null,
  purchase_price_ttc numeric generated always as (
    purchase_price_ht * (1 + coalesce((select initial_vat_rate from products where id = product_id), 0.20))
  ) stored,
  supplier_name text,
  invoice_number text,
  notes text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_product_deliveries_product on product_deliveries(product_id);
create index if not exists idx_product_deliveries_date on product_deliveries(delivery_date);

-- RLS (temporairement permissif pour le dev)
alter table product_deliveries enable row level security;

create policy product_deliveries_all_access on product_deliveries for all using (true) with check (true);

