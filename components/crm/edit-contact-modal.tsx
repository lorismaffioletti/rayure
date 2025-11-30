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
import { updateContact } from '@/app/actions/contacts';
import { toast } from 'sonner';
import type { Contact, Company } from '@/types/database';
import type { ReactNode } from 'react';

interface EditContactModalProps {
  contact: Contact & { company?: Company | null };
  companies: Company[];
  children: ReactNode;
}

export function EditContactModal({ contact, companies, children }: EditContactModalProps) {
  const [open, setOpen] = useState(false);
  const [first_name, setFirstName] = useState(contact.first_name);
  const [last_name, setLastName] = useState(contact.last_name);
  const [email, setEmail] = useState(contact.email || '');
  const [phone, setPhone] = useState(contact.phone || '');
  const [role, setRole] = useState(contact.role || '');
  const [company_id, setCompanyId] = useState<string>(contact.company_id || '');
  const [relationship_start_date, setRelationshipStartDate] = useState(
    contact.relationship_start_date ? contact.relationship_start_date.split('T')[0] : ''
  );
  const [source, setSource] = useState(contact.source || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFirstName(contact.first_name);
      setLastName(contact.last_name);
      setEmail(contact.email || '');
      setPhone(contact.phone || '');
      setRole(contact.role || '');
      setCompanyId(contact.company_id || '');
      setRelationshipStartDate(
        contact.relationship_start_date ? contact.relationship_start_date.split('T')[0] : ''
      );
      setSource(contact.source || '');
    }
  }, [open, contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateContact(contact.id, {
        first_name,
        last_name,
        email: email || undefined,
        phone: phone || undefined,
        role: role || undefined,
        company_id: company_id || undefined,
        relationship_start_date: relationship_start_date || undefined,
        source: source || undefined,
      });
      toast.success('Contact modifié avec succès');
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le contact</DialogTitle>
          <DialogDescription>
            Modifiez les informations du contact
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
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
            <Label htmlFor="edit-role">Rôle</Label>
            <Input
              id="edit-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-company_id">Entreprise</Label>
            <select
              id="edit-company_id"
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

          <div className="space-y-2">
            <Label htmlFor="edit-relationship_start_date">Début de relation</Label>
            <Input
              id="edit-relationship_start_date"
              type="date"
              value={relationship_start_date}
              onChange={(e) => setRelationshipStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-source">Source</Label>
            <Input
              id="edit-source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Ex: LinkedIn, Salon, Recommandation..."
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

