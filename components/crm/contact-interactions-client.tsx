'use client';

import { useState } from 'react';
import { groupByTimePeriod, formatDateTime } from '@/lib/utils/date';
import { Phone, Mail, MessageSquare, Calendar, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditInteractionModal } from '@/components/crm/edit-interaction-modal';
import type { ContactInteraction } from '@/types/database';

interface ContactInteractionsClientProps {
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
  return INTERACTION_ICONS[interaction.type] || <MessageSquare className="h-4 w-4" />;
}

export function ContactInteractionsClient({
  interactions,
  userName,
}: ContactInteractionsClientProps) {
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
              <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-border" />

              {/* Timeline items */}
              <div className="space-y-6 pl-10">
                {items.map((interaction) => (
                  <div key={interaction.id} className="relative group">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setEditingInteraction(interaction)}
                        >
                          <Pencil className="h-3 w-3" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                      </div>
                      {interaction.content && (
                        <p className="text-sm text-foreground">{interaction.content}</p>
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
          interaction={editingInteraction}
          isOpen={!!editingInteraction}
          onClose={() => setEditingInteraction(null)}
          onSuccess={() => setEditingInteraction(null)}
        />
      )}
    </>
  );
}

