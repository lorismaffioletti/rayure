# Rayure — Bootstrap multi-fichiers (pour Cursor)

> **Instruction** (à l'attention de l'Agent Cursor) : pour **chaque bloc** ci-dessous au format
> ```file:path=...```, **crée/écrase** le fichier à ce chemin avec **exactement** ce contenu.

```file:path=.cursorrules
# Cursor Rules — Rayure

## Objectifs
- Respecter le brief “Rayure” (CRM, événements, produits, notes de frais, to-do, recherche) et les écrans listés.
- Priorité à la clarté, maintenabilité et mobile-first.

## Stack
- Next.js 15 + TypeScript strict, Tailwind, shadcn/ui, Supabase (Auth/DB/Storage).
- dnd-kit (Kanban), react-day-picker (calendrier).

## Architecture & Code
- Dossiers: /app, /components, /features, /lib, /supabase, /types, /styles, /scripts.
- Server Components par défaut; Client Components uniquement si nécessaire (DND, formulaires).
- Types exhaustifs, pas de `any` sauf commentaire justifié.
- Formatage: Prettier; ESLint sans warnings à la CI.
- Nommage fichiers: kebab-case; composants React en PascalCase.
- Pas de secrets en dur; utilise `process.env`.

## Données & Sécurité
- RLS activées par défaut; accès uniquement utilisateurs authentifiés.
- Liste blanche via table `allowed_users(email, role)` pour Rayure.
- Index, FTS et migrations versionnées dans /supabase/migrations.
- Évolution de schéma = migration obligatoire.

## UI/UX
- Mobile-first; bottom nav; sidebar desktop.
- shadcn/ui pour composants; cards, modals, listes, formulaires cohérents.
- Accessibilité: labels, aria-*, contrastes raisonnables.

## Git
- Commits Conventional Commits (feat, fix, chore, refactor, docs, test).
- PR/commits atomiques; inclure “why” si décision technique.

## Interaction avec l’Agent
- Toujours proposer un plan avant large refactor (>10 fichiers).
- Demander validation avant: migrations, suppression de fichiers, push.

```

```file:path=.env.example
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# (Optionnel pour seeds/migrations locales – ne jamais committer)
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_NAME=Rayure
NEXT_PUBLIC_ENV=development

```

```file:path=package.json
{
  "name": "rayure",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "seed": "tsx scripts/seed.ts"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "typescript": "latest",
    "@supabase/supabase-js": "latest",
    "@supabase/ssr": "latest",
    "zod": "latest",
    "clsx": "latest",
    "class-variance-authority": "latest",
    "@dnd-kit/core": "latest",
    "@dnd-kit/sortable": "latest",
    "@dnd-kit/utilities": "latest",
    "react-day-picker": "latest",
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest"
  },
  "devDependencies": {
    "eslint": "latest",
    "eslint-config-next": "latest",
    "eslint-config-prettier": "latest",
    "prettier": "latest",
    "tsx": "latest"
  }
}
```

```file:path=.gitignore
# Node / Next
node_modules
.next
out
# Env
.env*
!.env.example
# Misc
.DS_Store

```

```file:path=.editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

```

```file:path=.eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {}
}
```

```file:path=prettier.config.cjs
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
};

```

```file:path=tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "allowJs": false,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

```file:path=next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
};

module.exports = nextConfig;

```

```file:path=tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;

```

```file:path=postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

```

```file:path=styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light dark; }
html, body, #__next { height: 100%; }

```

```file:path=app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rayure',
  description: 'CRM & ops interne (mobile-first)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh bg-white text-neutral-900 antialiased">
        <main className="pb-16">{children}</main>
        {/* Bottom nav mobile simple (placeholder) */}
        <nav className="fixed inset-x-0 bottom-0 border-t bg-white">
          <ul className="mx-auto flex max-w-md items-center justify-between px-6 py-3 text-sm">
            <li><Link href="/">Dashboard</Link></li>
            <li><Link href="/crm/companies">CRM</Link></li>
            <li><Link href="/events">Événements</Link></li>
            <li><Link href="/tasks">Tâches</Link></li>
          </ul>
        </nav>
      </body>
    </html>
  );
}

