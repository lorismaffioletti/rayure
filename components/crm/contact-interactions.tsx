import { getContactInteractions } from '@/lib/supabase/queries/contacts';

interface ContactInteractionsProps {
  contactId: string;
}

const INTERACTION_ICONS: Record<string, string> = {
  appel: '📞',
  email: '✉️',
  sms: '💬',
  rdv: '📅',
};

const INTERACTION_LABELS: Record<string, string> = {
  appel: 'Appel',
  email: 'Email',
  sms: 'SMS',
  rdv: 'Rendez-vous',
};

export async function ContactInteractions({ contactId }: ContactInteractionsProps) {
  const interactions = await getContactInteractions(contactId);

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
                {INTERACTION_LABELS[interaction.type] || interaction.type}
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

