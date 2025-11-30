'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { CreateInteractionInput } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function createInteraction(input: CreateInteractionInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('contact_interactions')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création de l'interaction: ${error.message}`);
  }

  revalidatePath(`/crm/contacts/${input.contact_id}`);
  return data;
}

