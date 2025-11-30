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
import { Textarea } from '@/components/ui/textarea';
import { updateEvent } from '@/app/actions/events';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Event, Company, Contact, Barman } from '@/types/database';

interface EditEventModalProps {
  children: ReactNode;
  event: Event;
  companies: Company[];
  contacts: Contact[];
  barmans: Barman[];
}

const EVENT_STATUSES = [
  { value: 'prospect', label: 'Prospect' },
  { value: 'negociation', label: 'Négociation' },
  { value: 'validé', label: 'Validé' },
  { value: 'perdu', label: 'Perdu' },
  { value: 'terminé', label: 'Terminé' },
  { value: 'consolidé', label: 'Consolidé' },
];

export function EditEventModal({
  children,
  event,
  companies,
  contacts,
  barmans,
}: EditEventModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [location, setLocation] = useState(event.location || '');
  const [date, setDate] = useState(
    event.date ? new Date(event.date).toISOString().slice(0, 10) : ''
  );
  const [start_time, setStartTime] = useState(
    event.start_time ? new Date(event.start_time).toTimeString().slice(0, 5) : ''
  );
  const [end_time, setEndTime] = useState(
    event.end_time ? new Date(event.end_time).toTimeString().slice(0, 5) : ''
  );
  const [setup_time, setSetupTime] = useState(
    event.setup_time ? new Date(event.setup_time).toTimeString().slice(0, 5) : ''
  );
  const [assigned_company_id, setAssignedCompanyId] = useState(event.assigned_company_id || '');
  const [assigned_contact_id, setAssignedContactId] = useState(event.assigned_contact_id || '');
  const [status, setStatus] = useState(event.status);
  const [provenance, setProvenance] = useState(event.provenance || '');
  const [has_beer_truck, setHasBeerTruck] = useState<boolean | null>(event.has_beer_truck);
  const [stand_count, setStandCount] = useState(event.stand_count?.toString() || '');
  const [ca_ht, setCaHt] = useState(event.ca_ht?.toString() || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(event.title);
      setLocation(event.location || '');
      setDate(event.date ? new Date(event.date).toISOString().slice(0, 10) : '');
      setStartTime(event.start_time ? new Date(event.start_time).toTimeString().slice(0, 5) : '');
      setEndTime(event.end_time ? new Date(event.end_time).toTimeString().slice(0, 5) : '');
      setSetupTime(event.setup_time ? new Date(event.setup_time).toTimeString().slice(0, 5) : '');
      setAssignedCompanyId(event.assigned_company_id || '');
      setAssignedContactId(event.assigned_contact_id || '');
      setStatus(event.status);
      setProvenance(event.provenance || '');
      setHasBeerTruck(event.has_beer_truck);
      setStandCount(event.stand_count?.toString() || '');
      setCaHt(event.ca_ht?.toString() || '');
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
        title,
        location: location || undefined,
        date: date ? new Date(date).toISOString() : undefined,
        start_time: start_time && date ? `${date}T${start_time}` : undefined,
        end_time: end_time && date ? `${date}T${end_time}` : undefined,
        setup_time: setup_time && date ? `${date}T${setup_time}` : undefined,
        assigned_company_id: assigned_company_id || undefined,
        assigned_contact_id: assigned_contact_id || undefined,
        status,
        provenance: provenance || undefined,
        has_beer_truck: has_beer_truck !== null ? has_beer_truck : undefined,
        stand_count: stand_count ? parseInt(stand_count) : undefined,
        ca_ht: ca_ht ? parseFloat(ca_ht) : undefined,
      });
      toast.success('Événement modifié avec succès');
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'événement</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'événement
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Nom de l'événement *</Label>
            <Input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-location">Lieu</Label>
              <Input
                id="edit-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Date *</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-start_time">Horaires - Début</Label>
              <Input
                id="edit-start_time"
                type="time"
                value={start_time}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-end_time">Horaires - Fin</Label>
              <Input
                id="edit-end_time"
                type="time"
                value={end_time}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-setup_time">Heure d'installation</Label>
              <Input
                id="edit-setup_time"
                type="time"
                value={setup_time}
                onChange={(e) => setSetupTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company_id">Entreprise</Label>
              <select
                id="edit-company_id"
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
              <Label htmlFor="edit-contact_id">Contact</Label>
              <select
                id="edit-contact_id"
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
            <Label htmlFor="edit-provenance">Provenance de l'événement</Label>
            <Input
              id="edit-provenance"
              type="text"
              value={provenance}
              onChange={(e) => setProvenance(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-has_beer_truck">Beer Truck</Label>
              <select
                id="edit-has_beer_truck"
                value={has_beer_truck === null ? '' : has_beer_truck ? 'yes' : 'no'}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setHasBeerTruck(null);
                  } else {
                    setHasBeerTruck(e.target.value === 'yes');
                  }
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">-</option>
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-stand_count">Stand : Nombre</Label>
              <Input
                id="edit-stand_count"
                type="number"
                min="0"
                value={stand_count}
                onChange={(e) => setStandCount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">Statut *</Label>
              <select
                id="edit-status"
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
              <Label htmlFor="edit-ca_ht">CA HT (€)</Label>
              <Input
                id="edit-ca_ht"
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

