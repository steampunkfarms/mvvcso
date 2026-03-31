import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { createMagicLink } from '@/lib/auth';
import { env } from '@/lib/env';

const registerSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  language: z.enum(['en', 'es']).default('en'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);
    const email = data.email.toLowerCase().trim();

    // Check if user already exists
    const [existing] = await db.select().from(schema.authUsers).where(eq(schema.authUsers.email, email));

    if (existing) {
      // User exists — just send magic link to sign in
      const token = await createMagicLink(email);
      if (token && env.hasResend) {
        const { Resend } = await import('resend');
        const resend = new Resend(env.resendApiKey);
        await resend.emails.send({
          from: 'MVVCSO <noreply@mvvcso.org>',
          to: email,
          subject: 'Sign in to MVVCSO',
          text: `Click to sign in: ${env.siteUrl}/admin/verify?token=${token}`,
        });
      }
      return NextResponse.json({ success: true, message: 'Check your email' });
    }

    // Create new resident account
    await db.insert(schema.authUsers).values({
      email,
      name: data.name.trim(),
      role: 'resident',
      language: data.language,
      displayName: data.name.trim(),
    });

    // Send magic link
    const token = await createMagicLink(email);
    if (token && env.hasResend) {
      const { Resend } = await import('resend');
      const resend = new Resend(env.resendApiKey);
      await resend.emails.send({
        from: 'MVVCSO <noreply@mvvcso.org>',
        to: email,
        subject: 'Welcome to MVVCSO — Verify Your Account',
        text: `Welcome to the MVVCSO community, ${data.name}!\n\nClick to verify your account: ${env.siteUrl}/admin/verify?token=${token}\n\nThis link expires in 15 minutes.`,
      });
    }

    await db.insert(schema.activityLog).values({
      type: 'user_registered',
      title: `New resident registered: ${data.name.trim()}`,
      entityType: 'user',
    });

    return NextResponse.json({ success: true, message: 'Check your email to complete registration' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
