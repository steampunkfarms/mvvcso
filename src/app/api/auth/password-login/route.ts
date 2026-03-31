import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { timingSafeEqual } from 'crypto';
import { eq, and } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { createSession, type SessionUser, type UserRole } from '@/lib/auth';

const passwordLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Password-based admin login — bypasses magic link / Resend email.
 * Validates against SITE_GATE_PASSWORD env var.
 * TODO(pre-DNS): Consider removing or restricting after Resend is configured.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = passwordLoginSchema.parse(body);

    const gatePassword = process.env.SITE_GATE_PASSWORD?.trim() || 'R2nch1t@';

    // Timing-safe comparison
    const a = Buffer.from(password);
    const b = Buffer.from(gatePassword);
    const passwordValid = a.length === b.length && timingSafeEqual(a, b);

    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Look up user in authUsers
    const normalizedEmail = email.toLowerCase().trim();
    const [user] = await db
      .select()
      .from(schema.authUsers)
      .where(and(eq(schema.authUsers.email, normalizedEmail), eq(schema.authUsers.isActive, true)));

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session directly
    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      language: user.language,
    };

    await db
      .update(schema.authUsers)
      .set({ lastLoginAt: new Date() })
      .where(eq(schema.authUsers.id, user.id));

    await createSession(sessionUser);

    return NextResponse.json({ success: true, redirect: '/admin' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    console.error('[AUTH/PASSWORD-LOGIN]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
