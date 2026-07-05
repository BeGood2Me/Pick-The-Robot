import type { UserProfile } from '../matching/types';

import type { FormAnswers, WizardAnswers } from './types';
import { assertFormComplete, isFieldEmpty } from './validateAnswers';


function assertNonNegative(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative number`);
  }
}



/**

 * Validates raw wizard answers and normalizes them into a UserProfile

 * for the matching engine.

 */

export function buildUserProfile(answers: FormAnswers | WizardAnswers): UserProfile {
  assertFormComplete(answers);

  const filled = answers as FormAnswers;


  assertNonNegative('laborCostPerHour', filled.laborCostPerHour);
  assertNonNegative('hoursPerDay', filled.hoursPerDay);
  assertNonNegative('daysPerWeek', filled.daysPerWeek);

  const base = {
    laborCostPerHour: filled.laborCostPerHour,
    hoursPerDay: filled.hoursPerDay,
    daysPerWeek: filled.daysPerWeek,
    staffingPressure: filled.staffingPressure,
    budgetPreference: filled.budgetPreference,
    acquisitionPreference: filled.acquisitionPreference,
    techReadiness: filled.techReadiness,
    region: filled.region,
  };

  switch (filled.category) {
    case 'warehouse':
      assertNonNegative('facilitySizeSqM', filled.facilitySizeSqM);
      assertNonNegative('ordersPerDay', filled.ordersPerDay);
      assertNonNegative('picksPerDay', filled.picksPerDay);
      return {
        ...base,
        category: 'warehouse',
        facilitySizeSqM: filled.facilitySizeSqM,
        ordersPerDay: filled.ordersPerDay,
        picksPerDay: filled.picksPerDay,
        mainPainPoint: filled.mainPainPoint,
        loadType: filled.loadType,
        layoutStability: filled.layoutStability,
        aisleConstraints: filled.aisleConstraints,
        wmsReadiness: filled.wmsReadiness,
        temperatureZone: filled.temperatureZone,
      };

    case 'cleaning':
      assertNonNegative('floorAreaSqM', filled.floorAreaSqM);
      assertNonNegative('cleaningFrequencyPerDay', filled.cleaningFrequencyPerDay);
      assertNonNegative('staffAssignedToCleaning', filled.staffAssignedToCleaning);
      return {
        ...base,
        category: 'cleaning',
        floorAreaSqM: filled.floorAreaSqM,
        environmentType: filled.environmentType,
        cleaningFrequencyPerDay: filled.cleaningFrequencyPerDay,
        messLevel: filled.messLevel,
        obstacleComplexity: filled.obstacleComplexity,
        cleaningType: filled.cleaningType,
        staffAssignedToCleaning: filled.staffAssignedToCleaning,
        floorSurface: filled.floorSurface,
        cleaningLaborCostPerHour: isFieldEmpty(filled.cleaningLaborCostPerHour)
          ? filled.laborCostPerHour
          : filled.cleaningLaborCostPerHour,
      };

    case 'restaurant':
      assertNonNegative('seatsPerDay', filled.seatsPerDay);
      assertNonNegative('peakHoursPerDay', filled.peakHoursPerDay);
      return {
        ...base,
        category: 'restaurant',
        venueType: filled.venueType,
        seatsPerDay: filled.seatsPerDay,
        peakHoursPerDay: filled.peakHoursPerDay,
        mainPainPoint: filled.mainPainPoint,
        layoutComplexity: filled.layoutComplexity,
        aisleWidth: filled.aisleWidth,
        serviceIntensity: filled.serviceIntensity,
        ...(typeof filled.tableCount === 'number' && filled.tableCount > 0
          ? { tableCount: filled.tableCount }
          : {}),
      };
  }
}
