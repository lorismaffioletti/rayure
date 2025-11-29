import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Contact, ContactInteraction, Company } from '@/types/database';

export async function getContacts(filters?: {
  companyId?: string;
  search?: string;
}) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from('contacts')
    .select('*, company:companies(*)')
    .order('created_at', { ascending: false });

  if (filters?.companyId) {
    query = query.eq('company_id', filters.companyId);
  }

  if (filters?.search) {
    query = query.textSearch('search', filters.search, {
      type: 'websearch',
      config: 'french',
    });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Erreur lors de la récupération des contacts: ${error.message}`);
  }

  return (data || []) as Array<Contact & { company?: Company | null }>;
}

export async function getContactById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('contacts')
    .select('*, company:companies(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Erreur lors de la récupération du contact: ${error.message}`);
  }

  return data as Contact & { company?: Company | null };
}

export async function getContactInteractions(contactId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('contact_interactions')
    .select('*')
    .eq('contact_id', contactId)
    .order('date', { ascending: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des interactions: ${error.message}`);
  }

  return (data || []) as ContactInteraction[];
}

