-- === Enums ===
create type company_type as enum ('mairie','agence','entreprise','autre');
create type interaction_type as enum ('appel','email','sms','rdv');
create type event_status as enum ('prospect','negociation','validé','perdu','terminé','consolidé');

-- === Whitelist utilisateurs ===
create table if not exists allowed_users (
  email text primary key,
  role text not null default 'member',
  created_at timestamptz not null default now()
);

-- === Companies ===
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type company_type not null default 'autre',
  logo_url text,
  created_at timestamptz not null default now()
);

-- === Contacts ===
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  role text,
  created_at timestamptz not null default now()
);

-- === Contact interactions ===
create table if not exists contact_interactions (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts(id) on delete cascade,
  type interaction_type not null,
  date timestamptz not null,
  content text,
  created_at timestamptz not null default now()
);

-- === Events ===
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  date timestamptz,
  assigned_company_id uuid references companies(id) on delete set null,
  assigned_contact_id uuid references contacts(id) on delete set null,
  status event_status not null default 'prospect',
  ca_ht numeric,
  staff text[],
  rh_hours numeric default 0,
  rh_cost numeric generated always as (coalesce(rh_hours,0) * 14.5) stored,
  stock_used jsonb,
  created_at timestamptz not null default now()
);

-- === Event notes ===
create table if not exists event_notes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  content text,
  created_at timestamptz not null default now()
);

-- === Products ===
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  supplier_name text,
  created_at timestamptz not null default now()
);

-- === Product prices (historique) ===
create table if not exists product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  price_ht numeric not null,
  price_ttc numeric not null,
  vat_rate numeric not null,
  created_at timestamptz not null default now()
);

-- === Notes de frais ===
create table if not exists notes_frais (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount_ht numeric not null,
  vat_rate numeric not null,
  amount_ttc numeric not null,
  date date not null,
  receipt_url text,
  created_at timestamptz not null default now()
);

-- === Tasks ===
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  priority int not null check (priority between 1 and 3),
  due_date date,
  is_done boolean not null default false,
  created_at timestamptz not null default now(),
  done_at timestamptz
);

-- === Quick links ===
create table if not exists quick_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  favicon_url text,
  created_at timestamptz not null default now()
);

-- === Indexes clés ===
create index if not exists idx_contacts_company on contacts(company_id);
create index if not exists idx_events_company on events(assigned_company_id);
create index if not exists idx_events_contact on events(assigned_contact_id);
create index if not exists idx_prices_product on product_prices(product_id);

-- === Full-Text Search (FR) ===
alter table companies add column if not exists search tsvector;
alter table contacts add column if not exists search tsvector;
alter table events add column if not exists search tsvector;
alter table products add column if not exists search tsvector;

create index if not exists companies_search_idx on companies using gin (search);
create index if not exists contacts_search_idx on contacts using gin (search);
create index if not exists events_search_idx on events using gin (search);
create index if not exists products_search_idx on products using gin (search);

create or replace function set_search_companies() returns trigger as $$
begin
  new.search := to_tsvector('french', coalesce(new.name,''));
  return new;
end; $$ language plpgsql;

create or replace function set_search_contacts() returns trigger as $$
begin
  new.search := to_tsvector('french', coalesce(new.first_name,'') || ' ' || coalesce(new.last_name,'') || ' ' || coalesce(new.email,'') || ' ' || coalesce(new.phone,''));
  return new;
end; $$ language plpgsql;

create or replace function set_search_events() returns trigger as $$
begin
  new.search := to_tsvector('french', coalesce(new.title,'') || ' ' || coalesce(new.description,'') || ' ' || coalesce(new.location,''));
  return new;
end; $$ language plpgsql;

create or replace function set_search_products() returns trigger as $$
begin
  new.search := to_tsvector('french', coalesce(new.name,'') || ' ' || coalesce(new.supplier_name,''));
  return new;
end; $$ language plpgsql;

drop trigger if exists companies_search_tg on companies;
create trigger companies_search_tg before insert or update on companies
for each row execute function set_search_companies();

drop trigger if exists contacts_search_tg on contacts;
create trigger contacts_search_tg before insert or update on contacts
for each row execute function set_search_contacts();

drop trigger if exists events_search_tg on events;
create trigger events_search_tg before insert or update on events
for each row execute function set_search_events();

drop trigger if exists products_search_tg on products;
create trigger products_search_tg before insert or update on products
for each row execute function set_search_products();

-- === RLS ===
alter table allowed_users enable row level security;
alter table companies enable row level security;
alter table contacts enable row level security;
alter table contact_interactions enable row level security;
alter table events enable row level security;
alter table event_notes enable row level security;
alter table products enable row level security;
alter table product_prices enable row level security;
alter table notes_frais enable row level security;
alter table tasks enable row level security;
alter table quick_links enable row level security;

-- helper: vérifie que l'email JWT est whitelisté
create or replace function is_whitelisted() returns boolean as $$
  select exists(
    select 1 from allowed_users
    where email = coalesce(nullif(current_setting('request.jwt.claims', true)::jsonb->>'email',''), '')
  );
$$ language sql stable;

-- Lecture/écriture pour utilisateurs authentifiés et whitelistés
-- === RLS : policies par commande (fix) ===
-- Prérequis : RLS déjà activée sur les tables (ton script le fait plus haut)
-- Helper (déjà défini) : is_whitelisted()

do $$
declare
  t record;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename in (
        'companies','contacts','contact_interactions','events','event_notes',
        'products','product_prices','notes_frais','tasks','quick_links'
      )
  loop
    -- nettoyer d’anciennes policies
    execute format('drop policy if exists %I_select on %I;',  t.tablename || '_select',  t.tablename);
    execute format('drop policy if exists %I_insert on %I;',  t.tablename || '_insert',  t.tablename);
    execute format('drop policy if exists %I_update on %I;',  t.tablename || '_update',  t.tablename);
    execute format('drop policy if exists %I_delete on %I;',  t.tablename || '_delete',  t.tablename);

    -- recréer une policy par type de commande
    execute format(
      'create policy %I_select on %I for select using (auth.role() = ''authenticated'' and is_whitelisted());',
      t.tablename || '_select', t.tablename
    );

    execute format(
      'create policy %I_insert on %I for insert with check (auth.role() = ''authenticated'' and is_whitelisted());',
      t.tablename || '_insert', t.tablename
    );

    execute format(
      'create policy %I_update on %I for update using (auth.role() = ''authenticated'' and is_whitelisted());',
      t.tablename || '_update', t.tablename
    );

    execute format(
      'create policy %I_delete on %I for delete using (auth.role() = ''authenticated'' and is_whitelisted());',
      t.tablename || '_delete', t.tablename
    );
  end loop;
end$$;