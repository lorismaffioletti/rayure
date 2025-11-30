import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Package } from 'lucide-react';
import { getProducts } from '@/lib/supabase/queries/products';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { CreateProductModal } from '@/components/products/create-product-modal';

export default async function ProductsPage() {
  return (
    <div className="page">
      <PageHeader
        title="Produits"
        description="Catalogue des produits et historiques de prix"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Produits' }]}
        actions={
          <CreateProductModal>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </CreateProductModal>
        }
      />

      <Suspense fallback={<LoadingSkeleton type="table" />}>
        <ProductsList />
      </Suspense>
    </div>
  );
}

async function ProductsList() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-12 w-12" />}
        title="Aucun produit enregistré"
        description="Commencez par ajouter votre premier produit"
      />
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden sm:table-cell">Fournisseur</TableHead>
            <TableHead className="hidden md:table-cell">Dernier prix</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">
                <Link href={`/products/${product.id}`} className="hover:underline">
                  {product.name}
                </Link>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {product.supplier_name || '-'}
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {product.latest_price ? `${product.latest_price} €` : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

