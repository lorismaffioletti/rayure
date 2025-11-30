'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  setup_time?: string;
  assigned_company_id?: string;
  assigned_contact_id?: string;
  status?: string;
  ca_ht?: number;
  staff?: string[];
  rh_hours?: number;
  provenance?: string;
  has_beer_truck?: boolean;
  stand_count?: number;
}

export interface CreateEventStaffInput {
  event_id: string;
  barman_id: string;
  start_time: string;
  end_time: string;
}

export async function createEventStaff(input: CreateEventStaffInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('event_staff')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de l'ajout du staff: ${error.message}`);
  }

  revalidatePath('/events');
  return data;
}

export async function deleteEventStaff(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('event_staff').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression du staff: ${error.message}`);
  }

  revalidatePath('/events');
}

export async function createEvent(input: CreateEventInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('events')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création de l'événement: ${error.message}`);
  }

  revalidatePath('/events');
  return data;
}

export async function updateEvent(id: string, input: Partial<CreateEventInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('events')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de l'événement: ${error.message}`);
  }

  revalidatePath('/events');
  return data;
}

export async function deleteEvent(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('events').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression de l'événement: ${error.message}`);
  }

  revalidatePath('/events');
}

