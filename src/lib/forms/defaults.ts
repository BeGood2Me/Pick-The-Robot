import type { RobotCategory } from '../matching/types';
import type { BaseFormAnswers, FormAnswers, FormAnswersForCategory, WizardAnswers } from './types';

/** In-progress wizard state — only `category` is set until the user fills each field. */
export function emptyAnswersForCategory(category: RobotCategory): WizardAnswers {
  return { category };
}

export const DEFAULT_BASE_ANSWERS: BaseFormAnswers = {  laborCostPerHour: 22,
  hoursPerDay: 8,
  daysPerWeek: 5,
  staffingPressure: 'medium',
  budgetPreference: 'balanced',
  acquisitionPreference: 'open',
  techReadiness: 'medium',
  region: 'US',
};

export const DEFAULT_WAREHOUSE_ANSWERS: FormAnswersForCategory<'warehouse'> = {
  ...DEFAULT_BASE_ANSWERS,
  category: 'warehouse',
  facilitySizeSqM: 5000,
  ordersPerDay: 800,
  picksPerDay: 4000,
  mainPainPoint: 'transport',
  loadType: 'mixed_totes',
  layoutStability: 'some_change',
  aisleConstraints: 'moderate',
  wmsReadiness: 'partial',
  temperatureZone: 'ambient',
};

export const DEFAULT_CLEANING_ANSWERS: FormAnswersForCategory<'cleaning'> = {
  ...DEFAULT_BASE_ANSWERS,
  category: 'cleaning',
  floorAreaSqM: 2500,
  environmentType: 'office',
  cleaningFrequencyPerDay: 1,
  messLevel: 'moderate',
  obstacleComplexity: 'medium',
  cleaningType: 'vacuum',
  staffAssignedToCleaning: 1,
  floorSurface: 'hard',
  cleaningLaborCostPerHour: 22,
};

export const DEFAULT_RESTAURANT_ANSWERS: FormAnswersForCategory<'restaurant'> = {
  ...DEFAULT_BASE_ANSWERS,
  category: 'restaurant',
  venueType: 'full_service',
  seatsPerDay: 150,
  peakHoursPerDay: 3,
  mainPainPoint: 'food_running',
  layoutComplexity: 'moderate',
  aisleWidth: 'normal',
  serviceIntensity: 'medium',
  tableCount: 0,
};

export function defaultAnswersForCategory(category: 'warehouse'): FormAnswersForCategory<'warehouse'>;
export function defaultAnswersForCategory(category: 'cleaning'): FormAnswersForCategory<'cleaning'>;
export function defaultAnswersForCategory(category: 'restaurant'): FormAnswersForCategory<'restaurant'>;
export function defaultAnswersForCategory(
  category: 'warehouse' | 'cleaning' | 'restaurant',
): FormAnswers {
  switch (category) {
    case 'warehouse':
      return DEFAULT_WAREHOUSE_ANSWERS;
    case 'cleaning':
      return DEFAULT_CLEANING_ANSWERS;
    case 'restaurant':
      return DEFAULT_RESTAURANT_ANSWERS;
  }
}

/** Merge partial answers (e.g. from share links) with category defaults. */
export function normalizeFormAnswers(
  answers: FormAnswers | (Partial<FormAnswers> & { category: FormAnswers['category'] }),
): FormAnswers {
  switch (answers.category) {
    case 'warehouse':
      return { ...DEFAULT_WAREHOUSE_ANSWERS, ...answers } as FormAnswers;
    case 'cleaning':
      return { ...DEFAULT_CLEANING_ANSWERS, ...answers } as FormAnswers;
    case 'restaurant':
      return { ...DEFAULT_RESTAURANT_ANSWERS, ...answers } as FormAnswers;
  }
}
