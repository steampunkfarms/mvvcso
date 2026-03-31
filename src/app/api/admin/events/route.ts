import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const eventSchema = z.object({
  titleEn: z.string().min(1),
  titleEs: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  date: z.string().transform(s => new Date(s)),
  endDate: z.string().optional().transform(s => s ? new Date(s) : undefined),
  location: z.string().optional(),
  maxRsvp: z.number().optional(),
  isPublic: z.boolean().default(true),
  category: z.string().optional(),
});

export async function GET() {
  await requireAuth();
  const events = await db.select().from(schema.events).orderBy(desc(schema.events.date));
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  const body = await req.json();
  const data = eventSchema.parse(body);

  const [event] = await db.insert(schema.events).values({
    ...data,
    createdBy: user.id,
  }).returning();

  await db.insert(schema.activityLog).values({
    type: 'event_created',
    title: `New event: ${data.titleEn}`,
    entityId: event.id,
    entityType: 'events',
    userId: user.id,
  });

  return NextResponse.json(event, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await requireAuth();
  const body = await req.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const data = eventSchema.partial().parse(rest);
  const [updated] = await db
    .update(schema.events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.events.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  await requireAuth(['president', 'vice_president', 'secretary']);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await db.delete(schema.events).where(eq(schema.events.id, id));
  return NextResponse.json({ success: true });
}
