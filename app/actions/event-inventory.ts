'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CreateEventInventoryInput {
  event_id: string;
  product_id: string;
  sale_price_ht: number;
  sale_price_ttc: number;
  quantity: number;
}

export async function createEventInventory(input: CreateEventInventoryInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('event_inventory')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de l'ajout du produit: ${error.message}`);
  }

  revalidatePath(`/events/${input.event_id}`);
  return data;
}

export async function updateEventInventory(id: string, eventId: string, input: Partial<CreateEventInventoryInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('event_inventory')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour du produit: ${error.message}`);
  }

  revalidatePath(`/events/${eventId}`);
  return data;
}

export async function deleteEventInventory(id: string, eventId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('event_inventory').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression du produit: ${error.message}`);
  }

  revalidatePath(`/events/${eventId}`);
}

