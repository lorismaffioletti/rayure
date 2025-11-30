import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Package, Truck } from 'lucide-react';
import { getProductById, getProductDeliveries } from '@/lib/supabase/queries/product-deliveries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { ProductDeliveryTimeline } from '@/components/products/product-delivery-timeline';
import { AddProductDeliveryModal } from '@/components/products/add-product-delivery-modal';
import { EmptyState } from '@/components/ui/empty-state';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const [product, deliveries] = await Promise.all([
      getProductById(id),
      getProductDeliveries(id),
    ]);

    return (
      <div className="page max-w-5xl pb-24">
        <div className="mb-6">
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux produits
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          {/* Informations du produit */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Fournisseur</div>
                <div className="font-medium">{product.supplier_name || '-'}</div>
              </div>
              {product.initial_price_ht && (
                <div>
                  <div className="text-sm text-muted-foreground">Prix HT initial</div>
                  <div className="font-medium">
                    {product.initial_price_ht.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </div>
                </div>
              )}
              {product.initial_vat_rate && (
                <div>
                  <div className="text-sm text-muted-foreground">Taux de TVA</div>
                  <div className="font-medium">{(product.initial_vat_rate * 100).toFixed(1)}%</div>
                </div>
              )}
              {product.initial_quantity !== null && (
                <div>
                  <div className="text-sm text-muted-foreground">Quantité initiale</div>
                  <div className="font-medium">
                    {product.initial_quantity} {product.unit || 'unité'}
                  </div>
                </div>
              )}
              {product.unit && (
                <div>
                  <div className="text-sm text-muted-foreground">Unité de mesure</div>
                  <Badge variant="outline">{product.unit}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Nombre de livraisons</div>
                <div className="font-medium text-2xl">{deliveries.length}</div>
              </div>
              {deliveries.length > 0 && (
                <>
                  <div>
                    <div className="text-sm text-muted-foreground">Dernière livraison</div>
                    <div className="font-medium">
                      {format(new Date(deliveries[0].delivery_date), 'd MMMM yyyy', { locale: fr })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Quantité totale livrée</div>
                    <div className="font-medium text-2xl">
                      {deliveries.reduce((sum, d) => sum + d.quantity, 0)}{' '}
                      {product.unit || 'unité'}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline des livraisons */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historique des livraisons</CardTitle>
              <AddProductDeliveryModal productId={id}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une livraison
                </Button>
              </AddProductDeliveryModal>
            </div>
          </CardHeader>
          <CardContent>
            {deliveries.length === 0 ? (
              <EmptyState
                icon={<Truck className="h-12 w-12" />}
                title="Aucune livraison enregistrée"
                description="Ajoutez votre première livraison pour commencer à suivre l'historique"
              />
            ) : (
              <ProductDeliveryTimeline deliveries={deliveries} productId={id} />
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}

