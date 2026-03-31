import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { getFinancialSummary, getTransactions, formatCents } from '@/lib/financial';
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default async function TreasurerDashboardPage() {
  await requireAuth(['president', 'treasurer']);

  const summary = await getFinancialSummary();
  const recentTransactions = await getTransactions({ limit: 10 });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text-primary)">Treasurer&apos;s Dashboard</h1>
        <Link
          href="/admin/treasurer/transactions/new"
          className="px-4 py-2 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors"
        >
          Add Transaction
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Cash on Hand</span>
            <Wallet className="w-5 h-5 text-stone-600" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{formatCents(summary.cashOnHand)}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Income This Month</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{formatCents(summary.monthIncome)}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Expenses This Month</span>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{formatCents(summary.monthExpenses)}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Fund Accounts</span>
            <DollarSign className="w-5 h-5 text-stone-600" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{summary.fundBalances.length}</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { href: '/admin/treasurer/transactions', label: 'Transaction Ledger' },
          { href: '/admin/treasurer/budgets', label: 'Budgets' },
          { href: '/admin/treasurer/funds', label: 'Fund Balances' },
          { href: '/admin/treasurer/grants', label: 'Grants' },
        ].map(link => (
          <Link key={link.href} href={link.href} className="bg-white rounded-xl p-4 border border-stone-200 hover:shadow-md transition-shadow flex items-center justify-between">
            <span className="font-medium text-sm text-(--text-primary)">{link.label}</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </Link>
        ))}
      </div>

      {/* Fund Balances */}
      {summary.fundBalances.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <h2 className="font-semibold text-(--text-primary) mb-4">Fund Balances</h2>
          <div className="space-y-2">
            {summary.fundBalances.map(f => (
              <div key={f.fund} className="flex items-center justify-between py-2 border-b border-stone-200/30 last:border-0">
                <span className="text-sm text-(--text-primary) capitalize">{f.fund.replace('_', ' ')}</span>
                <span className={`text-sm font-semibold ${f.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCents(f.balance)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="font-semibold text-(--text-primary)">Recent Transactions</h2>
          <Link href="/admin/treasurer/transactions" className="text-sm text-gold-400 hover:text-gold-500">
            View all
          </Link>
        </div>
        {recentTransactions.length === 0 ? (
          <p className="p-5 text-sm text-(--text-muted)">No transactions recorded yet.</p>
        ) : (
          <div className="divide-y divide-stone-200/30">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <span className="text-sm font-medium text-(--text-primary)">{tx.description}</span>
                  <div className="text-xs text-(--text-muted)">
                    {format(tx.date, 'MMM d, yyyy')} · {tx.category} · {tx.fund}
                  </div>
                </div>
                <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCents(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
