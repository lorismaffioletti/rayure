import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Event, Company, Contact, EventStaff, Barman } from '@/types/database';

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

export async function getEventById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*, company:companies(*), contact:contacts(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Erreur lors de la récupération de l'événement: ${error.message}`);
  }

  return data as Event & { company?: Company | null; contact?: Contact | null };
}

export async function getEventStaff(eventId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('event_staff')
    .select('*, barman:barmans(*)')
    .eq('event_id', eventId)
    .order('start_time', { ascending: true });

  if (error) {
    throw new Error(`Erreur lors de la récupération du staff: ${error.message}`);
  }

  return (data || []) as Array<EventStaff & { barman?: Barman | null }>;
}
