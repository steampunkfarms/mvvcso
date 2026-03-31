import { NextRequest, NextResponse } from 'next/server';
import { eq, count } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/lib/db';

const rsvpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  status: z.string().default('attending'),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const data = rsvpSchema.parse(body);

  // Check event exists and is public
  const [event] = await db.select().from(schema.events).where(eq(schema.events.id, id));
  if (!event || !event.isPublic) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  // Check capacity
  if (event.maxRsvp) {
    const [{ value: currentCount }] = await db
      .select({ value: count() })
      .from(schema.eventRsvps)
      .where(eq(schema.eventRsvps.eventId, id));

    if (Number(currentCount) >= event.maxRsvp) {
      return NextResponse.json({ error: 'Event is full' }, { status: 409 });
    }
  }

  const [rsvp] = await db.insert(schema.eventRsvps).values({
    eventId: id,
    ...data,
  }).returning();

  await db.insert(schema.activityLog).values({
    type: 'rsvp_new',
    title: `RSVP: ${data.name} for ${event.titleEn}`,
    entityId: rsvp.id,
    entityType: 'event_rsvps',
  });

  return NextResponse.json(rsvp, { status: 201 });
}
