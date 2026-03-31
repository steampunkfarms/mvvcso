import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getMeeting, getMeetingMinutes, getMeetingApprovals, getBoardMembers } from '@/lib/meetings';

const voteSchema = z.object({
  vote: z.enum(['approve', 'reject', 'abstain']),
  comment: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  const { id } = await params;

  const meeting = await getMeeting(id);
  if (!meeting || meeting.status !== 'pending_approval') {
    return NextResponse.json({ error: 'Meeting not in approval state' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const data = voteSchema.parse(body);

    // Upsert vote (replace existing vote)
    const [existing] = await db
      .select()
      .from(schema.meetingApprovals)
      .where(
        and(
          eq(schema.meetingApprovals.meetingId, id),
          eq(schema.meetingApprovals.memberId, user.id)
        )
      );

    if (existing) {
      await db
        .update(schema.meetingApprovals)
        .set({ vote: data.vote, comment: data.comment || null, votedAt: new Date() })
        .where(eq(schema.meetingApprovals.id, existing.id));
    } else {
      await db.insert(schema.meetingApprovals).values({
        meetingId: id,
        memberId: user.id,
        vote: data.vote,
        comment: data.comment || null,
      });
    }

    // Check if majority has approved
    const approvals = await getMeetingApprovals(id);
    const members = await getBoardMembers();
    const approveCount = approvals.filter(a => a.vote === 'approve').length;
    const quorum = Math.ceil(members.length / 2);

    if (approveCount >= quorum) {
      const minutes = await getMeetingMinutes(id);
      const approvedContent = minutes?.editedDraft || minutes?.aiDraft;

      await db
        .update(schema.boardMeetings)
        .set({ status: 'approved', updatedAt: new Date() })
        .where(eq(schema.boardMeetings.id, id));

      await db
        .update(schema.meetingMinutes)
        .set({
          approvedVersion: approvedContent,
          approvedAt: new Date(),
          approvalMethod: 'platform_vote',
          updatedAt: new Date(),
        })
        .where(eq(schema.meetingMinutes.meetingId, id));

      await db.insert(schema.activityLog).values({
        type: 'minutes_approved',
        title: 'Meeting minutes approved by board majority',
        entityId: id,
        entityType: 'meeting',
        userId: user.id,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Approval vote error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
