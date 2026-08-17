import { describe, it, expect } from 'vitest';
import { estimateCleaningRoi, formatUsdRange } from '../src/lib/matching/cleaningRoi';
import { generateRecommendation } from '../src/lib/matching';
import { formatResultsSummary } from '../src/lib/matching/formatSummary';
import type { CleaningProfile } from '../src/lib/matching/types';

const base: CleaningProfile = {
  laborCostPerHour: 22,
  hoursPerDay: 8,
  daysPerWeek: 5,
  staffingPressure: 'medium',
  budgetPreference: 'balanced',
  acquisitionPreference: 'open',
  techReadiness: 'medium',
  region: 'US',
  category: 'cleaning',
  floorAreaSqM: 4500,
  environmentType: 'retail',
  cleaningFrequencyPerDay: 2,
  messLevel: 'moderate',
  obstacleComplexity: 'medium',
  cleaningType: 'combo',
  staffAssignedToCleaning: 2,
  floorSurface: 'hard',
  cleaningLaborCostPerHour: 20,
};

describe('estimateCleaningRoi', () => {
  it('never claims more displaced hours than reported staff floor time', () => {
    const roi = estimateCleaningRoi(base, 'large_scrubber', 'raas');
    const staffFloorHours = 2 * 8 * 5 * 0.5;
    expect(roi.weeklyFloorHours).toBeLessThanOrEqual(staffFloorHours);
    expect(roi.weeklyHoursDisplaced).toBeLessThanOrEqual(roi.weeklyFloorHours);
    expect(roi.robotCount).toBeGreaterThanOrEqual(1);
  });

  it('infers hours when staff assigned is zero', () => {
    const roi = estimateCleaningRoi(
      { ...base, staffAssignedToCleaning: 0 },
      'large_scrubber',
      'raas',
    );
    expect(roi.hoursSource).toBe('inferred');
    expect(roi.weeklyFloorHours).toBeGreaterThan(0);
  });

  it('marks small or infrequent sites as a weak savings case', () => {
    const roi = estimateCleaningRoi(
      {
        ...base,
        floorAreaSqM: 250,
        cleaningFrequencyPerDay: 0.5,
        staffAssignedToCleaning: 1,
      },
      'office_cleaner',
      'buy',
    );
    expect(roi.viability).toBe('weak');
  });

  it('does not invent workers compensation dollars', () => {
    const roi = estimateCleaningRoi(base, 'large_scrubber', 'raas');
    const blob = [...roi.notes, ...roi.assumptions].join(' ');
    expect(blob.toLowerCase()).toMatch(/workers compensation/);
    expect(blob).not.toMatch(/\$\d[\d,]*\s*(?:\/\s*)?(?:yr|year|mo|month).*comp/i);
    expect(blob).not.toMatch(/comp.*\$\d/i);
  });

  it('never reports more robots than the cap', () => {
    const roi = estimateCleaningRoi(
      { ...base, floorAreaSqM: 80_000, cleaningFrequencyPerDay: 3, staffAssignedToCleaning: 20 },
      'office_cleaner',
      'buy',
    );
    expect(roi.robotCount).toBeLessThanOrEqual(12);
  });

  it('is deterministic', () => {
    const a = estimateCleaningRoi(base, 'large_scrubber', 'raas');
    const b = estimateCleaningRoi(base, 'large_scrubber', 'raas');
    expect(a).toEqual(b);
  });

  it('formats ranges without a collapsing low and high', () => {
    expect(formatUsdRange({ low: 2000, high: 5000 })).toContain('to');
  });
});

describe('cleaning recommendation includes ROI', () => {
  it('attaches cleaningRoi on cleaning matches', () => {
    const cleaning = generateRecommendation(base);
    expect(cleaning.cleaningRoi).toBeDefined();
    expect(cleaning.cleaningRoi?.robotType).toBe(cleaning.bestRobotMatch.robotType);

    const summary = formatResultsSummary(cleaning);
    expect(summary).toContain('Cleaning labor offset');
    expect(summary).toContain('Hours robots could take');
  });
});
