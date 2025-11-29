import { Suspense } from 'react';
import { Receipt } from 'lucide-react';
import { getExpenses } from '@/lib/supabase/queries/expenses';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

export default async function ExpensesPage() {
  return (
    <div className="page">
      <PageHeader
        title="Notes de frais"
        description="Gestion des notes de frais et justificatifs"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Notes de frais' }]}
      />

      <Suspense fallback={<LoadingSkeleton type="table" />}>
        <ExpensesList />
      </Suspense>
    </div>
  );
}

async function ExpensesList() {
  const expenses = await getExpenses();

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="h-12 w-12" />}
        title="Aucune note de frais enregistrée"
        description="Commencez par ajouter votre première note de frais"
      />
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libellé</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="text-right">Montant TTC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.title}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {new Date(expense.date).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell className="text-right font-medium">
                {expense.amount_ttc.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                €
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

