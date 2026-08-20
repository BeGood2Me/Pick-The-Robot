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
import { categoryGuideHref, homeMatcherHref } from '@/lib/content/navigation';
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

/** Avoid “Serving robot robots” — labels ending in “robot” become plural robots. */
function pluralRobotPhrase(label: string): string {
  if (/\brobots\b/i.test(label)) return label;
  if (/\brobot\b/i.test(label)) return label.replace(/\brobot\b/i, 'robots');
  return `${label} robots`;
}

function shortEnvironmentName(environment: PseoEnvironment): string {
  const shortNames: Record<string, string> = {
    'ecommerce-warehouse': 'e-commerce fulfillment',
    'third-party-logistics-warehouse': '3PL warehouses',
    'manufacturing-plant': 'manufacturing plants',
    'grocery-cold-chain-dc': 'grocery & cold-chain DCs',
    'office-retail-floors': 'retail & offices',
    'hospital-healthcare-floors': 'hospitals & healthcare',
    'warehouse-distribution-floors': 'warehouse floors',
    'full-service-restaurant': 'full-service restaurants',
    'quick-service-food-hall': 'QSR & food halls',
  };
  return shortNames[environment.id] ?? environment.name;
}

type BestForCopy = { title: string; h1: string; metaDescription: string };

function clipMeta(meta: string): string {
  return meta.length > 160 ? `${meta.slice(0, 157)}…` : meta;
}

