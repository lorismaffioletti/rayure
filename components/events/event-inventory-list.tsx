import { Pencil, Trash2, Package } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { EditEventInventoryModal } from '@/components/events/edit-event-inventory-modal';
import { DeleteEventInventoryButton } from '@/components/events/delete-event-inventory-button';
import { Badge } from '@/components/ui/badge';
import type { EventInventory, Product } from '@/types/database';

interface EventInventoryListProps {
  inventory: Array<EventInventory & { product?: Product | null }>;
  eventId: string;
}

function isFutProduct(productName: string | undefined): boolean {
  if (!productName) return false;
  const name = productName.toLowerCase();
  return name.includes('fut') || name.includes('barrel') || name.includes('tonneau');
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
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead className="text-right">Prix HT</TableHead>
              <TableHead className="text-right">Prix TTC</TableHead>
              <TableHead className="text-center min-w-[120px]">
                <div className="space-y-1">
                  <div className="font-semibold">Inventaire de début</div>
                  <div className="text-xs font-normal text-muted-foreground">
                    {inventory.some((item) => isFutProduct(item.product?.name)) && 'P / E / V'}
                  </div>
                </div>
              </TableHead>
              <TableHead className="text-center min-w-[120px]">
                <div className="space-y-1">
                  <div className="font-semibold">Inventaire de fin</div>
                  <div className="text-xs font-normal text-muted-foreground">
                    {inventory.some((item) => isFutProduct(item.product?.name)) && 'P / E / V'}
                  </div>
                </div>
              </TableHead>
              <TableHead className="text-center min-w-[80px]">
                <div className="font-semibold">Total</div>
                <div className="text-xs font-normal text-muted-foreground">(Début - Fin)</div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              const isFut = isFutProduct(item.product?.name);
              
              // Calcul pour les fûts
              let startTotal = 0;
              let endTotal = 0;
              let totalDiff = 0;
              
              if (isFut) {
                const startFull = item.inventory_start_full || 0;
                const startOpened = item.inventory_start_opened || 0;
                const startEmpty = item.inventory_start_empty || 0;
                startTotal = startFull + startOpened + startEmpty;
                
                const endFull = item.inventory_end_full || 0;
                const endOpened = item.inventory_end_opened || 0;
                const endEmpty = item.inventory_end_empty || 0;
                endTotal = endFull + endOpened + endEmpty;
                
                totalDiff = startTotal - endTotal;
              } else {
                // Pour les autres produits
                const startQty = item.inventory_start_quantity || 0;
                const endQty = item.inventory_end_quantity || 0;
                startTotal = startQty;
                endTotal = endQty;
                totalDiff = startQty - endQty;
              }

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{item.product?.name || 'Produit inconnu'}</span>
                      {isFut && (
                        <Badge variant="outline" className="text-xs">
                          Fût
                        </Badge>
                      )}
                    </div>
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
                  <TableCell className="text-center">
                    {isFut ? (
                      <div className="text-xs space-y-1">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-muted-foreground">P:</span>
                          <span className="font-medium">{item.inventory_start_full || 0}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-muted-foreground">E:</span>
                          <span className="font-medium">{item.inventory_start_opened || 0}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-muted-foreground">V:</span>
                          <span className="font-medium">{item.inventory_start_empty || 0}</span>
                        </div>
                        <div className="font-semibold pt-1 border-t mt-1">
                          Total: {startTotal}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-medium">{startTotal}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {isFut ? (
                      <div className="text-xs space-y-1">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-muted-foreground">P:</span>
                          <span className="font-medium">{item.inventory_end_full || 0}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-muted-foreground">E:</span>
                          <span className="font-medium">{item.inventory_end_opened || 0}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-muted-foreground">V:</span>
                          <span className="font-medium">{item.inventory_end_empty || 0}</span>
                        </div>
                        <div className="font-semibold pt-1 border-t mt-1">
                          Total: {endTotal}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-medium">{endTotal}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div
                      className={`text-sm font-semibold ${
                        totalDiff > 0
                          ? 'text-green-600 dark:text-green-400'
                          : totalDiff < 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {totalDiff > 0 ? '+' : ''}
                      {totalDiff}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <EditEventInventoryModal
                        inventoryItem={item}
                        eventId={eventId}
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
