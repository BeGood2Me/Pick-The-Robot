import type { AcquisitionModel, BudgetPreference, MatchScore, PartialMatchScore, TechReadiness, UserProfile, Vendor } from '../types';

/** Clamp a numeric score to the 0–100 range. */
export function clamp(score: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, score));
}

/** Weighted combination of dimension scores into overallMatch. */
export function computeOverallMatch(score: PartialMatchScore): number {
  const useCaseWeight = 0.45;
  const economicWeight = 0.35;
  const deploymentWeight = 0.2;
  return clamp(
    useCaseWeight * score.useCaseFit +
      economicWeight * score.economicFit +
      deploymentWeight * score.deploymentFit,
  );
}

export function withOverallMatch(score: PartialMatchScore): MatchScore {
  return { ...score, overallMatch: computeOverallMatch(score) };
}

export function staffingPressureScore(pressure: UserProfile['staffingPressure']): number {
  const map = { low: 40, medium: 65, high: 85 };
  return map[pressure];
}

export function techReadinessScore(readiness: TechReadiness): number {
  const map = { low: 35, medium: 60, high: 85 };
  return map[readiness];
}

export function laborCostFactor(laborCostPerHour: number): number {
  return clamp(50 + ((laborCostPerHour - 18) / 27) * 40);
}

export function budgetTierFit(
  budgetPreference: BudgetPreference,
  tier: Vendor['budgetTier'],
): number {
  const tierValue = { entry: 0, mid: 1, premium: 2 }[tier];
  if (budgetPreference === 'low_upfront') {
    return tierValue === 0 ? 90 : tierValue === 1 ? 65 : 40;
  }
  if (budgetPreference === 'maximize_long_term_roi') {
    return tierValue === 2 ? 85 : tierValue === 1 ? 75 : 55;
  }
  return tierValue === 1 ? 85 : tierValue === 0 ? 70 : 65;
}

export function deploymentComplexityFit(
  techReadiness: TechReadiness,
  complexity: Vendor['deploymentComplexity'],
): number {
  const readiness = techReadinessScore(techReadiness);
  const complexityPenalty = { low: 0, medium: 15, high: 30 }[complexity];
  return clamp(readiness - complexityPenalty + 20);
}

export function facilitySizeFit(
  profileSize: number,
  idealSize: Vendor['idealFacilitySize'],
  category: UserProfile['category'],
): number {
  const sizeBucket =
    category === 'restaurant'
      ? profileSize < 40
        ? 'small'
        : profileSize < 100
          ? 'medium'
          : 'large'
      : profileSize < 2000
        ? 'small'
        : profileSize < 10000
          ? 'medium'
          : 'large';
  if (sizeBucket === idealSize) return 90;
  const order = { small: 0, medium: 1, large: 2 };
  const diff = Math.abs(order[sizeBucket] - order[idealSize]);
  return diff === 1 ? 65 : 40;
}

/** Restaurant facility scale proxy for vendor size matching. */
export function restaurantScaleProxy(
  seatsPerDay: number,
  tableCount?: number,
): number {
  return tableCount ?? Math.round(seatsPerDay / 4);
}

/** Pick acquisition model aligned with a budget preference goal. */
export function acquisitionForBudgetGoal(
  budgetPreference: BudgetPreference,
  primary: AcquisitionModel,
): AcquisitionModel {
  if (budgetPreference === 'low_upfront') {
    if (primary === 'buy') return 'raas';
    return primary === 'lease' ? 'raas' : primary;
  }
  if (budgetPreference === 'maximize_long_term_roi') {
    if (primary === 'raas') return 'buy';
    return primary;
  }
  return primary;
}
