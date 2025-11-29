-- Script pour désactiver RLS temporairement en développement
-- ⚠️ À NE PAS UTILISER EN PRODUCTION
-- Exécutez ce script dans Supabase SQL Editor

-- Supprimer les politiques existantes
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
    execute format('drop policy if exists %I_select on %I;',  t.tablename || '_select',  t.tablename);
    execute format('drop policy if exists %I_insert on %I;',  t.tablename || '_insert',  t.tablename);
    execute format('drop policy if exists %I_update on %I;',  t.tablename || '_update',  t.tablename);
    execute format('drop policy if exists %I_delete on %I;',  t.tablename || '_delete',  t.tablename);
  end loop;
end$$;

-- Créer des politiques permissives pour le développement
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
    execute format('create policy %I_select on %I for select using (true);', t.tablename || '_select', t.tablename);
    execute format('create policy %I_insert on %I for insert with check (true);', t.tablename || '_insert', t.tablename);
    execute format('create policy %I_update on %I for update using (true);', t.tablename || '_update', t.tablename);
    execute format('create policy %I_delete on %I for delete using (true);', t.tablename || '_delete', t.tablename);
  end loop;
end$$;

