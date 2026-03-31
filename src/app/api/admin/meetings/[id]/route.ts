import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth(['president', 'secretary']);
  const { id } = await params;

  try {
    const body = await request.json();

    // Update meeting fields
    if (body.location || body.meetingType || body.calledBy !== undefined) {
      await db
        .update(schema.boardMeetings)
        .set({
          ...(body.location && { location: body.location }),
          ...(body.meetingType && { meetingType: body.meetingType }),
          ...(body.calledBy !== undefined && { calledBy: body.calledBy }),
          ...(body.agendaJson !== undefined && { agendaJson: body.agendaJson }),
          ...(body.status && { status: body.status }),
          ...(body.calledToOrderAt && { calledToOrderAt: new Date(body.calledToOrderAt) }),
          ...(body.adjournedAt && { adjournedAt: new Date(body.adjournedAt) }),
          ...(body.quorumPresent !== undefined && { quorumPresent: body.quorumPresent }),
          updatedAt: new Date(),
        })
        .where(eq(schema.boardMeetings.id, id));
    }

    // Update raw notes on minutes
    if (body.rawNotes !== undefined) {
      await db
        .update(schema.meetingMinutes)
        .set({
          rawNotes: body.rawNotes,
          updatedAt: new Date(),
        })
        .where(eq(schema.meetingMinutes.meetingId, id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update meeting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
