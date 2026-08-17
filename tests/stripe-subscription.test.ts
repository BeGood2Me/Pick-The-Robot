import { describe, it, expect } from 'vitest';
import {
  subscriptionShouldRevokeKeys,
  tierFromSubscription,
} from '../src/lib/stripe/subscription';

describe('subscription policy', () => {
  it('revokes keys for unpaid and past_due subscriptions', () => {
    expect(subscriptionShouldRevokeKeys('past_due')).toBe(true);
    expect(subscriptionShouldRevokeKeys('unpaid')).toBe(true);
    expect(subscriptionShouldRevokeKeys('canceled')).toBe(true);
    expect(subscriptionShouldRevokeKeys('paused')).toBe(true);
    expect(subscriptionShouldRevokeKeys('active')).toBe(false);
    expect(subscriptionShouldRevokeKeys('trialing')).toBe(false);
  });

  it('resolves tier from subscription metadata', () => {
    const tier = tierFromSubscription({
      id: 'sub_1',
      object: 'subscription',
      metadata: { tier: 'pro' },
      items: { object: 'list', data: [], has_more: false, url: '' },
    } as never);
    expect(tier).toBe('pro');
  });
});
