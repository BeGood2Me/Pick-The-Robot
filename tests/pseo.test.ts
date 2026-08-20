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
    expect(all.length).toBe(22);
    expect(publishable.length).toBe(22);
    expect(publishable.every(comboHasEnoughVendors)).toBe(true);
  });

  it('resolves new long-tail facility pages', () => {
    expect(resolveBestForPage('amr', 'third-party-logistics-warehouse')?.title).toMatch(/3PL/i);
    expect(resolveBestForPage('large_scrubber', 'hospital-healthcare-floors')?.title).toMatch(
      /hospital/i,
    );
    expect(resolveBestForPage('serving_robot', 'quick-service-food-hall')?.title).toMatch(/QSR|food hall/i);
    expect(resolveBestForPage('pallet_mover', 'manufacturing-plant')?.costBand).not.toBeNull();
  });

  it('resolves amr + ecommerce-warehouse with enough vendors', () => {
    const page = resolveBestForPage('amr', 'ecommerce-warehouse');
    expect(page).not.toBeNull();
    expect(page!.vendors.length).toBeGreaterThanOrEqual(MIN_VENDORS_FOR_PAGE);
    expect(page!.path).toBe('/best/amr/ecommerce-warehouse');
    expect(page!.title).toMatch(/Best AMR for e-commerce fulfillment/i);
    expect(page!.h1).toMatch(/Best AMRs for e-commerce fulfillment/i);
    expect(page!.h1.toLowerCase()).not.toContain('fulfillment warehouse');
    expect(page!.metaDescription.length).toBeLessThanOrEqual(160);
    expect(page!.matcherHref).toBe('/?category=warehouse#matcher');
    expect(page!.categoryGuideHref).toBe('/warehouse-robots');
    expect(page!.faqs.length).toBeGreaterThanOrEqual(3);
  });

  it('aligns title and H1 on all publishable best-for pages', () => {
    for (const page of getHubEntries()) {
      expect(page.title.length).toBeGreaterThan(10);
      expect(page.h1.length).toBeGreaterThan(10);
      expect(page.metaDescription.length).toBeGreaterThan(40);
      expect(page.metaDescription.length).toBeLessThanOrEqual(160);
      // H1 should use short facility labels, not raw environment.name
      expect(page.h1.toLowerCase()).not.toContain('fulfillment warehouse');
      expect(page.h1.toLowerCase()).not.toContain('office and retail floors');
    }
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
