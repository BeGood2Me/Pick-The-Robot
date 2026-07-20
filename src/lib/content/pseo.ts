import environmentsData from '@/data/pseo/environments.json';
import useCasesData from '@/data/pseo/use-cases.json';
import pageCombosData from '@/data/pseo/page-combos.json';
import costBandsData from '@/data/pseo/cost-bands.json';
import type {
  PseoCostBand,
  PseoEnvironment,
  PseoFaq,
  PseoPageCombo,
  PseoUseCase,
} from '@/lib/content/pseo-types';
import { ROBOT_TYPE_INFO } from '@/lib/content/categories';
import { categoryGuideHref, CATEGORY_ROUTES } from '@/lib/content/navigation';
import {
  ACQUISITION_LABELS,
  type RobotCategory,
  type RobotType,
  type Vendor,
} from '@/lib/matching';
import { VENDORS, compareVendorsForDisplay } from '@/lib/matching/vendors';

/** Minimum vendors required to publish a best-for page. */
export const MIN_VENDORS_FOR_PAGE = 2;

/** Max vendor cards / table rows on a best-for page. */
export const MAX_VENDORS_ON_PAGE = 5;

/** Minimum cost-driver bullets for a usable cost snapshot. */
export const MIN_COST_DRIVERS = 3;

const COST_GUIDE_BY_CATEGORY: Record<RobotCategory, { href: string; label: string }> = {
  warehouse: { href: '/warehouse-robot-cost', label: 'Warehouse robot cost guide' },
  cleaning: { href: '/cleaning-robot-cost', label: 'Cleaning robot cost guide' },
  restaurant: { href: '/raas-pricing', label: 'RaaS pricing guide' },
};

export const BEST_HUB_PATH = '/best';

export function bestForPath(robotType: RobotType, environmentId: string): string {
  return `${BEST_HUB_PATH}/${robotType}/${environmentId}`;
}

export function getAllEnvironments(): PseoEnvironment[] {
  return environmentsData as PseoEnvironment[];
}

export function getEnvironmentById(id: string): PseoEnvironment | undefined {
  return getAllEnvironments().find((env) => env.id === id);
}

export function getAllUseCases(): PseoUseCase[] {
  return useCasesData as PseoUseCase[];
}

export function getAllPageCombos(): PseoPageCombo[] {
  return pageCombosData as PseoPageCombo[];
}

export function getVendorsForBestPage(
  category: RobotCategory,
  robotType: RobotType,
): Vendor[] {
  return VENDORS.filter(
    (v) => v.categories.includes(category) && v.robotTypes.includes(robotType),
  )
    .sort(compareVendorsForDisplay)
    .slice(0, MAX_VENDORS_ON_PAGE);
}

export function comboHasEnoughVendors(combo: PseoPageCombo): boolean {
  const env = getEnvironmentById(combo.environmentId);
  if (!env) return false;
  const count = VENDORS.filter(
    (v) => v.categories.includes(env.category) && v.robotTypes.includes(combo.robotType),
  ).length;
  return count >= MIN_VENDORS_FOR_PAGE;
}

/** Allowlisted combos that pass the thin-page vendor gate. */
export function getPublishableCombos(): PseoPageCombo[] {
  return getAllPageCombos().filter(comboHasEnoughVendors);
}

export function getUseCasesForPage(
  robotType: RobotType,
  environmentId: string,
): PseoUseCase[] {
  return getAllUseCases()
    .filter(
      (uc) =>
        uc.robotType === robotType && uc.environmentIds.includes(environmentId),
    )
    .sort((a, b) => a.priority - b.priority);
}

export interface ResolvedBestForPage {
  robotType: RobotType;
  robotTypeLabel: string;
  environment: PseoEnvironment;
  vendors: Vendor[];
  useCases: PseoUseCase[];
  faqs: PseoFaq[];
  costBand: PseoCostBand | null;
  path: string;
  h1: string;
  title: string;
  metaDescription: string;
  matcherHref: string;
  categoryGuideHref: string;
  costGuide: { href: string; label: string };
  year: number;
}

