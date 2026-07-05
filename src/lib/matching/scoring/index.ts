import type {
  AcquisitionModel,
  BudgetPreference,
  CleaningRobotType,
  MatchScore,
  RestaurantRobotType,
  RobotType,
  ScoredRobotResult,
  UserProfile,
  WarehouseRobotType,
} from '../types';
import {
  scoreCleaningRobotType as scoreCleaningScored,
  recommendCleaningAcquisition,
  CLEANING_ROBOT_TYPES,
} from './cleaning';
import {
  scoreRestaurantRobotType as scoreRestaurantScored,
  recommendRestaurantAcquisition,
  RESTAURANT_ROBOT_TYPES,
} from './restaurant';
import {
  clamp,
  computeOverallMatch,
  withOverallMatch,
  acquisitionForBudgetGoal as acquisitionForBudgetGoalFn,
} from './shared';
import {
  scoreWarehouseRobotType as scoreWarehouseScored,
  recommendWarehouseAcquisition,
  WAREHOUSE_ROBOT_TYPES,
} from './warehouse';

export {
  clamp,
  computeOverallMatch,
  withOverallMatch,
  staffingPressureScore,
  techReadinessScore,
  laborCostFactor,
  budgetTierFit,
  deploymentComplexityFit,
  facilitySizeFit,
  restaurantScaleProxy,
} from './shared';

export { createTrace, recordHit, applyDelta, topHits, hitsForDimension } from './trace';
export {
  scoreWarehouseRobotType as scoreWarehouseRobotTypeScored,
  recommendWarehouseAcquisition,
  WAREHOUSE_ROBOT_TYPES,
} from './warehouse';
export {
  scoreCleaningRobotType as scoreCleaningRobotTypeScored,
  recommendCleaningAcquisition,
  CLEANING_ROBOT_TYPES,
} from './cleaning';
export {
  scoreRestaurantRobotType as scoreRestaurantRobotTypeScored,
  recommendRestaurantAcquisition,
  RESTAURANT_ROBOT_TYPES,
} from './restaurant';
export { scoreVendorForProfile, getVendorExclusionReason } from './vendors';

export function scoreWarehouseRobotType(
  profile: import('../types').WarehouseProfile,
  robotType: WarehouseRobotType,
): MatchScore {
  return scoreWarehouseScored(profile, robotType).score;
}

export function scoreCleaningRobotType(
  profile: import('../types').CleaningProfile,
  robotType: CleaningRobotType,
): MatchScore {
  return scoreCleaningScored(profile, robotType).score;
}

export function scoreRestaurantRobotType(
  profile: import('../types').RestaurantProfile,
  robotType: RestaurantRobotType,
): MatchScore {
  return scoreRestaurantScored(profile, robotType).score;
}

export function getRobotTypesForCategory(category: UserProfile['category']): RobotType[] {
  switch (category) {
    case 'warehouse':
      return WAREHOUSE_ROBOT_TYPES;
    case 'cleaning':
      return CLEANING_ROBOT_TYPES;
    case 'restaurant':
      return RESTAURANT_ROBOT_TYPES;
  }
}

export function scoreRobotType(profile: UserProfile, robotType: RobotType): ScoredRobotResult {
  switch (profile.category) {
    case 'warehouse':
      return scoreWarehouseScored(profile, robotType as WarehouseRobotType);
    case 'cleaning':
      return scoreCleaningScored(profile, robotType as CleaningRobotType);
    case 'restaurant':
      return scoreRestaurantScored(profile, robotType as RestaurantRobotType);
  }
}

/** @deprecated Use scoreRobotType for trace support. */
export function scoreRobotTypeScore(profile: UserProfile, robotType: RobotType): MatchScore {
  return scoreRobotType(profile, robotType).score;
}

export function recommendAcquisition(profile: UserProfile): AcquisitionModel {
  switch (profile.category) {
    case 'warehouse':
      return recommendWarehouseAcquisition(profile);
    case 'cleaning':
      return recommendCleaningAcquisition(profile);
    case 'restaurant':
      return recommendRestaurantAcquisition(profile);
  }
}

export function acquisitionForBudgetGoal(
  budgetPreference: BudgetPreference,
  primary: AcquisitionModel,
): AcquisitionModel {
  return acquisitionForBudgetGoalFn(budgetPreference, primary);
}
