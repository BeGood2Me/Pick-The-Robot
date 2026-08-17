import { describe, it, expect, beforeEach } from 'vitest';
import {
  provisionVendorSubscription,
  recordVendorClick,
  getVendorEntitlements,
  createLoginToken,
  consumeLoginToken,
  getVendorAccountByEmail,
  resetVendorStoreForTests,
} from '../src/lib/vendor/vendorStore';
import { createVendorSessionToken, parseVendorSessionToken } from '../src/lib/vendor/session';
import { mergeVendorWithEntitlement } from '../src/lib/vendor/entitlements';
import { VENDORS } from '../src/lib/matching/vendors';

describe('vendor partner store', () => {
  beforeEach(async () => {
    await resetVendorStoreForTests();
  });

  it('provisions verified subscription and entitlements', async () => {
    const account = await provisionVendorSubscription({
      email: 'sales@vendor.test',
      vendorSlug: 'locus-robotics',
      customerId: 'cus_test',
      checkoutSessionId: 'cs_test',
      subscriptionId: 'sub_verified',
      tier: 'verified',
    });

    expect(account.vendorSlug).toBe('locus-robotics');
    const entitlements = await getVendorEntitlements();
    expect(entitlements['locus-robotics']?.verified).toBe(true);
    expect(entitlements['locus-robotics']?.sponsored).toBe(false);
  });

  it('records clicks and merges profile overlays', async () => {
    await provisionVendorSubscription({
      email: 'sales@vendor.test',
      vendorSlug: 'locus-robotics',
      customerId: 'cus_test',
      checkoutSessionId: 'cs_test',
      subscriptionId: 'sub_verified',
      tier: 'verified',
    });

    await recordVendorClick('locus-robotics', 'results');
    const base = VENDORS.find((v) => v.slug === 'locus-robotics');
    expect(base).toBeTruthy();
    const merged = mergeVendorWithEntitlement(base!, {
      verified: true,
      sponsored: false,
      logoUrl: 'https://example.com/logo.png',
    });
    expect(merged.logoUrl).toBe('https://example.com/logo.png');
  });

  it('issues and consumes magic login tokens', async () => {
    await provisionVendorSubscription({
      email: 'partner@vendor.test',
      vendorSlug: 'mir-mobile-industrial-robots',
      customerId: 'cus_mir',
      checkoutSessionId: 'cs_mir',
      subscriptionId: 'sub_mir',
      tier: 'verified',
    });

    const token = await createLoginToken('partner@vendor.test');
    const email = await consumeLoginToken(token);
    expect(email).toBe('partner@vendor.test');

    const account = await getVendorAccountByEmail('partner@vendor.test');
    expect(account?.vendorSlug).toBe('mir-mobile-industrial-robots');
  });

  it('creates signed vendor session cookies', () => {
    const token = createVendorSessionToken({
      accountId: 'acc_1',
      email: 'partner@vendor.test',
      vendorSlug: 'mir-mobile-industrial-robots',
    });
    const parsed = parseVendorSessionToken(token);
    expect(parsed?.vendorSlug).toBe('mir-mobile-industrial-robots');
  });
});
