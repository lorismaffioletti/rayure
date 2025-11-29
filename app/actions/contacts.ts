'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { CreateContactInput } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function createContact(input: CreateContactInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('contacts')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création du contact: ${error.message}`);
  }

  revalidatePath('/crm/contacts');
  if (input.company_id) {
    revalidatePath(`/crm/companies/${input.company_id}`);
  }
  return data;
}

export async function updateContact(id: string, input: Partial<CreateContactInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('contacts')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour du contact: ${error.message}`);
  }

  revalidatePath('/crm/contacts');
  revalidatePath(`/crm/contacts/${id}`);
  return data;
}

export async function deleteContact(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('contacts').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression du contact: ${error.message}`);
  }

  revalidatePath('/crm/contacts');
}

