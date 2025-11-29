import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !key) {
  console.error('❌ Erreur: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis');
  process.exit(1);
}

const supabase = createClient(url, key);

async function debugWhitelist() {
  console.log('🔍 Vérification de la whitelist...\n');

  // Lister tous les utilisateurs whitelistés
  const { data: allUsers, error: listError } = await supabase
    .from('allowed_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (listError) {
    console.error('❌ Erreur lors de la récupération:', listError.message);
    process.exit(1);
  }

  console.log(`📋 Utilisateurs whitelistés (${allUsers?.length || 0}):`);
  if (allUsers && allUsers.length > 0) {
    allUsers.forEach((user) => {
      console.log(`  - ${user.email} (rôle: ${user.role})`);
    });
  } else {
    console.log('  Aucun utilisateur trouvé');
  }

  // Vérifier spécifiquement l'email
  const email = 'loris@coupdepression.fr';
  console.log(`\n🔎 Recherche de: ${email}`);

  const { data: foundUser, error: findError } = await supabase
    .from('allowed_users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (findError) {
    console.error('❌ Erreur lors de la recherche:', findError.message);
  } else if (foundUser) {
    console.log(`✅ Utilisateur trouvé:`, foundUser);
  } else {
    console.log(`❌ Utilisateur non trouvé`);
    console.log(`\n💡 Pour ajouter l'utilisateur, exécutez:`);
    console.log(`   INSERT INTO allowed_users (email, role) VALUES ('${email}', 'owner')`);
  }
}

debugWhitelist().catch((err) => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});

