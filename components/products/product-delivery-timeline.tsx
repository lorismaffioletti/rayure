'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Truck, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditProductDeliveryModal } from '@/components/products/edit-product-delivery-modal';
import { DeleteProductDeliveryButton } from '@/components/products/delete-product-delivery-button';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import type { ProductDelivery, Product } from '@/types/database';

interface ProductDeliveryTimelineProps {
  deliveries: Array<ProductDelivery & { product?: Product | null }>;
  productId: string;
}

export function ProductDeliveryTimeline({
  deliveries,
  productId,
}: ProductDeliveryTimelineProps) {
  return (
    <div className="relative">
      {/* Ligne verticale */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-6">
        {deliveries.map((delivery, index) => (
          <div key={delivery.id} className="relative flex items-start gap-4">
            {/* Cercle sur la ligne */}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-background bg-primary">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>

            {/* Contenu de la livraison */}
            <Card className="flex-1">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {format(new Date(delivery.delivery_date), 'd MMMM yyyy', { locale: fr })}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {delivery.quantity} {delivery.product?.unit || 'unité'}
                      </Badge>
                    </div>

                    <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <div>
                        <span className="font-medium text-foreground">Prix HT:</span>{' '}
                        {delivery.purchase_price_ht.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Prix TTC:</span>{' '}
                        {delivery.purchase_price_ttc.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </div>
                      {delivery.supplier_name && (
                        <div>
                          <span className="font-medium text-foreground">Fournisseur:</span>{' '}
                          {delivery.supplier_name}
                        </div>
                      )}
                      {delivery.invoice_number && (
                        <div>
                          <span className="font-medium text-foreground">Facture:</span>{' '}
                          {delivery.invoice_number}
                        </div>
                      )}
                    </div>

                    {delivery.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Notes:</span> {delivery.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <EditProductDeliveryModal
                      delivery={delivery}
                      productId={productId}
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                    </EditProductDeliveryModal>
                    <DeleteProductDeliveryButton
                      deliveryId={delivery.id}
                      productId={productId}
                      deliveryDate={delivery.delivery_date}
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8 !text-destructive hover:!text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </DeleteProductDeliveryButton>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

