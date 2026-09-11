import { describe, expect, it } from 'vitest';
import type { WarehouseFormAnswers } from '@/lib/forms/types';
import {
  listComparisonPages,
  matcherFieldsForCategory,
  priceBandsReference,
  runMatch,
} from '../mcp-server/src/services';

const warehouseAnswers: WarehouseFormAnswers = {
  category: 'warehouse',
  laborCostPerHour: 22,
  hoursPerDay: 16,
  daysPerWeek: 5,
  staffingPressure: 'medium',
  budgetPreference: 'balanced',
  acquisitionPreference: 'open',
  techReadiness: 'medium',
  region: 'US',
  facilitySizeSqM: 8000,
  ordersPerDay: 1200,
  picksPerDay: 6000,
  mainPainPoint: 'transport',
  loadType: 'mixed_totes',
  layoutStability: 'frequent_change',
  aisleConstraints: 'moderate',
  wmsReadiness: 'partial',
  temperatureZone: 'ambient',
};

describe('MCP server services', () => {
  it('returns matcher fields for warehouse', () => {
    const fields = matcherFieldsForCategory('warehouse');
    expect(fields.some((f) => f.key === 'picksPerDay')).toBe(true);
    expect(fields.find((f) => f.key === 'category')).toBeUndefined();
  });

  it('runs match and returns share URL', () => {
    const outcome = runMatch(warehouseAnswers);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.match.bestRobotMatch.robotType).toBeTruthy();
    expect(outcome.shareUrl).toContain('share=');
    expect(outcome.match.vendorMatches.length).toBeGreaterThan(0);
  });

  it('exposes price bands and comparisons', () => {
    const bands = priceBandsReference();
    expect(bands.warehouse.amrPurchase).toContain('150k');
    const comparisons = listComparisonPages();
    expect(comparisons.some((c) => c.slug === 'amr-vs-agv')).toBe(true);
  });
});
