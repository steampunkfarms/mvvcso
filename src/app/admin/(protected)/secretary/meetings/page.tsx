import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { getMeetings } from '@/lib/meetings';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';

export default async function MeetingsListPage() {
  await requireAuth(['president', 'secretary']);
  const meetings = await getMeetings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text-primary)">Board Meetings</h1>
        <Link
          href="/admin/secretary/meetings/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-terra-cotta text-white text-sm font-semibold hover:bg-terra-cotta-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Meeting
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-sandy-gold overflow-hidden">
        {meetings.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No meetings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sandy-gold/10 text-left">
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Date</th>
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Type</th>
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Location</th>
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandy-gold/30">
              {meetings.map(meeting => (
                <tr key={meeting.id} className="hover:bg-sandy-gold/5 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/secretary/meetings/${meeting.id}`} className="text-terra-cotta hover:underline font-medium">
                      {format(meeting.meetingDate, 'MMMM d, yyyy')}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-(--text-secondary) capitalize">{meeting.meetingType}</td>
                  <td className="px-5 py-3 text-(--text-secondary)">{meeting.location || '—'}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={meeting.status} />
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-sandy-gold/20 text-chaparral',
    ai_processing: 'bg-sky-100 text-sky-700',
    review: 'bg-sunset-peach/20 text-terra-cotta',
    pending_approval: 'bg-dusty-mauve/20 text-dusty-mauve',
    approved: 'bg-green-100 text-green-700',
    published: 'bg-green-200 text-green-800',
  };

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
