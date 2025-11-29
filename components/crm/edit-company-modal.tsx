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
import { updateCompany } from '@/app/actions/companies';
import { toast } from 'sonner';
import type { CompanyType, Company } from '@/types/database';
import type { ReactNode } from 'react';

interface EditCompanyModalProps {
  company: Company;
  children: ReactNode;
}

const COMPANY_TYPES: { value: CompanyType; label: string }[] = [
  { value: 'mairie', label: 'Mairie' },
  { value: 'agence', label: 'Agence' },
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'autre', label: 'Autre' },
];

export function EditCompanyModal({ company, children }: EditCompanyModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(company.name);
  const [type, setType] = useState<CompanyType>(company.type);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(company.name);
      setType(company.type);
    }
  }, [open, company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateCompany(company.id, { name, type });
      toast.success('Entreprise modifiée avec succès');
      setOpen(false);
      window.location.reload();
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
          <DialogTitle>Modifier l'entreprise</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'entreprise
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nom *</Label>
            <Input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-type">Type *</Label>
            <select
              id="edit-type"
              value={type}
              onChange={(e) => setType(e.target.value as CompanyType)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {COMPANY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
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

