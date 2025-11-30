import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { ProductDelivery, Product } from '@/types/database';

export async function getProductDeliveries(productId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('product_deliveries')
    .select('*, product:products(*)')
    .eq('product_id', productId)
    .order('delivery_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des livraisons: ${error.message}`);
  }

  return (data || []) as Array<ProductDelivery & { product?: Product | null }>;
}

export async function getProductById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Erreur lors de la récupération du produit: ${error.message}`);
  }

  return data;
}

