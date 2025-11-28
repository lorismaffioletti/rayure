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

