import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { EventInventory, Product } from '@/types/database';

export async function getEventInventory(eventId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('event_inventory')
    .select('*, product:products(*)')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération de l'inventaire: ${error.message}`);
  }

  return (data || []) as Array<EventInventory & { product?: Product | null }>;
}

