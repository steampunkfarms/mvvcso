import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';

const createMeetingSchema = z.object({
  meetingDate: z.string().min(1),
  meetingType: z.enum(['regular', 'special', 'emergency', 'annual']).default('regular'),
  location: z.string().optional(),
  calledBy: z.string().optional(),
});

export async function POST(request: Request) {
  const user = await requireAuth(['president', 'secretary']);

  try {
    const body = await request.json();
    const data = createMeetingSchema.parse(body);

    const [meeting] = await db
      .insert(schema.boardMeetings)
      .values({
        meetingDate: new Date(data.meetingDate),
        meetingType: data.meetingType,
        location: data.location || 'MVVCSO Community Center',
        calledBy: data.calledBy || null,
        createdBy: user.id,
      })
      .returning({ id: schema.boardMeetings.id });

    // Create empty minutes record
    await db.insert(schema.meetingMinutes).values({
      meetingId: meeting.id,
    });

    // Log activity
    await db.insert(schema.activityLog).values({
      type: 'meeting_created',
      title: `${data.meetingType} meeting scheduled`,
      description: `Meeting on ${data.meetingDate}`,
      entityId: meeting.id,
      entityType: 'meeting',
      userId: user.id,
    });

    return NextResponse.json({ id: meeting.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Create meeting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
