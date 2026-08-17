import { describe, it, expect, beforeEach } from 'vitest';
import { API_TIER_CARDS, DEVELOPERS_PATH } from '../src/lib/content/developers';
import { API_TIER_LIMITS } from '../src/lib/api/tiers';

describe('DEVELOPERS_PATH', () => {
  it('points to the developers page', () => {
    expect(DEVELOPERS_PATH).toBe('/api');
  });
});

describe('API_TIER_CARDS', () => {
  it('stays in sync with API tier limits', () => {
    for (const card of API_TIER_CARDS) {
      const limits = API_TIER_LIMITS[card.tier];
      const formatted = limits.matchesPerMonth.toLocaleString();
      expect(card.features.some((f) => f.includes(formatted))).toBe(true);
    }
  });

  it('includes starter and pro plans only', () => {
    expect(API_TIER_CARDS.map((card) => card.tier)).toEqual(['starter', 'pro']);
  });

  it('prices starter at $49 and pro at $149', () => {
    expect(API_TIER_CARDS[0]?.price).toBe('$49/mo');
    expect(API_TIER_CARDS[1]?.price).toBe('$149/mo');
  });
});
