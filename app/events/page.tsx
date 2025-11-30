import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import { getEvents } from '@/lib/supabase/queries/events';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { getContacts } from '@/lib/supabase/queries/contacts';
import { getBarmans } from '@/lib/supabase/queries/barmans';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EventsCalendar } from '@/components/events/events-calendar';
import { EventStats } from '@/components/events/event-stats';
import { EventsList } from '@/components/events/events-list';
import { CreateEventModal } from '@/components/events/create-event-modal';

async function EventsContent() {
  const [events, companies, contacts, barmans] = await Promise.all([
    getEvents(),
    getCompanies(),
    getContacts(),
    getBarmans(),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Colonne gauche : Calendrier */}
      <div>
        <EventsCalendar events={events} />
      </div>

      {/* Colonne droite : Stats + Liste des événements */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
          <EventStats events={events} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Événements à venir</h3>
          <EventsList events={events} />
        </div>
      </div>
    </div>
  );
}

export default async function EventsPage() {
  const [companies, contacts, barmans] = await Promise.all([
    getCompanies(),
    getContacts(),
    getBarmans(),
  ]);

  return (
    <div className="page">
      <PageHeader
        title="Événements"
        description="Gestion des événements et pipeline d'opportunités"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Événements' }]}
            actions={
              <CreateEventModal companies={companies} contacts={contacts} barmans={barmans}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel événement
                </Button>
              </CreateEventModal>
            }
      />

      <Suspense fallback={<LoadingSkeleton type="grid" />}>
        <EventsContent />
      </Suspense>
    </div>
  );
}

