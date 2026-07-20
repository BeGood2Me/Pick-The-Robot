import { describe, it, expect } from 'vitest';
import {
  MIN_VENDORS_FOR_PAGE,
  comboHasEnoughVendors,
  getAllPageCombos,
  getHubEntries,
  getPublishableCombos,
  getVendorsForBestPage,
  resolveBestForPage,
} from '../src/lib/content/pseo';
import { VENDORS } from '../src/lib/matching/vendors';

describe('pSEO best-for pages', () => {
  it('allowlists only combos that clear the vendor gate', () => {
    const all = getAllPageCombos();
    const publishable = getPublishableCombos();
    expect(all.length).toBeGreaterThanOrEqual(1);
    expect(publishable.length).toBeGreaterThanOrEqual(1);
    expect(publishable.every(comboHasEnoughVendors)).toBe(true);
  });

  it('resolves amr + ecommerce-warehouse with enough vendors', () => {
    const page = resolveBestForPage('amr', 'ecommerce-warehouse');
    expect(page).not.toBeNull();
    expect(page!.vendors.length).toBeGreaterThanOrEqual(MIN_VENDORS_FOR_PAGE);
    expect(page!.path).toBe('/best/amr/ecommerce-warehouse');
    expect(page!.h1.toLowerCase()).toContain('amr');
    expect(page!.matcherHref).toContain('/warehouse-robots');
    expect(page!.faqs.length).toBeGreaterThanOrEqual(3);
  });

  it('rejects unknown or thin combos', () => {
    expect(resolveBestForPage('amr', 'does-not-exist')).toBeNull();
    expect(resolveBestForPage('kitchen_automation', 'ecommerce-warehouse')).toBeNull();
  });

  it('resolves vendors from vendors.json by category + robotType', () => {
    const vendors = getVendorsForBestPage('warehouse', 'amr');
    expect(vendors.length).toBeGreaterThanOrEqual(MIN_VENDORS_FOR_PAGE);
    expect(
      vendors.every(
        (v) => v.categories.includes('warehouse') && v.robotTypes.includes('amr'),
      ),
    ).toBe(true);
    expect(vendors.every((v) => VENDORS.some((all) => all.id === v.id))).toBe(true);
  });

  it('hub entries match publishable combos', () => {
    const hub = getHubEntries();
    const publishable = getPublishableCombos();
    expect(hub.length).toBe(publishable.length);
    expect(hub.every((p) => p.vendors.length >= MIN_VENDORS_FOR_PAGE)).toBe(true);
  });
});
