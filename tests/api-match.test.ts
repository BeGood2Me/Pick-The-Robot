import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resolveApiBaseUrl } from '../src/lib/api/baseUrl';
import { buildApiClickUrl } from '../src/lib/api/clickUrl';
import { toPublicMatchResponse } from '../src/lib/api/publicMatch';
import { resolveApiTier } from '../src/lib/api/tiers';
import { defaultAnswersForCategory } from '../src/lib/forms';
import { onFormSubmit } from '../src/lib/matching/adapter';

const BASE = 'https://picktherobot.com';

describe('resolveApiTier', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
    delete process.env.PICKTHEROBOT_API_KEY_STARTER;
    delete process.env.PICKTHEROBOT_API_KEY_PRO;
  });

  afterEach(() => {
    process.env = env;
  });

  it('requires an API key', async () => {
    const req = new Request('https://picktherobot.com/api/v1/match', { method: 'POST' });
    expect(await resolveApiTier(req)).toBeNull();
  });

  it('returns starter for a valid starter key', async () => {
    process.env.PICKTHEROBOT_API_KEY_STARTER = 'starter-secret';
    const req = new Request('https://picktherobot.com/api/v1/match', {
      method: 'POST',
      headers: { 'X-API-Key': 'starter-secret' },
    });
    expect(await resolveApiTier(req)).toBe('starter');
  });

  it('returns pro for a valid pro key', async () => {
    process.env.PICKTHEROBOT_API_KEY_PRO = 'pro-secret';
    const req = new Request('https://picktherobot.com/api/v1/match', {
      method: 'POST',
      headers: { 'X-API-Key': 'pro-secret' },
    });
    expect(await resolveApiTier(req)).toBe('pro');
  });

  it('returns null for an invalid key', async () => {
    process.env.PICKTHEROBOT_API_KEY_PRO = 'pro-secret';
    const req = new Request('https://picktherobot.com/api/v1/match', {
      method: 'POST',
      headers: { 'X-API-Key': 'wrong' },
    });
    expect(await resolveApiTier(req)).toBeNull();
  });
});

describe('buildApiClickUrl', () => {
  it('routes match clicks through the site out redirect', () => {
    expect(buildApiClickUrl(BASE, 'avidbots')).toBe(
      'https://picktherobot.com/out/avidbots?utm_source=api&utm_medium=referral&utm_content=match',
    );
  });

  it('tags catalog clicks separately', () => {
    expect(buildApiClickUrl(BASE, 'avidbots', 'catalog')).toContain('utm_content=catalog');
  });
});

describe('resolveApiBaseUrl', () => {
  it('uses the request origin for generated links', () => {
    const req = new Request('http://localhost:3005/api/v1/match', { method: 'POST' });
    expect(resolveApiBaseUrl(req)).toBe('http://localhost:3005');
  });
});

describe('toPublicMatchResponse', () => {
  it('limits starter tier vendors and hides extended fields', () => {
    const result = onFormSubmit(defaultAnswersForCategory('cleaning'));
    const payload = toPublicMatchResponse(result, 'starter', {
      matchId: 'test-id',
      baseUrl: BASE,
    });

    expect(payload.tier).toBe('starter');
    expect(payload.vendorMatches.length).toBeLessThanOrEqual(3);
    expect(payload.runnerUpRobotMatch).toBeUndefined();

    for (const vendor of payload.vendorMatches) {
      expect(vendor.clickUrl).toContain('/out/');
      expect(vendor.score).toBeUndefined();
    }
  });

  it('includes perspectives on pro tier', () => {
    const result = onFormSubmit(defaultAnswersForCategory('warehouse'));
    const payload = toPublicMatchResponse(result, 'pro', {
      matchId: 'test-id',
      baseUrl: BASE,
    });

    expect(payload.vendorMatches.length).toBeLessThanOrEqual(5);
    expect(payload.explanation.vendorChoiceReasons).toBeDefined();
    if (payload.vendorMatches[0]) {
      expect(payload.vendorMatches[0].score?.useCaseFit).toBeDefined();
    }
  });

  it('summarizes cleaning ROI on starter tier', () => {
    const result = onFormSubmit(defaultAnswersForCategory('cleaning'));
    const payload = toPublicMatchResponse(result, 'starter', {
      matchId: 'test-id',
      baseUrl: BASE,
    });

    if (payload.cleaningRoi) {
      expect(payload.cleaningRoi.viability).toBeDefined();
      expect('assumptions' in payload.cleaningRoi).toBe(false);
      expect(payload.fleetSizingHint).toBeUndefined();
    }
  });

  it('includes full cleaning ROI on pro tier', () => {
    const result = onFormSubmit(defaultAnswersForCategory('cleaning'));
    const payload = toPublicMatchResponse(result, 'pro', {
      matchId: 'test-id',
      baseUrl: BASE,
    });

    if (payload.cleaningRoi) {
      expect('assumptions' in payload.cleaningRoi).toBe(true);
    }
  });
});
