# Rayure
CRM & outil d'exploitation interne (mobile-first).

## Setup
1. Copier `.env.example` → `.env.local` et renseigner `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. (Optionnel seed) Exporter `SUPABASE_SERVICE_ROLE_KEY` dans l'environnement.
3. Installer : `npm i` (ou `pnpm i`/`yarn`).
4. Lancer : `npm run dev`.

## Données
- Appliquer la migration `supabase/migrations/0001_init.sql` via Supabase (SQL editor/CLI).
- Seed : `npm run seed`.

## Développement
- `npm run lint` / `npm run typecheck`
- Scaffolding complet : utiliser le **Master Prompt** (Rayure) dans Cursor.

