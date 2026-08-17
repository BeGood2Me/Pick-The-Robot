import { NextResponse } from 'next/server';
import { getStripe, getStripeWebhookSecret, isStripeConfigured } from '@/lib/stripe/server';
import { handleStripeWebhookEvent } from '@/lib/stripe/handleWebhookEvent';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, getStripeWebhookSecret());
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid webhook signature.';
    return NextResponse.json({ error: 'invalid_signature', message }, { status: 400 });
  }

  try {
    await handleStripeWebhookEvent(stripe, event);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook handler failed.';
    console.error('[stripe webhook]', event.type, message);
    return NextResponse.json({ error: 'handler_failed', message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
