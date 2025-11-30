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
import { createEventStaff, deleteEventStaff } from '@/app/actions/events';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Clock } from 'lucide-react';
import type { ReactNode } from 'react';
import type { EventStaff, Barman } from '@/types/database';

interface EditEventStaffModalProps {
  children: ReactNode;
  eventId: string;
  staff: Array<EventStaff & { barman?: Barman | null }>;
  barmans: Barman[];
  eventDate: string | null;
}

export function EditEventStaffModal({
  children,
  eventId,
  staff,
  barmans,
  eventDate,
}: EditEventStaffModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<{
    barman_id: string;
    start_time: string;
    end_time: string;
  }>({
    barman_id: '',
    start_time: '',
    end_time: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setNewStaff({
        barman_id: '',
        start_time: '',
        end_time: '',
      });
    }
  }, [open]);

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end || !eventDate) return 0;
    const startDate = new Date(`${eventDate}T${start}`);
    const endDate = new Date(`${eventDate}T${end}`);
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.barman_id || !newStaff.start_time || !newStaff.end_time || !eventDate) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await createEventStaff({
        event_id: eventId,
        barman_id: newStaff.barman_id,
        start_time: `${eventDate}T${newStaff.start_time}`,
        end_time: `${eventDate}T${newStaff.end_time}`,
      });
      toast.success('Staff ajouté avec succès');
      setNewStaff({
        barman_id: '',
        start_time: '',
        end_time: '',
      });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce staff ?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteEventStaff(staffId);
      toast.success('Staff supprimé avec succès');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const hours = calculateHours(newStaff.start_time, newStaff.end_time);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gérer le staff</DialogTitle>
          <DialogDescription>
            Ajoutez ou supprimez des membres du staff pour cet événement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulaire d'ajout */}
          <form onSubmit={handleAddStaff} className="space-y-4 rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Ajouter un staff</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="staff-barman">Barman *</Label>
                <select
                  id="staff-barman"
                  value={newStaff.barman_id}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, barman_id: e.target.value })
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
                <Label htmlFor="staff-start">Heure de début *</Label>
                <Input
                  id="staff-start"
                  type="time"
                  value={newStaff.start_time}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, start_time: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-end">Heure de fin *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="staff-end"
                    type="time"
                    value={newStaff.end_time}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, end_time: e.target.value })
                    }
                    required
                    className="flex-1"
                  />
                  {hours > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{hours}h</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button type="submit" size="sm" disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </form>

          {/* Liste du staff existant */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Staff actuel ({staff.length})</h3>
            {staff.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun staff assigné</p>
            ) : (
              <div className="space-y-2">
                {staff.map((member) => {
                  const startTime = new Date(member.start_time);
                  const endTime = new Date(member.end_time);

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium">
                          {member.barman
                            ? `${member.barman.first_name} ${member.barman.last_name}`
                            : 'Barman inconnu'}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {startTime.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              -{' '}
                              {endTime.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <span>{member.hours_worked.toFixed(2)}h</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteStaff(member.id)}
                        disabled={loading}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

