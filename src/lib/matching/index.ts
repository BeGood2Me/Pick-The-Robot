/**
 * Category-specific rule helpers and re-exports.
 * Scoring logic lives in scoring.ts; orchestration in engine.ts.
 */

export {
  scoreWarehouseRobotType,
  recommendWarehouseAcquisition,
  scoreCleaningRobotType,
  recommendCleaningAcquisition,
  scoreRestaurantRobotType,
  recommendRestaurantAcquisition,
  scoreRobotType,
  recommendAcquisition,
  scoreVendorForProfile,
  getVendorExclusionReason,
  getRobotTypesForCategory,
  computeOverallMatch,
  clamp,
  withOverallMatch,
  acquisitionForBudgetGoal,
} from './scoring';

export {
  generateRecommendation,
  trackVendorClick,
  trackRobotClick,
  trackCategoryChanged,
  trackResultsSaved,
} from './engine';

export { getFleetSizingHint, fleetSizingDisclaimer } from './sizing';
export { buildExplanation, ROBOT_TYPE_LABELS, ACQUISITION_LABELS } from './explain';
export { VENDORS, getVendorsByCategory, getVendorById } from './vendors';
export { setMatchEventHandler, emitMatchEvent } from './events';
export { onProfileSubmit, onFormSubmit } from './adapter';
export {
  buildSharePayload,
  encodeSharePayload,
  decodeSharePayload,
  buildShareUrl,
} from './share';

export type {
  RobotCategory,
  WarehouseRobotType,
  CleaningRobotType,
  RestaurantRobotType,
  RobotType,
  AcquisitionModel,
  BaseUserProfile,
  WarehouseProfile,
  CleaningProfile,
  RestaurantProfile,
  UserProfile,
  MatchScore,
  RobotMatch,
  Vendor,
  VendorMatch,
  RecommendationExplanation,
  RecommendationResult,
  MatchEvent,
  MatchEventHandler,
  PartialMatchScore,
  MatchConfidence,
  ScoringTrace,
  RuleHit,
  ScoreDimension,
  ScoredRobotResult,
} from './types';

export { MATCH_THRESHOLDS } from './types';
