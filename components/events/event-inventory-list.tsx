'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Package } from 'lucide-react';
import { EditEventInventoryModal } from '@/components/events/edit-event-inventory-modal';
import { DeleteEventInventoryButton } from '@/components/events/delete-event-inventory-button';
import type { EventInventory, Product } from '@/types/database';
import { getProducts } from '@/lib/supabase/queries/products';

interface EventInventoryListProps {
  inventory: Array<EventInventory & { product?: Product | null }>;
  eventId: string;
}

export function EventInventoryList({ inventory, eventId }: EventInventoryListProps) {
  if (inventory.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-12 w-12" />}
        title="Aucun produit dans l'inventaire"
        description="Ajoutez des produits vendus lors de cet événement"
      />
    );
  }

  const totalHt = inventory.reduce(
    (sum, item) => sum + item.sale_price_ht * item.quantity,
    0
  );
  const totalTtc = inventory.reduce(
    (sum, item) => sum + item.sale_price_ttc * item.quantity,
    0
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead className="text-right">Prix HT</TableHead>
              <TableHead className="text-right">Prix TTC</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">Total HT</TableHead>
              <TableHead className="text-right">Total TTC</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              const itemTotalHt = item.sale_price_ht * item.quantity;
              const itemTotalTtc = item.sale_price_ttc * item.quantity;

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.product?.name || 'Produit inconnu'}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.sale_price_ht.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.sale_price_ttc.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right font-medium">
                    {itemTotalHt.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {itemTotalTtc.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <EditEventInventoryModal
                        inventoryItem={item}
                        eventId={eventId}
                        products={[]}
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                      </EditEventInventoryModal>
                      <DeleteEventInventoryButton
                        inventoryId={item.id}
                        eventId={eventId}
                        productName={item.product?.name || 'Produit'}
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8 !text-destructive hover:!text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </DeleteEventInventoryButton>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Total HT</span>
          <span className="font-semibold">
            {totalHt.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="font-medium">Total TTC</span>
          <span className="font-semibold">
            {totalTtc.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
      </div>
    </div>
  );
}

