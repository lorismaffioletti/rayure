-- === Barmans (Staff) ===
create table if not exists barmans (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text,
  email text,
  date_of_birth date,
  created_at timestamptz not null default now()
);

-- === Event Staff (relation many-to-many avec horaires) ===
create table if not exists event_staff (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  barman_id uuid not null references barmans(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  hours_worked numeric generated always as (
    extract(epoch from (end_time - start_time)) / 3600
  ) stored,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_event_staff_event on event_staff(event_id);
create index if not exists idx_event_staff_barman on event_staff(barman_id);

-- RLS (temporairement permissif pour le dev)
alter table barmans enable row level security;
alter table event_staff enable row level security;

create policy barmans_all_access on barmans for all using (true) with check (true);
create policy event_staff_all_access on event_staff for all using (true) with check (true);

