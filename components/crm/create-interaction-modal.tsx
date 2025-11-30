'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createInteraction } from '@/app/actions/interactions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Phone, Mail, MessageSquare, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InteractionType } from '@/types/database';

interface CreateInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contactId: string;
  contactName: string;
}

const INTERACTION_TYPES: { value: InteractionType; label: string; icon: React.ReactNode }[] = [
  { value: 'appel', label: 'Appel', icon: <Phone className="h-4 w-4" /> },
  { value: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
  { value: 'sms', label: 'SMS', icon: <MessageSquare className="h-4 w-4" /> },
  { value: 'rdv', label: 'Rendez-vous', icon: <Calendar className="h-4 w-4" /> },
];

export function CreateInteractionModal({
  isOpen,
  onClose,
  onSuccess,
  contactId,
  contactName,
}: CreateInteractionModalProps) {
  const router = useRouter();
  const [type, setType] = useState<InteractionType>('appel');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType('appel');
      setDate(new Date().toISOString().slice(0, 16));
      setContent('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createInteraction({
        contact_id: contactId,
        type,
        date: new Date(date).toISOString(),
        content: content || undefined,
      });
      toast.success('Interaction créée avec succès');
      setType('appel');
      setDate(new Date().toISOString().slice(0, 16));
      setContent('');
      onClose();
      router.refresh();
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter une interaction</DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle interaction avec {contactName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type *</Label>
            <div className="grid grid-cols-2 gap-2">
              {INTERACTION_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={cn(
                    'flex items-center gap-2 rounded-md border p-3 text-left transition-colors',
                    type === t.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input hover:bg-muted'
                  )}
                >
                  {t.icon}
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date et heure *</Label>
            <Input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Notes</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Détails de l'interaction..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
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

