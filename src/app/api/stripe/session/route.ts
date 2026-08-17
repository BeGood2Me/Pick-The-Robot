import { NextResponse } from 'next/server';
import {
  peekPendingApiKey,
  provisionApiKey,
  retrievePendingApiKey,
  rotateApiKeyForCheckout,
  verifyRecoveryToken,
  issueRecoveryToken,
} from '@/lib/api/keyStore';
import { isApiTier } from '@/lib/api/tiers';
import { getStripe, isStripeCheckoutConfigured } from '@/lib/stripe/server';
import {
  checkoutSessionIsPaid,
  subscriptionIdFromSession,
} from '@/lib/stripe/subscription';
import type Stripe from 'stripe';

function sessionCustomerId(session: Stripe.Checkout.Session): string | null {
  if (typeof session.customer === 'string') return session.customer;
  return session.customer?.id ?? null;
}

function sessionEmail(session: Stripe.Checkout.Session): string {
  return (
    session.customer_details?.email ??
    session.customer_email ??
    'unknown@picktherobot.com'
  );
}

async function subscriptionIsActive(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<boolean> {
  const subscriptionId = subscriptionIdFromSession(session);
  if (!subscriptionId) return true;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription.status === 'active' || subscription.status === 'trialing';
}

export async function GET(request: Request) {
  if (!isStripeCheckoutConfigured()) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  const rotate = url.searchParams.get('rotate') === '1';
  const recoveryToken = url.searchParams.get('token');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'validation_failed', message: 'session_id is required.' },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!checkoutSessionIsPaid(session)) {
      return NextResponse.json(
        { error: 'payment_incomplete', message: 'Checkout is not complete yet.' },
        { status: 402 },
      );
    }

    const tierValue = session.metadata?.tier;
    if (!tierValue || !isApiTier(tierValue)) {
      return NextResponse.json(
        {
          error: 'invalid_session',
          message: 'Checkout session is missing a valid API tier.',
        },
        { status: 422 },
      );
    }

    if (!(await subscriptionIsActive(stripe, session))) {
      return NextResponse.json(
        {
          error: 'subscription_inactive',
          message: 'Your subscription is not active. Resubscribe on the API page.',
        },
        { status: 403 },
      );
    }

    const customerId = sessionCustomerId(session);
    if (!customerId) {
      return NextResponse.json(
        {
          error: 'key_pending',
          message: 'Your payment succeeded. Preparing your API key…',
        },
        { status: 202 },
      );
    }

    const keyInput = {
      tier: tierValue,
      customerId,
      email: sessionEmail(session),
      checkoutSessionId: sessionId,
      subscriptionId: subscriptionIdFromSession(session) ?? undefined,
    };

    let rotated = false;
    let issuedRecoveryToken: string | null = null;

    if (rotate) {
      if (!recoveryToken || !(await verifyRecoveryToken(sessionId, recoveryToken))) {
        return NextResponse.json(
          {
            error: 'invalid_recovery_token',
            message: 'A valid recovery token is required to rotate your API key.',
          },
          { status: 403 },
        );
      }
      await rotateApiKeyForCheckout(keyInput);
      rotated = true;
    } else if (!(await peekPendingApiKey(sessionId))) {
      await provisionApiKey(keyInput);
    }

    issuedRecoveryToken = await issueRecoveryToken(sessionId);

    const apiKey = await retrievePendingApiKey(sessionId);
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'key_already_retrieved',
          message: 'Use your saved recovery link with ?rotate=1 and token=… to generate a new key.',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      tier: tierValue,
      apiKey,
      recoveryToken: issuedRecoveryToken,
      rotated,
      email: session.customer_details?.email ?? session.customer_email ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not load checkout session.';
    return NextResponse.json({ error: 'session_lookup_failed', message }, { status: 500 });
  }
}
