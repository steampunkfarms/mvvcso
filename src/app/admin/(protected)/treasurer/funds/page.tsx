import { requireAuth } from '@/lib/auth';
import { getFinancialSummary, formatCents } from '@/lib/financial';

export default async function FundsPage() {
  await requireAuth(['president', 'treasurer']);
  const summary = await getFinancialSummary();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Fund Tracking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summary.fundBalances.length === 0 ? (
          <p className="text-(--text-muted) col-span-full">No funds yet. Add transactions to create fund balances.</p>
        ) : (
          summary.fundBalances.map(f => (
            <div key={f.fund} className="bg-white rounded-xl p-6 border border-stone-200">
              <h3 className="font-semibold text-(--text-primary) capitalize mb-2">{f.fund.replace('_', ' ')}</h3>
              <div className={`text-2xl font-bold ${f.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCents(f.balance)}
              </div>
              <p className="text-xs text-(--text-muted) mt-1">Current balance</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
