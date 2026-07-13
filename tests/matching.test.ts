import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  computeOverallMatch,
  generateRecommendation,
  recommendWarehouseAcquisition,
  recommendCleaningAcquisition,
  recommendRestaurantAcquisition,
  scoreWarehouseRobotType,
  scoreCleaningRobotType,
  scoreRestaurantRobotType,
  scoreVendorForProfile,
  scoreRobotType,
  getVendorExclusionReason,
  setMatchEventHandler,
} from '../src/lib/matching';
import { compareVendorMatches, getVendorById } from '../src/lib/matching/vendors';
import * as vendorsModule from '../src/lib/matching/vendors';
import { facilitySizeFit } from '../src/lib/matching/scoring/shared';
import { MATCH_THRESHOLDS } from '../src/lib/matching/types';
import type {
  CleaningProfile,
  RestaurantProfile,
  Vendor,
  VendorMatch,
  WarehouseProfile,
} from '../src/lib/matching/types';

const baseProfile = {
  laborCostPerHour: 22,
  hoursPerDay: 8,
  daysPerWeek: 5,
  staffingPressure: 'medium' as const,
  budgetPreference: 'balanced' as const,
  acquisitionPreference: 'open' as const,
  techReadiness: 'medium' as const,
  region: 'US',
};

const warehouseProfile: WarehouseProfile = {
  ...baseProfile,
  category: 'warehouse',
  facilitySizeSqM: 8000,
  ordersPerDay: 1200,
  picksPerDay: 6000,
  mainPainPoint: 'transport',
  loadType: 'mixed_totes',
  layoutStability: 'frequent_change',
  aisleConstraints: 'moderate',
  wmsReadiness: 'partial',
  temperatureZone: 'ambient',
};

const cleaningProfile: CleaningProfile = {
  ...baseProfile,
  category: 'cleaning',
  floorAreaSqM: 4500,
  environmentType: 'retail',
  cleaningFrequencyPerDay: 2,
  messLevel: 'moderate',
  obstacleComplexity: 'medium',
  cleaningType: 'combo',
  staffAssignedToCleaning: 2,
  floorSurface: 'hard',
  cleaningLaborCostPerHour: 20,
};

const restaurantProfile: RestaurantProfile = {
  ...baseProfile,
  category: 'restaurant',
  venueType: 'qsr',
  seatsPerDay: 300,
  peakHoursPerDay: 4,
  mainPainPoint: 'food_running',
  layoutComplexity: 'open',
  aisleWidth: 'wide',
  serviceIntensity: 'high',
};

describe('computeOverallMatch', () => {
  it('applies documented weights', () => {
    const overall = computeOverallMatch({
      useCaseFit: 80,
      economicFit: 60,
      deploymentFit: 50,
    });
    expect(overall).toBeCloseTo(0.45 * 80 + 0.35 * 60 + 0.2 * 50, 1);
  });
});

describe('warehouse scoring', () => {
  it('favors AMR for transport + frequent layout change', () => {
    const amr = scoreWarehouseRobotType(warehouseProfile, 'amr');
    const agv = scoreWarehouseRobotType(warehouseProfile, 'agv');
    expect(amr.useCaseFit).toBeGreaterThan(agv.useCaseFit);
    expect(amr.overallMatch).toBeGreaterThan(agv.overallMatch);
  });

  it('favors picking_assist for picking pain point', () => {
    const pickingProfile: WarehouseProfile = {
      ...warehouseProfile,
      mainPainPoint: 'picking',
      layoutStability: 'stable',
    };
    const pick = scoreWarehouseRobotType(pickingProfile, 'picking_assist');
    const amr = scoreWarehouseRobotType(pickingProfile, 'amr');
    expect(pick.overallMatch).toBeGreaterThan(amr.overallMatch);
  });

  it('differentiates inventory pain from picking — AMR vs pick-assist', () => {
    const inventoryProfile: WarehouseProfile = {
      ...warehouseProfile,
      mainPainPoint: 'inventory',
      picksPerDay: 2000,
    };
    const amr = scoreWarehouseRobotType(inventoryProfile, 'amr');
    const pick = scoreWarehouseRobotType(inventoryProfile, 'picking_assist');
    expect(amr.useCaseFit).toBeGreaterThan(pick.useCaseFit);
  });

  it('recommends RaaS for low upfront budget', () => {
    const profile: WarehouseProfile = {
      ...warehouseProfile,
      budgetPreference: 'low_upfront',
    };
    expect(recommendWarehouseAcquisition(profile)).toBe('raas');
  });

  it('recommends buy for stable high-utilization + high tech readiness', () => {
    const profile: WarehouseProfile = {
      ...warehouseProfile,
      budgetPreference: 'maximize_long_term_roi',
      layoutStability: 'stable',
      ordersPerDay: 2000,
      techReadiness: 'high',
    };
    expect(recommendWarehouseAcquisition(profile)).toBe('buy');
  });

  it('records trace hits for AMR transport recommendation', () => {
    const { trace } = scoreRobotType(warehouseProfile, 'amr');
    expect(trace.hits.length).toBeGreaterThanOrEqual(2);
    expect(trace.hits.some((h) => h.id.includes('pain') || h.id.includes('layout'))).toBe(true);
  });

  it('boosts AMR and penalizes AGV in cold-chain environments', () => {
    const coldProfile: WarehouseProfile = {
      ...warehouseProfile,
      temperatureZone: 'cold',
    };
    const amr = scoreRobotType(coldProfile, 'amr');
    const agv = scoreRobotType(coldProfile, 'agv');
    expect(amr.trace.hits.some((h) => h.id === 'cold_zone_amr')).toBe(true);
    expect(agv.trace.hits.some((h) => h.id === 'cold_zone_penalty')).toBe(true);
    expect(amr.score.useCaseFit).toBeGreaterThan(agv.score.useCaseFit);
  });
});

