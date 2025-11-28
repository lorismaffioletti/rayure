import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Company, CompanyType, Contact, Event } from '@/types/database';

export async function getCompanies(filters?: {
  type?: CompanyType;
  search?: string;
}) {
  const supabase = createSupabaseServerClient();
  let query = supabase.from('companies').select('*').order('created_at', { ascending: false });

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.search) {
    query = query.textSearch('search', filters.search, {
      type: 'websearch',
      config: 'french',
    });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Erreur lors de la récupération des entreprises: ${error.message}`);
  }

  return (data || []) as Company[];
}

export async function getCompanyById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Erreur lors de la récupération de l'entreprise: ${error.message}`);
  }

  return data as Company;
}

export async function getCompanyContacts(companyId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des contacts: ${error.message}`);
  }

  return (data || []) as Contact[];
}

export async function getCompanyEvents(companyId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*, company:companies(*), contact:contacts(*)')
    .eq('assigned_company_id', companyId)
    .order('date', { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des événements: ${error.message}`);
  }

  return (data || []) as Array<Event & { company?: Company | null; contact?: Contact | null }>;
}

