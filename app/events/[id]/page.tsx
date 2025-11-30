import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2, Calendar, MapPin, Clock, Building2, User, Euro, Truck, LayoutGrid } from 'lucide-react';
import { getEventById, getEventStaff } from '@/lib/supabase/queries/events';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EditEventModal } from '@/components/events/edit-event-modal';
import { DeleteEventButton } from '@/components/events/delete-event-button';
import { EventStaffList } from '@/components/events/event-staff-list';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { getContacts } from '@/lib/supabase/queries/contacts';
import { getBarmans } from '@/lib/supabase/queries/barmans';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_LABELS: Record<string, string> = {
  prospect: 'Prospect',
  negociation: 'Négociation',
  validé: 'Validé',
  perdu: 'Perdu',
  terminé: 'Terminé',
  consolidé: 'Consolidé',
};

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  try {
    const [event, staff, companies, contacts, barmans] = await Promise.all([
      getEventById(id),
      getEventStaff(id),
      getCompanies(),
      getContacts(),
      getBarmans(),
    ]);

    const eventDate = event.date ? new Date(event.date) : null;
    const startTime = event.start_time ? new Date(event.start_time) : null;
    const endTime = event.end_time ? new Date(event.end_time) : null;
    const setupTime = event.setup_time ? new Date(event.setup_time) : null;

    const totalHours = staff.reduce((sum, s) => sum + (s.hours_worked || 0), 0);
    const totalCost = totalHours * 14.5;

    return (
      <div className="page max-w-5xl pb-24">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <Link
              href="/events"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Retour aux événements
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{event.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline">{STATUS_LABELS[event.status] || event.status}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EditEventModal event={event} companies={companies} contacts={contacts} barmans={barmans}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </EditEventModal>
            <DeleteEventButton eventId={event.id} eventTitle={event.title}>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </DeleteEventButton>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventDate && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Date</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{format(eventDate, 'EEEE d MMMM yyyy', { locale: fr })}</span>
                  </div>
                </div>
              )}

              {(startTime || endTime) && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Horaires</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>
                      {startTime && format(startTime, 'HH:mm')}
                      {startTime && endTime && ' - '}
                      {endTime && format(endTime, 'HH:mm')}
                    </span>
                  </div>
                </div>
              )}

              {setupTime && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Heure d'installation</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{format(setupTime, 'HH:mm')}</span>
                  </div>
                </div>
              )}

              {event.location && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Lieu</div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              )}

              {event.provenance && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Provenance</div>
                  <div className="text-sm">{event.provenance}</div>
                </div>
              )}

              {event.has_beer_truck !== null && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Beer Truck</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4" />
                    <span>{event.has_beer_truck ? 'Oui' : 'Non'}</span>
                  </div>
                </div>
              )}

              {event.stand_count !== null && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Stand</div>
                  <div className="flex items-center gap-2 text-sm">
                    <LayoutGrid className="h-4 w-4" />
                    <span>{event.stand_count} stand{event.stand_count > 1 ? 's' : ''}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CRM et CA */}
          <Card>
            <CardHeader>
              <CardTitle>CRM & Chiffre d'affaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.company && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Entreprise</div>
                  <Link
                    href={`/crm/companies/${event.company.id}`}
                    className="flex items-center gap-2 text-sm hover:text-primary hover:underline"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>{event.company.name}</span>
                  </Link>
                </div>
              )}

              {event.contact && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Contact</div>
                  <Link
                    href={`/crm/contacts/${event.contact.id}`}
                    className="flex items-center gap-2 text-sm hover:text-primary hover:underline"
                  >
                    <User className="h-4 w-4" />
                    <span>
                      {event.contact.first_name} {event.contact.last_name}
                    </span>
                  </Link>
                </div>
              )}

              {event.ca_ht && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Chiffre d'affaires HT</div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Euro className="h-4 w-4" />
                    <span>{event.ca_ht.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Staff */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Staff ({staff.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {staff.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun staff assigné</p>
            ) : (
              <>
                <EventStaffList staff={staff} />
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total heures travaillées</span>
                    <span className="font-medium">{totalHours.toFixed(2)}h</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Coût total RH (14,50€/h)</span>
                    <span className="font-medium">
                      {totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }
}