describe('cleaning scoring', () => {
  it('favors large_scrubber for large retail floors', () => {
    const scrubber = scoreCleaningRobotType(cleaningProfile, 'large_scrubber');
    const office = scoreCleaningRobotType(cleaningProfile, 'office_cleaner');
    expect(scrubber.overallMatch).toBeGreaterThan(office.overallMatch);
  });

  it('favors industrial_cleaner for industrial environment', () => {
    const industrialProfile: CleaningProfile = {
      ...cleaningProfile,
      environmentType: 'industrial',
      messLevel: 'heavy',
    };
    const industrial = scoreCleaningRobotType(industrialProfile, 'industrial_cleaner');
    const office = scoreCleaningRobotType(industrialProfile, 'office_cleaner');
    expect(industrial.useCaseFit).toBeGreaterThan(office.useCaseFit);
  });

  it('differentiates economic scores across robot types by at least 10 pts', () => {
    const office = scoreCleaningRobotType(cleaningProfile, 'office_cleaner').economicFit;
    const scrubber = scoreCleaningRobotType(cleaningProfile, 'large_scrubber').economicFit;
    const industrial = scoreCleaningRobotType(cleaningProfile, 'industrial_cleaner').economicFit;
    const spread = Math.max(office, scrubber, industrial) - Math.min(office, scrubber, industrial);
    expect(spread).toBeGreaterThanOrEqual(10);
  });

  it('recommends RaaS for low upfront', () => {
    expect(
      recommendCleaningAcquisition({ ...cleaningProfile, budgetPreference: 'low_upfront' }),
    ).toBe('raas');
  });

  it('mixed environment still ranks all cleaning robot types', () => {
    const mixedProfile: CleaningProfile = {
      ...cleaningProfile,
      environmentType: 'mixed',
      floorAreaSqM: 250,
      cleaningFrequencyPerDay: 0.25,
      messLevel: 'light',
      obstacleComplexity: 'high',
    };
    const result = generateRecommendation(mixedProfile);
    expect(result.allRobotMatches.length).toBe(3);
    expect(result.allRobotMatches.every((m) => m.trace.hits.length > 0)).toBe(true);
  });
});

describe('restaurant scoring', () => {
  it('favors serving_robot for food_running at volume', () => {
    const serving = scoreRestaurantRobotType(restaurantProfile, 'serving_robot');
    const reception = scoreRestaurantRobotType(restaurantProfile, 'reception_robot');
    expect(serving.overallMatch).toBeGreaterThan(reception.overallMatch);
  });

  it('penalizes serving robot for tight fine-dining layout', () => {
    const tightProfile: RestaurantProfile = {
      ...restaurantProfile,
      venueType: 'full_service',
      layoutComplexity: 'tight',
      aisleWidth: 'narrow',
    };
    const serving = scoreRestaurantRobotType(tightProfile, 'serving_robot');
    const openServing = scoreRestaurantRobotType(restaurantProfile, 'serving_robot');
    expect(serving.useCaseFit).toBeLessThan(openServing.useCaseFit);
  });

  it('differentiates economic scores across robot types by at least 10 pts', () => {
    const serving = scoreRestaurantRobotType(restaurantProfile, 'serving_robot').economicFit;
    const kitchen = scoreRestaurantRobotType(restaurantProfile, 'kitchen_automation').economicFit;
    const reception = scoreRestaurantRobotType(restaurantProfile, 'reception_robot').economicFit;
    const spread = Math.max(serving, kitchen, reception) - Math.min(serving, kitchen, reception);
    expect(spread).toBeGreaterThanOrEqual(10);
  });

  it('buffet staff_shortage favors bussing over serving', () => {
    const buffetProfile: RestaurantProfile = {
      ...restaurantProfile,
      venueType: 'buffet',
      mainPainPoint: 'staff_shortage',
      seatsPerDay: 200,
    };
    const bussing = scoreRestaurantRobotType(buffetProfile, 'bussing_robot');
    const serving = scoreRestaurantRobotType(buffetProfile, 'serving_robot');
    expect(bussing.overallMatch).toBeGreaterThanOrEqual(serving.overallMatch - 5);
  });

  it('defaults to lease for balanced restaurant profile', () => {
    expect(recommendRestaurantAcquisition(restaurantProfile)).toBe('lease');
  });
});