/** Long-tail SEO copy: title ≈ H1 ≈ primary query; meta ≤ ~160 chars. */
function buildBestForCopy(
  robotType: RobotType,
  robotPhrase: string,
  environment: PseoEnvironment,
  year: number,
): BestForCopy {
  const key = `${robotType}:${environment.id}`;
  const byCombo: Record<string, BestForCopy> = {
    'amr:ecommerce-warehouse': {
      title: `Best AMR for e-commerce fulfillment (${year})`,
      h1: `Best AMRs for e-commerce fulfillment (${year})`,
      metaDescription: `Best AMRs for e-commerce fulfillment (${year}): vendor shortlist, RaaS vs buy, and when AGVs win instead. Free matcher.`,
    },
    'agv:ecommerce-warehouse': {
      title: `Best AGV for e-commerce warehouses (${year})`,
      h1: `Best AGVs for e-commerce warehouses (${year})`,
      metaDescription: `Best AGVs for e-commerce warehouses (${year}): fixed-route fit, infrastructure cost, and when AMRs win. Free matcher.`,
    },
    'picking_assist:ecommerce-warehouse': {
      title: `Best pick-assist robot for e-commerce (${year})`,
      h1: `Best pick-assist robots for e-commerce (${year})`,
      metaDescription: `Best pick-assist robots for e-commerce (${year}): collaborative picking vendors, WMS fit, and pilot cues. Free matcher.`,
    },
    'amr:third-party-logistics-warehouse': {
      title: `Best AMR for 3PL warehouses (${year})`,
      h1: `Best AMRs for 3PL warehouses (${year})`,
      metaDescription: `Best AMRs for 3PL warehouses (${year}): flexible fleets for multi-client DCs, pilots, and seasonal peaks. Free matcher.`,
    },
    'picking_assist:third-party-logistics-warehouse': {
      title: `Best pick-assist for 3PL warehouses (${year})`,
      h1: `Best pick-assist robots for 3PL warehouses (${year})`,
      metaDescription: `Best pick-assist robots for 3PL warehouses (${year}): multi-client fulfillment, WMS fit, and seasonal ramp. Free matcher.`,
    },
    'agv:third-party-logistics-warehouse': {
      title: `Best AGV for 3PL warehouses (${year})`,
      h1: `Best AGVs for 3PL warehouses (${year})`,
      metaDescription: `Best AGVs for 3PL warehouses (${year}): stable dock lanes vs flexible AMRs for changing clients. Free matcher.`,
    },
    'pallet_mover:third-party-logistics-warehouse': {
      title: `Best pallet mover for 3PL warehouses (${year})`,
      h1: `Best pallet movers for 3PL warehouses (${year})`,
      metaDescription: `Best pallet movers for 3PL warehouses (${year}): inbound/outbound pallets, aisle fit, and vendor shortlist. Free matcher.`,
    },
    'agv:manufacturing-plant': {
      title: `Best AGV for manufacturing plants (${year})`,
      h1: `Best AGVs for manufacturing plants (${year})`,
      metaDescription: `Best AGVs for manufacturing plants (${year}): line-side delivery, stable routes, and when AMRs fit better. Free matcher.`,
    },
    'pallet_mover:manufacturing-plant': {
      title: `Best pallet mover for manufacturing (${year})`,
      h1: `Best pallet movers for manufacturing plants (${year})`,
      metaDescription: `Best pallet movers for manufacturing plants (${year}): dock-to-line moves, safety zoning, vendor shortlist. Free matcher.`,
    },
    'amr:manufacturing-plant': {
      title: `Best AMR for manufacturing plants (${year})`,
      h1: `Best AMRs for manufacturing plants (${year})`,
      metaDescription: `Best AMRs for manufacturing plants (${year}): ad-hoc WIP transport when fixed AGV loops are overkill. Free matcher.`,
    },
    'amr:grocery-cold-chain-dc': {
      title: `Best AMR for grocery & cold-chain DCs (${year})`,
      h1: `Best AMRs for grocery & cold-chain DCs (${year})`,
      metaDescription: `Best AMRs for grocery & cold-chain DCs (${year}): wave transport, temperature caveats, vendor shortlist. Free matcher.`,
    },
    'agv:grocery-cold-chain-dc': {
      title: `Best AGV for grocery & cold-chain DCs (${year})`,
      h1: `Best AGVs for grocery & cold-chain DCs (${year})`,
      metaDescription: `Best AGVs for grocery & cold-chain DCs (${year}): fixed dock lanes, hygiene, and temperature fit. Free matcher.`,
    },
    'pallet_mover:grocery-cold-chain-dc': {
      title: `Best pallet mover for grocery DCs (${year})`,
      h1: `Best pallet movers for grocery & cold-chain DCs (${year})`,
      metaDescription: `Best pallet movers for grocery DCs (${year}): outbound waves, dock congestion, and vendor shortlist. Free matcher.`,
    },
    'office_cleaner:office-retail-floors': {
      title: `Best office cleaning robot for retail & offices (${year})`,
      h1: `Best office cleaning robots for retail & offices (${year})`,
      metaDescription: `Best office cleaning robots for retail & offices (${year}): compact autonomous cleaners, vendors, and when to use scrubbers.`,
    },
    'large_scrubber:hospital-healthcare-floors': {
      title: `Best scrubber robot for hospitals (${year})`,
      h1: `Best scrubber robots for hospitals & healthcare (${year})`,
      metaDescription: `Best autonomous scrubbers for hospitals (${year}): corridor coverage, overnight runs, vendor shortlist. Free matcher.`,
    },
    'office_cleaner:hospital-healthcare-floors': {
      title: `Best cleaning robot for clinics & hospitals (${year})`,
      h1: `Best office cleaners for clinics & hospitals (${year})`,
      metaDescription: `Best compact cleaning robots for clinics & hospitals (${year}): admin wings, mapping, staff handoff. Free matcher.`,
    },
    'industrial_cleaner:hospital-healthcare-floors': {
      title: `Best industrial cleaner for hospitals (${year})`,
      h1: `Best industrial cleaners for healthcare support areas (${year})`,
      metaDescription: `Best industrial floor cleaners for hospital docks & service corridors (${year}): heavy soil, vendor shortlist.`,
    },
    'large_scrubber:warehouse-distribution-floors': {
      title: `Best scrubber for warehouse floors (${year})`,
      h1: `Best scrubber robots for warehouse floors (${year})`,
      metaDescription: `Best autonomous scrubbers for warehouse floors (${year}): concrete dust, dock soil, RaaS vs buy. Free matcher.`,
    },
    'industrial_cleaner:warehouse-distribution-floors': {
      title: `Best industrial cleaner for warehouses (${year})`,
      h1: `Best industrial cleaners for warehouse floors (${year})`,
      metaDescription: `Best industrial floor cleaners for warehouses (${year}): heavy soil, rugged floors, vendor shortlist. Free matcher.`,
    },
    'serving_robot:full-service-restaurant': {
      title: `Best serving robot for full-service restaurants (${year})`,
      h1: `Best serving robots for full-service restaurants (${year})`,
      metaDescription: `Best serving robots for full-service restaurants (${year}): aisle fit, peak running, lease vs RaaS. Free matcher.`,
    },
    'serving_robot:quick-service-food-hall': {
      title: `Best serving robot for QSR & food halls (${year})`,
      h1: `Best serving robots for QSR & food halls (${year})`,
      metaDescription: `Best serving robots for QSR & food halls (${year}): shared paths, lease/RaaS pilots, vendor shortlist. Free matcher.`,
    },
    'bussing_robot:quick-service-food-hall': {
      title: `Best bussing robot for food halls (${year})`,
      h1: `Best bussing robots for QSR & food halls (${year})`,
      metaDescription: `Best bussing robots for food halls (${year}): table turn, path fit, lease vs labour. Free matcher.`,
    },
  };

  const override = byCombo[key];
  if (override) {
    return { ...override, metaDescription: clipMeta(override.metaDescription) };
  }

  const envTitle = shortEnvironmentName(environment);
  const title = `Best ${robotPhrase} for ${envTitle} (${year})`;
  const metaDescription = clipMeta(
    `Best ${robotPhrase} for ${envTitle} (${year}) — compare vendors, cost models, and next steps with the free matcher.`,
  );
  return { title, h1: title, metaDescription };
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
  const robotPhrase = pluralRobotPhrase(robotTypeLabel);
  const { h1, title, metaDescription } = buildBestForCopy(
    robotType,
    robotPhrase,
    environment,
    year,
  );

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
    metaDescription,
    matcherHref: homeMatcherHref(environment.category),
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
