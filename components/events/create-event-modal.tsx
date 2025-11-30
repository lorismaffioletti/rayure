'use client';

import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { createEvent } from '@/app/actions/events';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Company, Contact } from '@/types/database';

interface CreateEventModalProps {
  children?: ReactNode;
  companies: Company[];
  contacts: Contact[];
  defaultDate?: Date;
}

const EVENT_STATUSES = [
  { value: 'prospect', label: 'Prospect' },
  { value: 'negociation', label: 'Négociation' },
  { value: 'validé', label: 'Validé' },
  { value: 'perdu', label: 'Perdu' },
  { value: 'terminé', label: 'Terminé' },
  { value: 'consolidé', label: 'Consolidé' },
];

export function CreateEventModal({
  children,
  companies,
  contacts,
  defaultDate,
}: CreateEventModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(
    defaultDate ? defaultDate.toISOString().slice(0, 16) : ''
  );
  const [status, setStatus] = useState('prospect');
  const [assigned_company_id, setAssignedCompanyId] = useState<string>('');
  const [assigned_contact_id, setAssignedContactId] = useState<string>('');
  const [ca_ht, setCaHt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && defaultDate) {
      setDate(defaultDate.toISOString().slice(0, 16));
    }
  }, [open, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEvent({
        title,
        description: description || undefined,
        location: location || undefined,
        date: date ? new Date(date).toISOString() : undefined,
        status,
        assigned_company_id: assigned_company_id || undefined,
        assigned_contact_id: assigned_contact_id || undefined,
        ca_ht: ca_ht ? parseFloat(ca_ht) : undefined,
      });
      toast.success('Événement créé avec succès');
      setTitle('');
      setDescription('');
      setLocation('');
      setDate(defaultDate ? defaultDate.toISOString().slice(0, 16) : '');
      setStatus('prospect');
      setAssignedCompanyId('');
      setAssignedContactId('');
      setCaHt('');
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = assigned_company_id
    ? contacts.filter((c) => c.company_id === assigned_company_id)
    : contacts;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un événement</DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel événement à votre calendrier
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date et heure</Label>
              <Input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <select
                id="status"
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_id">Entreprise</Label>
              <select
                id="company_id"
                value={assigned_company_id}
                onChange={(e) => {
                  setAssignedCompanyId(e.target.value);
                  setAssignedContactId(''); // Reset contact when company changes
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
              <Label htmlFor="contact_id">Contact</Label>
              <select
                id="contact_id"
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

          <div className="space-y-2">
            <Label htmlFor="ca_ht">CA HT (€)</Label>
            <Input
              id="ca_ht"
              type="number"
              step="0.01"
              value={ca_ht}
              onChange={(e) => setCaHt(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

