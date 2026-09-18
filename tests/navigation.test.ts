import { describe, it, expect } from 'vitest';
import {
  categoryGuideHref,
  CATEGORY_GUIDE_LINKS,
  HEADER_NAV_LINKS,
  homeMatcherHref,
  HOME_MATCHER_RESET_HREF,
  HOME_TRACKS_HREF,
  VENDORS_INDEX_HREF,
} from '../src/lib/content/navigation';
import { getMatcherCtaHref } from '../src/lib/navigation/matcher';

describe('getMatcherCtaHref', () => {
  it('keeps users on comparison pages with in-page matcher CTAs', () => {
    expect(getMatcherCtaHref('/amr-vs-agv')).toBe('/amr-vs-agv#matcher');
  });

  it('sends category guide pages to the business matcher hub', () => {
    expect(getMatcherCtaHref('/warehouse-robots')).toBe('/business#matcher');
    expect(getMatcherCtaHref('/cleaning-robots')).toBe('/business#matcher');
  });

  it('sends the homepage Get match CTA to the two-track chooser', () => {
    expect(getMatcherCtaHref('/')).toBe('#tracks');
  });

  it('sends unrelated pages to the two-track chooser', () => {
    expect(getMatcherCtaHref('/privacy')).toBe('/#tracks');
  });

  it('keeps users on results and dedicated matcher pages', () => {
    expect(getMatcherCtaHref('/results')).toBe('/results#matcher');
    expect(getMatcherCtaHref('/business')).toBe('/business#matcher');
    expect(getMatcherCtaHref('/home-robots')).toBe('/home-robots#matcher');
    expect(getMatcherCtaHref('/robot-vacuums')).toBe('/robot-vacuums#matcher');
    expect(getMatcherCtaHref('/robot-vacuums/results')).toBe('/robot-vacuums/results#matcher');
  });
});

describe('homeMatcherHref', () => {
  it('pre-selects a category on the business matcher hub', () => {
    expect(homeMatcherHref('warehouse')).toBe('/business?category=warehouse#matcher');
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
    expect(CATEGORY_GUIDE_LINKS[1]).toEqual({
      href: '/cleaning-robots',
      label: 'Commercial cleaning robots guide',
    });
  });
});

describe('HOME_MATCHER_RESET_HREF', () => {
  it('opens the business hub matcher category picker', () => {
    expect(HOME_MATCHER_RESET_HREF).toBe('/business#matcher');
  });
});

describe('HOME_TRACKS_HREF', () => {
  it('points at the homepage track chooser', () => {
    expect(HOME_TRACKS_HREF).toBe('/#tracks');
  });
});

describe('HEADER_NAV_LINKS', () => {
  it('lists home and business tracks as peers, then B2B categories', () => {
    expect(HEADER_NAV_LINKS).toHaveLength(5);
    expect(HEADER_NAV_LINKS.map((link) => link.href)).toEqual([
      '/home-robots',
      '/business',
      '/warehouse-robots',
      '/cleaning-robots',
      '/restaurant-robots',
    ]);
    expect(HEADER_NAV_LINKS[0]?.label).toBe('Home robots');
    expect(HEADER_NAV_LINKS[1]?.label).toBe('Business');
  });
});

describe('VENDORS_INDEX_HREF', () => {
  it('points to vendor browse page', () => {
    expect(VENDORS_INDEX_HREF).toBe('/vendors');
  });
});

describe('HOME_EXPLORE_LINKS', () => {
  it('links homepage explore strip to both tracks and category pages', async () => {
    const { HOME_EXPLORE_LINKS } = await import('../src/components/content/HomeExploreStrip');
    expect(HOME_EXPLORE_LINKS.map((link) => link.href)).toEqual([
      '/home-robots',
      '/robot-vacuums',
      '/business',
      '/warehouse-robots',
      '/cleaning-robots',
      '/restaurant-robots',
      '/best',
      '/integrations',
      '/warehouse-robot-cost',
      '/amr-vs-agv',
      '/about',
    ]);
  });
});
