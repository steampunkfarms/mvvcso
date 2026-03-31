import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getMeeting, getMeetingMinutes, getBoardMembers } from '@/lib/meetings';
import { env } from '@/lib/env';
import { format } from 'date-fns';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['president', 'secretary']);
  const { id } = await params;

  const meeting = await getMeeting(id);
  if (!meeting) {
    return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
  }

  const minutes = await getMeetingMinutes(id);
  const draftContent = minutes?.editedDraft || minutes?.aiDraft;
  if (!draftContent) {
    return NextResponse.json({ error: 'No draft to submit' }, { status: 400 });
  }

  // Advance status
  await db
    .update(schema.boardMeetings)
    .set({ status: 'pending_approval', updatedAt: new Date() })
    .where(eq(schema.boardMeetings.id, id));

  // Notify board members via email
  if (env.hasResend) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(env.resendApiKey);
      const members = await getBoardMembers();

      await Promise.allSettled(
        members.map(member =>
          resend.emails.send({
            from: 'MVVCSO Secretary <noreply@mvvcso.org>',
            to: member.email,
            subject: `Minutes Ready for Review: ${format(meeting.meetingDate, 'MMMM d, yyyy')} Meeting`,
            text: `The minutes from the ${meeting.meetingType} meeting on ${format(meeting.meetingDate, 'MMMM d, yyyy')} are ready for your review and approval.\n\nPlease log in to the admin portal to review and cast your vote.\n\n${env.siteUrl}/admin/secretary/meetings/${id}/approvals`,
          })
        )
      );
    } catch (emailError) {
      console.error('Failed to send approval notification emails:', emailError);
    }
  }

  await db.insert(schema.activityLog).values({
    type: 'minutes_submitted',
    title: 'Minutes submitted for board approval',
    entityId: id,
    entityType: 'meeting',
    userId: user.id,
  });

  return NextResponse.json({ success: true });
}
