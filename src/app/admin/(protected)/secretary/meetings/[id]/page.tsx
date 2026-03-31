import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { getMeeting, getMeetingMinutes, getMeetingAttendance, getMeetingResolutions, parseAgenda } from '@/lib/meetings';
import { format } from 'date-fns';
import { FileText, Users, ListChecks, Wand2, ArrowLeft } from 'lucide-react';
import { AttendanceEditor } from '@/components/meetings/attendance-editor';
import { RawNotesEditor } from '@/components/meetings/raw-notes-editor';

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth(['president', 'secretary']);
  const { id } = await params;
  const meeting = await getMeeting(id);

  if (!meeting) notFound();

  const minutes = await getMeetingMinutes(id);
  const attendance = await getMeetingAttendance(id);
  const resolutions = await getMeetingResolutions(id);
  const agenda = parseAgenda(meeting.agendaJson);

  const statusSteps = ['draft', 'review', 'pending_approval', 'approved', 'published'];
  const currentStep = statusSteps.indexOf(meeting.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/secretary/meetings" className="text-terra-cotta hover:text-terra-cotta-hover">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-(--text-primary)">
            {meeting.meetingType.charAt(0).toUpperCase() + meeting.meetingType.slice(1)} Meeting
          </h1>
          <p className="text-sm text-(--text-muted)">
            {format(meeting.meetingDate, 'EEEE, MMMM d, yyyy · h:mm a')} · {meeting.location}
          </p>
        </div>
      </div>

      {/* Status Progress */}
      <div className="bg-white rounded-xl p-5 border border-sandy-gold">
        <h3 className="text-sm font-semibold text-(--text-muted) mb-3 uppercase tracking-wider">Minutes Lifecycle</h3>
        <div className="flex items-center gap-2">
          {statusSteps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i <= currentStep ? 'bg-terra-cotta text-white' : 'bg-sandy-gold/30 text-(--text-muted)'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs hidden sm:inline ${i <= currentStep ? 'text-terra-cotta font-medium' : 'text-(--text-muted)'}`}>
                {step.replace('_', ' ')}
              </span>
              {i < statusSteps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < currentStep ? 'bg-terra-cotta' : 'bg-sandy-gold/30'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Raw Notes / Audio Input */}
          {(meeting.status === 'draft' || meeting.status === 'review') && (
            <div className="bg-white rounded-xl p-6 border border-sandy-gold">
              <h2 className="font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-terra-cotta" />
                Meeting Notes
              </h2>
              <RawNotesEditor meetingId={id} rawNotes={minutes?.rawNotes || ''} />
            </div>
          )}

          {/* AI Draft */}
          {minutes?.aiDraft && (
            <div className="bg-white rounded-xl p-6 border border-sandy-gold">
              <h2 className="font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-terra-cotta" />
                AI-Generated Draft
              </h2>
              <div className="prose prose-sm max-w-none text-(--text-secondary)">
                {minutes.aiDraft.split('\n').map((line: string, i: number) => {
                  if (line.startsWith('# ')) return <h1 key={i} className="text-lg font-bold mt-4 mb-2">{line.slice(2)}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold mt-3 mb-1">{line.slice(3)}</h2>;
                  if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold mt-2 mb-1">{line.slice(4)}</h3>;
                  if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.slice(2)}</li>;
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="mb-1">{line}</p>;
                })}
              </div>
              {meeting.status === 'review' && (
                <div className="mt-4 pt-4 border-t border-sandy-gold flex gap-3">
                  <Link
                    href={`/admin/secretary/meetings/${id}/minutes`}
                    className="px-4 py-2 rounded-lg bg-terra-cotta text-white text-sm font-semibold hover:bg-terra-cotta-hover transition-colors"
                  >
                    Edit Minutes
                  </Link>
                  <Link
                    href={`/admin/secretary/meetings/${id}/approvals`}
                    className="px-4 py-2 rounded-lg border border-terra-cotta text-terra-cotta text-sm font-semibold hover:bg-terra-cotta/5 transition-colors"
                  >
                    Submit for Approval
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Resolutions */}
          {resolutions.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-sandy-gold">
              <h2 className="font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-terra-cotta" />
                Resolutions ({resolutions.length})
              </h2>
              <div className="space-y-3">
                {resolutions.map(res => (
                  <div key={res.id} className="p-3 rounded-lg bg-cream-light border border-sandy-gold/50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-(--text-primary)">{res.title}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${res.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {res.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    {res.resolutionNumber && (
                      <span className="text-xs text-(--text-muted)">#{res.resolutionNumber}</span>
                    )}
                    <div className="text-xs text-(--text-muted) mt-1">
                      {res.votesFor} for / {res.votesAgainst} against / {res.abstentions} abstain
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Attendance */}
          <div className="bg-white rounded-xl p-5 border border-sandy-gold">
            <h3 className="font-semibold text-(--text-primary) mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-terra-cotta" />
              Attendance
            </h3>
            <AttendanceEditor meetingId={id} attendance={attendance} editable={meeting.status === 'draft'} />
          </div>

          {/* Agenda */}
          {agenda.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-sandy-gold">
              <h3 className="font-semibold text-(--text-primary) mb-3">Agenda</h3>
              <ol className="space-y-2">
                {agenda.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-terra-cotta font-bold shrink-0">{i + 1}.</span>
                    <div>
                      <span className="text-(--text-primary)">{item.title}</span>
                      {item.presenter && (
                        <span className="text-(--text-muted) text-xs ml-1">({item.presenter})</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
