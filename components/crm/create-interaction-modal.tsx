'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { createInteraction } from '@/app/actions/interactions';
import type { InteractionType } from '@/types/database';

interface CreateInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contactId: string;
  contactName: string;
}

const INTERACTION_TYPES: { value: InteractionType; label: string; icon: string }[] = [
  { value: 'appel', label: 'Appel', icon: '📞' },
  { value: 'email', label: 'Email', icon: '✉️' },
  { value: 'sms', label: 'SMS', icon: '💬' },
  { value: 'rdv', label: 'Rendez-vous', icon: '📅' },
];

export function CreateInteractionModal({
  isOpen,
  onClose,
  onSuccess,
  contactId,
  contactName,
}: CreateInteractionModalProps) {
  const [type, setType] = useState<InteractionType>('appel');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createInteraction({
        contact_id: contactId,
        type,
        date: new Date(date).toISOString(),
        content: content || undefined,
      });
      setType('appel');
      setDate(new Date().toISOString().slice(0, 16));
      setContent('');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Ajouter une interaction - ${contactName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
        )}

        <div>
          <label htmlFor="type" className="block text-sm font-medium">
            Type *
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {INTERACTION_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`rounded-md border p-3 text-left transition ${
                  type === t.value
                    ? 'border-neutral-900 bg-neutral-50'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <span className="mr-2">{t.icon}</span>
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Date et heure *
          </label>
          <input
            id="date"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            Notes
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="Détails de l'interaction..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