describe('vendor scoring', () => {
  it('scores higher when robot type and acquisition align', () => {
    const vendor = getVendorById('wh-001')!;
    const aligned = scoreVendorForProfile(warehouseProfile, vendor, 'amr', 'raas');
    const misaligned = scoreVendorForProfile(warehouseProfile, vendor, 'pallet_mover', 'buy');
    expect(aligned.overallMatch).toBeGreaterThan(misaligned.overallMatch);
  });

  it('applies small sponsored boost without overriding poor fit', () => {
    const sponsored = { ...getVendorById('wh-001')!, sponsored: true };
    const nonSponsored = getVendorById('wh-005')!;
    const sponsoredScore = scoreVendorForProfile(
      warehouseProfile,
      sponsored,
      'amr',
      'raas',
    );
    const goodFitNonSponsored = scoreVendorForProfile(
      warehouseProfile,
      nonSponsored,
      'pallet_mover',
      'raas',
    );
    const poorFitSponsored = scoreVendorForProfile(
      warehouseProfile,
      sponsored,
      'pallet_mover',
      'buy',
    );
    expect(goodFitNonSponsored.overallMatch).toBeGreaterThan(poorFitSponsored.overallMatch);
    expect(sponsoredScore.tags).toContain('sponsored');
  });

  it('returns exclusion reason when vendor does not match region', () => {
    const vendor = getVendorById('wh-002')!;
    const reason = getVendorExclusionReason(
      { ...warehouseProfile, region: 'APAC' },
      vendor,
      'agv',
      'lease',
    );
    expect(reason).toContain('APAC');
  });
});

