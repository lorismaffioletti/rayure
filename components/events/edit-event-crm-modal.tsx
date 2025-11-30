'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateEvent } from '@/app/actions/events';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Event, Company, Contact } from '@/types/database';

interface EditEventCrmModalProps {
  children: ReactNode;
  event: Event;
  companies: Company[];
  contacts: Contact[];
}

export function EditEventCrmModal({ children, event, companies, contacts }: EditEventCrmModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [assigned_company_id, setAssignedCompanyId] = useState(event.assigned_company_id || '');
  const [assigned_contact_id, setAssignedContactId] = useState(event.assigned_contact_id || '');
  const [ca_ht, setCaHt] = useState(event.ca_ht?.toString() || '');
  const [status, setStatus] = useState(event.status);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setAssignedCompanyId(event.assigned_company_id || '');
      setAssignedContactId(event.assigned_contact_id || '');
      setCaHt(event.ca_ht?.toString() || '');
      setStatus(event.status);
    }
  }, [open, event]);

  const filteredContacts = useMemo(() => {
    return assigned_company_id
      ? contacts.filter((c) => c.company_id === assigned_company_id)
      : contacts;
  }, [contacts, assigned_company_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateEvent(event.id, {
        assigned_company_id: assigned_company_id || undefined,
        assigned_contact_id: assigned_contact_id || undefined,
        ca_ht: ca_ht ? parseFloat(ca_ht) : undefined,
        status,
      });
      toast.success('Informations CRM modifiées avec succès');
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const EVENT_STATUSES = [
    { value: 'prospect', label: 'Prospect' },
    { value: 'negociation', label: 'Négociation' },
    { value: 'validé', label: 'Validé' },
    { value: 'perdu', label: 'Perdu' },
    { value: 'terminé', label: 'Terminé' },
    { value: 'consolidé', label: 'Consolidé' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier les informations CRM</DialogTitle>
          <DialogDescription>
            Modifiez les informations relatives au contact, à l'entreprise et au CA
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crm-company_id">Entreprise</Label>
              <select
                id="crm-company_id"
                value={assigned_company_id}
                onChange={(e) => {
                  setAssignedCompanyId(e.target.value);
                  setAssignedContactId('');
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Aucune</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crm-contact_id">Contact</Label>
              <select
                id="crm-contact_id"
                value={assigned_contact_id}
                onChange={(e) => setAssignedContactId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={!assigned_company_id}
              >
                <option value="">Aucun</option>
                {filteredContacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crm-status">Statut *</Label>
              <select
                id="crm-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {EVENT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crm-ca_ht">CA HT (€)</Label>
              <Input
                id="crm-ca_ht"
                type="number"
                step="0.01"
                value={ca_ht}
                onChange={(e) => setCaHt(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Modification...' : 'Modifier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

