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
import { createEvent, createEventStaff } from '@/app/actions/events';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import type { Company, Contact, Barman } from '@/types/database';

interface CreateEventModalProps {
  children?: ReactNode;
  companies: Company[];
  contacts: Contact[];
  barmans: Barman[];
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

interface StaffMember {
  barman_id: string;
  start_time: string;
  end_time: string;
  hours: number;
}

export function CreateEventModal({
  children,
  companies,
  contacts,
  barmans,
  defaultDate,
}: CreateEventModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(
    defaultDate ? defaultDate.toISOString().slice(0, 10) : ''
  );
  const [start_time, setStartTime] = useState('');
  const [end_time, setEndTime] = useState('');
  const [setup_time, setSetupTime] = useState('');
  const [assigned_company_id, setAssignedCompanyId] = useState<string>('');
  const [assigned_contact_id, setAssignedContactId] = useState<string>('');
  const [status, setStatus] = useState('prospect');
  const [provenance, setProvenance] = useState('');
  const [has_beer_truck, setHasBeerTruck] = useState<boolean | null>(null);
  const [stand_count, setStandCount] = useState('');
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && defaultDate) {
      setDate(defaultDate.toISOString().slice(0, 10));
    }
  }, [open, defaultDate]);

  const filteredContacts = useMemo(() => {
    return assigned_company_id
      ? contacts.filter((c) => c.company_id === assigned_company_id)
      : contacts;
  }, [contacts, assigned_company_id]);

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(`${date}T${start}`);
    const endDate = new Date(`${date}T${end}`);
    if (endDate < startDate) {
      // If end is before start, assume it's the next day
      endDate.setDate(endDate.getDate() + 1);
    }
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  };

  const addStaffMember = () => {
    setStaff([
      ...staff,
      {
        barman_id: '',
        start_time: '',
        end_time: '',
        hours: 0,
      },
    ]);
  };

  const updateStaffMember = (index: number, field: keyof StaffMember, value: string | number) => {
    const updated = [...staff];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'start_time' || field === 'end_time') {
      updated[index].hours = calculateHours(
        updated[index].start_time,
        updated[index].end_time
      );
    }
    setStaff(updated);
  };

  const removeStaffMember = (index: number) => {
    setStaff(staff.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the event first
      const eventDate = date ? new Date(date).toISOString() : undefined;
      const event = await createEvent({
        title,
        location: location || undefined,
        date: eventDate,
        start_time: start_time ? `${date}T${start_time}` : undefined,
        end_time: end_time ? `${date}T${end_time}` : undefined,
        setup_time: setup_time ? `${date}T${setup_time}` : undefined,
        assigned_company_id: assigned_company_id || undefined,
        assigned_contact_id: assigned_contact_id || undefined,
        status,
        provenance: provenance || undefined,
        has_beer_truck: has_beer_truck !== null ? has_beer_truck : undefined,
        stand_count: stand_count ? parseInt(stand_count) : undefined,
      });

      // Then create staff members
      if (event && staff.length > 0) {
        for (const member of staff) {
          if (member.barman_id && member.start_time && member.end_time) {
            await createEventStaff({
              event_id: event.id,
              barman_id: member.barman_id,
              start_time: `${date}T${member.start_time}`,
              end_time: `${date}T${member.end_time}`,
            });
          }
        }
      }

      toast.success('Événement créé avec succès');
      // Reset form
      setTitle('');
      setLocation('');
      setDate(defaultDate ? defaultDate.toISOString().slice(0, 10) : '');
      setStartTime('');
      setEndTime('');
      setSetupTime('');
      setAssignedCompanyId('');
      setAssignedContactId('');
      setStatus('prospect');
      setProvenance('');
      setHasBeerTruck(null);
      setStandCount('');
      setStaff([]);
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
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un événement</DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel événement à votre calendrier
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Informations de base</h3>
            <div className="space-y-2">
              <Label htmlFor="title">Nom de l'événement *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Horaires - Début</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={start_time}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">Horaires - Fin</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={end_time}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setup_time">Heure d'installation</Label>
                <Input
                  id="setup_time"
                  type="time"
                  value={setup_time}
                  onChange={(e) => setSetupTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* CRM */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Liaison CRM</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_id">Lier à une entreprise du CRM</Label>
                <select
                  id="company_id"
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
                <Label htmlFor="contact_id">Lier à un contact du CRM</Label>
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
          </div>

          {/* Provenance et équipement */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Provenance et équipement</h3>
            <div className="space-y-2">
              <Label htmlFor="provenance">Provenance de l'événement ?</Label>
              <Input
                id="provenance"
                type="text"
                value={provenance}
                onChange={(e) => setProvenance(e.target.value)}
                placeholder="Ex: Salon, Recommandation, Site web..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="has_beer_truck">Beer Truck</Label>
                <select
                  id="has_beer_truck"
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
                <Label htmlFor="stand_count">Stand : Nombre</Label>
                <Input
                  id="stand_count"
                  type="number"
                  min="0"
                  value={stand_count}
                  onChange={(e) => setStandCount(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Staff */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Staff</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStaffMember}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter un staff
              </Button>
            </div>

            {staff.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun staff ajouté</p>
            ) : (
              <div className="space-y-3">
                {staff.map((member, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Staff #{index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStaffMember(index)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`staff-barman-${index}`}>Barman *</Label>
                        <select
                          id={`staff-barman-${index}`}
                          value={member.barman_id}
                          onChange={(e) =>
                            updateStaffMember(index, 'barman_id', e.target.value)
                          }
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Sélectionner un barman</option>
                          {barmans.map((barman) => (
                            <option key={barman.id} value={barman.id}>
                              {barman.first_name} {barman.last_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`staff-start-${index}`}>Heure de début *</Label>
                        <Input
                          id={`staff-start-${index}`}
                          type="time"
                          value={member.start_time}
                          onChange={(e) =>
                            updateStaffMember(index, 'start_time', e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`staff-end-${index}`}>Heure de fin *</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`staff-end-${index}`}
                            type="time"
                            value={member.end_time}
                            onChange={(e) =>
                              updateStaffMember(index, 'end_time', e.target.value)
                            }
                            required
                            className="flex-1"
                          />
                          {member.hours > 0 && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{member.hours}h</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Statut */}
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
