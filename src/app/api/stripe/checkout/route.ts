import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { isApiTier, type ApiTier } from '@/lib/api/tiers';
import { DEVELOPERS_PATH } from '@/lib/content/developers';
import { BASE_URL } from '@/lib/seo/metadata';
import { getStripe, getStripePriceId, isStripeCheckoutConfigured } from '@/lib/stripe/server';

export async function POST(request: Request) {
  if (!isStripeCheckoutConfigured()) {
    return NextResponse.json(
      {
        error: 'stripe_not_configured',
        message:
          'Stripe is not configured. Set STRIPE_SECRET_KEY, STRIPE_STARTER_PRICE_ID, and STRIPE_PRO_PRICE_ID.',
      },
      { status: 503 },
    );
  }

  let tier: ApiTier = 'starter';
  try {
    const body = (await request.json()) as { tier?: string };
    if (body.tier && isApiTier(body.tier)) {
      tier = body.tier;
    }
  } catch {
    // Default to starter when no JSON body is sent.
  }

  const siteUrl = BASE_URL.replace(/\/$/, '');
  const integrationSuffix = randomBytes(4).toString('hex');

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: getStripePriceId(tier), quantity: 1 }],
      success_url: `${siteUrl}${DEVELOPERS_PATH}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${DEVELOPERS_PATH}?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: { tier },
      subscription_data: {
        metadata: { tier },
      },
      // PickTheRobot uses standard Stripe Checkout, not Managed Payments.
      managed_payments: { enabled: false },
      integration_identifier: `picktherobot_api_${tier}_${integrationSuffix}`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'checkout_failed', message: 'Stripe did not return a checkout URL.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url, tier });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed.';
    return NextResponse.json({ error: 'checkout_failed', message }, { status: 500 });
  }
}
