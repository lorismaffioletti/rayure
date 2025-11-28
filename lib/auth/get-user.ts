import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Vérifier si l'utilisateur est whitelisté
  const { data: allowedUser } = await supabase
    .from('allowed_users')
    .select('email, role')
    .eq('email', user.email)
    .single();

  if (!allowedUser) {
    return null;
  }

  return {
    id: user.id,
    email: user.email!,
    role: allowedUser.role,
  };
}

