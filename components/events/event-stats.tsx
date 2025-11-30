import { Card, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import type { Event } from '@/types/database';

interface EventStatsProps {
  events: Event[];
}

export function EventStats({ events }: EventStatsProps) {
  const totalEvents = events.length;
  const upcomingEvents = events.filter(
    (event) => event.date && new Date(event.date) >= new Date()
  ).length;
  const totalCA = events.reduce((sum, event) => sum + (event.ca_ht || 0), 0);
  const validatedEvents = events.filter((event) => event.status === 'validé').length;

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        title="Total"
        value={totalEvents.toString()}
        description="événements"
      />
      <StatCard
        title="À venir"
        value={upcomingEvents.toString()}
        description="événements"
      />
      <StatCard
        title="CA total"
        value={totalCA.toLocaleString('fr-FR')}
        description="€ HT"
      />
      <StatCard
        title="Validés"
        value={validatedEvents.toString()}
        description="événements"
      />
    </div>
  );
}

