'use client';

import { useState } from 'react';
import { getContactInteractions } from '@/lib/supabase/queries/contacts';
import { getUser } from '@/lib/auth/get-user';
import { groupByTimePeriod, formatDateTime } from '@/lib/utils/date';
import { Phone, Mail, MessageSquare, Calendar, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditInteractionModal } from '@/components/crm/edit-interaction-modal';
import type { ContactInteraction } from '@/types/database';

interface ContactInteractionsProps {
  contactId: string;
  interactions: ContactInteraction[];
  userName: string;
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

export function ContactInteractions({ contactId, interactions, userName }: ContactInteractionsProps) {
  const [editingInteraction, setEditingInteraction] = useState<ContactInteraction | null>(null);

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
    <>
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
                      <div className="flex items-center justify-between gap-2">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setEditingInteraction(interaction)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Modifier</span>
                        </Button>
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

      {editingInteraction && (
        <EditInteractionModal
          isOpen={!!editingInteraction}
          onClose={() => setEditingInteraction(null)}
          onSuccess={() => setEditingInteraction(null)}
          interaction={editingInteraction}
        />
      )}
    </>
  );
}

