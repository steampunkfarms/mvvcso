import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { getMeeting, getMeetingApprovals, getBoardMembers } from '@/lib/meetings';
import { format } from 'date-fns';
import { ApprovalVoteForm } from '@/components/meetings/approval-vote-form';
import Link from 'next/link';
import { ArrowLeft, Check, X as XIcon, Minus } from 'lucide-react';

export default async function ApprovalsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const meeting = await getMeeting(id);

  if (!meeting) notFound();

  const approvals = await getMeetingApprovals(id);
  const members = await getBoardMembers();
  const quorum = Math.ceil(members.length / 2);
  const approveCount = approvals.filter(a => a.vote === 'approve').length;
  const rejectCount = approvals.filter(a => a.vote === 'reject').length;

  const userVote = approvals.find(a => a.memberId === user.id);
  const canVote = meeting.status === 'pending_approval';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/secretary/meetings/${id}`} className="text-gold-400 hover:text-gold-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-(--text-primary)">Minutes Approval</h1>
          <p className="text-sm text-(--text-muted)">
            {format(meeting.meetingDate, 'MMMM d, yyyy')} {meeting.meetingType} meeting
          </p>
        </div>
      </div>

      {/* Tally */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
          <div className="text-2xl font-bold text-green-700">{approveCount}</div>
          <div className="text-xs text-green-600">Approve</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
          <div className="text-2xl font-bold text-red-700">{rejectCount}</div>
          <div className="text-xs text-red-600">Reject</div>
        </div>
        <div className="bg-stone-200/10 rounded-xl p-4 text-center border border-stone-200">
          <div className="text-2xl font-bold text-stone-600">{approvals.filter(a => a.vote === 'abstain').length}</div>
          <div className="text-xs text-stone-600">Abstain</div>
        </div>
      </div>

      <p className="text-sm text-(--text-muted)">
        {approveCount >= quorum
          ? 'Quorum reached — minutes approved.'
          : `${quorum - approveCount} more approval(s) needed for quorum (${quorum} of ${members.length}).`}
      </p>

      {/* Your vote */}
      {canVote && (
        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <h2 className="font-semibold text-(--text-primary) mb-4">Your Vote</h2>
          <ApprovalVoteForm meetingId={id} currentVote={userVote?.vote} />
        </div>
      )}

      {/* All votes */}
      <div className="bg-white rounded-xl p-6 border border-stone-200">
        <h2 className="font-semibold text-(--text-primary) mb-4">Board Votes</h2>
        <div className="space-y-3">
          {members.map(member => {
            const vote = approvals.find(a => a.memberId === member.id);
            return (
              <div key={member.id} className="flex items-center justify-between py-2 border-b border-stone-200/30 last:border-0">
                <div>
                  <span className="text-sm font-medium text-(--text-primary)">{member.name}</span>
                  <span className="text-xs text-(--text-muted) ml-2 capitalize">{member.role.replace('_', ' ')}</span>
                </div>
                {vote ? (
                  <div className="flex items-center gap-2">
                    {vote.vote === 'approve' && <Check className="w-4 h-4 text-green-600" />}
                    {vote.vote === 'reject' && <XIcon className="w-4 h-4 text-red-600" />}
                    {vote.vote === 'abstain' && <Minus className="w-4 h-4 text-stone-600" />}
                    <span className={`text-xs font-medium capitalize ${
                      vote.vote === 'approve' ? 'text-green-600' :
                      vote.vote === 'reject' ? 'text-red-600' : 'text-stone-600'
                    }`}>
                      {vote.vote}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-(--text-muted)">Pending</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
