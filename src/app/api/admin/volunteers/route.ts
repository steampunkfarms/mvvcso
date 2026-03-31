import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const volunteerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  language: z.string().default('en'),
  skills: z.string().optional(),
  availability: z.string().optional(),
  status: z.string().default('pending'),
  backgroundCheck: z.string().default('not_started'),
  notes: z.string().optional(),
});

export async function GET() {
  await requireAuth(['president', 'vice_president', 'secretary', 'volunteer_coordinator']);
  const volunteers = await db.select().from(schema.volunteers).orderBy(schema.volunteers.name);
  return NextResponse.json(volunteers);
}

export async function POST(req: NextRequest) {
  await requireAuth(['president', 'vice_president', 'secretary', 'volunteer_coordinator']);
  const body = await req.json();
  const data = volunteerSchema.parse(body);
  const [volunteer] = await db.insert(schema.volunteers).values(data).returning();

  await db.insert(schema.activityLog).values({
    type: 'volunteer_signup',
    title: `New volunteer: ${data.name}`,
    entityId: volunteer.id,
    entityType: 'volunteers',
  });

  return NextResponse.json(volunteer, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await requireAuth(['president', 'vice_president', 'secretary', 'volunteer_coordinator']);
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const [updated] = await db
    .update(schema.volunteers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.volunteers.id, id))
    .returning();

  return NextResponse.json(updated);
}