```

```file:path=app/page.tsx
export default function Page() {
  return (
    <section className="mx-auto max-w-3xl p-6">
      <h1 className="mb-2 text-2xl font-bold">Rayure</h1>
      <p className="text-neutral-600">
        Bienvenue ! Cette base démarre le projet (Next + TS + Tailwind). Utilise le Master Prompt
        pour scaffolder le CRM (tables, écrans, Kanban, etc.).
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a className="rounded border p-4" href="/crm/companies">CRM — Entreprises</a>
        <a className="rounded border p-4" href="/crm/contacts">CRM — Contacts</a>
        <a className="rounded border p-4" href="/events">Événements (Kanban)</a>
        <a className="rounded border p-4" href="/products">Produits</a>
        <a className="rounded border p-4" href="/expenses">Notes de frais</a>
        <a className="rounded border p-4" href="/tasks">Tâches</a>
      </div>
    </section>
  );
}

```

```file:path=lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

```

```file:path=lib/supabase/server.ts
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    },
  );
  return supabase;
}

```

```file:path=supabase/migrations/0001_init.sql
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
do $$
declare
  t record;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename in ('companies','contacts','contact_interactions','events','event_notes','products','product_prices','notes_frais','tasks','quick_links')
  loop
    execute format('drop policy if exists %I_select on %I;', t.tablename || '_select', t.tablename);
    execute format('drop policy if exists %I_write on %I;', t.tablename || '_write', t.tablename);
    execute format('create policy %I_select on %I for select using (auth.role() = ''authenticated'' and is_whitelisted());', t.tablename || '_select', t.tablename);
    execute format('create policy %I_write on %I for insert with check (auth.role() = ''authenticated'' and is_whitelisted())', t.tablename || '_write', t.tablename);
    execute format('alter policy %I_write on %I add for update using (auth.role() = ''authenticated'' and is_whitelisted());', t.tablename || '_write', t.tablename);
    execute format('alter policy %I_write on %I add for delete using (auth.role() = ''authenticated'' and is_whitelisted());', t.tablename || '_write', t.tablename);
  end loop;
end$$;

-- === Buckets Storage ===
select storage.create_bucket('receipts', true, false); -- public=false
select storage.create_bucket('logos', true, false);

-- RLS sur storage.objects (lecture/écriture si whitelisté)
create policy receipts_read on storage.objects for select
  using (bucket_id = 'receipts' and auth.role() = 'authenticated' and is_whitelisted());
create policy receipts_write on storage.objects for insert
  with check (bucket_id = 'receipts' and auth.role() = 'authenticated' and is_whitelisted());
create policy receipts_delete on storage.objects for delete
  using (bucket_id = 'receipts' and auth.role() = 'authenticated' and is_whitelisted());

create policy logos_read on storage.objects for select
  using (bucket_id = 'logos' and auth.role() = 'authenticated' and is_whitelisted());
create policy logos_write on storage.objects for insert
  with check (bucket_id = 'logos' and auth.role() = 'authenticated' and is_whitelisted());
create policy logos_delete on storage.objects for delete
  using (bucket_id = 'logos' and auth.role() = 'authenticated' and is_whitelisted());

```

```file:path=scripts/seed.ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // ⚠️ ne jamais committer cette clé
const supabase = createClient(url, key);

async function main() {
  // whitelist de base (remplace par tes emails)
  await supabase.from('allowed_users').upsert([
    { email: 'toi@example.com', role: 'owner' },
  ]);

  const { data: company } = await supabase.from('companies').insert({
    name: 'Mairie de Démo',
    type: 'mairie',
  }).select().single();

  const { data: contact } = await supabase.from('contacts').insert({
    company_id: company?.id,
    first_name: 'Alice',
    last_name: 'Martin',
    email: 'alice@demo.fr',
  }).select().single();

  await supabase.from('events').insert({
    title: 'Beer Truck — Marché de Printemps',
    location: 'Lyon',
    status: 'prospect',
    assigned_company_id: company?.id,
    assigned_contact_id: contact?.id,
    ca_ht: 1200,
    rh_hours: 8,
  });

  await supabase.from('products').insert({
    name: 'Fût Blonde 30L',
    supplier_name: 'Brasserie Demo',
  });

  await supabase.from('tasks').insert({
    title: 'Rappeler Alice',
    priority: 2,
  });

  console.log('Seed terminé ✅');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

```

```file:path=README.md
# Rayure
CRM & outil d’exploitation interne (mobile-first).

## Setup
1. Copier `.env.example` → `.env.local` et renseigner `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. (Optionnel seed) Exporter `SUPABASE_SERVICE_ROLE_KEY` dans l’environnement.
3. Installer : `npm i` (ou `pnpm i`/`yarn`).
4. Lancer : `npm run dev`.

## Données
- Appliquer la migration `supabase/migrations/0001_init.sql` via Supabase (SQL editor/CLI).
- Seed : `npm run seed`.

## Développement
- `npm run lint` / `npm run typecheck`
- Scaffolding complet : utiliser le **Master Prompt** (Rayure) dans Cursor.

```
