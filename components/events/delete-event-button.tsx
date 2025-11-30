'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteEvent } from '@/app/actions/events';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface DeleteEventButtonProps {
  children: ReactNode;
  eventId: string;
  eventTitle: string;
}

export function DeleteEventButton({ children, eventId, eventTitle }: DeleteEventButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteEvent(eventId);
      toast.success(`L'événement "${eventTitle}" a été supprimé.`);
      router.push('/events');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement l'événement{' '}
            <span className="font-semibold">{eventTitle}</span> et toutes les données associées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={loading}>
              Annuler
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? 'Suppression...' : 'Supprimer'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

