import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Product } from '@/types/database';

export interface ProductWithPrice extends Product {
  latest_price?: number;
}

export async function getProducts() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des produits: ${error.message}`);
  }

  // Pour l'instant, retourner les produits sans prix (sera amélioré plus tard)
  return (data || []).map((product) => ({
    ...product,
    latest_price: undefined,
  })) as ProductWithPrice[];
}

