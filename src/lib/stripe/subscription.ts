import type Stripe from 'stripe';
import { isApiTier, type ApiTier } from '@/lib/api/tiers';
import { isVendorTier, type VendorTier } from '@/lib/vendor/tiers';

export function checkoutSessionIsPaid(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
}

export function subscriptionIdFromSession(session: Stripe.Checkout.Session): string | null {
  if (typeof session.subscription === 'string') return session.subscription;
  return session.subscription?.id ?? null;
}

export function subscriptionIsActiveStatus(status: Stripe.Subscription.Status): boolean {
  return status === 'active' || status === 'trialing';
}

export function subscriptionShouldRevokeKeys(status: Stripe.Subscription.Status): boolean {
  return (
    status === 'canceled' ||
    status === 'unpaid' ||
    status === 'incomplete_expired' ||
    status === 'past_due' ||
    status === 'paused'
  );
}

export function tierFromSubscription(subscription: Stripe.Subscription): ApiTier | null {
  if (subscription.metadata?.product === 'vendor') return null;
  const metadataTier = subscription.metadata?.tier;
  if (metadataTier && isApiTier(metadataTier)) return metadataTier;

  const priceId = subscription.items.data[0]?.price?.id;
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter';
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro';
  return null;
}

export function vendorTierFromSubscription(subscription: Stripe.Subscription): VendorTier | null {
  if (subscription.metadata?.product !== 'vendor') {
    const priceId = subscription.items.data[0]?.price?.id;
    if (priceId === process.env.STRIPE_VENDOR_VERIFIED_PRICE_ID) return 'verified';
    if (priceId === process.env.STRIPE_VENDOR_SPONSORED_PRICE_ID) return 'sponsored';
    return null;
  }
  const metadataTier = subscription.metadata?.tier;
  if (isVendorTier(metadataTier)) return metadataTier;
  const priceId = subscription.items.data[0]?.price?.id;
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_VENDOR_VERIFIED_PRICE_ID) return 'verified';
  if (priceId === process.env.STRIPE_VENDOR_SPONSORED_PRICE_ID) return 'sponsored';
  return null;
}

export function subscriptionProduct(
  subscription: Stripe.Subscription,
): 'api' | 'vendor' | null {
  if (subscription.metadata?.product === 'vendor') return 'vendor';
  if (tierFromSubscription(subscription)) return 'api';
  if (vendorTierFromSubscription(subscription)) return 'vendor';
  return null;
}
