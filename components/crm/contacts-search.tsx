'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ContactsList } from '@/components/crm/contacts-list';
import type { Contact, Company } from '@/types/database';

interface ContactsSearchProps {
  contacts: Array<Contact & { company?: Company | null }>;
  companies: Company[];
}

export function ContactsSearch({ contacts, companies }: ContactsSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return contacts;
    }

    const query = searchQuery.toLowerCase().trim();
    return contacts.filter((contact) => {
      const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
      const email = (contact.email || '').toLowerCase();
      const phone = (contact.phone || '').toLowerCase();
      const companyName = (contact.company?.name || '').toLowerCase();
      const role = (contact.role || '').toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        companyName.includes(query) ||
        role.includes(query)
      );
    });
  }, [contacts, searchQuery]);

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un contact (nom, email, téléphone, entreprise, rôle)..."
            className="pl-10"
          />
        </div>
      </div>
      <ContactsList contacts={filteredContacts} companies={companies} />
    </>
  );
}

