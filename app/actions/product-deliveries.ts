'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CreateProductDeliveryInput {
  product_id: string;
  delivery_date: string;
  quantity: number;
  purchase_price_ht: number;
  vat_rate?: number;
  supplier_name?: string;
  invoice_number?: string;
  notes?: string;
}

export async function createProductDelivery(input: CreateProductDeliveryInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('product_deliveries')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de l'ajout de la livraison: ${error.message}`);
  }

  revalidatePath(`/products/${input.product_id}`);
  revalidatePath('/products');
  return data;
}

export async function updateProductDelivery(
  id: string,
  productId: string,
  input: Partial<CreateProductDeliveryInput>
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('product_deliveries')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de la livraison: ${error.message}`);
  }

  revalidatePath(`/products/${productId}`);
  return data;
}

export async function deleteProductDelivery(id: string, productId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('product_deliveries').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression de la livraison: ${error.message}`);
  }

  revalidatePath(`/products/${productId}`);
}

