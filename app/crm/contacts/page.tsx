import { Suspense } from 'react';
import Link from 'next/link';
import { getContacts } from '@/lib/supabase/queries/contacts';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ContactsList } from '@/components/crm/contacts-list';
import { CompanyFilter } from '@/components/crm/company-filter';

interface ContactsPageProps {
  searchParams: Promise<{ companyId?: string; search?: string }>;
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const params = await searchParams;
  const companyId = params.companyId;
  const search = params.search;

  const companies = await getCompanies();

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Gérez vos contacts et leurs interactions
          </p>
        </div>
        <Link
          href="/crm/contacts?create=true"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Nouveau contact
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <CompanyFilter companies={companies} currentCompanyId={companyId} />
        <ContactSearch initialSearch={search} />
      </div>

      <Suspense fallback={<div className="py-8 text-center text-neutral-500">Chargement...</div>}>
        <ContactsList companyId={companyId} search={search} />
      </Suspense>
    </div>
  );
}


function ContactSearch({ initialSearch }: { initialSearch?: string }) {
  return (
    <form method="get" action="/crm/contacts" className="flex-1">
      <input
        type="search"
        name="search"
        defaultValue={initialSearch}
        placeholder="Rechercher un contact..."
        className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
      />
    </form>
  );
}

