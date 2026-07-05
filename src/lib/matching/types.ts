/** Core domain types for the PickTheRobot matching engine. */

export type RobotCategory = 'warehouse' | 'cleaning' | 'restaurant';

export type WarehouseRobotType = 'amr' | 'agv' | 'picking_assist' | 'pallet_mover';
export type CleaningRobotType = 'office_cleaner' | 'large_scrubber' | 'industrial_cleaner';
export type RestaurantRobotType =
  | 'serving_robot'
  | 'bussing_robot'
  | 'kitchen_automation'
  | 'reception_robot';

export type RobotType = WarehouseRobotType | CleaningRobotType | RestaurantRobotType;

export type AcquisitionModel = 'buy' | 'lease' | 'raas';

export type StaffingPressure = 'low' | 'medium' | 'high';
export type BudgetPreference = 'low_upfront' | 'balanced' | 'maximize_long_term_roi';
export type TechReadiness = 'low' | 'medium' | 'high';

export interface BaseUserProfile {
  category: RobotCategory;
  laborCostPerHour: number;
  hoursPerDay: number;
  daysPerWeek: number;
  staffingPressure: StaffingPressure;
  budgetPreference: BudgetPreference;
  acquisitionPreference: AcquisitionModel | 'open';
  techReadiness: TechReadiness;
  /** Optional region code for vendor region matching (e.g. 'US', 'EU'). */
  region?: string;
}

export interface WarehouseProfile extends BaseUserProfile {
  category: 'warehouse';
  facilitySizeSqM: number;
  ordersPerDay: number;
  picksPerDay: number;
  mainPainPoint: 'transport' | 'picking' | 'pallet_movement' | 'inventory' | 'labor_shortage';
  loadType: 'light_items' | 'mixed_totes' | 'pallets';
  layoutStability: 'stable' | 'some_change' | 'frequent_change';
  aisleConstraints: 'tight' | 'moderate' | 'wide';
  wmsReadiness: 'none' | 'partial' | 'ready';
  temperatureZone: 'ambient' | 'cold';
}

export interface CleaningProfile extends BaseUserProfile {
  category: 'cleaning';
  floorAreaSqM: number;
  environmentType: 'office' | 'retail' | 'warehouse' | 'industrial' | 'mixed';
  cleaningFrequencyPerDay: number;
  messLevel: 'light' | 'moderate' | 'heavy';
  obstacleComplexity: 'low' | 'medium' | 'high';
  cleaningType: 'vacuum' | 'scrub' | 'sweep' | 'combo';
  staffAssignedToCleaning: number;
  floorSurface: 'hard' | 'carpet' | 'mixed';
  /** Janitorial wage; defaults to laborCostPerHour when unset. */
  cleaningLaborCostPerHour: number;
}

export interface RestaurantProfile extends BaseUserProfile {
  category: 'restaurant';
  venueType: 'qsr' | 'full_service' | 'buffet' | 'hotel_restaurant' | 'food_hall';
  seatsPerDay: number;
  peakHoursPerDay: number;
  mainPainPoint:
    | 'food_running'
    | 'bussing'
    | 'kitchen_bottleneck'
    | 'staff_shortage'
    | 'guest_guidance';
  layoutComplexity: 'tight' | 'moderate' | 'open';
  aisleWidth: 'narrow' | 'normal' | 'wide';
  serviceIntensity: 'low' | 'medium' | 'high';
  /** Optional table count for layout-heavy venues; improves vendor size fit. */
  tableCount?: number;
}

export type UserProfile = WarehouseProfile | CleaningProfile | RestaurantProfile;

export interface MatchScore {
  useCaseFit: number;
  economicFit: number;
  deploymentFit: number;
  overallMatch: number;
}

export type ScoreDimension = 'useCase' | 'economic' | 'deployment';

export interface RuleHit {
  id: string;
  delta: number;
  dimension: ScoreDimension;
  message: string;
}

export interface ScoringTrace {
  hits: RuleHit[];
}

export interface ScoredRobotResult {
  score: MatchScore;
  trace: ScoringTrace;
}

export interface RobotMatch {
  category: RobotCategory;
  robotType: RobotType;
  acquisitionModel: AcquisitionModel;
  score: MatchScore;
  trace: ScoringTrace;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  categories: RobotCategory[];
  robotTypes: RobotType[];
  industries: string[];
  idealFacilitySize: 'small' | 'medium' | 'large';
  budgetTier: 'entry' | 'mid' | 'premium';
  deploymentComplexity: 'low' | 'medium' | 'high';
  acquisitionModelsSupported: AcquisitionModel[];
  regions: string[];
  bestFor: string[];
  strengths: string[];
  limitations: string[];
  outboundUrl: string;
  affiliateUrl?: string;
  sponsored?: boolean;
  shortDescription: string;
  /** Sponsored listings only — optional logo URL (self-hosted path recommended). */
  logoUrl?: string;
  /** Restaurant-only: typical daily cover range this vendor targets. */
  minCoversPerDay?: number;
  maxCoversPerDay?: number;
}

export interface VendorMatch {
  vendorId: string;
  vendorName: string;
  category: RobotCategory;
  robotTypes: RobotType[];
  acquisitionModels: AcquisitionModel[];
  score: MatchScore;
  overallMatch: number;
  tags: string[];
  sponsored: boolean;
}

export interface RecommendationExplanation {
  summary: string;
  robotChoiceReasons: string[];
  acquisitionReasons: string[];
  vendorChoiceReasons: string[];
  cautions: string[];
  /** When runner-up is within 10 pts, explains why it ranked second. */
  runnerUpComparison?: string[];
}

export type MatchConfidence = 'strong' | 'moderate' | 'weak';

export interface RecommendationResult {
  profile: UserProfile;
  bestRobotMatch: RobotMatch;
  runnerUpRobotMatch?: RobotMatch;
  bestLowUpfrontMatch?: RobotMatch;
  bestLongTermRoiMatch?: RobotMatch;
  /** All robot types ranked by overallMatch for the category. */
  allRobotMatches: RobotMatch[];
  acquisitionRecommendation: AcquisitionModel;
  vendorMatches: VendorMatch[];
  /** True when vendor list includes below-threshold fallbacks. */
  vendorsLowConfidence: boolean;
  /** Top exclusion reasons when vendorsLowConfidence is true. */
  vendorExclusionReasons?: string[];
  matchConfidence: MatchConfidence;
  explanation: RecommendationExplanation;
  /** Qualitative fleet sizing guidance (not a dollar ROI estimate). */
  fleetSizingHint?: string;
}

/** Score without overallMatch — used as input to computeOverallMatch. */
export type PartialMatchScore = Omit<MatchScore, 'overallMatch'>;

export interface MatchEvent {
  type:
    | 'match_generated'
    | 'robot_clicked'
    | 'vendor_clicked'
    | 'category_changed'
    | 'results_saved'
    | 'acquisition_model_viewed';
  payload: unknown;
}

export type MatchEventHandler = (event: MatchEvent) => void;

/** Thresholds for robot match quality (documented for transparency). */
export const MATCH_THRESHOLDS = {
  /** Minimum overallMatch to surface as primary recommendation. */
  best: 50,
  /** Minimum overallMatch to surface as runner-up. */
  runnerUp: 35,
  /** Max vendors returned per recommendation. */
  maxVendors: 5,
  /** Minimum overallMatch for vendor to be a confident match. */
  vendorMin: 35,
  /** Floor for vendor fallback when none qualify. */
  vendorFallbackMin: 20,
  /** Soft boost applied to sponsored vendors (must not dominate relevance). */
  sponsoredBoost: 3,
} as const;
