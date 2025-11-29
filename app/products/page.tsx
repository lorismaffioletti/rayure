import { Suspense } from 'react';
import { getProducts } from '@/lib/supabase/queries/products';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default async function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produits</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Catalogue des produits et historiques de prix
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="py-8 text-center text-neutral-500">Chargement...</div>}>
        <ProductsList />
      </Suspense>
    </div>
  );
}

async function ProductsList() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
        <p className="text-neutral-500">Aucun produit enregistré</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden sm:table-cell">Fournisseur</TableHead>
            <TableHead className="hidden md:table-cell">Dernier prix</TableHead>
          </TableRow>
        </TableHeader>
        <tbody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-neutral-50">
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="hidden text-neutral-600 sm:table-cell">
                {product.supplier_name || '-'}
              </TableCell>
              <TableCell className="hidden text-neutral-600 md:table-cell">
                {product.latest_price ? `${product.latest_price} €` : '-'}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

