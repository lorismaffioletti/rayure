import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Barman } from '@/types/database';

export async function getBarmans() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('barmans')
    .select('*')
    .order('last_name', { ascending: true });

  if (error) {
    throw new Error(`Erreur lors de la récupération des barmans: ${error.message}`);
  }

  return (data || []) as Barman[];
}

export async function getBarmanById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('barmans')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Erreur lors de la récupération du barman: ${error.message}`);
  }

  return data as Barman;
}

