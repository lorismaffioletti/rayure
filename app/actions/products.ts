'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CreateProductInput {
  name: string;
  supplier_name?: string;
  initial_price_ht?: number;
  initial_vat_rate?: number;
  initial_quantity?: number;
  unit?: string;
}

export async function createProduct(input: CreateProductInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création du produit: ${error.message}`);
  }

  revalidatePath('/products');
  return data;
}

export async function updateProduct(id: string, input: Partial<CreateProductInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour du produit: ${error.message}`);
  }

  revalidatePath('/products');
  return data;
}

export async function deleteProduct(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression du produit: ${error.message}`);
  }

  revalidatePath('/products');
}

