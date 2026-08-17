import { describe, it, expect } from 'vitest';
import { estimateWarehouseRoi } from '../src/lib/matching/warehouseRoi';
import { generateRecommendation } from '../src/lib/matching';
import type { WarehouseProfile } from '../src/lib/matching/types';

const base: WarehouseProfile = {
  laborCostPerHour: 24,
  hoursPerDay: 8,
  daysPerWeek: 5,
  staffingPressure: 'medium',
  budgetPreference: 'balanced',
  acquisitionPreference: 'open',
  techReadiness: 'medium',
  region: 'US',
  category: 'warehouse',
  facilitySizeSqM: 8000,
  ordersPerDay: 1200,
  picksPerDay: 6000,
  mainPainPoint: 'transport',
  loadType: 'mixed_totes',
  layoutStability: 'some_change',
  aisleConstraints: 'moderate',
  wmsReadiness: 'partial',
  temperatureZone: 'ambient',
};

describe('estimateWarehouseRoi', () => {
  it('flags low-volume transport as weak', () => {
    const roi = estimateWarehouseRoi(
      { ...base, ordersPerDay: 120, facilitySizeSqM: 1500 },
      'amr',
      'raas',
    );
    expect(roi.viability).toBe('weak');
    expect(roi.notes.some((n) => n.includes('short internal routes'))).toBe(true);
  });

  it('never displaces more hours than modeled activity', () => {
    const roi = estimateWarehouseRoi(base, 'amr', 'raas');
    expect(roi.weeklyHoursDisplaced).toBeLessThanOrEqual(roi.weeklyActivityHours);
    expect(roi.unitCount).toBeGreaterThan(0);
  });

  it('models pick-assist as throughput uplift', () => {
    const roi = estimateWarehouseRoi(base, 'picking_assist', 'raas');
    expect(roi.modelKind).toBe('throughput');
    expect(roi.secondaryStat?.label).toBe('Picks / day');
  });

  it('does not include integration dollars in assumptions', () => {
    const roi = estimateWarehouseRoi(base, 'amr', 'buy');
    const blob = [...roi.notes, ...roi.assumptions].join(' ');
    expect(blob.toLowerCase()).toMatch(/integration/);
    expect(blob).not.toMatch(/integration.*\$\d/i);
  });

  it('warns on AGV infrastructure', () => {
    const roi = estimateWarehouseRoi(base, 'agv', 'buy');
    const blob = [...roi.notes, ...roi.assumptions].join(' ');
    expect(blob.toLowerCase()).toMatch(/infrastructure|guide paths/);
  });

  it('is deterministic', () => {
    const a = estimateWarehouseRoi(base, 'amr', 'raas');
    const b = estimateWarehouseRoi(base, 'amr', 'raas');
    expect(a).toEqual(b);
  });
});

describe('warehouse recommendation includes ROI', () => {
  it('attaches laborOffset on warehouse matches', () => {
    const result = generateRecommendation(base);
    expect(result.laborOffset).toBeDefined();
    expect(result.laborOffset?.robotType).toBe(result.bestRobotMatch.robotType);
  });
});
