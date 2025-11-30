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
import { updateBarman } from '@/app/actions/barmans';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Barman } from '@/types/database';
import type { ReactNode } from 'react';

interface EditBarmanModalProps {
  barman: Barman;
  children: ReactNode;
}

export function EditBarmanModal({ barman, children }: EditBarmanModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [first_name, setFirstName] = useState(barman.first_name);
  const [last_name, setLastName] = useState(barman.last_name);
  const [phone, setPhone] = useState(barman.phone || '');
  const [email, setEmail] = useState(barman.email || '');
  const [date_of_birth, setDateOfBirth] = useState(
    barman.date_of_birth ? barman.date_of_birth.split('T')[0] : ''
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFirstName(barman.first_name);
      setLastName(barman.last_name);
      setPhone(barman.phone || '');
      setEmail(barman.email || '');
      setDateOfBirth(barman.date_of_birth ? barman.date_of_birth.split('T')[0] : '');
    }
  }, [open, barman]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateBarman(barman.id, {
        first_name,
        last_name,
        phone: phone || undefined,
        email: email || undefined,
        date_of_birth: date_of_birth || undefined,
      });
      toast.success('Barman modifié avec succès');
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le barman</DialogTitle>
          <DialogDescription>
            Modifiez les informations du barman
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-first_name">Prénom *</Label>
              <Input
                id="edit-first_name"
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-last_name">Nom *</Label>
              <Input
                id="edit-last_name"
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Téléphone</Label>
            <Input
              id="edit-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date_of_birth">Date de naissance</Label>
            <Input
              id="edit-date_of_birth"
              type="date"
              value={date_of_birth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
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

