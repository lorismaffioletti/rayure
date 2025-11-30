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
import { updateEvent } from '@/app/actions/events';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Event } from '@/types/database';

interface EditEventInfoModalProps {
  children: ReactNode;
  event: Event;
}

export function EditEventInfoModal({ children, event }: EditEventInfoModalProps) {
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
  const [provenance, setProvenance] = useState(event.provenance || '');
  const [has_beer_truck, setHasBeerTruck] = useState<boolean | null>(event.has_beer_truck);
  const [stand_count, setStandCount] = useState(event.stand_count?.toString() || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(event.title);
      setLocation(event.location || '');
      setDate(event.date ? new Date(event.date).toISOString().slice(0, 10) : '');
      setStartTime(event.start_time ? new Date(event.start_time).toTimeString().slice(0, 5) : '');
      setEndTime(event.end_time ? new Date(event.end_time).toTimeString().slice(0, 5) : '');
      setSetupTime(event.setup_time ? new Date(event.setup_time).toTimeString().slice(0, 5) : '');
      setProvenance(event.provenance || '');
      setHasBeerTruck(event.has_beer_truck);
      setStandCount(event.stand_count?.toString() || '');
    }
  }, [open, event]);

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
        provenance: provenance || undefined,
        has_beer_truck: has_beer_truck !== null ? has_beer_truck : undefined,
        stand_count: stand_count ? parseInt(stand_count) : undefined,
      });
      toast.success('Informations modifiées avec succès');
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier les informations principales</DialogTitle>
          <DialogDescription>
            Modifiez les informations de base de l'événement
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="info-title">Nom de l'événement *</Label>
            <Input
              id="info-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="info-location">Lieu</Label>
              <Input
                id="info-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="info-date">Date *</Label>
              <Input
                id="info-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="info-start_time">Horaires - Début</Label>
              <Input
                id="info-start_time"
                type="time"
                value={start_time}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="info-end_time">Horaires - Fin</Label>
              <Input
                id="info-end_time"
                type="time"
                value={end_time}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="info-setup_time">Heure d'installation</Label>
              <Input
                id="info-setup_time"
                type="time"
                value={setup_time}
                onChange={(e) => setSetupTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="info-provenance">Provenance de l'événement</Label>
            <Input
              id="info-provenance"
              type="text"
              value={provenance}
              onChange={(e) => setProvenance(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="info-has_beer_truck">Beer Truck</Label>
              <select
                id="info-has_beer_truck"
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
              <Label htmlFor="info-stand_count">Stand : Nombre</Label>
              <Input
                id="info-stand_count"
                type="number"
                min="0"
                value={stand_count}
                onChange={(e) => setStandCount(e.target.value)}
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

