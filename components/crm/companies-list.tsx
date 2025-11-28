import Link from 'next/link';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import type { CompanyType } from '@/types/database';

const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  mairie: 'Mairie',
  agence: 'Agence',
  entreprise: 'Entreprise',
  autre: 'Autre',
};

interface CompaniesListProps {
  type?: CompanyType;
  search?: string;
}

export async function CompaniesList({ type, search }: CompaniesListProps) {
  const companies = await getCompanies({ type, search });

  if (companies.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
        <p className="text-neutral-500">Aucune entreprise trouvée</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden sm:table-cell">Créé le</TableHead>
          </TableRow>
        </TableHeader>
        <tbody>
          {companies.map((company) => (
            <TableRow key={company.id} className="hover:bg-neutral-50">
              <TableCell>
                <Link
                  href={`/crm/companies/${company.id}`}
                  className="font-medium text-neutral-900 hover:underline"
                >
                  {company.name}
                </Link>
              </TableCell>
              <TableCell>
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs">
                  {COMPANY_TYPE_LABELS[company.type]}
                </span>
              </TableCell>
              <TableCell className="hidden text-neutral-500 sm:table-cell">
                {new Date(company.created_at).toLocaleDateString('fr-FR')}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

