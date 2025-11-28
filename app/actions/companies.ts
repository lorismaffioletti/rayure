'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { CreateCompanyInput } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function createCompany(input: CreateCompanyInput) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('companies')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création de l'entreprise: ${error.message}`);
  }

  revalidatePath('/crm/companies');
  return data;
}

export async function updateCompany(id: string, input: Partial<CreateCompanyInput>) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('companies')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de l'entreprise: ${error.message}`);
  }

  revalidatePath('/crm/companies');
  revalidatePath(`/crm/companies/${id}`);
  return data;
}

export async function deleteCompany(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('companies').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression de l'entreprise: ${error.message}`);
  }

  revalidatePath('/crm/companies');
}
