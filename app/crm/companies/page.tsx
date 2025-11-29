import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
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
    <div className="page">
      <PageHeader
        title="Entreprises"
        description="Gérez vos entreprises et clients"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Entreprises' }]}
        actions={<CreateCompanyButton />}
      />

      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <CompanyTypeFilter currentType={type} />
        <CompanySearch initialSearch={search} />
      </div>

      <Suspense fallback={<LoadingSkeleton type="table" />}>
        <CompaniesList type={type} search={search} />
      </Suspense>
    </div>
  );
}

function CreateCompanyButton() {
  return (
    <CreateCompanyModal>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle entreprise
      </Button>
    </CreateCompanyModal>
  );
}

function CompanyTypeFilter({ currentType }: { currentType?: CompanyType }) {
  return (
    <div className="flex gap-2">
      <Button
        asChild
        variant={!currentType ? 'default' : 'outline'}
        size="sm"
      >
        <Link href="/crm/companies">Tous</Link>
      </Button>
      {Object.entries(COMPANY_TYPE_LABELS).map(([value, label]) => (
        <Button
          key={value}
          asChild
          variant={currentType === value ? 'default' : 'outline'}
          size="sm"
        >
          <Link href={`/crm/companies?type=${value}`}>{label}</Link>
        </Button>
      ))}
    </div>
  );
}

function CompanySearch({ initialSearch }: { initialSearch?: string }) {
  return (
    <form method="get" action="/crm/companies" className="flex-1">
      <Input
        type="search"
        name="search"
        defaultValue={initialSearch}
        placeholder="Rechercher une entreprise..."
      />
    </form>
  );
}

