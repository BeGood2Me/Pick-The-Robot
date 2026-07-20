import { describe, it, expect } from 'vitest';
import {
  MIN_COST_DRIVERS,
  getCostBand,
  getPublishableCombos,
  getHubEntries,
  resolveBestForPage,
  resolveCostBandForPage,
} from '../src/lib/content/pseo';

describe('pSEO cost bands', () => {
  it('resolves a band for every publishable best combo', () => {
    const publishable = getPublishableCombos();
    expect(publishable.length).toBeGreaterThanOrEqual(1);
    for (const combo of publishable) {
      const band = getCostBand(combo.robotType);
      expect(band).not.toBeNull();
      expect(band!.purchaseBand.trim().length).toBeGreaterThan(0);
      expect(band!.monthlyBand.trim().length).toBeGreaterThan(0);
      expect(band!.costDrivers.length).toBeGreaterThanOrEqual(MIN_COST_DRIVERS);
      expect(band!.caveat.trim().length).toBeGreaterThan(0);
    }
  });

  it('attaches costBand on resolved best-for pages', () => {
    const page = resolveBestForPage('amr', 'ecommerce-warehouse');
    expect(page).not.toBeNull();
    expect(page!.costBand).not.toBeNull();
    expect(page!.costBand!.robotType).toBe('amr');
    expect(resolveCostBandForPage(page!)).toEqual(page!.costBand);
  });

  it('returns null for unknown robot types', () => {
    expect(getCostBand('kitchen_automation' as 'amr')).toBeNull();
  });

  it('hub entries all expose cost bands', () => {
    const hub = getHubEntries();
    expect(hub.every((p) => p.costBand !== null)).toBe(true);
  });
});
