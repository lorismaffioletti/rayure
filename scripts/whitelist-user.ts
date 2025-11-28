import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // ⚠️ ne jamais committer cette clé

if (!url || !key) {
  console.error(
    '❌ Erreur: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local',
  );
  process.exit(1);
}

const supabase = createClient(url, key);

async function whitelistUser(email: string, role: string = 'member') {
  try {
    const { data, error } = await supabase
      .from('allowed_users')
      .upsert(
        { email, role },
        {
          onConflict: 'email',
        },
      )
      .select();

    if (error) {
      console.error('❌ Erreur lors de l\'ajout à la whitelist:', error.message);
      process.exit(1);
    }

    console.log(`✅ Utilisateur ${email} ajouté à la whitelist avec le rôle "${role}"`);
    console.log('📋 Données:', data);
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

// Récupérer l'email depuis les arguments de la ligne de commande
const email = process.argv[2];
const role = process.argv[3] || 'member';

if (!email) {
  console.error('❌ Usage: npm run whitelist <email> [role]');
  console.error('   Exemple: npm run whitelist user@example.com owner');
  process.exit(1);
}

whitelistUser(email, role);

