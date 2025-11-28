import { Suspense } from 'react';
import Link from 'next/link';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { CreateCompanyModal } from '@/components/crm/create-company-modal';
import { CompaniesList } from '@/components/crm/companies-list';
import type { CompanyType } from '@/types/database';

interface CompaniesPageProps {
  searchParams: Promise<{ type?: string; search?: string }>;
}

const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  mairie: 'Mairie',
  agence: 'Agence',
  entreprise: 'Entreprise',
  autre: 'Autre',
};

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const params = await searchParams;
  const type = params.type as CompanyType | undefined;
  const search = params.search;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Entreprises</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Gérez vos entreprises et clients
          </p>
        </div>
        <CreateCompanyButton />
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <CompanyTypeFilter currentType={type} />
        <CompanySearch initialSearch={search} />
      </div>

      <Suspense fallback={<div className="py-8 text-center text-neutral-500">Chargement...</div>}>
        <CompaniesList type={type} search={search} />
      </Suspense>
    </div>
  );
}

function CreateCompanyButton() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/crm/companies?create=true"
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        + Nouvelle entreprise
      </Link>
    </div>
  );
}

function CompanyTypeFilter({ currentType }: { currentType?: CompanyType }) {
  return (
    <div className="flex gap-2">
      <Link
        href="/crm/companies"
        className={`rounded-md px-3 py-1.5 text-sm ${
          !currentType
            ? 'bg-neutral-900 text-white'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
        }`}
      >
        Tous
      </Link>
      {Object.entries(COMPANY_TYPE_LABELS).map(([value, label]) => (
        <Link
          key={value}
          href={`/crm/companies?type=${value}`}
          className={`rounded-md px-3 py-1.5 text-sm ${
            currentType === value
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

function CompanySearch({ initialSearch }: { initialSearch?: string }) {
  return (
    <form method="get" action="/crm/companies" className="flex-1">
      <input
        type="search"
        name="search"
        defaultValue={initialSearch}
        placeholder="Rechercher une entreprise..."
        className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
      />
    </form>
  );
}

