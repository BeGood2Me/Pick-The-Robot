import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { FOR_VENDORS_PATH } from '@/lib/content/for-vendors';
import { getVendorBySlug } from '@/lib/matching/vendors';
import { BASE_URL } from '@/lib/seo/metadata';
import { getStripe, isVendorStripeCheckoutConfigured } from '@/lib/stripe/server';
import { vendorHasActiveVerified } from '@/lib/vendor/subscription';
import { isVendorTier } from '@/lib/vendor/tiers';

export async function POST(request: Request) {
  if (!isVendorStripeCheckoutConfigured()) {
    return NextResponse.json(
      {
        error: 'stripe_not_configured',
        message:
          'Vendor checkout is not configured. Set STRIPE_VENDOR_VERIFIED_PRICE_ID and related env vars.',
      },
      { status: 503 },
    );
  }

  let tier = 'verified';
  let vendorSlug = '';
  try {
    const body = (await request.json()) as { tier?: string; vendorSlug?: string };
    if (body.tier && isVendorTier(body.tier)) tier = body.tier;
    vendorSlug = (body.vendorSlug ?? '').trim();
  } catch {
    return NextResponse.json(
      { error: 'validation_failed', message: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  if (!vendorSlug) {
    return NextResponse.json(
      { error: 'validation_failed', message: 'Select a vendor listing.' },
      { status: 400 },
    );
  }

  const vendor = getVendorBySlug(vendorSlug);
  if (!vendor) {
    return NextResponse.json(
      { error: 'unknown_vendor', message: 'No vendor listing found for that selection.' },
      { status: 404 },
    );
  }

  if (tier === 'sponsored' && !(await vendorHasActiveVerified(vendorSlug))) {
    return NextResponse.json(
      {
        error: 'verified_required',
        message: 'Sponsored boost requires an active Verified partner subscription.',
      },
      { status: 403 },
    );
  }

  const siteUrl = BASE_URL.replace(/\/$/, '');
  const integrationSuffix = randomBytes(4).toString('hex');
  const priceEnvKey =
    tier === 'verified' ? 'STRIPE_VENDOR_VERIFIED_PRICE_ID' : 'STRIPE_VENDOR_SPONSORED_PRICE_ID';
  const priceId = process.env[priceEnvKey];
  if (!priceId) {
    return NextResponse.json(
      { error: 'stripe_not_configured', message: `${priceEnvKey} is not set.` },
      { status: 503 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}${FOR_VENDORS_PATH}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${FOR_VENDORS_PATH}?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        product: 'vendor',
        tier,
        vendor_slug: vendorSlug,
      },
      subscription_data: {
        metadata: {
          product: 'vendor',
          tier,
          vendor_slug: vendorSlug,
        },
      },
      managed_payments: { enabled: false },
      integration_identifier: `picktherobot_vendor_${tier}_${integrationSuffix}`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'checkout_failed', message: 'Stripe did not return a checkout URL.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url, tier, vendorSlug });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed.';
    return NextResponse.json({ error: 'checkout_failed', message }, { status: 500 });
  }
}
