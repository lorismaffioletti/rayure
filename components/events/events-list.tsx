import { EventCard } from '@/components/events/event-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Calendar } from 'lucide-react';
import type { Event } from '@/types/database';

interface EventsListProps {
  events: Event[];
}

export function EventsList({ events }: EventsListProps) {
  // Filter and sort upcoming events (including today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events
    .filter((event) => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      // Include events from today onwards
      return eventDate >= today;
    })
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  if (upcomingEvents.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-12 w-12" />}
        title="Aucun événement à venir"
        description="Planifiez votre prochain événement dès maintenant !"
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {upcomingEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

