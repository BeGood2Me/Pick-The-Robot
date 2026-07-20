import type { RobotCategory, RobotType } from '@/lib/matching';

/**
 * pSEO environment / facility-type records.
 * Add a new environment JSON entry, then allowlist a combo in page-combos.json
 * (and ensure ≥2 vendors support that robotType in that category).
 */
export interface PseoEnvironment {
  id: string;
  name: string;
  description: string;
  floorAreaBand: string;
  trafficPattern: string;
  priorityKpis: string[];
  category: RobotCategory;
  /** Short intro used under the H1 on best-for pages. */
  pageIntro: string;
}

/**
 * Workflow / use-case attached to environments + robot types.
 * Add entries referencing environmentIds and a robotType from the matcher taxonomy.
 */
export interface PseoUseCase {
  id: string;
  name: string;
  robotType: RobotType;
  environmentIds: string[];
  summary: string;
  priority: number;
  kpis: string[];
}

export interface PseoFaq {
  question: string;
  answer: string;
}

/**
 * Allowlisted page combinations. Only these routes are generated,
 * and only if ≥2 vendors match robotType + category.
 */
export interface PseoPageCombo {
  robotType: RobotType;
  environmentId: string;
  /** Optional page-specific FAQs; falls back to environment-level defaults in loader. */
  faqs?: PseoFaq[];
}

/** Software / platform catalog for integration pages. */
export type PseoSoftwareCategory =
  | 'WMS'
  | 'ERP'
  | 'fleetManager'
  | 'analytics'
  | 'integrationPlatform'
  | 'facilitiesOps';

export interface PseoSoftwareAffiliate {
  hasAffiliate: boolean;
  programName?: string;
  trackingUrl?: string;
}

/**
 * Add software in software.json, then allowlist vendor×software pairs in integration-combos.json.
 */
export interface PseoSoftware {
  id: string;
  name: string;
  category: PseoSoftwareCategory;
  description: string;
  pricingHint: string;
  websiteUrl: string;
  affiliate?: PseoSoftwareAffiliate;
}

/**
 * Allowlisted vendor × software integration pages.
 * Requires non-empty summary, ≥3 setupSteps, ≥3 faqs to publish.
 */
export interface PseoIntegrationCombo {
  vendorSlug: string;
  softwareId: string;
  environmentIds: string[];
  summary: string;
  architectureNotes: string[];
  setupSteps: string[];
  faqs: PseoFaq[];
}

/**
 * Descriptive cost bands for best-for pages (not quotes).
 * Keep aligned with guides.ts / category priceRanges.
 */
export interface PseoCostBand {
  robotType: RobotType;
  purchaseBand: string;
  monthlyBand: string;
  costDrivers: string[];
  caveat: string;
}
