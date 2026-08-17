import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  lookupTierByApiKey,
  peekPendingApiKey,
  provisionApiKey,
  resetKeyStoreForTests,
} from '../src/lib/api/keyStore';
import { handleStripeWebhookEvent } from '../src/lib/stripe/handleWebhookEvent';

describe('stripe webhook handlers', () => {
  beforeEach(async () => {
    await resetKeyStoreForTests();
  });

  it('provisions a key on paid checkout.session.completed', async () => {
    const stripe = {
      subscriptions: {
        retrieve: vi.fn().mockResolvedValue({ status: 'active' }),
      },
    };

    await handleStripeWebhookEvent(stripe as never, {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_webhook_1',
          mode: 'subscription',
          payment_status: 'paid',
          customer: 'cus_webhook_1',
          customer_email: 'paid@example.com',
          metadata: { tier: 'starter' },
          subscription: 'sub_webhook_1',
        },
      },
    } as never);

    const pending = await peekPendingApiKey('cs_webhook_1');
    expect(pending?.startsWith('ptr_starter_')).toBe(true);
    expect(await lookupTierByApiKey(pending!)).toBe('starter');
  });

  it('skips unpaid checkout sessions', async () => {
    await handleStripeWebhookEvent({} as never, {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_unpaid',
          mode: 'subscription',
          payment_status: 'unpaid',
          customer: 'cus_unpaid',
          metadata: { tier: 'starter' },
        },
      },
    } as never);

    expect(await peekPendingApiKey('cs_unpaid')).toBeNull();
  });

  it('revokes keys when a subscription is past_due', async () => {
    const { apiKey } = await provisionApiKey({
      tier: 'starter',
      customerId: 'cus_past_due',
      email: 'past@example.com',
      checkoutSessionId: 'cs_past_due',
      subscriptionId: 'sub_past_due',
    });

    await handleStripeWebhookEvent({} as never, {
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_past_due',
          status: 'past_due',
          metadata: { tier: 'starter' },
          items: { data: [] },
        },
      },
    } as never);

    expect(await lookupTierByApiKey(apiKey)).toBeNull();
  });
});
