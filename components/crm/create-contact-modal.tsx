'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { createContact } from '@/app/actions/contacts';
import type { Company } from '@/types/database';

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultCompanyId?: string;
  companies: Company[];
}

export function CreateContactModal({
  isOpen,
  onClose,
  onSuccess,
  defaultCompanyId,
  companies,
}: CreateContactModalProps) {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [company_id, setCompanyId] = useState<string>(defaultCompanyId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createContact({
        first_name,
        last_name,
        email: email || undefined,
        phone: phone || undefined,
        role: role || undefined,
        company_id: company_id || undefined,
      });
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setRole('');
      setCompanyId(defaultCompanyId || '');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer un contact">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium">
              Prénom *
            </label>
            <input
              id="first_name"
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium">
              Nom *
            </label>
            <input
              id="last_name"
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Téléphone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium">
            Rôle
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>

        <div>
          <label htmlFor="company_id" className="block text-sm font-medium">
            Entreprise
          </label>
          <select
            id="company_id"
            value={company_id}
            onChange={(e) => setCompanyId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          >
            <option value="">Aucune</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
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

