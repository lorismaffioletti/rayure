'use client';

import Link from 'next/link';
import { Building2, Pencil, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { EditCompanyModal } from '@/components/crm/edit-company-modal';
import { DeleteCompanyButton } from '@/components/crm/delete-company-button';
import type { CompanyType, Company } from '@/types/database';

const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  mairie: 'Mairie',
  agence: 'Agence',
  entreprise: 'Entreprise',
  autre: 'Autre',
};

interface CompaniesListProps {
  companies: Company[];
}

export function CompaniesList({ companies }: CompaniesListProps) {
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
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <EditCompanyModal company={company}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                  </EditCompanyModal>
                  <DeleteCompanyButton companyId={company.id} companyName={company.name}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </DeleteCompanyButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

