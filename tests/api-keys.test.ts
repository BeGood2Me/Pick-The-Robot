import { describe, it, expect, beforeEach } from 'vitest';
import {
  hashApiKey,
  lookupTierByApiKey,
  provisionApiKey,
  resetKeyStoreForTests,
  retrievePendingApiKey,
  revokeKeysForSubscription,
  rotateApiKeyForCheckout,
  updateTierForSubscription,
  verifyRecoveryToken,
  issueRecoveryToken,
} from '../src/lib/api/keyStore';
import { resolveApiTier } from '../src/lib/api/tiers';

describe('api key store', () => {
  beforeEach(async () => {
    await resetKeyStoreForTests();
  });

  it('provisions and resolves a starter key', async () => {
    const { apiKey, recoveryToken } = await provisionApiKey({
      tier: 'starter',
      customerId: 'cus_test_123',
      email: 'dev@example.com',
      checkoutSessionId: 'cs_test_123',
    });

    expect(apiKey.startsWith('ptr_starter_')).toBe(true);
    expect(recoveryToken).toMatch(/^rt_/);
    expect(await lookupTierByApiKey(apiKey)).toBe('starter');
    expect(await retrievePendingApiKey('cs_test_123')).toBe(apiKey);
    expect(await retrievePendingApiKey('cs_test_123')).toBeNull();
  });

  it('revokes keys when a subscription ends', async () => {
    const { apiKey } = await provisionApiKey({
      tier: 'pro',
      customerId: 'cus_cancel_1',
      email: 'cancel@example.com',
      checkoutSessionId: 'cs_cancel_1',
      subscriptionId: 'sub_cancel_1',
    });

    await revokeKeysForSubscription('sub_cancel_1');
    expect(await lookupTierByApiKey(apiKey)).toBeNull();
  });

  it('does not revoke other subscriptions for the same customer', async () => {
    const first = await provisionApiKey({
      tier: 'starter',
      customerId: 'cus_multi',
      email: 'multi@example.com',
      checkoutSessionId: 'cs_multi_1',
      subscriptionId: 'sub_multi_1',
    });
    const second = await provisionApiKey({
      tier: 'pro',
      customerId: 'cus_multi',
      email: 'multi@example.com',
      checkoutSessionId: 'cs_multi_2',
      subscriptionId: 'sub_multi_2',
    });

    await revokeKeysForSubscription('sub_multi_1');
    expect(await lookupTierByApiKey(first.apiKey)).toBeNull();
    expect(await lookupTierByApiKey(second.apiKey)).toBe('pro');
  });

  it('updates tier when a subscription is upgraded', async () => {
    const { apiKey } = await provisionApiKey({
      tier: 'starter',
      customerId: 'cus_upgrade',
      email: 'upgrade@example.com',
      checkoutSessionId: 'cs_upgrade',
      subscriptionId: 'sub_upgrade',
    });

    await updateTierForSubscription('sub_upgrade', 'pro');
    expect(await lookupTierByApiKey(apiKey)).toBe('pro');
  });

  it('provisions idempotently for the same checkout session', async () => {
    const first = await provisionApiKey({
      tier: 'starter',
      customerId: 'cus_dup',
      email: 'dup@example.com',
      checkoutSessionId: 'cs_dup',
    });
    const second = await provisionApiKey({
      tier: 'starter',
      customerId: 'cus_dup',
      email: 'dup@example.com',
      checkoutSessionId: 'cs_dup',
    });

    expect(second.apiKey).toBe(first.apiKey);
  });

  it('rotates a key and revokes the previous one', async () => {
    const first = await provisionApiKey({
      tier: 'starter',
      customerId: 'cus_rotate',
      email: 'rotate@example.com',
      checkoutSessionId: 'cs_rotate',
    });
    await retrievePendingApiKey('cs_rotate');

    const second = await rotateApiKeyForCheckout({
      tier: 'starter',
      customerId: 'cus_rotate',
      email: 'rotate@example.com',
      checkoutSessionId: 'cs_rotate',
    });

    expect(second.apiKey).not.toBe(first.apiKey);
    expect(await lookupTierByApiKey(first.apiKey)).toBeNull();
    expect(await lookupTierByApiKey(second.apiKey)).toBe('starter');
    expect(await retrievePendingApiKey('cs_rotate')).toBe(second.apiKey);
  });

  it('requires a valid recovery token to rotate', async () => {
    await provisionApiKey({
      tier: 'starter',
      customerId: 'cus_token',
      email: 'token@example.com',
      checkoutSessionId: 'cs_token',
    });
    const token = await issueRecoveryToken('cs_token');
    expect(await verifyRecoveryToken('cs_token', token)).toBe(true);
    expect(await verifyRecoveryToken('cs_token', 'rt_invalid')).toBe(false);
  });

  it('hashes keys consistently', () => {
    expect(hashApiKey('ptr_pro_test')).toHaveLength(64);
  });
});

describe('resolveApiTier with provisioned keys', () => {
  beforeEach(async () => {
    await resetKeyStoreForTests();
    delete process.env.PICKTHEROBOT_API_KEY_PRO;
    delete process.env.PICKTHEROBOT_API_KEY_PARTNER;
  });

  it('accepts provisioned pro keys', async () => {
    const { apiKey } = await provisionApiKey({
      tier: 'pro',
      customerId: 'cus_auth_1',
      email: 'auth@example.com',
      checkoutSessionId: 'cs_auth_1',
    });

    const req = new Request('https://picktherobot.com/api/v1/match', {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
    });

    expect(await resolveApiTier(req)).toBe('pro');
  });
});
