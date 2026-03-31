import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { getTransactions, formatCents } from '@/lib/financial';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';

export default async function TransactionLedgerPage() {
  await requireAuth(['president', 'treasurer']);
  const transactions = await getTransactions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text-primary)">Transaction Ledger</h1>
        <Link
          href="/admin/treasurer/transactions/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-terra-cotta text-white text-sm font-semibold hover:bg-terra-cotta-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-sandy-gold overflow-x-auto">
        {transactions.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No transactions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sandy-gold/10 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Date</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Description</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Category</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Fund</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary) text-right">Amount</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary) text-center">Reconciled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandy-gold/30">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-sandy-gold/5">
                  <td className="px-4 py-3 text-(--text-secondary) whitespace-nowrap">{format(tx.date, 'MMM d, yyyy')}</td>
                  <td className="px-4 py-3 text-(--text-primary) font-medium">{tx.description}</td>
                  <td className="px-4 py-3 text-(--text-secondary) capitalize">{tx.category}</td>
                  <td className="px-4 py-3 text-(--text-secondary) capitalize">{tx.fund.replace('_', ' ')}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCents(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${tx.reconciled ? 'bg-green-500' : 'bg-sandy-gold/40'}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
