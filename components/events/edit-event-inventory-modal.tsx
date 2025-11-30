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
import { updateEventInventory } from '@/app/actions/event-inventory';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { EventInventory, Product } from '@/types/database';

interface EditEventInventoryModalProps {
  children: ReactNode;
  inventoryItem: EventInventory & { product?: Product | null };
  eventId: string;
  products: Product[];
}

export function EditEventInventoryModal({
  children,
  inventoryItem,
  eventId,
  products,
}: EditEventInventoryModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sale_price_ht, setSalePriceHt] = useState(inventoryItem.sale_price_ht.toString());
  const [sale_price_ttc, setSalePriceTtc] = useState(inventoryItem.sale_price_ttc.toString());
  const [quantity, setQuantity] = useState(inventoryItem.quantity.toString());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSalePriceHt(inventoryItem.sale_price_ht.toString());
      setSalePriceTtc(inventoryItem.sale_price_ttc.toString());
      setQuantity(inventoryItem.quantity.toString());
    }
  }, [open, inventoryItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const priceHt = parseFloat(sale_price_ht);
      const priceTtc = parseFloat(sale_price_ttc);
      const qty = parseInt(quantity);

      if (isNaN(priceHt) || isNaN(priceTtc) || isNaN(qty) || qty <= 0) {
        toast.error('Veuillez saisir des valeurs valides');
        return;
      }

      await updateEventInventory(inventoryItem.id, eventId, {
        sale_price_ht: priceHt,
        sale_price_ttc: priceTtc,
        quantity: qty,
      });
      toast.success('Produit modifié avec succès');
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
          <DialogDescription>
            Modifiez le prix de vente et la quantité pour {inventoryItem.product?.name || 'ce produit'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Produit</Label>
            <div className="text-sm text-muted-foreground">
              {inventoryItem.product?.name || 'Produit inconnu'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-sale_price_ht">Prix de vente HT (€) *</Label>
              <Input
                id="edit-sale_price_ht"
                type="number"
                step="0.01"
                min="0"
                value={sale_price_ht}
                onChange={(e) => setSalePriceHt(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-sale_price_ttc">Prix de vente TTC (€) *</Label>
              <Input
                id="edit-sale_price_ttc"
                type="number"
                step="0.01"
                min="0"
                value={sale_price_ttc}
                onChange={(e) => setSalePriceTtc(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-quantity">Quantité *</Label>
            <Input
              id="edit-quantity"
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
              {loading ? 'Modification...' : 'Modifier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

