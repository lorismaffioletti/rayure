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
import { Textarea } from '@/components/ui/textarea';
import { createProductDelivery } from '@/app/actions/product-deliveries';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface AddProductDeliveryModalProps {
  children?: ReactNode;
  productId: string;
}

export function AddProductDeliveryModal({
  children,
  productId,
}: AddProductDeliveryModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [delivery_date, setDeliveryDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [quantity, setQuantity] = useState('');
  const [purchase_price_ht, setPurchasePriceHt] = useState('');
  const [supplier_name, setSupplierName] = useState('');
  const [invoice_number, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const qty = parseInt(quantity);
      const priceHt = parseFloat(purchase_price_ht);

      if (!delivery_date || !quantity || !purchase_price_ht) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      if (isNaN(qty) || qty <= 0 || isNaN(priceHt) || priceHt <= 0) {
        toast.error('Veuillez saisir des valeurs valides');
        return;
      }

      await createProductDelivery({
        product_id: productId,
        delivery_date,
        quantity: qty,
        purchase_price_ht: priceHt,
        supplier_name: supplier_name.trim() || undefined,
        invoice_number: invoice_number.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      toast.success('Livraison ajoutée avec succès');
      setDeliveryDate(new Date().toISOString().slice(0, 10));
      setQuantity('');
      setPurchasePriceHt('');
      setSupplierName('');
      setInvoiceNumber('');
      setNotes('');
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
          <DialogTitle>Ajouter une livraison</DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle livraison ou achat pour ce produit
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delivery_date">Date de livraison *</Label>
            <Input
              id="delivery_date"
              type="date"
              value={delivery_date}
              onChange={(e) => setDeliveryDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="purchase_price_ht">Prix HT d'achat (€) *</Label>
              <Input
                id="purchase_price_ht"
                type="number"
                step="0.01"
                min="0"
                value={purchase_price_ht}
                onChange={(e) => setPurchasePriceHt(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier_name">Fournisseur</Label>
              <Input
                id="supplier_name"
                type="text"
                value={supplier_name}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Nom du fournisseur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice_number">Numéro de facture</Label>
              <Input
                id="invoice_number"
                type="text"
                value={invoice_number}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="N° facture"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations complémentaires..."
              rows={3}
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

