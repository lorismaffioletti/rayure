import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import { getContacts } from '@/lib/supabase/queries/contacts';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ContactsList } from '@/components/crm/contacts-list';
import { CompanyFilter } from '@/components/crm/company-filter';
import { CreateContactModal } from '@/components/crm/create-contact-modal';
import type { Company } from '@/types/database';

async function ContactsListWrapper({
  companyId,
  search,
  companies,
}: {
  companyId?: string;
  search?: string;
  companies: Company[];
}) {
  const contacts = await getContacts({ companyId, search });
  return <ContactsList contacts={contacts} companies={companies} />;
}

interface ContactsPageProps {
  searchParams: Promise<{ companyId?: string; search?: string }>;
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const params = await searchParams;
  const companyId = params.companyId;
  const search = params.search;

  const companies = await getCompanies();

  return (
    <div className="page">
      <PageHeader
        title="Contacts"
        description="Gérez vos contacts et leurs interactions"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Contacts' }]}
        actions={
          <CreateContactModal companies={companies}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau contact
            </Button>
          </CreateContactModal>
        }
      />

      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <CompanyFilter companies={companies} currentCompanyId={companyId} />
        <ContactSearch initialSearch={search} />
      </div>

      <Suspense fallback={<LoadingSkeleton type="table" />}>
        <ContactsListWrapper companyId={companyId} search={search} companies={companies} />
      </Suspense>
    </div>
  );
}


function ContactSearch({ initialSearch }: { initialSearch?: string }) {
  return (
    <form method="get" action="/crm/contacts" className="flex-1">
      <Input
        type="search"
        name="search"
        defaultValue={initialSearch}
        placeholder="Rechercher un contact..."
      />
    </form>
  );
}

