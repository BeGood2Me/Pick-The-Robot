import { describe, expect, it } from 'vitest';
import { toPublicHomeMatchResponse } from '../src/lib/api/publicHomeMatch';
import { recommendHomeVacuum } from '../src/lib/home-vacuums/engine';
import type { HomeVacuumAnswers } from '../src/lib/home-vacuums/types';
import { POST as homeMatchPost } from '../src/app/api/v1/home/match/route';
import { GET as homeProductsGet } from '../src/app/api/v1/home/products/route';

const BASE = 'https://picktherobot.com';

const sampleAnswers: HomeVacuumAnswers = {
  floorMix: 'mixed',
  homeSize: 'medium',
  pets: 'dog',
  hairLength: 'long',
  mopNeeded: 'yes',
  budgetBand: '600_1000',
  selfEmpty: 'preferred',
  multiFloor: false,
  obstacles: 'medium',
};

describe('toPublicHomeMatchResponse', () => {
  it('limits starter tier products and hides score breakdown', () => {
    const result = recommendHomeVacuum(sampleAnswers);
    const payload = toPublicHomeMatchResponse(result, 'starter', {
      matchId: 'test-id',
      baseUrl: BASE,
    });

    expect(payload.track).toBe('home_vacuum');
    expect(payload.tier).toBe('starter');
    expect(payload.affiliateLocale).toBe('US');
    expect(payload.productMatches.length).toBeLessThanOrEqual(3);
    expect(payload.shareUrl).toContain('/robot-vacuums/results?share=');
    for (const product of payload.productMatches) {
      expect(product.score).toBeUndefined();
      expect(product.cautions).toBeUndefined();
      expect(product.clickUrl).toMatch(/^https?:\/\//);
      expect(product.clickLocale).toBe('US');
    }
  });

  it('includes score breakdown on pro tier', () => {
    const result = recommendHomeVacuum(sampleAnswers);
    const payload = toPublicHomeMatchResponse(result, 'pro', {
      matchId: 'test-id',
      baseUrl: BASE,
    });

    expect(payload.productMatches.length).toBeLessThanOrEqual(5);
    expect(payload.productMatches[0]?.score?.useCaseFit).toBeDefined();
    expect(payload.productMatches[0]?.cautions?.length).toBeGreaterThan(0);
  });

  it('honors affiliateLocale for clickUrl storefront', () => {
    const result = recommendHomeVacuum(sampleAnswers);
    const payload = toPublicHomeMatchResponse(result, 'starter', {
      matchId: 'test-id',
      baseUrl: BASE,
      affiliateLocale: 'UK',
    });

    expect(payload.affiliateLocale).toBe('UK');
    expect(payload.productMatches[0]?.clickLocale).toBe('UK');
  });
});

describe('POST /api/v1/home/match', () => {
  const env = process.env;

  it('requires an API key', async () => {
    process.env = { ...env };
    delete process.env.PICKTHEROBOT_API_KEY_STARTER;
    delete process.env.PICKTHEROBOT_API_KEY_PRO;

    const res = await homeMatchPost(
      new Request('https://picktherobot.com/api/v1/home/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleAnswers),
      }),
    );
    expect(res.status).toBe(401);
    process.env = env;
  });

  it('returns a home vacuum match for a valid starter key', async () => {
    process.env = { ...env };
    process.env.PICKTHEROBOT_API_KEY_STARTER = 'starter-secret';
    delete process.env.DATABASE_URL;

    const res = await homeMatchPost(
      new Request('http://localhost:3005/api/v1/home/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'starter-secret',
        },
        body: JSON.stringify(sampleAnswers),
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.track).toBe('home_vacuum');
    expect(body.productMatches.length).toBeGreaterThan(0);
    expect(body.bestClass).toBeTruthy();

    process.env = env;
  });

  it('rejects incomplete answers', async () => {
    process.env = { ...env };
    process.env.PICKTHEROBOT_API_KEY_STARTER = 'starter-secret';
    delete process.env.DATABASE_URL;

    const res = await homeMatchPost(
      new Request('http://localhost:3005/api/v1/home/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'starter-secret',
        },
        body: JSON.stringify({ floorMix: 'mixed' }),
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('validation_failed');
    expect(body.fields).toBeDefined();

    process.env = env;
  });
});

describe('GET /api/v1/home/products', () => {
  const env = process.env;

  it('lists home products with a valid key', async () => {
    process.env = { ...env };
    process.env.PICKTHEROBOT_API_KEY_PRO = 'pro-secret';
    delete process.env.DATABASE_URL;

    const res = await homeProductsGet(
      new Request('http://localhost:3005/api/v1/home/products?class=mop_vac_combo', {
        headers: { 'X-API-Key': 'pro-secret' },
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.track).toBe('home_vacuum');
    expect(body.class).toBe('mop_vac_combo');
    expect(body.affiliateLocale).toBe('US');
    expect(body.count).toBeGreaterThan(0);
    expect(body.products.every((p: { class: string }) => p.class === 'mop_vac_combo')).toBe(true);

    process.env = env;
  });

  it('accepts locale query for Amazon storefront', async () => {
    process.env = { ...env };
    process.env.PICKTHEROBOT_API_KEY_PRO = 'pro-secret';
    delete process.env.DATABASE_URL;

    const res = await homeProductsGet(
      new Request('http://localhost:3005/api/v1/home/products?locale=UK', {
        headers: { 'X-API-Key': 'pro-secret' },
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.affiliateLocale).toBe('UK');
    expect(body.products[0]?.clickLocale).toBe('UK');

    process.env = env;
  });
});
