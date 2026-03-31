import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { isMasterAdmin, MASTER_ADMIN_EMAIL } from '@/lib/master-admin';
import { db, schema } from '@/lib/db';

const VALID_ROLES = [
  'president', 'vice_president', 'secretary', 'treasurer',
  'board_member', 'volunteer_coordinator', 'content_manager',
  'voting_member', 'resident',
] as const;

const createUserSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  role: z.enum(VALID_ROLES),
  language: z.enum(['en', 'es']).default('en'),
});

const updateUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200).optional(),
  role: z.enum(VALID_ROLES).optional(),
  language: z.enum(['en', 'es']).optional(),
  isActive: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(['president']);
    const body = await req.json();
    const data = createUserSchema.parse(body);

    const [created] = await db
      .insert(schema.authUsers)
      .values({
        name: data.name,
        email: data.email.toLowerCase().trim(),
        role: data.role,
        language: data.language,
      })
      .returning();

    await db.insert(schema.activityLog).values({
      type: 'user_created',
      title: `Added user: ${data.name}`,
      entityId: created.id,
      entityType: 'auth_user',
      userId: user.id,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }
    console.error('[API/ADMIN/USERS] POST error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(['president']);
    const body = await req.json();
    const data = updateUserSchema.parse(body);

    // Protect master admin from role/deactivation changes by non-master-admins
    const [target] = await db
      .select()
      .from(schema.authUsers)
      .where(eq(schema.authUsers.id, data.id));

    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (isMasterAdmin(target.email) && !isMasterAdmin(user.email)) {
      return NextResponse.json({ error: 'Cannot modify master admin account' }, { status: 403 });
    }

    if (isMasterAdmin(target.email) && data.isActive === false) {
      return NextResponse.json({ error: 'Cannot deactivate master admin account' }, { status: 403 });
    }

    const updates: Record<string, unknown> = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.role !== undefined) updates.role = data.role;
    if (data.language !== undefined) updates.language = data.language;
    if (data.isActive !== undefined) updates.isActive = data.isActive;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const [updated] = await db
      .update(schema.authUsers)
      .set(updates)
      .where(eq(schema.authUsers.id, data.id))
      .returning();

    await db.insert(schema.activityLog).values({
      type: 'user_updated',
      title: `Updated user: ${updated.name}`,
      entityId: updated.id,
      entityType: 'auth_user',
      userId: user.id,
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    console.error('[API/ADMIN/USERS] PUT error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
