import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth();
  const { id } = await params;

  const [minutes] = await db
    .select()
    .from(schema.meetingMinutes)
    .where(eq(schema.meetingMinutes.meetingId, id));

  if (!minutes) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(minutes);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['president', 'secretary']);
  const { id } = await params;

  try {
    const body = await request.json();

    await db
      .update(schema.meetingMinutes)
      .set({
        editedDraft: body.editedDraft,
        editedBy: user.id,
        editedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.meetingMinutes.meetingId, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update minutes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
