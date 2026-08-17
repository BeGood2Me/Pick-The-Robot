import Stripe from 'stripe';
import type { ApiTier } from '@/lib/api/tiers';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured.');
  }
  return secret;
}

export function getStripePriceId(tier: ApiTier): string {
  const envKey = tier === 'starter' ? 'STRIPE_STARTER_PRICE_ID' : 'STRIPE_PRO_PRICE_ID';
  const priceId = process.env[envKey];
  if (!priceId) {
    throw new Error(`${envKey} is not configured.`);
  }
  return priceId;
}

export function isStripeCheckoutConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_STARTER_PRICE_ID &&
      process.env.STRIPE_PRO_PRICE_ID,
  );
}

export function isStripeConfigured(): boolean {
  return Boolean(isStripeCheckoutConfigured() && process.env.STRIPE_WEBHOOK_SECRET);
}
