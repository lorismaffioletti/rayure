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

export async function updateInteraction(
  id: string,
  input: Partial<Omit<CreateInteractionInput, 'contact_id'>>
) {
  const supabase = await createSupabaseServerClient();
  const { data: interaction } = await supabase
    .from('contact_interactions')
    .select('contact_id')
    .eq('id', id)
    .single();

  if (!interaction) {
    throw new Error('Interaction introuvable');
  }

  const { data, error } = await supabase
    .from('contact_interactions')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de l'interaction: ${error.message}`);
  }

  revalidatePath(`/crm/contacts/${interaction.contact_id}`);
  return data;
}

export async function deleteInteraction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: interaction } = await supabase
    .from('contact_interactions')
    .select('contact_id')
    .eq('id', id)
    .single();

  if (!interaction) {
    throw new Error('Interaction introuvable');
  }

  const { error } = await supabase.from('contact_interactions').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression de l'interaction: ${error.message}`);
  }

  revalidatePath(`/crm/contacts/${interaction.contact_id}`);
}

