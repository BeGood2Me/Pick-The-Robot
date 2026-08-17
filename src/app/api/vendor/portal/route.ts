import { NextResponse } from 'next/server';
import { FOR_VENDORS_PATH } from '@/lib/content/for-vendors';
import { getVendorSession, getVendorPortalForSession } from '@/lib/vendor/auth-server';
import { getStripe, isVendorStripeCheckoutConfigured } from '@/lib/stripe/server';

export async function GET() {
  const session = await getVendorSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const summary = await getVendorPortalForSession();
  if (!summary) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  return NextResponse.json(summary);
}

export async function POST() {
  if (!isVendorStripeCheckoutConfigured()) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });
  }

  const session = await getVendorSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const summary = await getVendorPortalForSession();
  if (!summary?.account.stripeCustomerId) {
    return NextResponse.json({ error: 'no_customer' }, { status: 400 });
  }

  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: summary.account.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://picktherobot.com'}${FOR_VENDORS_PATH}/portal`,
  });

  return NextResponse.json({ url: portal.url });
}
