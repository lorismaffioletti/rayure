import { getContactInteractions } from '@/lib/supabase/queries/contacts';
import { getUser } from '@/lib/auth/get-user';
import { ContactInteractionsClient } from '@/components/crm/contact-interactions-client';

interface ContactInteractionsProps {
  contactId: string;
}

function formatUserName(email: string | null | undefined): string {
  if (!email) return 'Utilisateur';
  const name = email.split('@')[0];
  // Capitalize first letter of each word and format as "Prénom Nom"
  const parts = name.split('.');
  if (parts.length >= 2) {
    const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    return `${firstName} ${lastName}`;
  }
  // Fallback: capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export async function ContactInteractions({ contactId }: ContactInteractionsProps) {
  const [interactions, user] = await Promise.all([
    getContactInteractions(contactId),
    getUser(),
  ]);

  const userName = formatUserName(user?.email);

  return <ContactInteractionsClient interactions={interactions} userName={userName} />;
}

