import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar as CalendarIcon, Clock, Building2, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Event } from '@/types/database';

interface EventCardProps {
  event: Event;
  showCompany?: boolean;
  showContact?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  prospect: 'Prospect',
  negociation: 'Négociation',
  validé: 'Validé',
  perdu: 'Perdu',
  terminé: 'Terminé',
  consolidé: 'Consolidé',
};

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  prospect: 'outline',
  negociation: 'default',
  validé: 'default',
  perdu: 'destructive',
  terminé: 'secondary',
  consolidé: 'secondary',
};

export function EventCard({ event, showCompany = true, showContact = true }: EventCardProps) {
  const eventDate = event.date ? new Date(event.date) : null;
  const startTime = event.start_time ? new Date(event.start_time) : null;
  const endTime = event.end_time ? new Date(event.end_time) : null;

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="hover:shadow-md transition h-full">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-base line-clamp-2 flex-1">{event.title}</h4>
              <Badge variant={STATUS_COLORS[event.status] || 'outline'} className="text-xs shrink-0">
                {STATUS_LABELS[event.status] || event.status}
              </Badge>
            </div>

            {eventDate && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {format(eventDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </span>
              </div>
            )}

            {(startTime || endTime) && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {startTime && format(startTime, 'HH:mm')}
                  {startTime && endTime && ' - '}
                  {endTime && format(endTime, 'HH:mm')}
                </span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}

            {showCompany && event.company && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{event.company.name}</span>
              </div>
            )}

            {showContact && event.contact && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  {event.contact.first_name} {event.contact.last_name}
                </span>
              </div>
            )}

            {event.ca_ht && (
              <div className="text-sm font-medium text-foreground">
                CA HT: {event.ca_ht.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

