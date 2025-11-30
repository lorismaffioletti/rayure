import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar as CalendarIcon } from 'lucide-react';
import type { Event } from '@/types/database';

interface EventsListProps {
  events: Event[];
}

const STATUS_LABELS: Record<string, string> = {
  prospect: 'Prospect',
  negociation: 'Négociation',
  validé: 'Validé',
  perdu: 'Perdu',
  terminé: 'Terminé',
  consolidé: 'Consolidé',
};

export function EventsList({ events }: EventsListProps) {
  // Filter and sort upcoming events
  const upcomingEvents = events
    .filter((event) => event.date && new Date(event.date) >= new Date())
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        Aucun événement à venir
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {upcomingEvents.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`}>
          <Card className="hover:shadow-md transition h-full">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm line-clamp-2">{event.title}</h4>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {STATUS_LABELS[event.status] || event.status}
                  </Badge>
                </div>

                {event.date && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3" />
                    <span>
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                )}

                {event.ca_ht && (
                  <div className="text-xs font-medium text-foreground">
                    {event.ca_ht.toLocaleString('fr-FR')} € HT
                  </div>
                )}

                {event.company && (
                  <div className="text-xs text-muted-foreground">
                    {event.company.name}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

