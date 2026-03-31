import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  titleEs: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category: z.string().optional(),
  dueDate: z.string().optional().transform(s => s ? new Date(s) : undefined),
  priority: z.enum(['critical', 'high', 'normal', 'low']).optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'overdue']).optional(),
  recurrence: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  assignedRole: z.string().optional().nullable(),
});

const createSchema = z.object({
  title: z.string().min(1),
  titleEs: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1),
  dueDate: z.string().transform(s => new Date(s)),
  priority: z.enum(['critical', 'high', 'normal', 'low']).default('normal'),
  recurrence: z.string().optional(),
  notes: z.string().optional(),
  assignedRole: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    await requireAuth(['president', 'secretary', 'treasurer']);
    const body = await req.json();
    const { id, ...data } = updateSchema.parse(body);

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (data.title !== undefined) updates.title = data.title;
    if (data.titleEs !== undefined) updates.titleEs = data.titleEs;
    if (data.description !== undefined) updates.description = data.description;
    if (data.category !== undefined) updates.category = data.category;
    if (data.dueDate !== undefined) updates.dueDate = data.dueDate;
    if (data.priority !== undefined) updates.priority = data.priority;
    if (data.recurrence !== undefined) updates.recurrence = data.recurrence;
    if (data.notes !== undefined) updates.notes = data.notes;
    if (data.assignedRole !== undefined) updates.notes = data.assignedRole
      ? `Assigned to: ${data.assignedRole}${data.notes ? `\n${data.notes}` : ''}`
      : data.notes;
    if (data.status !== undefined) {
      updates.status = data.status;
      if (data.status === 'completed') updates.completedDate = new Date();
    }

    const [updated] = await db
      .update(schema.complianceTasks)
      .set(updates)
      .where(eq(schema.complianceTasks.id, id))
      .returning();

    if (!updated) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    console.error('[API/COMPLIANCE] PUT error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(['president', 'secretary', 'treasurer']);
    const body = await req.json();
    const data = createSchema.parse(body);

    const [created] = await db
      .insert(schema.complianceTasks)
      .values({
        title: data.title,
        titleEs: data.titleEs,
        description: data.description,
        category: data.category,
        dueDate: data.dueDate,
        priority: data.priority,
        recurrence: data.recurrence,
        notes: data.assignedRole
          ? `Assigned to: ${data.assignedRole}${data.notes ? `\n${data.notes}` : ''}`
          : data.notes,
      })
      .returning();

    await db.insert(schema.activityLog).values({
      type: 'compliance_task_created',
      title: `New compliance task: ${data.title}`,
      entityId: created.id,
      entityType: 'compliance_task',
      userId: user.id,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    console.error('[API/COMPLIANCE] POST error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
