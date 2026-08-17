import type { AcquisitionModel, RoiEstimate, RobotType, UserProfile } from './types';
import { estimateCleaningRoi, isCleaningRobotType } from './cleaningRoi';
import { estimateRestaurantRoi, isRestaurantRobotType } from './restaurantRoi';
import { estimateWarehouseRoi, isWarehouseRobotType } from './warehouseRoi';

/** Indicative labor offset for the matched robot type — all categories. */
export function estimateLaborOffset(
  profile: UserProfile,
  robotType: RobotType,
  acquisitionModel: AcquisitionModel,
): RoiEstimate | undefined {
  if (profile.category === 'cleaning' && isCleaningRobotType(robotType)) {
    return estimateCleaningRoi(profile, robotType, acquisitionModel);
  }
  if (profile.category === 'warehouse' && isWarehouseRobotType(robotType)) {
    return estimateWarehouseRoi(profile, robotType, acquisitionModel);
  }
  if (profile.category === 'restaurant' && isRestaurantRobotType(robotType)) {
    return estimateRestaurantRoi(profile, robotType, acquisitionModel);
  }
  return undefined;
}
