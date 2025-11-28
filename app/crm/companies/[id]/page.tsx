import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCompanyById, getCompanyContacts, getCompanyEvents } from '@/lib/supabase/queries/companies';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { CreateContactButton } from '@/components/crm/create-contact-button';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { CreateInteractionModal } from '@/components/crm/create-interaction-modal';
import { CompanyTimeline } from '@/components/crm/company-timeline';

interface CompanyPageProps {
  params: Promise<{ id: string }>;
}

const COMPANY_TYPE_LABELS: Record<string, string> = {
  mairie: 'Mairie',
  agence: 'Agence',
  entreprise: 'Entreprise',
  autre: 'Autre',
};

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;

  try {
    const [company, contacts, events, allCompanies] = await Promise.all([
      getCompanyById(id),
      getCompanyContacts(id),
      getCompanyEvents(id),
      getCompanies(),
    ]);

    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <Link
            href="/crm/companies"
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            ← Retour aux entreprises
          </Link>
          <h1 className="mt-2 text-2xl font-bold">{company.name}</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {COMPANY_TYPE_LABELS[company.type] || company.type}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contacts ({contacts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <p className="text-sm text-neutral-500">Aucun contact</p>
              ) : (
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <Link
                      key={contact.id}
                      href={`/crm/contacts/${contact.id}`}
                      className="block rounded-md border border-neutral-200 p-3 hover:bg-neutral-50"
                    >
                      <div className="font-medium">
                        {contact.first_name} {contact.last_name}
                      </div>
                      {contact.email && (
                        <div className="text-sm text-neutral-600">{contact.email}</div>
                      )}
                      {contact.role && (
                        <div className="text-xs text-neutral-500">{contact.role}</div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <CreateContactButton companyId={id} companies={allCompanies} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Événements ({events.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-sm text-neutral-500">Aucun événement</p>
              ) : (
                <div className="space-y-2">
                  {events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block rounded-md border border-neutral-200 p-3 hover:bg-neutral-50"
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.date && (
                        <div className="text-sm text-neutral-600">
                          {new Date(event.date).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                      <div className="text-xs text-neutral-500">{event.status}</div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyTimeline companyId={id} contacts={contacts} />
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error loading company:', error);
    notFound();
  }
}


