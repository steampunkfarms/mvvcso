import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { db, schema } from '@/lib/db';

const { donations } = schema;

export async function POST(request: Request) {
  if (!env.hasStripe || !env.stripeWebhookSecret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(env.stripeSecretKey);

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.stripeWebhookSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      await db.insert(donations).values({
        stripeSessionId: session.id,
        stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
        donorName: session.customer_details?.name || null,
        donorEmail: session.customer_details?.email || null,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        type: session.mode === 'subscription' ? 'recurring' : 'one-time',
        status: 'completed',
        campaign: (session.metadata?.campaign as string) || 'general',
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
