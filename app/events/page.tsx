import { Suspense } from 'react';
import { getEvents } from '@/lib/supabase/queries/events';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function EventsPage() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Événements</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Gestion des événements et pipeline d'opportunités
        </p>
      </div>

      <Suspense fallback={<div className="py-8 text-center text-neutral-500">Chargement...</div>}>
        <EventsList />
      </Suspense>
    </div>
  );
}

async function EventsList() {
  const events = await getEvents();

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-neutral-500">Aucun événement enregistré</p>
        </CardContent>
      </Card>
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
                <div className="text-neutral-600">📍 {event.location}</div>
              )}
              {event.date && (
                <div className="text-neutral-600">
                  📅 {new Date(event.date).toLocaleDateString('fr-FR')}
                </div>
              )}
              <div>
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs">
                  {event.status}
                </span>
              </div>
              {event.ca_ht && (
                <div className="font-medium text-neutral-900">
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

