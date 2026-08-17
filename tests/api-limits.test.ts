import { describe, it, expect, beforeEach } from 'vitest';
import { enforceApiLimits, finalizeApiLimits } from '../src/lib/api/guard';
import { resetMonthlyUsageForTests } from '../src/lib/api/metering';
import { consumeRateLimit, resetRateLimitsForTests } from '../src/lib/api/rateLimit';
import { buildOpenApiDocument } from '../src/lib/api/openapi';
import {
  catalogLimitForTier,
  filterVendorsForCatalog,
  toPublicVendorCatalogEntry,
} from '../src/lib/api/publicVendors';
import { VENDORS } from '../src/lib/matching/vendors';

const BASE = 'https://picktherobot.com';

function requestWithIp(ip: string): Request {
  return new Request(`${BASE}/api/v1/match`, {
    method: 'POST',
    headers: { 'X-Forwarded-For': ip },
  });
}

describe('rate limiting', () => {
  beforeEach(async () => {
    await resetRateLimitsForTests();
    await resetMonthlyUsageForTests();
  });

  it('blocks starter tier after the per-minute limit', async () => {
    const req = requestWithIp('203.0.113.10');

    for (let i = 0; i < 30; i++) {
      expect(await enforceApiLimits(req, 'starter', 'vendors')).toBeNull();
      await finalizeApiLimits(req, 'starter', 'vendors');
    }

    const blocked = await enforceApiLimits(req, 'starter', 'vendors');
    expect(blocked).not.toBeNull();
    expect(blocked?.status).toBe(429);
  });

  it('does not consume rate limit without finalizeApiLimits', async () => {
    const req = requestWithIp('203.0.113.11');

    for (let i = 0; i < 20; i++) {
      expect(await enforceApiLimits(req, 'starter', 'vendors')).toBeNull();
    }

    expect(await enforceApiLimits(req, 'starter', 'vendors')).toBeNull();
  });
});

describe('monthly match quota', () => {
  beforeEach(async () => {
    await resetRateLimitsForTests();
    await resetMonthlyUsageForTests();
  });

  it('blocks match calls after the starter monthly quota', async () => {
    const req = requestWithIp('203.0.113.20');

    for (let i = 0; i < 2000; i++) {
      expect(await enforceApiLimits(req, 'starter', 'match')).toBeNull();
      await finalizeApiLimits(req, 'starter', 'match');
      await resetRateLimitsForTests();
    }

    const blocked = await enforceApiLimits(req, 'starter', 'match');
    expect(blocked).not.toBeNull();
    expect(blocked?.status).toBe(429);
  });
});

describe('vendor catalog', () => {
  it('filters by category and region', () => {
    const cleaning = filterVendorsForCatalog(VENDORS, 'cleaning', 'US');
    expect(cleaning.length).toBeGreaterThan(0);
    for (const vendor of cleaning) {
      expect(vendor.categories).toContain('cleaning');
      expect(vendor.regions).toContain('US');
    }
  });

  it('hides extended fields on starter tier', () => {
    const vendor = VENDORS[0]!;
    const entry = toPublicVendorCatalogEntry(vendor, 'starter', BASE);
    expect(entry.strengths).toBeUndefined();
    expect(entry.clickUrl).toContain('utm_content=catalog');
  });

  it('includes extended fields on pro tier', () => {
    const vendor = VENDORS[0]!;
    const entry = toPublicVendorCatalogEntry(vendor, 'pro', BASE);
    expect(entry.strengths).toBeDefined();
    expect(entry.limitations).toBeDefined();
  });

  it('caps catalog size by tier', () => {
    expect(catalogLimitForTier('starter')).toBe(50);
    expect(catalogLimitForTier('pro')).toBeGreaterThan(catalogLimitForTier('starter'));
  });
});

describe('openapi document', () => {
  it('describes match and vendors endpoints', () => {
    const doc = buildOpenApiDocument(BASE);
    expect(doc.openapi).toBe('3.1.0');
    expect(doc.paths['/match'].post).toBeDefined();
    expect(doc.paths['/vendors'].get).toBeDefined();
    expect(doc['x-tier-limits']).toBeDefined();
  });
});

describe('consumeRateLimit', () => {
  beforeEach(async () => resetRateLimitsForTests());

  it('decrements remaining count', async () => {
    const first = await consumeRateLimit('starter:ip:test', 'starter');
    const second = await consumeRateLimit('starter:ip:test', 'starter');
    expect(first.remaining).toBe(29);
    expect(second.remaining).toBe(28);
  });
});
