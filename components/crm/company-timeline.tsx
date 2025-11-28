import { getContactInteractions } from '@/lib/supabase/queries/contacts';
import type { Contact } from '@/types/database';

interface CompanyTimelineProps {
  companyId: string;
  contacts: Contact[];
}

const INTERACTION_ICONS: Record<string, string> = {
  appel: '📞',
  email: '✉️',
  sms: '💬',
  rdv: '📅',
};

export async function CompanyTimeline({ companyId, contacts }: CompanyTimelineProps) {
  // Récupérer toutes les interactions de tous les contacts de l'entreprise
  const allInteractions = await Promise.all(
    contacts.map(async (contact) => {
      const interactions = await getContactInteractions(contact.id);
      return interactions.map((interaction) => ({
        ...interaction,
        contact,
      }));
    }),
  );

  const interactions = allInteractions.flat().sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (interactions.length === 0) {
    return <p className="text-sm text-neutral-500">Aucune interaction enregistrée</p>;
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <div
          key={interaction.id}
          className="flex gap-4 border-l-2 border-neutral-200 pl-4"
        >
          <div className="text-2xl">{INTERACTION_ICONS[interaction.type] || '📝'}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {interaction.contact.first_name} {interaction.contact.last_name}
              </span>
              <span className="text-sm text-neutral-500">
                {new Date(interaction.date).toLocaleString('fr-FR')}
              </span>
            </div>
            {interaction.content && (
              <p className="mt-1 text-sm text-neutral-600">{interaction.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

