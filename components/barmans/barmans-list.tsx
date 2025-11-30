'use client';

import { Users, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { EditBarmanModal } from '@/components/barmans/edit-barman-modal';
import { DeleteBarmanButton } from '@/components/barmans/delete-barman-button';
import type { Barman } from '@/types/database';

interface BarmansListProps {
  barmans: Barman[];
}

export function BarmansList({ barmans }: BarmansListProps) {
  if (barmans.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-12 w-12" />}
        title="Aucun barman enregistré"
        description="Commencez par créer votre premier barman"
      />
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden sm:table-cell">Téléphone</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Date de naissance</TableHead>
            <TableHead className="text-center">Permis</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {barmans.map((barman) => (
            <TableRow key={barman.id}>
              <TableCell className="font-medium text-foreground">
                {barman.first_name} {barman.last_name}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {barman.phone || '-'}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {barman.email || '-'}
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {barman.date_of_birth
                  ? new Date(barman.date_of_birth).toLocaleDateString('fr-FR')
                  : '-'}
              </TableCell>
              <TableCell className="text-center">
                {barman.has_license ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <EditBarmanModal barman={barman}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                  </EditBarmanModal>
                  <DeleteBarmanButton barmanId={barman.id} barmanName={`${barman.first_name} ${barman.last_name}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 !text-destructive hover:!text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </DeleteBarmanButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

