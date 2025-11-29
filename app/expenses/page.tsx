import { Suspense } from 'react';
import { getExpenses } from '@/lib/supabase/queries/expenses';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default async function ExpensesPage() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes de frais</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Gestion des notes de frais et justificatifs
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="py-8 text-center text-neutral-500">Chargement...</div>}>
        <ExpensesList />
      </Suspense>
    </div>
  );
}

async function ExpensesList() {
  const expenses = await getExpenses();

  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
        <p className="text-neutral-500">Aucune note de frais enregistrée</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libellé</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="text-right">Montant TTC</TableHead>
          </TableRow>
        </TableHeader>
        <tbody>
          {expenses.map((expense) => (
            <TableRow key={expense.id} className="hover:bg-neutral-50">
              <TableCell className="font-medium">{expense.title}</TableCell>
              <TableCell className="hidden text-neutral-600 sm:table-cell">
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
        </tbody>
      </Table>
    </div>
  );
}

