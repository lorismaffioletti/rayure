import { getContactInteractions } from '@/lib/supabase/queries/contacts';
import { groupByTimePeriod, formatDateTime } from '@/lib/utils/date';
import type { ContactInteraction } from '@/types/database';

interface ContactInteractionsProps {
  contactId: string;
}

const INTERACTION_LABELS: Record<string, string> = {
  appel: 'Appel',
  email: 'Email',
  sms: 'SMS',
  rdv: 'Rendez-vous',
};

function formatInteractionTitle(interaction: ContactInteraction): string {
  return INTERACTION_LABELS[interaction.type] || interaction.type;
}

export async function ContactInteractions({ contactId }: ContactInteractionsProps) {
  const interactions = await getContactInteractions(contactId);

  if (interactions.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune interaction enregistrée</p>;
  }

  // Convert interactions to have Date objects
  const interactionsWithDates = interactions.map((interaction) => ({
    ...interaction,
    date: new Date(interaction.date),
  }));

  // Group by time period
  const grouped = groupByTimePeriod(interactionsWithDates);

  return (
    <div className="space-y-6">
      {grouped.map(({ period, items }) => (
        <div key={period} className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">{period}</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
            
            {/* Timeline items */}
            <div className="space-y-6 pl-8">
              {items.map((interaction) => (
                <div key={interaction.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[1.625rem] top-1 h-2 w-2 rounded-full bg-border" />
                  
                  {/* Content */}
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">
                      {formatInteractionTitle(interaction)}
                    </h4>
                    {interaction.content && (
                      <p className="text-sm text-foreground">
                        {interaction.content}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(interaction.date)} • Loris Maffioletti
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

