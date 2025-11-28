export type CompanyType = 'mairie' | 'agence' | 'entreprise' | 'autre';
export type InteractionType = 'appel' | 'email' | 'sms' | 'rdv';
export type EventStatus =
  | 'prospect'
  | 'negociation'
  | 'validé'
  | 'perdu'
  | 'terminé'
  | 'consolidé';

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  logo_url: string | null;
  created_at: string;
}

export interface Contact {
  id: string;
  company_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  created_at: string;
  company?: Company | null;
}

export interface ContactInteraction {
  id: string;
  contact_id: string;
  type: InteractionType;
  date: string;
  content: string | null;
  created_at: string;
  contact?: Contact;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  date: string | null;
  assigned_company_id: string | null;
  assigned_contact_id: string | null;
  status: EventStatus;
  ca_ht: number | null;
  staff: string[] | null;
  rh_hours: number | null;
  rh_cost: number | null;
  stock_used: Record<string, unknown> | null;
  created_at: string;
  company?: Company | null;
  contact?: Contact | null;
}

export interface EventNote {
  id: string;
  event_id: string;
  content: string | null;
  created_at: string;
}

// Types pour les formulaires
export interface CreateCompanyInput {
  name: string;
  type: CompanyType;
  logo_url?: string;
}

export interface CreateContactInput {
  company_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface CreateInteractionInput {
  contact_id: string;
  type: InteractionType;
  date: string;
  content?: string;
}

