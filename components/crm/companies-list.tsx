import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { getCompanies } from '@/lib/supabase/queries/companies';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
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
      <EmptyState
        icon={<Building2 className="h-12 w-12" />}
        title="Aucune entreprise trouvée"
        description="Commencez par créer votre première entreprise"
      />
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden sm:table-cell">Créé le</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <Link
                  href={`/crm/companies/${company.id}`}
                  className="font-medium hover:underline"
                >
                  {company.name}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{COMPANY_TYPE_LABELS[company.type]}</Badge>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {new Date(company.created_at).toLocaleDateString('fr-FR')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

