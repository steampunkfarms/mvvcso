import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, schema } from '@/lib/db';

const { contactSubmissions } = schema;
import { env } from '@/lib/env';

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  message: z.string().min(1).max(5000),
  language: z.enum(['en', 'es']).optional().default('en'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Save to database
    await db.insert(contactSubmissions).values({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone?.trim() || null,
      message: data.message.trim(),
      language: data.language,
    });

    // Send notification email if Resend is configured
    if (env.hasResend) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(env.resendApiKey);
        await resend.emails.send({
          from: 'MVVCSO Contact <noreply@mvvcso.org>',
          to: 'ranchitacommunityorganization@gmail.com',
          subject: `New contact form submission from ${data.name}`,
          text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nLanguage: ${data.language}\n\nMessage:\n${data.message}`,
        });
      } catch (emailError) {
        console.error('Failed to send contact notification email:', emailError);
        // Don't fail the request if email fails — the submission is saved
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
