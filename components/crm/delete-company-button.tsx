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
import { deleteCompany } from '@/app/actions/companies';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface DeleteCompanyButtonProps {
  companyId: string;
  companyName: string;
  children: ReactNode;
  onSuccess?: () => void;
}

export function DeleteCompanyButton({
  companyId,
  companyName,
  children,
  onSuccess,
}: DeleteCompanyButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteCompany(companyId);
      toast.success('Entreprise supprimée avec succès');
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/crm/companies');
        router.refresh();
      }
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
          <DialogTitle>Supprimer l'entreprise</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer <strong>{companyName}</strong> ? Cette action est
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

