'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  date?: string;
  assigned_company_id?: string;
  assigned_contact_id?: string;
  status?: string;
  ca_ht?: number;
  staff?: string[];
  rh_hours?: number;
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

