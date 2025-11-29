import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Expense } from '@/types/database';

export async function getExpenses() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('notes_frais')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des notes de frais: ${error.message}`);
  }

  return (data || []) as Expense[];
}

