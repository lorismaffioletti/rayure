import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface QuickLink {
  id: string;
  name: string;
  url: string;
  favicon_url: string | null;
  created_at: string;
}

export async function getQuickLinks() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('quick_links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des liens rapides: ${error.message}`);
  }

  return (data || []) as QuickLink[];
}

