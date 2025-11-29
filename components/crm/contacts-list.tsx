import Link from 'next/link';
import { Users } from 'lucide-react';
import { getContacts } from '@/lib/supabase/queries/contacts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';

interface ContactsListProps {
  companyId?: string;
  search?: string;
}

export async function ContactsList({ companyId, search }: ContactsListProps) {
  const contacts = await getContacts({ companyId, search });

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Link
                  href={`/crm/contacts/${contact.id}`}
                  className="font-medium hover:underline"
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

