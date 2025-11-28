import Link from 'next/link';
import { getContacts } from '@/lib/supabase/queries/contacts';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface ContactsListProps {
  companyId?: string;
  search?: string;
}

export async function ContactsList({ companyId, search }: ContactsListProps) {
  const contacts = await getContacts({ companyId, search });

  if (contacts.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
        <p className="text-neutral-500">Aucun contact trouvé</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden sm:table-cell">Téléphone</TableHead>
            <TableHead className="hidden md:table-cell">Entreprise</TableHead>
          </TableRow>
        </TableHeader>
        <tbody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="hover:bg-neutral-50">
              <TableCell>
                <Link
                  href={`/crm/contacts/${contact.id}`}
                  className="font-medium text-neutral-900 hover:underline"
                >
                  {contact.first_name} {contact.last_name}
                </Link>
              </TableCell>
              <TableCell className="hidden text-neutral-600 sm:table-cell">
                {contact.email || '-'}
              </TableCell>
              <TableCell className="hidden text-neutral-600 sm:table-cell">
                {contact.phone || '-'}
              </TableCell>
              <TableCell className="hidden text-neutral-600 md:table-cell">
                {contact.company?.name || '-'}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

