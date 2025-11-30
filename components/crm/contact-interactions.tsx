import { getContactInteractions } from '@/lib/supabase/queries/contacts';
import { getUser } from '@/lib/auth/get-user';
import { groupByTimePeriod, formatDateTime } from '@/lib/utils/date';
import { Phone, Mail, MessageSquare, Calendar } from 'lucide-react';
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

const INTERACTION_ICONS: Record<string, React.ReactNode> = {
  appel: <Phone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  sms: <MessageSquare className="h-4 w-4" />,
  rdv: <Calendar className="h-4 w-4" />,
};

function formatInteractionTitle(interaction: ContactInteraction): string {
  return INTERACTION_LABELS[interaction.type] || interaction.type;
}

function getInteractionIcon(interaction: ContactInteraction): React.ReactNode {
  return INTERACTION_ICONS[interaction.type] || null;
}

function formatUserName(email: string | null | undefined): string {
  if (!email) return 'Utilisateur';
  const name = email.split('@')[0];
  // Extract first name and last name from email (format: firstname.lastname or firstname_lastname)
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    // Assume first part is first name, rest is last name
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')}`;
  }
  // Fallback: capitalize first letter of each word
  return name
    .split(/[._-]/)
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
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
            
            {/* Timeline items */}
            <div className="space-y-6 pl-10">
              {items.map((interaction, index) => (
                <div key={interaction.id} className="relative">
                  {/* Timeline dot with icon */}
                  <div className="absolute -left-[2.125rem] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-border">
                    <div className="text-muted-foreground">
                      {getInteractionIcon(interaction)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getInteractionIcon(interaction) && (
                        <div className="text-muted-foreground">
                          {getInteractionIcon(interaction)}
                        </div>
                      )}
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

