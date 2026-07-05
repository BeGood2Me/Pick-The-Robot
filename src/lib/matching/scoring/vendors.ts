import type {
  AcquisitionModel,
  PartialMatchScore,
  RobotType,
  UserProfile,
  Vendor,
} from '../types';
import { MATCH_THRESHOLDS } from '../types';
import {
  budgetTierFit,
  clamp,
  computeOverallMatch,
  deploymentComplexityFit,
  facilitySizeFit,
  restaurantScaleProxy,
} from './shared';

export function getVendorExclusionReason(
  profile: UserProfile,
  vendor: Vendor,
  chosenRobotType: RobotType,
  chosenAcquisition: AcquisitionModel,
): string | null {
  if (!vendor.categories.includes(profile.category)) {
    return `${vendor.name} does not serve ${profile.category} robotics.`;
  }
  if (!vendor.robotTypes.includes(chosenRobotType)) {
    return `${vendor.name} does not offer your recommended robot type.`;
  }
  if (!vendor.acquisitionModelsSupported.includes(chosenAcquisition)) {
    return `${vendor.name} does not support your recommended acquisition model (${chosenAcquisition}).`;
  }
  if (profile.region && !vendor.regions.includes(profile.region)) {
    return `${vendor.name} does not list ${profile.region} in supported regions.`;
  }
  if (profile.category === 'restaurant' && profile.seatsPerDay) {
    if (vendor.minCoversPerDay && profile.seatsPerDay < vendor.minCoversPerDay) {
      return `${vendor.name} typically targets venues above ${vendor.minCoversPerDay} covers/day.`;
    }
    if (vendor.maxCoversPerDay && profile.seatsPerDay > vendor.maxCoversPerDay) {
      return `${vendor.name} typically targets venues below ${vendor.maxCoversPerDay} covers/day.`;
    }
  }
  return null;
}

export function scoreVendorForProfile(
  profile: UserProfile,
  vendor: Vendor,
  chosenRobotType: RobotType,
  chosenAcquisition: AcquisitionModel,
): {
  score: import('../types').MatchScore;
  overallMatch: number;
  tags: string[];
  exclusionReason: string | null;
} {
  const tags: string[] = [];
  let useCaseFit = 40;
  let economicFit = 50;
  let deploymentFit = 50;

  if (vendor.categories.includes(profile.category)) {
    useCaseFit += 25;
    tags.push('category_match');
  } else {
    useCaseFit -= 30;
  }

  if (vendor.robotTypes.includes(chosenRobotType)) {
    useCaseFit += 25;
    tags.push('robot_type_match');
  } else {
    useCaseFit -= 25;
  }

  if (vendor.acquisitionModelsSupported.includes(chosenAcquisition)) {
    economicFit += 20;
    tags.push('acquisition_supported');
  } else {
    economicFit -= 30;
  }

  economicFit = (economicFit + budgetTierFit(profile.budgetPreference, vendor.budgetTier)) / 2;

  deploymentFit = deploymentComplexityFit(profile.techReadiness, vendor.deploymentComplexity);

  const profileSize =
    profile.category === 'warehouse'
      ? profile.facilitySizeSqM
      : profile.category === 'cleaning'
        ? profile.floorAreaSqM
        : restaurantScaleProxy(profile.seatsPerDay, profile.tableCount);

  const sizeFit = facilitySizeFit(profileSize, vendor.idealFacilitySize, profile.category);
  useCaseFit = (useCaseFit + sizeFit) / 2;

  if (profile.category === 'restaurant' && profile.seatsPerDay) {
    if (vendor.minCoversPerDay && profile.seatsPerDay < vendor.minCoversPerDay) {
      useCaseFit -= 20;
      tags.push('below_vendor_cover_range');
    } else if (vendor.maxCoversPerDay && profile.seatsPerDay > vendor.maxCoversPerDay) {
      useCaseFit -= 20;
      tags.push('above_vendor_cover_range');
    }
  }

  if (profile.region && vendor.regions.includes(profile.region)) {
    deploymentFit += 10;
    tags.push('region_match');
  } else if (profile.region && !vendor.regions.includes(profile.region)) {
    deploymentFit -= 8;
  }

  if (vendor.sponsored) {
    tags.push('sponsored');
  }

  const partial: PartialMatchScore = {
    useCaseFit: clamp(useCaseFit),
    economicFit: clamp(economicFit),
    deploymentFit: clamp(deploymentFit),
  };

  let overallMatch = computeOverallMatch(partial);

  if (vendor.sponsored && overallMatch >= 40) {
    overallMatch = clamp(overallMatch + MATCH_THRESHOLDS.sponsoredBoost);
  }

  const exclusionReason =
    overallMatch < MATCH_THRESHOLDS.vendorMin
      ? getVendorExclusionReason(profile, vendor, chosenRobotType, chosenAcquisition)
      : null;

  return {
    score: { ...partial, overallMatch },
    overallMatch,
    tags,
    exclusionReason,
  };
}
