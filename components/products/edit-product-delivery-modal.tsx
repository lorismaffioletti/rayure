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
import { Textarea } from '@/components/ui/textarea';
import { updateProductDelivery } from '@/app/actions/product-deliveries';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { ProductDelivery, Product } from '@/types/database';

interface EditProductDeliveryModalProps {
  children: ReactNode;
  delivery: ProductDelivery & { product?: Product | null };
  productId: string;
}

export function EditProductDeliveryModal({
  children,
  delivery,
  productId,
}: EditProductDeliveryModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [delivery_date, setDeliveryDate] = useState(delivery.delivery_date.slice(0, 10));
  const [quantity, setQuantity] = useState(delivery.quantity.toString());
  const [purchase_price_ht, setPurchasePriceHt] = useState(delivery.purchase_price_ht.toString());
  const [supplier_name, setSupplierName] = useState(delivery.supplier_name || '');
  const [invoice_number, setInvoiceNumber] = useState(delivery.invoice_number || '');
  const [notes, setNotes] = useState(delivery.notes || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setDeliveryDate(delivery.delivery_date.slice(0, 10));
      setQuantity(delivery.quantity.toString());
      setPurchasePriceHt(delivery.purchase_price_ht.toString());
      setSupplierName(delivery.supplier_name || '');
      setInvoiceNumber(delivery.invoice_number || '');
      setNotes(delivery.notes || '');
    }
  }, [open, delivery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const qty = parseInt(quantity);
      const priceHt = parseFloat(purchase_price_ht);

      if (isNaN(qty) || qty <= 0 || isNaN(priceHt) || priceHt <= 0) {
        toast.error('Veuillez saisir des valeurs valides');
        return;
      }

      await updateProductDelivery(delivery.id, productId, {
        delivery_date,
        quantity: qty,
        purchase_price_ht: priceHt,
        supplier_name: supplier_name.trim() || undefined,
        invoice_number: invoice_number.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      toast.success('Livraison modifiée avec succès');
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
          <DialogTitle>Modifier la livraison</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de cette livraison
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-delivery_date">Date de livraison *</Label>
            <Input
              id="edit-delivery_date"
              type="date"
              value={delivery_date}
              onChange={(e) => setDeliveryDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="edit-purchase_price_ht">Prix HT d'achat (€) *</Label>
              <Input
                id="edit-purchase_price_ht"
                type="number"
                step="0.01"
                min="0"
                value={purchase_price_ht}
                onChange={(e) => setPurchasePriceHt(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-supplier_name">Fournisseur</Label>
              <Input
                id="edit-supplier_name"
                type="text"
                value={supplier_name}
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-invoice_number">Numéro de facture</Label>
              <Input
                id="edit-invoice_number"
                type="text"
                value={invoice_number}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
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

