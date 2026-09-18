/** Home robot-vacuum matcher — separate from the business RobotCategory engine. */

export type HomeFloorMix = 'hard' | 'carpet' | 'mixed';
export type HomeSize = 'small' | 'medium' | 'large';
export type HomePets = 'none' | 'cat' | 'dog' | 'both';
export type HomeHairLength = 'none' | 'short' | 'long';
export type HomeMopNeeded = 'no' | 'nice_to_have' | 'yes';
export type HomeBudgetBand = 'under_300' | '300_600' | '600_1000' | 'over_1000';
export type HomeSelfEmpty = 'not_needed' | 'preferred' | 'required';
export type HomeObstacles = 'low' | 'medium' | 'high';

export type HomeVacuumClass = 'vacuum_only' | 'mop_vac_combo';
export type HomeBudgetLane = 'budget' | 'mid' | 'premium';
export type HomeSuctionClass = 'standard' | 'strong';
export type HomeMopType = 'none' | 'basic' | 'spinning' | 'hot_water';
export type HomePetHair = 'poor' | 'ok' | 'strong';
export type HomeObstacleAvoidance = 'basic' | 'lidar' | 'camera_ai';

export interface HomeVacuumAnswers {
  floorMix: HomeFloorMix;
  homeSize: HomeSize;
  pets: HomePets;
  hairLength: HomeHairLength;
  mopNeeded: HomeMopNeeded;
  budgetBand: HomeBudgetBand;
  selfEmpty: HomeSelfEmpty;
  multiFloor: boolean;
  obstacles: HomeObstacles;
}

export type WizardHomeVacuumAnswers = Partial<HomeVacuumAnswers>;

export interface HomeVacuumProduct {
  id: string;
  slug: string;
  brand: string;
  name: string;
  class: HomeVacuumClass;
  priceBand: HomeBudgetBand;
  priceUsdApprox: number;
  suctionClass: HomeSuctionClass;
  mop: HomeMopType;
  selfEmpty: boolean;
  petHair: HomePetHair;
  carpetBoost: boolean;
  obstacleAvoidance: HomeObstacleAvoidance;
  multiFloorMaps: boolean;
  compact: boolean;
  outboundUrl: string;
  /** Retailer/affiliate URL when set; otherwise outboundUrl is used. */
  affiliateUrl?: string;
  shortDescription: string;
  strengths: string[];
  limitations: string[];
}

export interface HomeMatchScore {
  useCaseFit: number;
  economicFit: number;
  deploymentFit: number;
  overallMatch: number;
}

export interface HomeRuleHit {
  id: string;
  delta: number;
  dimension: 'useCase' | 'economic' | 'deployment';
  message: string;
}

export interface HomeProductMatch {
  product: HomeVacuumProduct;
  score: HomeMatchScore;
  reasons: string[];
  cautions: string[];
}

export type HomeMatchConfidence = 'strong' | 'moderate' | 'weak';

export interface HomeVacuumRecommendation {
  answers: HomeVacuumAnswers;
  bestClass: HomeVacuumClass;
  budgetLane: HomeBudgetLane;
  classReasons: string[];
  matches: HomeProductMatch[];
  matchConfidence: HomeMatchConfidence;
  summary: string;
  cautions: string[];
  affiliateDisclosure: string;
}
