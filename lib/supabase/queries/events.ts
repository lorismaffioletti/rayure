import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Event, Company, Contact } from '@/types/database';

export async function getEvents() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*, company:companies(*), contact:contacts(*)')
    .order('date', { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des événements: ${error.message}`);
  }

  return (data || []) as Array<Event & { company?: Company | null; contact?: Contact | null }>;
}

