import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { format } from 'date-fns';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AdminBallotsPage() {
  await requireAuth(['president', 'secretary']);
  const ballots = await db.select().from(schema.ballots).orderBy(desc(schema.ballots.createdAt));

  const statusColors: Record<string, string> = {
    draft: 'bg-stone-100 text-(--text-muted)',
    open: 'bg-sage-50 text-sage-600',
    closed: 'bg-stone-200 text-(--text-secondary)',
    certified: 'bg-gold-50 text-gold-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text-primary)">Ballot Management</h1>
        <Link href="/admin/ballots/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors">
          <Plus className="w-4 h-4" /> New Ballot
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {ballots.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No ballots created yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-100 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Title</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Type</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Opens</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Closes</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50">
              {ballots.map(ballot => (
                <tr key={ballot.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-(--text-primary) font-medium">{ballot.titleEn}</td>
                  <td className="px-4 py-3 text-(--text-secondary) capitalize">{ballot.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-(--text-muted) text-xs">{format(ballot.openDate, 'MMM d, yyyy')}</td>
                  <td className="px-4 py-3 text-(--text-muted) text-xs">{format(ballot.closeDate, 'MMM d, yyyy')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${statusColors[ballot.status] || 'bg-stone-100'}`}>
                      {ballot.status}
                    </span>
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
