'use client';

import Link from 'next/link';
import { Users, Pencil, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { EditContactModal } from '@/components/crm/edit-contact-modal';
import { DeleteContactButton } from '@/components/crm/delete-contact-button';
import type { Contact, Company } from '@/types/database';

interface ContactsListProps {
  contacts: Array<Contact & { company?: Company | null }>;
  companies: Company[];
}

export function ContactsList({ contacts, companies }: ContactsListProps) {
  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-12 w-12" />}
        title="Aucun contact trouvé"
        description="Commencez par créer votre premier contact"
      />
    );
  }
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden sm:table-cell">Téléphone</TableHead>
            <TableHead className="hidden md:table-cell">Entreprise</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Link
                  href={`/crm/contacts/${contact.id}`}
                  className="font-medium text-foreground hover:underline hover:text-primary"
                >
                  {contact.first_name} {contact.last_name}
                </Link>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {contact.email || '-'}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {contact.phone || '-'}
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {contact.company?.name || '-'}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <EditContactModal contact={contact} companies={companies}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                  </EditContactModal>
                  <DeleteContactButton
                    contactId={contact.id}
                    contactName={`${contact.first_name} ${contact.last_name}`}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8 !text-destructive hover:!text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </DeleteContactButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