function defaultFaqs(robotTypeLabel: string, environmentName: string): PseoFaq[] {
  return [
    {
      question: `How do I choose among ${robotTypeLabel} options for ${environmentName}?`,
      answer:
        'Shortlist vendors that support your robot type and facility category, then run the PickTheRobot matcher with your labour, layout, and budget inputs for a scored recommendation.',
    },
    {
      question: 'Is this a quote or a guarantee?',
      answer:
        'No. PickTheRobot is a buyer-side research tool. Vendor lists and ranges are for research only—confirm pricing, safety, and deployment with vendors.',
    },
  ];
}

export function resolveBestForPage(
  robotType: RobotType,
  environmentId: string,
): ResolvedBestForPage | null {
  const combo = getAllPageCombos().find(
    (c) => c.robotType === robotType && c.environmentId === environmentId,
  );
  if (!combo || !comboHasEnoughVendors(combo)) return null;

  const environment = getEnvironmentById(environmentId);
  if (!environment) return null;

  const vendors = getVendorsForBestPage(environment.category, robotType);
  if (vendors.length < MIN_VENDORS_FOR_PAGE) return null;

  const robotTypeLabel = ROBOT_TYPE_INFO[robotType]?.label ?? robotType;
  const year = new Date().getFullYear();
  const path = bestForPath(robotType, environmentId);
  const h1 = `Best ${robotTypeLabel} robots for ${environment.name} in ${year}`;
  const title = `${h1}`;
  const metaDescription = `${environment.pageIntro.slice(0, 140).trim()}… Compare vendors, workflows, and next steps.`;

  return {
    robotType,
    robotTypeLabel,
    environment,
    vendors,
    useCases: getUseCasesForPage(robotType, environmentId),
    faqs: combo.faqs?.length ? combo.faqs : defaultFaqs(robotTypeLabel, environment.name),
    costBand: getCostBand(robotType),
    path,
    h1,
    title,
    metaDescription:
      metaDescription.length > 160
        ? `${metaDescription.slice(0, 157)}…`
        : metaDescription,
    matcherHref: `${CATEGORY_ROUTES[environment.category]}#matcher`,
    categoryGuideHref: categoryGuideHref(environment.category),
    costGuide: COST_GUIDE_BY_CATEGORY[environment.category],
    year,
  };
}

export function getAllCostBands(): PseoCostBand[] {
  return costBandsData as PseoCostBand[];
}

export function getCostBand(robotType: RobotType): PseoCostBand | null {
  const band = getAllCostBands().find((b) => b.robotType === robotType);
  if (!band) return null;
  if (!band.purchaseBand?.trim() || !band.monthlyBand?.trim()) return null;
  if (!Array.isArray(band.costDrivers) || band.costDrivers.length < MIN_COST_DRIVERS) return null;
  if (!band.caveat?.trim()) return null;
  return band;
}

/** Cost band for a resolved best-for page (null if missing/thin). */
export function resolveCostBandForPage(page: ResolvedBestForPage): PseoCostBand | null {
  return page.costBand ?? getCostBand(page.robotType);
}

export function getHubEntries(): ResolvedBestForPage[] {
  return getPublishableCombos()
    .map((c) => resolveBestForPage(c.robotType, c.environmentId))
    .filter((page): page is ResolvedBestForPage => page !== null);
}

export function formatAcquisitionModels(vendor: Vendor): string {
  return vendor.acquisitionModelsSupported.map((m) => ACQUISITION_LABELS[m]).join(', ');
}

export function vendorPrimaryTask(vendor: Vendor, robotType: RobotType): string {
  const typed = vendor.bestFor[0];
  if (typed) return typed;
  const info = ROBOT_TYPE_INFO[robotType];
  return info?.bestFor[0] ?? vendor.shortDescription;
}

export function vendorCapacitySummary(vendor: Vendor): string {
  const size =
    vendor.idealFacilitySize === 'small'
      ? 'Smaller sites'
      : vendor.idealFacilitySize === 'large'
        ? 'Large facilities'
        : 'Mid-size facilities';
  const budget =
    vendor.budgetTier === 'entry'
      ? 'entry budget'
      : vendor.budgetTier === 'premium'
        ? 'premium budget'
        : 'mid-market budget';
  return `${size}; ${budget}; ${vendor.deploymentComplexity} deployment complexity`;
}
