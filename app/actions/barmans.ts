'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CreateBarmanInput {
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
  has_license?: boolean;
}

export async function createBarman(input: CreateBarmanInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('barmans')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création du barman: ${error.message}`);
  }

  revalidatePath('/barmans');
  return data;
}

export async function updateBarman(id: string, input: Partial<CreateBarmanInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('barmans')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour du barman: ${error.message}`);
  }

  revalidatePath('/barmans');
  return data;
}

export async function deleteBarman(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('barmans').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression du barman: ${error.message}`);
  }

  revalidatePath('/barmans');
}