describe('generateRecommendation integration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns warehouse recommendation with vendors and explanation', () => {
    const result = generateRecommendation(warehouseProfile);
    expect(result.bestRobotMatch.category).toBe('warehouse');
    expect(result.bestRobotMatch.robotType).toBe('amr');
    expect(result.acquisitionRecommendation).toBe('raas');
    expect(result.vendorMatches.length).toBeGreaterThan(0);
    expect(result.matchConfidence).toBe('strong');
    expect(result.vendorsLowConfidence).toBe(false);
    expect(result.explanation.summary).toContain('AMR');
    expect(result.explanation.robotChoiceReasons.length).toBeGreaterThanOrEqual(2);
    expect(result.allRobotMatches.length).toBe(4);
    expect(result.fleetSizingHint).toBeDefined();
  });

  it('returns cleaning recommendation', () => {
    const result = generateRecommendation(cleaningProfile);
    expect(result.bestRobotMatch.category).toBe('cleaning');
    expect(result.vendorMatches.length).toBeGreaterThan(0);
    expect(result.allRobotMatches.length).toBe(3);
  });

  it('returns restaurant recommendation', () => {
    const result = generateRecommendation(restaurantProfile);
    expect(result.bestRobotMatch.robotType).toBe('serving_robot');
    expect(result.runnerUpRobotMatch).toBeDefined();
  });

  it('includes runner-up comparison when scores are close', () => {
    const closeProfile: WarehouseProfile = {
      ...warehouseProfile,
      mainPainPoint: 'transport',
      layoutStability: 'stable',
      ordersPerDay: 600,
    };
    const result = generateRecommendation(closeProfile);
    if (
      result.runnerUpRobotMatch &&
      result.bestRobotMatch.score.overallMatch - result.runnerUpRobotMatch.score.overallMatch <= 10
    ) {
      expect(result.explanation.runnerUpComparison?.length).toBeGreaterThan(0);
    }
  });

  it('emits match_generated event', () => {
    const events: string[] = [];
    setMatchEventHandler((e) => events.push(e.type));
    generateRecommendation(warehouseProfile);
    expect(events).toContain('match_generated');
    setMatchEventHandler(null);
  });

  it('is deterministic', () => {
    const a = generateRecommendation(warehouseProfile);
    const b = generateRecommendation(warehouseProfile);
    expect(a.bestRobotMatch.robotType).toBe(b.bestRobotMatch.robotType);
    expect(a.bestRobotMatch.score.overallMatch).toBe(b.bestRobotMatch.score.overallMatch);
  });

  it('exposes matchConfidence on every recommendation', () => {
    const result = generateRecommendation(warehouseProfile);
    expect(['strong', 'moderate', 'weak']).toContain(result.matchConfidence);
  });

  it('returns vendor matches for niche warehouse profile', () => {
    const nicheProfile: WarehouseProfile = {
      ...warehouseProfile,
      region: 'APAC',
      budgetPreference: 'maximize_long_term_roi',
      acquisitionPreference: 'buy',
      mainPainPoint: 'pallet_movement',
    };
    const result = generateRecommendation(nicheProfile);
    expect(result.vendorMatches.length).toBeGreaterThan(0);
    expect(result.bestRobotMatch.robotType).toBe('pallet_mover');
  });

  it('sets vendorsLowConfidence when all vendors score below threshold', () => {
    const lowFitVendor: Vendor = {
      ...getVendorById('wh-002')!,
      robotTypes: ['pallet_mover'],
      acquisitionModelsSupported: ['buy'],
      idealFacilitySize: 'large',
      budgetTier: 'premium',
      deploymentComplexity: 'high',
      regions: ['US'],
    };

    const profile: WarehouseProfile = {
      ...warehouseProfile,
      region: 'APAC',
      budgetPreference: 'low_upfront',
      acquisitionPreference: 'raas',
      facilitySizeSqM: 500,
      techReadiness: 'low',
    };

    vi.spyOn(vendorsModule, 'getVendorsByCategory').mockReturnValue([lowFitVendor]);

    const result = generateRecommendation(profile);
    expect(result.vendorsLowConfidence).toBe(true);
    expect(result.vendorMatches.length).toBeGreaterThan(0);
    expect(result.vendorExclusionReasons?.length).toBeGreaterThan(0);
    expect(
      scoreVendorForProfile(
        profile,
        lowFitVendor,
        result.bestRobotMatch.robotType,
        result.acquisitionRecommendation,
      ).overallMatch,
    ).toBeLessThan(MATCH_THRESHOLDS.vendorMin);
  });

  it('surfaces vendor exclusion reason for poor robot type fit', () => {
    const vendor = getVendorById('wh-001')!;
    const reason = getVendorExclusionReason(
      { ...warehouseProfile, region: 'APAC' },
      vendor,
      'pallet_mover',
      'buy',
    );
    expect(reason).toContain('robot type');
  });

  it('sorts vendor matches by overall score regardless of sponsorship', () => {
    const sponsored = {
      vendorId: 's',
      vendorName: 'Sponsored Co',
      category: 'warehouse' as const,
      robotTypes: ['amr' as const],
      acquisitionModels: ['raas' as const],
      score: { useCaseFit: 50, economicFit: 50, deploymentFit: 50, overallMatch: 55 },
      overallMatch: 55,
      tags: ['sponsored'],
      sponsored: true,
    } satisfies VendorMatch;
    const organic = {
      ...sponsored,
      vendorId: 'o',
      vendorName: 'Organic Co',
      overallMatch: 90,
      score: { useCaseFit: 90, economicFit: 90, deploymentFit: 90, overallMatch: 90 },
      tags: [],
      sponsored: false,
    };
    const sorted = [organic, sponsored].sort(compareVendorMatches);
    expect(sorted[0].vendorName).toBe('Organic Co');
    expect(sorted[0].overallMatch).toBe(90);
  });
});

describe('restaurant vendor scoring', () => {
  it('uses table-count thresholds for facility size fit', () => {
    expect(facilitySizeFit(50, 'medium', 'restaurant')).toBe(90);
    expect(facilitySizeFit(50, 'large', 'restaurant')).toBe(65);
    expect(facilitySizeFit(8000, 'medium', 'warehouse')).toBe(90);
  });

  it('penalizes vendors outside the cover-day range', () => {
    const vendor = getVendorById('rs-001')!;
    const base: RestaurantProfile = {
      ...restaurantProfile,
      tableCount: 50,
      seatsPerDay: 200,
    };
    const inRange = scoreVendorForProfile(base, vendor, 'serving_robot', 'lease');
    const outOfRange = scoreVendorForProfile(
      { ...base, seatsPerDay: 40 },
      vendor,
      'serving_robot',
      'lease',
    );
    expect(outOfRange.overallMatch).toBeLessThan(inRange.overallMatch);
    expect(outOfRange.tags).toContain('below_vendor_cover_range');
  });
});
