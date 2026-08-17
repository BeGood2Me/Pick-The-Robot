import { describe, it, expect } from 'vitest';
import { estimateRestaurantRoi } from '../src/lib/matching/restaurantRoi';
import { generateRecommendation } from '../src/lib/matching';
import type { RestaurantProfile } from '../src/lib/matching/types';

const base: RestaurantProfile = {
  laborCostPerHour: 18,
  hoursPerDay: 10,
  daysPerWeek: 6,
  staffingPressure: 'high',
  budgetPreference: 'low_upfront',
  acquisitionPreference: 'open',
  techReadiness: 'medium',
  region: 'US',
  category: 'restaurant',
  venueType: 'full_service',
  seatsPerDay: 220,
  peakHoursPerDay: 3,
  mainPainPoint: 'food_running',
  layoutComplexity: 'moderate',
  aisleWidth: 'normal',
  serviceIntensity: 'high',
  tableCount: 40,
};

describe('estimateRestaurantRoi', () => {
  it('models peak-hour runner work only', () => {
    const roi = estimateRestaurantRoi(base, 'serving_robot', 'raas');
    expect(roi.modelKind).toBe('peak_labor_offset');
    expect(roi.notes.some((n) => n.includes('peak-hour'))).toBe(true);
  });

  it('never displaces more hours than modeled activity', () => {
    const roi = estimateRestaurantRoi(base, 'serving_robot', 'raas');
    expect(roi.weeklyHoursDisplaced).toBeLessThanOrEqual(roi.weeklyActivityHours);
    expect(roi.unitCount).toBeGreaterThan(0);
  });

  it('marks very small venues as weak', () => {
    const roi = estimateRestaurantRoi(
      { ...base, seatsPerDay: 50, peakHoursPerDay: 2 },
      'serving_robot',
      'raas',
    );
    expect(roi.viability).toBe('weak');
  });

  it('does not invent tip pool dollars', () => {
    const roi = estimateRestaurantRoi(base, 'serving_robot', 'raas');
    const blob = [...roi.notes, ...roi.assumptions].join(' ');
    expect(blob.toLowerCase()).toMatch(/tip/);
    expect(blob).not.toMatch(/tip.*\$\d/i);
  });

  it('labels kitchen automation as throughput sketch', () => {
    const roi = estimateRestaurantRoi(
      { ...base, mainPainPoint: 'kitchen_bottleneck' },
      'kitchen_automation',
      'raas',
    );
    expect(roi.modelKind).toBe('throughput');
    expect(roi.notes.some((n) => n.includes('station-specific'))).toBe(true);
  });

  it('is deterministic', () => {
    const a = estimateRestaurantRoi(base, 'bussing_robot', 'raas');
    const b = estimateRestaurantRoi(base, 'bussing_robot', 'raas');
    expect(a).toEqual(b);
  });
});

describe('restaurant recommendation includes ROI', () => {
  it('attaches laborOffset on restaurant matches', () => {
    const result = generateRecommendation(base);
    expect(result.laborOffset).toBeDefined();
    expect(result.laborOffset?.robotType).toBe(result.bestRobotMatch.robotType);
  });
});
