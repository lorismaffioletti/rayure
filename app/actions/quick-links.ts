'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CreateQuickLinkInput {
  name: string;
  url: string;
  favicon_url?: string;
}

export async function createQuickLink(input: CreateQuickLinkInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('quick_links')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création du lien rapide: ${error.message}`);
  }

  revalidatePath('/');
  return data;
}

export async function updateQuickLink(id: string, input: Partial<CreateQuickLinkInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('quick_links')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour du lien rapide: ${error.message}`);
  }

  revalidatePath('/');
  return data;
}

export async function deleteQuickLink(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('quick_links').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression du lien rapide: ${error.message}`);
  }

  revalidatePath('/');
}

