# MASTER PROMPT — LANCEMENT PROJET « RAYURE »

**Rôle & mode opératoire**
- Commence par un **plan synthétique** (sections, tâches, ordre). Demande validation avant opérations destructives (migrations, push).
- Commits atomiques (Conventional Commits). Exécute commandes depuis le terminal intégré.

## 0) Contexte & objectif
Web app **mobile-first** nommée **Rayure** (CRM + exploitation Beer Truck).
- Clients/entreprises/contacts + timeline d’interactions
- Pipeline d’opportunités (Kanban)
- Événements (CA, staff, heures RH × 14,50€, stock consommé)
- Produits + historiques de prix
- Notes de frais (upload → Supabase Storage)
- Dashboard + to-do + liens + recherche
- Auth multi-utilisateur (V1 simple), interne
- Environnements dev/prod
- Futur : Google Agenda, push notifs

## 1) Stack & structure
- Next.js 15 + React + **TypeScript strict**
- Tailwind + **shadcn/ui**
- Supabase (Auth/DB/Storage)
- dnd-kit, react-day-picker
- Dossiers: /app, /components, /lib, /styles, /types, /features, /supabase, /scripts
- ESLint + Prettier, alias `@/*`

## 2) Données (Supabase)
Tables: companies, contacts, contact_interactions, events (FTS + rh_cost = rh_hours × 14.5), event_notes, products, product_prices, notes_frais, tasks, quick_links.  
RLS: utilisateurs authentifiés **et** whitelisted via `allowed_users(email, role)`.  
Storage buckets: `receipts`, `logos`.  
Migrations: `supabase/migrations/0001_init.sql` + seed `scripts/seed.ts`.

## 3) Pages & fonctionnalités
- **/** Dashboard: résumé semaine, CA (hors perdu), progression M/M-1, ville la plus active, tâches urgentes, liens rapides, recherche globale.
- **/crm/companies** liste+filtres, fiche: infos, contacts, événements liés, notes, timeline fusionnée, “Ajouter interaction”
- **/crm/contacts** liste+recherche+filtre entreprise, fiche: timeline + FAB “appel/mail/sms/rdv”
- **/events** Kanban (Prospect → Consolidé) via dnd-kit; fiche avec coûts RH auto, notes, “Copier message staff”, “Consolider”
- **/products** liste (nom, fournisseur, dernier prix), fiche + historique, “Ajouter prix”
- **/expenses** notes de frais + upload (receipts)
- **/tasks** to-do + historique
- **/search** FTS unifiée

**Auth** Supabase email/password (MDP fort), pas de 2FA V1. Middleware de protection.

## 4) Qualité & DX
TS strict, a11y basique, tests minimaux (utilitaires + 1 test DB).

## 5) Env & secrets
`.env.example` → `.env.local` (SUPABASE_URL/ANON). `next.config.js` avec `NEXT_PUBLIC_…` si requis.

## 6) Git & CI
`git init` → commit init → demander URL remote → push. (Optionnel) CI lint+typecheck.

## 7) DoD
App démarre, auth/routing OK, migrations prêtes/appliquées, FTS OK, responsive mobile-first, README présent.

### Démarre maintenant
1) Affiche le **plan**.
2) Scaffolding + configs + Supabase client + pages de base.
3) Génère migrations SQL + seed.
4) Crée `.cursorrules` et `.env.example`, init Git, prépare push.
