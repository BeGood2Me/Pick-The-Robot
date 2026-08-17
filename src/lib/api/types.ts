import type {
  AcquisitionModel,
  CleaningRoiViability,
  MatchConfidence,
  MoneyRange,
  RobotCategory,
  RobotType,
  ScoreDimension,
} from '@/lib/matching/types';
import type { ApiTier } from './tiers';

export interface PublicMatchScore {
  overallMatch: number;
  useCaseFit?: number;
  economicFit?: number;
  deploymentFit?: number;
}

export interface PublicRuleHit {
  id: string;
  dimension: ScoreDimension;
  delta: number;
  message: string;
}

export interface PublicRobotMatch {
  robotType: RobotType;
  robotTypeLabel: string;
  acquisitionModel: AcquisitionModel;
  acquisitionLabel: string;
  score: PublicMatchScore;
  trace?: { hits: PublicRuleHit[] };
}

export interface PublicVendorMatch {
  vendorId: string;
  vendorName: string;
  slug: string;
  overallMatch: number;
  sponsored: boolean;
  tags: string[];
  robotTypes?: RobotType[];
  acquisitionModels?: AcquisitionModel[];
  score?: PublicMatchScore;
  shortDescription?: string;
  clickUrl: string;
  profileUrl: string;
  logoUrl?: string;
}

export interface PublicCleaningRoiSummary {
  viability: CleaningRoiViability;
  robotCount: number;
  monthlyNet: MoneyRange;
}

export interface PublicCleaningRoiFull extends PublicCleaningRoiSummary {
  coverageSqMPerOuting: number;
  weeklyFloorHours: number;
  weeklyHoursDisplaced: number;
  monthlyLaborSavings: number;
  monthlyRobotCost: MoneyRange;
  paybackMonths: MoneyRange | null;
  assumptions: string[];
  notes: string[];
}

export interface PublicMatchExplanation {
  summary: string;
  robotChoiceReasons: string[];
  acquisitionReasons: string[];
  cautions: string[];
  vendorChoiceReasons?: string[];
  runnerUpComparison?: string[];
}

export interface PublicMatchAttribution {
  required: boolean;
  link: string;
  text: string;
}

export interface PublicMatchResponse {
  matchId: string;
  tier: ApiTier;
  category: RobotCategory;
  matchConfidence: MatchConfidence;
  acquisitionRecommendation: AcquisitionModel;
  bestRobotMatch: PublicRobotMatch;
  runnerUpRobotMatch?: PublicRobotMatch;
  bestLowUpfrontMatch?: PublicRobotMatch;
  bestLongTermRoiMatch?: PublicRobotMatch;
  allRobotMatches?: PublicRobotMatch[];
  explanation: PublicMatchExplanation;
  vendorMatches: PublicVendorMatch[];
  vendorsLowConfidence: boolean;
  vendorExclusionReasons?: string[];
  fleetSizingHint?: string;
  cleaningRoi?: PublicCleaningRoiSummary | PublicCleaningRoiFull;
  attribution: PublicMatchAttribution;
}
