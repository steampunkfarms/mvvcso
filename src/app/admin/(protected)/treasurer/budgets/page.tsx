import { requireAuth } from '@/lib/auth';
import { getBudgets, formatCents, getTransactions } from '@/lib/financial';
import { db, schema } from '@/lib/db';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

export default async function BudgetsPage() {
  await requireAuth(['president', 'treasurer']);

  const currentYear = new Date().getFullYear();
  const budgets = await getBudgets(currentYear);

  // Get actuals per category for current year
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

  const actuals = await db
    .select({
      category: schema.financialTransactions.category,
      type: schema.financialTransactions.type,
      total: sql<number>`COALESCE(SUM(${schema.financialTransactions.amount}), 0)`,
    })
    .from(schema.financialTransactions)
    .where(
      and(
        gte(schema.financialTransactions.date, startOfYear),
        lte(schema.financialTransactions.date, endOfYear)
      )
    )
    .groupBy(schema.financialTransactions.category, schema.financialTransactions.type);

  const actualMap = new Map(actuals.map(a => [`${a.type}_${a.category}`, a.total]));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Budget vs. Actual — {currentYear}</h1>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {budgets.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No budgets set for {currentYear}. Budgets can be created via the API.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-200/10 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Category</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Fund</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary) text-right">Budgeted</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary) text-right">Actual</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary) text-right">Variance</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/30">
              {budgets.map(budget => {
                const actual = actualMap.get(`expense_${budget.category}`) || 0;
                const variance = budget.plannedAmount - actual;
                const pct = budget.plannedAmount > 0 ? (actual / budget.plannedAmount) * 100 : 0;

                return (
                  <tr key={budget.id} className="hover:bg-stone-200/5">
                    <td className="px-4 py-3 text-(--text-primary) font-medium capitalize">{budget.category}</td>
                    <td className="px-4 py-3 text-(--text-secondary) capitalize">{budget.fund.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-(--text-secondary) text-right">{formatCents(budget.plannedAmount)}</td>
                    <td className="px-4 py-3 text-(--text-secondary) text-right">{formatCents(actual)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCents(Math.abs(variance))} {variance >= 0 ? 'under' : 'over'}
                    </td>
                    <td className="px-4 py-3 w-32">
                      <div className="h-2 bg-stone-200/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct > 100 ? 'bg-red-500' : pct > 80 ? 'bg-gold-300' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-(--text-muted)">{pct.toFixed(0)}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
