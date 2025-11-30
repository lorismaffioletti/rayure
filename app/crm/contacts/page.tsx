import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import { getContacts } from '@/lib/supabase/queries/contacts';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ContactsSearch } from '@/components/crm/contacts-search';
import { CreateContactModal } from '@/components/crm/create-contact-modal';
import type { Company } from '@/types/database';

async function ContactsDataLoader({ companies }: { companies: Company[] }) {
  const contacts = await getContacts();
  return <ContactsSearch contacts={contacts} companies={companies} />;
}

interface ContactsPageProps {
  searchParams: Promise<{ companyId?: string; search?: string }>;
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
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

      <Suspense fallback={<LoadingSkeleton type="table" />}>
        <ContactsDataLoader companies={companies} />
      </Suspense>
    </div>
  );
}

