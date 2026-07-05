import { describe, it, expect } from 'vitest';
import {
  buildUserProfile,
  defaultAnswersForCategory,
  emptyAnswersForCategory,
  getRequiredFieldErrors,
} from '../src/lib/forms';
import { sqFtToSqM, sqMToSqFt } from '../src/lib/forms/validateAnswers';
import { onFormSubmit } from '../src/lib/matching/adapter';

describe('empty wizard answers', () => {
  it('starts with only category set', () => {
    const empty = emptyAnswersForCategory('warehouse');
    expect(empty.category).toBe('warehouse');
    expect(empty.laborCostPerHour).toBeUndefined();
    expect(empty.region).toBeUndefined();
  });

  it('flags all required fields as missing', () => {
    const errors = getRequiredFieldErrors(emptyAnswersForCategory('cleaning'));
    expect(errors.laborCostPerHour).toBeDefined();
    expect(errors.floorAreaSqM).toBeDefined();
    expect(errors.tableCount).toBeUndefined();
  });

  it('accepts zero staff assigned to cleaning', () => {
    const answers = {
      ...defaultAnswersForCategory('cleaning'),
      staffAssignedToCleaning: 0,
    };
    const errors = getRequiredFieldErrors(answers, ['staffAssignedToCleaning']);
    expect(errors.staffAssignedToCleaning).toBeUndefined();
  });
});

describe('buildUserProfile', () => {
  it('maps warehouse form answers to UserProfile', () => {
    const answers = defaultAnswersForCategory('warehouse');
    const profile = buildUserProfile(answers);
    expect(profile.category).toBe('warehouse');
    if (profile.category === 'warehouse') {
      expect(profile.facilitySizeSqM).toBe(answers.facilitySizeSqM);
    }
  });

  it('rejects negative labor cost', () => {
    const answers = {
      ...defaultAnswersForCategory('cleaning'),
      laborCostPerHour: -1,
    };
    expect(() => buildUserProfile(answers)).toThrow();
  });

  it('builds cleaning profile with zero staff', () => {
    const answers = {
      ...defaultAnswersForCategory('cleaning'),
      staffAssignedToCleaning: 0,
    };
    const profile = buildUserProfile(answers);
    expect(profile.category).toBe('cleaning');
    if (profile.category === 'cleaning') {
      expect(profile.staffAssignedToCleaning).toBe(0);
    }
  });
});

describe('area unit conversions', () => {
  it('preserves sqft precision across round-trip', () => {
    const sqft = 1000;
    const stored = sqFtToSqM(sqft);
    const roundTrip = Math.round(sqMToSqFt(stored));
    expect(Math.abs(roundTrip - sqft)).toBeLessThanOrEqual(1);
  });
});

describe('onFormSubmit', () => {
  it('returns recommendation from form answers', () => {
    const answers = {
      ...defaultAnswersForCategory('warehouse'),
      mainPainPoint: 'transport' as const,
      layoutStability: 'frequent_change' as const,
    };
    const result = onFormSubmit(answers);
    expect(result.bestRobotMatch.robotType).toBe('amr');
    expect(result.explanation.summary.length).toBeGreaterThan(0);
  });

  it('returns recommendation when zero cleaning staff', () => {
    const answers = {
      ...defaultAnswersForCategory('cleaning'),
      staffAssignedToCleaning: 0,
    };
    const result = onFormSubmit(answers);
    expect(result.bestRobotMatch.score.overallMatch).toBeGreaterThan(0);
  });
});
