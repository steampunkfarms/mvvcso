import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { getGrants, formatCents } from '@/lib/financial';
import { format } from 'date-fns';

export default async function GrantsPage() {
  await requireAuth(['president', 'treasurer']);
  const grants = await getGrants();

  const statusColors: Record<string, string> = {
    identified: 'bg-stone-200/20 text-dusk-500',
    applying: 'bg-sky-100 text-sky-700',
    submitted: 'bg-gold-100/20 text-gold-400',
    awarded: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
    completed: 'bg-green-200 text-green-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text-primary)">Grant Management</h1>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {grants.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No grants tracked yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-200/10 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Grant</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Funder</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Amount</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Status</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/30">
              {grants.map(grant => (
                <tr key={grant.id} className="hover:bg-stone-200/5">
                  <td className="px-4 py-3 text-(--text-primary) font-medium">{grant.name}</td>
                  <td className="px-4 py-3 text-(--text-secondary)">{grant.funder}</td>
                  <td className="px-4 py-3 text-(--text-secondary)">{grant.amount ? formatCents(grant.amount) : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${statusColors[grant.status] || 'bg-gray-100 text-gray-600'}`}>
                      {grant.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-(--text-muted) text-xs">
                    {grant.applicationDeadline ? format(grant.applicationDeadline, 'MMM d, yyyy') : '—'}
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
