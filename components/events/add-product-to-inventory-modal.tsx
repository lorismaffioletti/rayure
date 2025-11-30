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
import { createEventInventory } from '@/app/actions/event-inventory';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Product } from '@/types/database';

interface AddProductToInventoryModalProps {
  children?: ReactNode;
  eventId: string;
  products: Product[];
}

export function AddProductToInventoryModal({
  children,
  eventId,
  products,
}: AddProductToInventoryModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [product_id, setProductId] = useState('');
  const [sale_price_ht, setSalePriceHt] = useState('');
  const [sale_price_ttc, setSalePriceTtc] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const priceHt = parseFloat(sale_price_ht);
      const priceTtc = parseFloat(sale_price_ttc);
      const qty = parseInt(quantity);

      if (!product_id || !sale_price_ht || !sale_price_ttc || !quantity) {
        toast.error('Veuillez remplir tous les champs');
        return;
      }

      if (isNaN(priceHt) || isNaN(priceTtc) || isNaN(qty) || qty <= 0) {
        toast.error('Veuillez saisir des valeurs valides');
        return;
      }

      await createEventInventory({
        event_id: eventId,
        product_id,
        sale_price_ht: priceHt,
        sale_price_ttc: priceTtc,
        quantity: qty,
      });
      toast.success('Produit ajouté à l\'inventaire');
      setProductId('');
      setSalePriceHt('');
      setSalePriceTtc('');
      setQuantity('1');
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
          <DialogDescription>
            Sélectionnez un produit et indiquez le prix de vente et la quantité
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product_id">Produit *</Label>
            <select
              id="product_id"
              value={product_id}
              onChange={(e) => setProductId(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Sélectionner un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sale_price_ht">Prix de vente HT (€) *</Label>
              <Input
                id="sale_price_ht"
                type="number"
                step="0.01"
                min="0"
                value={sale_price_ht}
                onChange={(e) => setSalePriceHt(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale_price_ttc">Prix de vente TTC (€) *</Label>
              <Input
                id="sale_price_ttc"
                type="number"
                step="0.01"
                min="0"
                value={sale_price_ttc}
                onChange={(e) => setSalePriceTtc(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Ajout...' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

