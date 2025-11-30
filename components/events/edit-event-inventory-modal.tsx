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
  products?: Product[]; // Optional, not used in edit mode
}

function isFutProduct(productName: string | undefined): boolean {
  if (!productName) return false;
  const name = productName.toLowerCase();
  return name.includes('fut') || name.includes('barrel') || name.includes('tonneau');
}

export function EditEventInventoryModal({
  children,
  inventoryItem,
  eventId,
}: EditEventInventoryModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sale_price_ht, setSalePriceHt] = useState(inventoryItem.sale_price_ht.toString());
  const [sale_price_ttc, setSalePriceTtc] = useState(inventoryItem.sale_price_ttc.toString());
  const [quantity, setQuantity] = useState(inventoryItem.quantity.toString());
  
  // Inventaire de début
  const [inventory_start_quantity, setInventoryStartQuantity] = useState(
    (inventoryItem.inventory_start_quantity || 0).toString()
  );
  const [inventory_start_full, setInventoryStartFull] = useState(
    (inventoryItem.inventory_start_full || 0).toString()
  );
  const [inventory_start_opened, setInventoryStartOpened] = useState(
    (inventoryItem.inventory_start_opened || 0).toString()
  );
  const [inventory_start_empty, setInventoryStartEmpty] = useState(
    (inventoryItem.inventory_start_empty || 0).toString()
  );
  
  // Inventaire de fin
  const [inventory_end_quantity, setInventoryEndQuantity] = useState(
    (inventoryItem.inventory_end_quantity || 0).toString()
  );
  const [inventory_end_full, setInventoryEndFull] = useState(
    (inventoryItem.inventory_end_full || 0).toString()
  );
  const [inventory_end_opened, setInventoryEndOpened] = useState(
    (inventoryItem.inventory_end_opened || 0).toString()
  );
  const [inventory_end_empty, setInventoryEndEmpty] = useState(
    (inventoryItem.inventory_end_empty || 0).toString()
  );
  
  const [loading, setLoading] = useState(false);

  const isFut = isFutProduct(inventoryItem.product?.name);

  useEffect(() => {
    if (open) {
      setSalePriceHt(inventoryItem.sale_price_ht.toString());
      setSalePriceTtc(inventoryItem.sale_price_ttc.toString());
      setQuantity(inventoryItem.quantity.toString());
      setInventoryStartQuantity((inventoryItem.inventory_start_quantity || 0).toString());
      setInventoryStartFull((inventoryItem.inventory_start_full || 0).toString());
      setInventoryStartOpened((inventoryItem.inventory_start_opened || 0).toString());
      setInventoryStartEmpty((inventoryItem.inventory_start_empty || 0).toString());
      setInventoryEndQuantity((inventoryItem.inventory_end_quantity || 0).toString());
      setInventoryEndFull((inventoryItem.inventory_end_full || 0).toString());
      setInventoryEndOpened((inventoryItem.inventory_end_opened || 0).toString());
      setInventoryEndEmpty((inventoryItem.inventory_end_empty || 0).toString());
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

      const updateData: any = {
        sale_price_ht: priceHt,
        sale_price_ttc: priceTtc,
        quantity: qty,
      };

      if (isFut) {
        updateData.inventory_start_full = parseInt(inventory_start_full) || 0;
        updateData.inventory_start_opened = parseInt(inventory_start_opened) || 0;
        updateData.inventory_start_empty = parseInt(inventory_start_empty) || 0;
        updateData.inventory_end_full = parseInt(inventory_end_full) || 0;
        updateData.inventory_end_opened = parseInt(inventory_end_opened) || 0;
        updateData.inventory_end_empty = parseInt(inventory_end_empty) || 0;
      } else {
        updateData.inventory_start_quantity = parseInt(inventory_start_quantity) || 0;
        updateData.inventory_end_quantity = parseInt(inventory_end_quantity) || 0;
      }

      await updateEventInventory(inventoryItem.id, eventId, updateData);
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
          <DialogDescription>
            Modifiez le prix de vente et l'inventaire pour {inventoryItem.product?.name || 'ce produit'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Produit</Label>
            <div className="text-sm text-muted-foreground">
              {inventoryItem.product?.name || 'Produit inconnu'}
              {isFut && <span className="ml-2">(Fût)</span>}
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

          {isFut ? (
            <>
              {/* Inventaire de début - Fûts */}
              <div className="space-y-3 rounded-lg border p-4">
                <h3 className="text-sm font-semibold">Inventaire de début</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-start-full">Pleins</Label>
                    <Input
                      id="edit-start-full"
                      type="number"
                      min="0"
                      value={inventory_start_full}
                      onChange={(e) => setInventoryStartFull(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-start-opened">Entamés</Label>
                    <Input
                      id="edit-start-opened"
                      type="number"
                      min="0"
                      value={inventory_start_opened}
                      onChange={(e) => setInventoryStartOpened(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-start-empty">Vides</Label>
                    <Input
                      id="edit-start-empty"
                      type="number"
                      min="0"
                      value={inventory_start_empty}
                      onChange={(e) => setInventoryStartEmpty(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Inventaire de fin - Fûts */}
              <div className="space-y-3 rounded-lg border p-4">
                <h3 className="text-sm font-semibold">Inventaire de fin</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-end-full">Pleins</Label>
                    <Input
                      id="edit-end-full"
                      type="number"
                      min="0"
                      value={inventory_end_full}
                      onChange={(e) => setInventoryEndFull(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-end-opened">Entamés</Label>
                    <Input
                      id="edit-end-opened"
                      type="number"
                      min="0"
                      value={inventory_end_opened}
                      onChange={(e) => setInventoryEndOpened(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-end-empty">Vides</Label>
                    <Input
                      id="edit-end-empty"
                      type="number"
                      min="0"
                      value={inventory_end_empty}
                      onChange={(e) => setInventoryEndEmpty(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Inventaire de début - Autres produits */}
              <div className="space-y-3 rounded-lg border p-4">
                <h3 className="text-sm font-semibold">Inventaire de début</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-start-quantity">Quantité</Label>
                  <Input
                    id="edit-start-quantity"
                    type="number"
                    min="0"
                    value={inventory_start_quantity}
                    onChange={(e) => setInventoryStartQuantity(e.target.value)}
                  />
                </div>
              </div>

              {/* Inventaire de fin - Autres produits */}
              <div className="space-y-3 rounded-lg border p-4">
                <h3 className="text-sm font-semibold">Inventaire de fin</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-end-quantity">Quantité</Label>
                  <Input
                    id="edit-end-quantity"
                    type="number"
                    min="0"
                    value={inventory_end_quantity}
                    onChange={(e) => setInventoryEndQuantity(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

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
