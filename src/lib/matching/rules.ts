/**
 * Rule entry points per category — implemented in scoring.ts.
 * This module exists for the rules / scoring separation in the architecture.
 */

export {
  scoreWarehouseRobotType,
  recommendWarehouseAcquisition,
  scoreCleaningRobotType,
  recommendCleaningAcquisition,
  scoreRestaurantRobotType,
  recommendRestaurantAcquisition,
} from './scoring';
