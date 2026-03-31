import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { getMeetings, getAllResolutions } from '@/lib/meetings';
import { Calendar, FileText, ListChecks, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';

export default async function SecretaryDeskPage() {
  await requireAuth(['president', 'secretary']);

  const meetings = await getMeetings();
  const resolutions = await getAllResolutions();

  const recentMeetings = meetings.slice(0, 5);
  const draftCount = meetings.filter(m => m.status === 'draft' || m.status === 'review').length;
  const pendingApproval = meetings.filter(m => m.status === 'pending_approval').length;
  const totalResolutions = resolutions.filter(r => r.passed).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text-primary)">Secretary&apos;s Desk</h1>
        <Link
          href="/admin/secretary/meetings/new"
          className="px-4 py-2 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors"
        >
          New Meeting
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Meetings" value={meetings.length} icon={Calendar} />
        <KpiCard label="Drafts / In Review" value={draftCount} icon={FileText} />
        <KpiCard label="Pending Approval" value={pendingApproval} icon={ClipboardList} />
        <KpiCard label="Resolutions Passed" value={totalResolutions} icon={ListChecks} />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/secretary/meetings" className="bg-white rounded-xl p-5 border border-stone-200 hover:shadow-md transition-shadow">
          <Calendar className="w-6 h-6 text-gold-400 mb-2" />
          <h3 className="font-semibold text-(--text-primary)">All Meetings</h3>
          <p className="text-sm text-(--text-muted) mt-1">View and manage board meetings</p>
        </Link>
        <Link href="/admin/secretary/resolutions" className="bg-white rounded-xl p-5 border border-stone-200 hover:shadow-md transition-shadow">
          <ListChecks className="w-6 h-6 text-gold-400 mb-2" />
          <h3 className="font-semibold text-(--text-primary)">Resolution Register</h3>
          <p className="text-sm text-(--text-muted) mt-1">Searchable list of all resolutions</p>
        </Link>
        <Link href="/admin/secretary/attendance" className="bg-white rounded-xl p-5 border border-stone-200 hover:shadow-md transition-shadow">
          <ClipboardList className="w-6 h-6 text-gold-400 mb-2" />
          <h3 className="font-semibold text-(--text-primary)">Attendance History</h3>
          <p className="text-sm text-(--text-muted) mt-1">Track board member attendance</p>
        </Link>
      </div>

      {/* Recent Meetings */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="font-semibold text-(--text-primary)">Recent Meetings</h2>
          <Link href="/admin/secretary/meetings" className="text-sm text-gold-400 hover:text-gold-500">
            View all
          </Link>
        </div>
        {recentMeetings.length === 0 ? (
          <p className="p-5 text-sm text-(--text-muted)">No meetings yet. Create your first meeting.</p>
        ) : (
          <div className="divide-y divide-stone-200/50">
            {recentMeetings.map(meeting => (
              <Link
                key={meeting.id}
                href={`/admin/secretary/meetings/${meeting.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-stone-200/10 transition-colors"
              >
                <div>
                  <span className="text-sm font-medium text-(--text-primary)">
                    {meeting.meetingType.charAt(0).toUpperCase() + meeting.meetingType.slice(1)} Meeting
                  </span>
                  <span className="text-sm text-(--text-muted) ml-2">
                    {format(meeting.meetingDate, 'MMM d, yyyy')}
                  </span>
                </div>
                <StatusBadge status={meeting.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-stone-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-(--text-muted)">{label}</span>
        <Icon className="w-5 h-5 text-dusk-500" />
      </div>
      <div className="text-2xl font-bold text-(--text-primary)">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-stone-200/20 text-dusk-500',
    ai_processing: 'bg-sky-100 text-sky-700',
    review: 'bg-gold-100/20 text-gold-400',
    pending_approval: 'bg-terra-50/20 text-terra-400',
    approved: 'bg-green-100 text-green-700',
    published: 'bg-green-200 text-green-800',
  };

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
