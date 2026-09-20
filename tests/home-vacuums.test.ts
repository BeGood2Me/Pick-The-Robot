import { describe, it, expect } from 'vitest';
import {
  buildHomeVacuumSharePayload,
  decodeHomeVacuumSharePayload,
  encodeHomeVacuumSharePayload,
  getHomeVacuumCatalog,
  getHomeVacuumOutboundUrl,
  isCompleteHomeVacuumAnswers,
  pickHomeVacuumClass,
  productHasAffiliate,
  recommendHomeVacuum,
  resolveHomeAffiliateUrl,
  scoreHomeVacuumProduct,
  type HomeVacuumAnswers,
  type HomeVacuumProduct,
} from '../src/lib/home-vacuums';
import { HOME_VACUUM_AFFILIATE_DISCLOSURE } from '../src/lib/content/home-vacuums';

function sampleAnswers(overrides: Partial<HomeVacuumAnswers> = {}): HomeVacuumAnswers {
  return {
    floorMix: 'mixed',
    homeSize: 'medium',
    pets: 'dog',
    hairLength: 'long',
    mopNeeded: 'yes',
    budgetBand: '600_1000',
    selfEmpty: 'preferred',
    multiFloor: false,
    obstacles: 'medium',
    ...overrides,
  };
}

describe('home vacuum catalog', () => {
  const catalog = getHomeVacuumCatalog();

  it('has 15–25 current models, not B2B vendors', () => {
    expect(catalog.length).toBeGreaterThanOrEqual(15);
    expect(catalog.length).toBeLessThanOrEqual(25);
    expect(catalog.every((product) => product.brand && product.name && product.slug)).toBe(true);
  });

  it('uses unique ids and slugs', () => {
    const ids = catalog.map((product) => product.id);
    const slugs = catalog.map((product) => product.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('includes spec flags used by scoring', () => {
    for (const product of catalog) {
      expect(['vacuum_only', 'mop_vac_combo']).toContain(product.class);
      expect(['none', 'basic', 'spinning', 'hot_water']).toContain(product.mop);
      expect(typeof product.selfEmpty).toBe('boolean');
      expect(['poor', 'ok', 'strong']).toContain(product.petHair);
      expect(product.outboundUrl.startsWith('https://')).toBe(true);
    }
  });
});

describe('home vacuum scoring', () => {
  it('recommends a mop combo when mopping is required', () => {
    expect(pickHomeVacuumClass(sampleAnswers({ mopNeeded: 'yes' }))).toBe('mop_vac_combo');
    const result = recommendHomeVacuum(sampleAnswers({ mopNeeded: 'yes', floorMix: 'hard' }));
    expect(result.bestClass).toBe('mop_vac_combo');
    expect(result.matches[0]?.product.class).toBe('mop_vac_combo');
  });

  it('recommends vacuum-only when mopping is not wanted', () => {
    const answers = sampleAnswers({ mopNeeded: 'no', floorMix: 'carpet', pets: 'none', hairLength: 'short' });
    expect(pickHomeVacuumClass(answers)).toBe('vacuum_only');
    const result = recommendHomeVacuum(answers);
    expect(result.bestClass).toBe('vacuum_only');
  });

  it('penalizes models priced above the budget band', () => {
    const answers = sampleAnswers({ budgetBand: 'under_300', mopNeeded: 'no' });
    const premium: HomeVacuumProduct = {
      ...getHomeVacuumCatalog()[0]!,
      id: 'test-premium',
      slug: 'test-premium',
      priceBand: 'over_1000',
      class: 'mop_vac_combo',
      mop: 'spinning',
    };
    const budget: HomeVacuumProduct = {
      ...premium,
      id: 'test-budget',
      slug: 'test-budget',
      priceBand: 'under_300',
      class: 'vacuum_only',
      mop: 'none',
    };
    const premiumScore = scoreHomeVacuumProduct(premium, answers);
    const budgetScore = scoreHomeVacuumProduct(budget, answers);
    expect(budgetScore.score.economicFit).toBeGreaterThan(premiumScore.score.economicFit);
    expect(premiumScore.cautions.some((caution) => /budget/i.test(caution))).toBe(true);
  });

  it('includes Reddit-ready why/why-not copy, disclosure, and a shareable summary', () => {
    const result = recommendHomeVacuum(sampleAnswers());
    expect(result.matches.length).toBeGreaterThanOrEqual(3);
    expect(result.matches.length).toBeLessThanOrEqual(5);
    expect(result.summary).toMatch(/rules-based|public specs/i);
    expect(result.affiliateDisclosure).toBe(HOME_VACUUM_AFFILIATE_DISCLOSURE);
    expect(result.matches[0]?.reasons.length).toBeGreaterThan(0);
    expect(result.classReasons.length).toBeGreaterThan(0);
  });
});

describe('home vacuum share payload', () => {
  it('round-trips complete answers', () => {
    const answers = sampleAnswers({ multiFloor: true, obstacles: 'high' });
    const encoded = encodeHomeVacuumSharePayload(buildHomeVacuumSharePayload(answers));
    const decoded = decodeHomeVacuumSharePayload(encoded);
    expect(decoded?.answers).toEqual(answers);
  });

  it('rejects partial or business-track payloads', () => {
    expect(decodeHomeVacuumSharePayload('not-valid')).toBeNull();
    const partial = encodeHomeVacuumSharePayload({
      v: 1,
      track: 'home_vacuum',
      answers: { floorMix: 'hard' } as HomeVacuumAnswers,
    });
    expect(decodeHomeVacuumSharePayload(partial)).toBeNull();
    expect(isCompleteHomeVacuumAnswers({ floorMix: 'hard' })).toBe(false);
  });
});

describe('home vacuum outbound URLs', () => {
  it('appends UTM parameters and uses affiliate medium when set', () => {
    const product = getHomeVacuumCatalog()[0]!;
    const referral = getHomeVacuumOutboundUrl(
      { ...product, affiliateUrl: undefined, affiliateUrls: undefined },
      'results',
    );
    expect(referral).toContain('utm_source=picktherobot');
    expect(referral).toContain('utm_campaign=' + product.slug);
    expect(referral).toContain('utm_medium=referral');
    expect(referral).toContain('utm_term=home-vacuum');

    const affiliated = getHomeVacuumOutboundUrl(
      {
        ...product,
        affiliateUrl: undefined,
        affiliateUrls: { US: 'https://www.amazon.com/dp/example' },
      },
      'results',
    );
    expect(affiliated).toContain('utm_medium=affiliate');
    expect(affiliated).toContain('amazon.com/dp/example');
    expect(affiliated).toContain('utm_locale=US');
  });

  it('resolves per-marketplace affiliateUrls with legacy US fallback', () => {
    const product = getHomeVacuumCatalog()[0]!;
    const multi: HomeVacuumProduct = {
      ...product,
      affiliateUrl: 'https://www.amazon.com/dp/legacy',
      affiliateUrls: {
        US: 'https://www.amazon.com/dp/us-asin',
        UK: 'https://www.amazon.co.uk/dp/uk-asin',
      },
    };

    expect(resolveHomeAffiliateUrl(multi, 'US')).toContain('amazon.com/dp/us-asin');
    expect(resolveHomeAffiliateUrl(multi, 'UK')).toContain('amazon.co.uk/dp/uk-asin');
    expect(productHasAffiliate(multi, 'UK')).toBe(true);

    const legacyOnly: HomeVacuumProduct = {
      ...product,
      affiliateUrl: 'https://www.amazon.com/dp/legacy-only',
      affiliateUrls: undefined,
    };
    expect(resolveHomeAffiliateUrl(legacyOnly, 'US')).toContain('legacy-only');
    expect(resolveHomeAffiliateUrl(legacyOnly, 'UK')).toBeUndefined();
    expect(productHasAffiliate(legacyOnly, 'UK')).toBe(false);

    const ukUrl = getHomeVacuumOutboundUrl(multi, 'results', 'UK');
    expect(ukUrl).toContain('amazon.co.uk/dp/uk-asin');
    expect(ukUrl).toContain('utm_locale=UK');
    expect(ukUrl).toContain('utm_medium=affiliate');

    const missingUk = getHomeVacuumOutboundUrl(legacyOnly, 'results', 'UK');
    expect(missingUk).toContain('utm_medium=referral');
    expect(missingUk).not.toContain('utm_locale=');
    expect(missingUk.startsWith(legacyOnly.outboundUrl.split('?')[0]!)).toBe(true);
  });
});
