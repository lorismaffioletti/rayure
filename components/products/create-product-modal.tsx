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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProduct } from '@/app/actions/products';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface CreateProductModalProps {
  children?: ReactNode;
}

export function CreateProductModal({ children }: CreateProductModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [supplier_name, setSupplierName] = useState('');
  const [initial_price_ht, setInitialPriceHt] = useState('');
  const [initial_vat_rate, setInitialVatRate] = useState('20');
  const [initial_quantity, setInitialQuantity] = useState('0');
  const [unit, setUnit] = useState('unité');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!name.trim()) {
        toast.error('Le nom du produit est requis');
        return;
      }

      await createProduct({
        name: name.trim(),
        supplier_name: supplier_name.trim() || undefined,
        initial_price_ht: initial_price_ht ? parseFloat(initial_price_ht) : undefined,
        initial_vat_rate: initial_vat_rate ? parseFloat(initial_vat_rate) / 100 : undefined,
        initial_quantity: initial_quantity ? parseInt(initial_quantity) : undefined,
        unit: unit || 'unité',
      });
      toast.success('Produit créé avec succès');
      setName('');
      setSupplierName('');
      setInitialPriceHt('');
      setInitialVatRate('20');
      setInitialQuantity('0');
      setUnit('unité');
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
          <DialogDescription>
            Créez un nouveau produit dans votre catalogue
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Fût Blonde 30L"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier_name">Fournisseur</Label>
              <Input
                id="supplier_name"
                type="text"
                value={supplier_name}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Ex: Brasserie Demo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unité de mesure</Label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="unité">Unité</option>
                <option value="fût">Fût</option>
                <option value="bouteille">Bouteille</option>
                <option value="kg">Kilogramme</option>
                <option value="L">Litre</option>
                <option value="m²">Mètre carré</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial_price_ht">Prix HT (€)</Label>
              <Input
                id="initial_price_ht"
                type="number"
                step="0.01"
                min="0"
                value={initial_price_ht}
                onChange={(e) => setInitialPriceHt(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial_vat_rate">Taux de TVA (%)</Label>
              <Input
                id="initial_vat_rate"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={initial_vat_rate}
                onChange={(e) => setInitialVatRate(e.target.value)}
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial_quantity">Quantité initiale</Label>
              <Input
                id="initial_quantity"
                type="number"
                min="0"
                value={initial_quantity}
                onChange={(e) => setInitialQuantity(e.target.value)}
                placeholder="0"
              />
            </div>
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
