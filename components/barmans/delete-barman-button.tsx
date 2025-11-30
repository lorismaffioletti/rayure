'use client';

import { useState } from 'react';
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
import { deleteBarman } from '@/app/actions/barmans';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface DeleteBarmanButtonProps {
  barmanId: string;
  barmanName: string;
  children: ReactNode;
}

export function DeleteBarmanButton({
  barmanId,
  barmanName,
  children,
}: DeleteBarmanButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteBarman(barmanId);
      toast.success('Barman supprimé avec succès');
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
          <DialogTitle>Supprimer le barman</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer <strong>{barmanName}</strong> ? Cette action est
            irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

