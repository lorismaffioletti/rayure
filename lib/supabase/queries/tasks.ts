import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Task } from '@/types/database';

export async function getTasks() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('is_done', { ascending: true })
    .order('priority', { ascending: true })
    .order('due_date', { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des tâches: ${error.message}`);
  }

  return (data || []) as Task[];
}

