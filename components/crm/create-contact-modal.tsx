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
import { createContact } from '@/app/actions/contacts';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Company } from '@/types/database';
import type { ReactNode } from 'react';

interface CreateContactModalProps {
  children?: ReactNode;
  defaultCompanyId?: string;
  companies: Company[];
}

export function CreateContactModal({
  children,
  defaultCompanyId,
  companies,
}: CreateContactModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [source, setSource] = useState('');
  const [meeting_date, setMeetingDate] = useState('');
  const [company_id, setCompanyId] = useState<string>(defaultCompanyId || '');
  const [loading, setLoading] = useState(false);

  // Ouvrir le modal si le paramètre create=true est présent
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setOpen(true);
      // Nettoyer l'URL
      router.replace('/crm/contacts', { scroll: false });
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createContact({
        first_name,
        last_name,
        email: email || undefined,
        phone: phone || undefined,
        role: role || undefined,
        source: source || undefined,
        meeting_date: meeting_date || undefined,
        company_id: company_id || undefined,
      });
      toast.success('Contact créé avec succès');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setRole('');
      setSource('');
      setMeetingDate('');
      setCompanyId(defaultCompanyId || '');
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
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un contact</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau contact à votre CRM
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom *</Label>
              <Input
                id="first_name"
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom *</Label>
              <Input
                id="last_name"
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Input
              id="role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source du contact</Label>
            <Input
              id="source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Ex: LinkedIn, Salon, Recommandation..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_date">Date de rencontre</Label>
            <Input
              id="meeting_date"
              type="date"
              value={meeting_date}
              onChange={(e) => setMeetingDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_id">Entreprise</Label>
            <select
              id="company_id"
              value={company_id}
              onChange={(e) => setCompanyId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Aucune</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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

