import { describe, it, expect } from 'vitest';
import { categoryGuideHref, CATEGORY_GUIDE_LINKS, HOME_MATCHER_RESET_HREF, VENDORS_INDEX_HREF } from '../src/lib/content/navigation';
import { getMatcherCtaHref } from '../src/lib/navigation/matcher';

describe('getMatcherCtaHref', () => {
  it('keeps users on category pages', () => {
    expect(getMatcherCtaHref('/warehouse-robots')).toBe('/warehouse-robots#matcher');
    expect(getMatcherCtaHref('/amr-vs-agv')).toBe('/amr-vs-agv#matcher');
  });

  it('uses homepage matcher on unrelated pages', () => {
    expect(getMatcherCtaHref('/')).toBe('#matcher');
    expect(getMatcherCtaHref('/privacy')).toBe('/#matcher');
  });

  it('keeps users on results page', () => {
    expect(getMatcherCtaHref('/results')).toBe('/results#matcher');
  });
});

describe('categoryGuideHref', () => {
  it('links to educational content below the matcher', () => {
    expect(categoryGuideHref('warehouse')).toBe('/warehouse-robots#guide');
    expect(categoryGuideHref('cleaning')).toBe('/cleaning-robots#guide');
  });
});

describe('CATEGORY_GUIDE_LINKS', () => {
  it('uses guide labels and hash anchors', () => {
    expect(CATEGORY_GUIDE_LINKS).toHaveLength(3);
    expect(CATEGORY_GUIDE_LINKS[0]).toEqual({
      href: '/warehouse-robots#guide',
      label: 'Warehouse robots guide',
    });
  });
});

describe('HOME_MATCHER_RESET_HREF', () => {
  it('resets homepage matcher to category selection', () => {
    expect(HOME_MATCHER_RESET_HREF).toBe('/?matcher=category');
  });
});

describe('VENDORS_INDEX_HREF', () => {
  it('points to vendor browse page', () => {
    expect(VENDORS_INDEX_HREF).toBe('/vendors');
  });
});
