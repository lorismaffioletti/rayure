-- === Event Inventory (produits vendus par événement) ===
create table if not exists event_inventory (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  sale_price_ht numeric not null,
  sale_price_ttc numeric not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_event_inventory_event on event_inventory(event_id);
create index if not exists idx_event_inventory_product on event_inventory(product_id);

-- RLS (temporairement permissif pour le dev)
alter table event_inventory enable row level security;

create policy event_inventory_all_access on event_inventory for all using (true) with check (true);

