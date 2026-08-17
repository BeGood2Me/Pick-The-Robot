import { NextResponse } from 'next/server';
import { FOR_VENDORS_PATH } from '@/lib/content/for-vendors';
import { provisionVendorSubscription } from '@/lib/vendor/vendorStore';
import { createVendorSessionToken, vendorSessionCookieOptions, vendorSessionCookieName } from '@/lib/vendor/session';
import { getStripe, isVendorStripeCheckoutConfigured } from '@/lib/stripe/server';
import {
  checkoutSessionIsPaid,
  subscriptionIdFromSession,
} from '@/lib/stripe/subscription';
import { isVendorTier } from '@/lib/vendor/tiers';
import type Stripe from 'stripe';

export async function GET(request: Request) {
  if (!isVendorStripeCheckoutConfigured()) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
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

    if (session.metadata?.product !== 'vendor') {
      return NextResponse.json(
        { error: 'invalid_session', message: 'Not a vendor checkout session.' },
        { status: 422 },
      );
    }

    const tierValue = session.metadata.tier;
    const vendorSlug = session.metadata.vendor_slug;
    if (!isVendorTier(tierValue) || !vendorSlug) {
      return NextResponse.json(
        { error: 'invalid_session', message: 'Missing vendor checkout metadata.' },
        { status: 422 },
      );
    }

    const subscriptionId = subscriptionIdFromSession(session);
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'subscription_pending', message: 'Subscription is still processing.' },
        { status: 202 },
      );
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return NextResponse.json(
        { error: 'subscription_inactive', message: 'Subscription is not active.' },
        { status: 403 },
      );
    }

    const customerId =
      typeof session.customer === 'string' ? session.customer : session.customer?.id;
    if (!customerId) {
      return NextResponse.json(
        { error: 'customer_pending', message: 'Customer record is still processing.' },
        { status: 202 },
      );
    }

    const email =
      session.customer_details?.email ??
      session.customer_email ??
      'unknown@picktherobot.com';

    const account = await provisionVendorSubscription({
      email,
      vendorSlug,
      customerId,
      checkoutSessionId: sessionId,
      subscriptionId,
      tier: tierValue,
    });

    const sessionToken = createVendorSessionToken({
      accountId: account.id,
      email: account.email,
      vendorSlug: account.vendorSlug,
    });

    const response = NextResponse.json({
      tier: tierValue,
      vendorSlug,
      email: account.email,
      portalPath: `${FOR_VENDORS_PATH}/portal`,
    });
    response.cookies.set(vendorSessionCookieName(), sessionToken, vendorSessionCookieOptions());
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not complete vendor checkout.';
    return NextResponse.json({ error: 'session_lookup_failed', message }, { status: 500 });
  }
}
