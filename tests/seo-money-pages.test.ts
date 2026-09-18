import { describe, expect, it } from 'vitest';
import {
  BUYING_GUIDE_PAGES,
  BUSINESS_BUYING_GUIDE_PAGES,
  HOME_BUYING_GUIDE_PAGES,
} from '../src/lib/content/seo-money-pages';

describe('buying guide tracks', () => {
  it('tags every guide as home or business', () => {
    expect(BUYING_GUIDE_PAGES.every((p) => p.track === 'home' || p.track === 'business')).toBe(
      true,
    );
    expect(HOME_BUYING_GUIDE_PAGES.length).toBeGreaterThan(0);
    expect(BUSINESS_BUYING_GUIDE_PAGES.length).toBeGreaterThan(0);
    expect(HOME_BUYING_GUIDE_PAGES.every((p) => p.track === 'home')).toBe(true);
    expect(BUSINESS_BUYING_GUIDE_PAGES.every((p) => p.track === 'business')).toBe(true);
  });
});
