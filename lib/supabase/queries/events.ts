import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Event } from '@/types/database';

export async function getEvents() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des événements: ${error.message}`);
  }

  return (data || []) as Event[];
}

