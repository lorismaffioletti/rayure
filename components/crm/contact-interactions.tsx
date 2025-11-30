import { getContactInteractions } from '@/lib/supabase/queries/contacts';
import { getUser } from '@/lib/auth/get-user';
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

function formatUserName(email: string | null | undefined): string {
  if (!email) return 'Utilisateur';
  const name = email.split('@')[0];
  // Capitalize first letter of each word
  return name
    .split('.')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function ContactInteractions({ contactId }: ContactInteractionsProps) {
  const [interactions, user] = await Promise.all([
    getContactInteractions(contactId),
    getUser(),
  ]);

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
  const userName = formatUserName(user?.email);

  return (
    <div className="space-y-6">
      {grouped.map(({ period, items }) => (
        <div key={period} className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">{period}</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-border" />
            
            {/* Timeline items */}
            <div className="space-y-6 pl-10">
              {items.map((interaction, index) => (
                <div key={interaction.id} className="relative">
                  {/* Timeline dot with icon */}
                  <div className="absolute -left-[2.25rem] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-card shadow-sm">
                    <div className="text-muted-foreground">
                      {getInteractionIcon(interaction)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">
                        {formatInteractionTitle(interaction)}
                      </h4>
                    </div>
                    {interaction.content && (
                      <p className="text-sm text-foreground">
                        {interaction.content}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(interaction.date)} • {userName}
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

