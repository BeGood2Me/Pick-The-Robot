import type { FormAnswers, WizardAnswers } from './types';
import type { RobotCategory } from '../matching/types';
import { getFormFields } from './questions';

const OPTIONAL_FIELD_KEYS = new Set(['tableCount', 'cleaningLaborCostPerHour']);
const ZERO_VALID_FIELDS = new Set(['staffAssignedToCleaning']);

export function isFieldEmpty(value: unknown): boolean {
  if (value === undefined || value === '' || (typeof value === 'number' && Number.isNaN(value))) {
    return true;
  }
  if (typeof value === 'number' && value <= 0) {
    return true;
  }
  return false;
}

/** Block Next / submit when required fields on the current step are empty. */
export function getRequiredFieldErrors(
  answers: Partial<FormAnswers> & { category: RobotCategory },
  fieldKeys?: string[],
): Record<string, string> {
  const keys =
    fieldKeys ??
    getFormFields(answers.category)
      .map((f) => f.key)
      .filter((k) => !OPTIONAL_FIELD_KEYS.has(k));

  const errors: Record<string, string> = {};
  for (const key of keys) {
    const value = answers[key as keyof FormAnswers];
    if (ZERO_VALID_FIELDS.has(key) && value === 0) continue;
    if (isFieldEmpty(value)) {
      errors[key] = 'This field is required.';
    }
  }
  return errors;
}

/** Soft validation warnings — do not block submission. */
export function validateFormAnswers(answers: FormAnswers): string[] {
  const warnings: string[] = [];

  switch (answers.category) {
    case 'warehouse':
      if (
        !isFieldEmpty(answers.ordersPerDay) &&
        !isFieldEmpty(answers.picksPerDay) &&
        answers.picksPerDay < answers.ordersPerDay
      ) {
        warnings.push(
          'Picks per day is lower than orders per day — most operations have more picks than orders.',
        );
      }
      if (answers.ordersPerDay > 0 && answers.picksPerDay / answers.ordersPerDay > 50) {
        warnings.push(
          'Pick-to-order ratio looks unusually high — double-check your pick volume.',
        );
      }
      break;
    case 'restaurant':
      if (
        !isFieldEmpty(answers.peakHoursPerDay) &&
        !isFieldEmpty(answers.hoursPerDay) &&
        answers.peakHoursPerDay > answers.hoursPerDay
      ) {
        warnings.push(
          'Peak service hours cannot exceed operating hours per day — adjust one of these values.',
        );
      }
      break;
    case 'cleaning':
      if (answers.cleaningLaborCostPerHour === 0) {
        warnings.push(
          'Janitorial labor cost is zero — we will use your general labor cost for economic scoring.',
        );
      }
      break;
  }

  return warnings;
}

/** Per-field inline errors for implausible values. */
export function getFieldErrors(answers: FormAnswers): Record<string, string> {
  const errors: Record<string, string> = {};

  switch (answers.category) {
    case 'warehouse':
      if (
        !isFieldEmpty(answers.ordersPerDay) &&
        !isFieldEmpty(answers.picksPerDay) &&
        answers.picksPerDay < answers.ordersPerDay &&
        answers.ordersPerDay > 0
      ) {
        errors.picksPerDay = 'Usually higher than orders per day.';
      }
      if (answers.ordersPerDay > 0 && answers.picksPerDay / answers.ordersPerDay > 50) {
        errors.picksPerDay = 'Ratio looks unusually high — please verify.';
      }
      break;
    case 'restaurant':
      if (
        !isFieldEmpty(answers.peakHoursPerDay) &&
        !isFieldEmpty(answers.hoursPerDay) &&
        answers.peakHoursPerDay > answers.hoursPerDay
      ) {
        errors.peakHoursPerDay = 'Cannot exceed operating hours per day.';
      }
      break;  }

  return errors;
}

export function assertFormComplete(
  answers: WizardAnswers,
): asserts answers is FormAnswers {
  const errors = getRequiredFieldErrors(answers);
  if (Object.keys(errors).length > 0) {
    throw new Error('Please complete all required fields.');
  }
}
export function sqFtToSqM(sqFt: number): number {
  return sqFt * 0.092903;
}

/** m² to sq ft */
export function sqMToSqFt(sqM: number): number {
  return sqM / 0.092903;
}
