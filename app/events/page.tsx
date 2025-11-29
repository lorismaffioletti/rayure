import { Suspense } from 'react';
import { Calendar } from 'lucide-react';
import { getEvents } from '@/lib/supabase/queries/events';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

export default async function EventsPage() {
  return (
    <div className="page">
      <PageHeader
        title="Événements"
        description="Gestion des événements et pipeline d'opportunités"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Événements' }]}
      />

      <Suspense fallback={<LoadingSkeleton type="grid" />}>
        <EventsList />
      </Suspense>
    </div>
  );
}

async function EventsList() {
  const events = await getEvents();

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-12 w-12" />}
        title="Aucun événement enregistré"
        description="Commencez par créer votre premier événement"
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-lg">{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {event.location && (
                <div className="text-muted-foreground">📍 {event.location}</div>
              )}
              {event.date && (
                <div className="text-muted-foreground">
                  📅 {new Date(event.date).toLocaleDateString('fr-FR')}
                </div>
              )}
              <div>
                <Badge variant="outline">{event.status}</Badge>
              </div>
              {event.ca_ht && (
                <div className="font-medium">
                  CA HT: {event.ca_ht.toLocaleString('fr-FR')} €
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

