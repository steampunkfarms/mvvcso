import { requireAuth } from '@/lib/auth';
import { getAllResolutions } from '@/lib/meetings';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

export default async function ResolutionsPage() {
  await requireAuth(['president', 'secretary']);
  const resolutions = await getAllResolutions();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Resolution Register</h1>

      <div className="bg-white rounded-xl border border-sandy-gold overflow-hidden">
        {resolutions.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No resolutions recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sandy-gold/10 text-left">
                <th className="px-5 py-3 font-semibold text-(--text-primary)">#</th>
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Title</th>
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Meeting Date</th>
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Vote</th>
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandy-gold/30">
              {resolutions.map(res => (
                <tr key={res.id} className="hover:bg-sandy-gold/5">
                  <td className="px-5 py-3 text-terra-cotta font-mono text-xs">{res.resolutionNumber || '—'}</td>
                  <td className="px-5 py-3 text-(--text-primary) font-medium">{res.title}</td>
                  <td className="px-5 py-3 text-(--text-secondary)">{format(res.meetingDate, 'MMM d, yyyy')}</td>
                  <td className="px-5 py-3 text-(--text-muted) text-xs">
                    {res.votesFor}–{res.votesAgainst}–{res.abstentions}
                  </td>
                  <td className="px-5 py-3">
                    {res.passed ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3" /> Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        <X className="w-3 h-3" /> Failed
                      </span>
                    )}
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
