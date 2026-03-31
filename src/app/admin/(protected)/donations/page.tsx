import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc, gte, sql } from 'drizzle-orm';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, Users, Gift } from 'lucide-react';

function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export default async function AdminDonationsPage() {
  await requireAuth(['president', 'treasurer']);

  const donations = await db.select().from(schema.donations).orderBy(desc(schema.donations.createdAt));

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const thisMonth = donations.filter(d => d.createdAt >= startOfMonth);
  const thisYear = donations.filter(d => d.createdAt >= startOfYear);
  const monthTotal = thisMonth.reduce((sum, d) => sum + d.amount, 0);
  const yearTotal = thisYear.reduce((sum, d) => sum + d.amount, 0);
  const uniqueDonors = new Set(donations.map(d => d.donorEmail)).size;
  const avgDonation = donations.length > 0 ? Math.round(donations.reduce((sum, d) => sum + d.amount, 0) / donations.length) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Donations</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">This Month</span>
            <DollarSign className="w-5 h-5 text-sage-400" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{formatCents(monthTotal)}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">This Year</span>
            <TrendingUp className="w-5 h-5 text-sage-400" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{formatCents(yearTotal)}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Total Donors</span>
            <Users className="w-5 h-5 text-stone-600" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{uniqueDonors}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Avg Donation</span>
            <Gift className="w-5 h-5 text-gold-400" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{formatCents(avgDonation)}</div>
        </div>
      </div>

      {/* Donation log */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-200 bg-stone-100">
          <span className="text-sm font-semibold text-(--text-primary)">Donation Log ({donations.length})</span>
        </div>
        {donations.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No donations received yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Date</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Donor</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Email</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary) text-right">Amount</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Type</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Campaign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50">
              {donations.map(d => (
                <tr key={d.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-(--text-secondary) text-xs">{format(d.createdAt, 'MMM d, yyyy')}</td>
                  <td className="px-4 py-3 text-(--text-primary) font-medium">{d.donorName || '—'}</td>
                  <td className="px-4 py-3 text-(--text-secondary)">{d.donorEmail || '—'}</td>
                  <td className="px-4 py-3 text-right font-semibold text-sage-600">{formatCents(d.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${d.type === 'recurring' ? 'bg-terra-50 text-stone-700' : 'bg-stone-100 text-(--text-muted)'}`}>
                      {d.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-(--text-muted) capitalize text-xs">{d.campaign}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
