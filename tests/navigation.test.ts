import { describe, it, expect } from 'vitest';
import {
  categoryGuideHref,
  CATEGORY_GUIDE_LINKS,
  HEADER_NAV_LINKS,
  homeMatcherHref,
  HOME_MATCHER_RESET_HREF,
  VENDORS_INDEX_HREF,
} from '../src/lib/content/navigation';
import { getMatcherCtaHref } from '../src/lib/navigation/matcher';

describe('getMatcherCtaHref', () => {
  it('keeps users on comparison pages with in-page matcher CTAs', () => {
    expect(getMatcherCtaHref('/amr-vs-agv')).toBe('/amr-vs-agv#matcher');
  });

  it('sends category guide pages to the homepage matcher', () => {
    expect(getMatcherCtaHref('/warehouse-robots')).toBe('/#matcher');
    expect(getMatcherCtaHref('/cleaning-robots')).toBe('/#matcher');
  });

  it('uses homepage matcher on unrelated pages', () => {
    expect(getMatcherCtaHref('/')).toBe('#matcher');
    expect(getMatcherCtaHref('/privacy')).toBe('/#matcher');
  });

  it('keeps users on results page', () => {
    expect(getMatcherCtaHref('/results')).toBe('/results#matcher');
  });
});

describe('homeMatcherHref', () => {
  it('pre-selects a category on the homepage matcher', () => {
    expect(homeMatcherHref('warehouse')).toBe('/?category=warehouse#matcher');
    expect(homeMatcherHref()).toBe(HOME_MATCHER_RESET_HREF);
  });
});

describe('categoryGuideHref', () => {
  it('links to standalone category guide pages', () => {
    expect(categoryGuideHref('warehouse')).toBe('/warehouse-robots');
    expect(categoryGuideHref('cleaning')).toBe('/cleaning-robots');
  });
});

describe('CATEGORY_GUIDE_LINKS', () => {
  it('uses guide labels without hash anchors', () => {
    expect(CATEGORY_GUIDE_LINKS).toHaveLength(3);
    expect(CATEGORY_GUIDE_LINKS[0]).toEqual({
      href: '/warehouse-robots',
      label: 'Warehouse robots guide',
    });
  });
});

describe('HOME_MATCHER_RESET_HREF', () => {
  it('resets homepage matcher to category selection', () => {
    expect(HOME_MATCHER_RESET_HREF).toBe('/#matcher');
  });
});

describe('HEADER_NAV_LINKS', () => {
  it('includes categories, vendors, and API', () => {
    expect(HEADER_NAV_LINKS).toHaveLength(5);
    expect(HEADER_NAV_LINKS.map((link) => link.href)).toEqual([
      '/warehouse-robots',
      '/cleaning-robots',
      '/restaurant-robots',
      '/vendors',
      '/api',
    ]);
    expect(HEADER_NAV_LINKS[4]?.label).toBe('API');
  });
});

describe('VENDORS_INDEX_HREF', () => {
  it('points to vendor browse page', () => {
    expect(VENDORS_INDEX_HREF).toBe('/vendors');
  });
});

describe('HOME_EXPLORE_LINKS', () => {
  it('links homepage explore strip to category and hub pages', async () => {
    const { HOME_EXPLORE_LINKS } = await import('../src/components/content/HomeExploreStrip');
    expect(HOME_EXPLORE_LINKS.map((link) => link.href)).toEqual([
      '/warehouse-robots',
      '/cleaning-robots',
      '/restaurant-robots',
      '/best',
      '/integrations',
      '/blog',
      '/about',
    ]);
  });
});
