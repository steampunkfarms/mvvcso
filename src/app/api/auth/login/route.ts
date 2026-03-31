import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createMagicLink } from '@/lib/auth';
import { sendMagicLink } from '@/lib/email';

const loginSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = loginSchema.parse(body);

    const result = await createMagicLink(email);

    if (!result) {
      // Don't reveal whether email exists — same response either way
      return NextResponse.json({ message: 'If this email is authorized, a sign-in link has been sent.' });
    }

    await sendMagicLink(email, result.token, result.user.name);

    return NextResponse.json({ message: 'If this email is authorized, a sign-in link has been sent.' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    console.error('[AUTH/LOGIN]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
