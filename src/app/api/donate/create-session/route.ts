import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';

const donateSchema = z.object({
  amount: z.number().int().min(1).max(100000),
  frequency: z.enum(['one-time', 'monthly']).default('one-time'),
  campaign: z.string().default('general'),
});

export async function POST(request: Request) {
  if (!env.hasStripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured yet. Please use Zeffy to donate.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const data = donateSchema.parse(body);

    // Lazy-load Stripe
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(env.stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: data.frequency === 'monthly' ? 'subscription' : 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `MVVCSO Donation — ${data.campaign === 'ranchita-roots' ? 'Ranchita Roots' : 'General Fund'}`,
              description: 'Tax-deductible donation to MVVCSO, a 501(c)(3) nonprofit.',
            },
            unit_amount: data.amount * 100, // cents
            ...(data.frequency === 'monthly' && {
              recurring: { interval: 'month' as const },
            }),
          },
          quantity: 1,
        },
      ],
      metadata: {
        campaign: data.campaign,
        frequency: data.frequency,
      },
      success_url: `${env.siteUrl}/donate?success=true`,
      cancel_url: `${env.siteUrl}/donate`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Donate create-session error:', error);
    return NextResponse.json(
      { error: 'Failed to create donation session' },
      { status: 500 }
    );
  }
}
