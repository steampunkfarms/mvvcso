import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, schema } from '@/lib/db';

const { subscribers } = schema;

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  language: z.enum(['en', 'es']).optional().default('en'),
  source: z.string().optional().default('website'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = subscribeSchema.parse(body);

    await db
      .insert(subscribers)
      .values({
        email: data.email.toLowerCase().trim(),
        name: data.name?.trim() || null,
        language: data.language,
        source: data.source,
      })
      .onConflictDoNothing({ target: subscribers.email });

    // TODO: Send welcome email via Resend when RESEND_API_KEY is configured

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
