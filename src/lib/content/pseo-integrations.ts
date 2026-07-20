import softwareData from '@/data/pseo/software.json';
import integrationCombosData from '@/data/pseo/integration-combos.json';
import type {
  PseoEnvironment,
  PseoFaq,
  PseoIntegrationCombo,
  PseoSoftware,
  PseoSoftwareCategory,
} from '@/lib/content/pseo-types';
import { bestForPath, getEnvironmentById, getPublishableCombos } from '@/lib/content/pseo';
import { CATEGORY_ROUTES } from '@/lib/content/navigation';
import { ROBOT_TYPE_INFO } from '@/lib/content/categories';
import type { RobotCategory, Vendor } from '@/lib/matching';
import { getVendorBySlug } from '@/lib/matching/vendors';

/** Minimum setup steps and FAQs required to publish an integration page. */
export const MIN_SETUP_STEPS = 3;
export const MIN_INTEGRATION_FAQS = 3;

export const INTEGRATIONS_HUB_PATH = '/integrations';

export const SOFTWARE_CATEGORY_LABELS: Record<PseoSoftwareCategory, string> = {
  WMS: 'WMS',
  ERP: 'ERP',
  fleetManager: 'Fleet managers',
  analytics: 'Analytics',
  integrationPlatform: 'Integration platforms',
  facilitiesOps: 'Facilities / ops',
};

export function integrationPath(vendorSlug: string, softwareId: string): string {
  return `${INTEGRATIONS_HUB_PATH}/${vendorSlug}/${softwareId}`;
}

export function getAllSoftware(): PseoSoftware[] {
  return softwareData as PseoSoftware[];
}

export function getSoftwareById(id: string): PseoSoftware | undefined {
  return getAllSoftware().find((s) => s.id === id);
}

export function getAllIntegrationCombos(): PseoIntegrationCombo[] {
  return integrationCombosData as PseoIntegrationCombo[];
}

export function comboPassesThinGate(combo: PseoIntegrationCombo): boolean {
  if (!combo.summary?.trim()) return false;
  if (!Array.isArray(combo.setupSteps) || combo.setupSteps.length < MIN_SETUP_STEPS) return false;
  if (!Array.isArray(combo.faqs) || combo.faqs.length < MIN_INTEGRATION_FAQS) return false;
  if (!getVendorBySlug(combo.vendorSlug)) return false;
  if (!getSoftwareById(combo.softwareId)) return false;
  return true;
}

/** Allowlisted combos that resolve vendor + software and pass content gates. */
export function getPublishableIntegrationCombos(): PseoIntegrationCombo[] {
  return getAllIntegrationCombos().filter(comboPassesThinGate);
}

export interface RelatedBestLink {
  href: string;
  label: string;
}

export interface ResolvedIntegrationPage {
  combo: PseoIntegrationCombo;
  vendor: Vendor;
  software: PseoSoftware;
  environments: PseoEnvironment[];
  relatedBestPages: RelatedBestLink[];
  path: string;
  h1: string;
  title: string;
  metaDescription: string;
  matcherHref: string;
  vendorHref: string;
  showAffiliateCta: boolean;
  affiliateHref?: string;
  affiliateLabel?: string;
  year: number;
}

function relatedBestForCombo(
  vendor: Vendor,
  environmentIds: string[],
): RelatedBestLink[] {
  const publishable = getPublishableCombos();
  const links: RelatedBestLink[] = [];

  for (const envId of environmentIds) {
    const env = getEnvironmentById(envId);
    if (!env) continue;
    for (const combo of publishable) {
      if (combo.environmentId !== envId) continue;
      if (!vendor.robotTypes.includes(combo.robotType)) continue;
      if (!vendor.categories.includes(env.category)) continue;
      links.push({
        href: bestForPath(combo.robotType, combo.environmentId),
        label: `Best ${ROBOT_TYPE_INFO[combo.robotType]?.label ?? combo.robotType} for ${env.name}`,
      });
    }
  }

  const seen = new Set<string>();
  return links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}

export function resolveIntegrationPage(
  vendorSlug: string,
  softwareSlug: string,
): ResolvedIntegrationPage | null {
  const combo = getAllIntegrationCombos().find(
    (c) => c.vendorSlug === vendorSlug && c.softwareId === softwareSlug,
  );
  if (!combo || !comboPassesThinGate(combo)) return null;

  const vendor = getVendorBySlug(vendorSlug);
  const software = getSoftwareById(softwareSlug);
  if (!vendor || !software) return null;

  const environments = combo.environmentIds
    .map((id) => getEnvironmentById(id))
    .filter((e): e is PseoEnvironment => Boolean(e));

  const primaryCategory: RobotCategory =
    environments[0]?.category ?? vendor.categories[0] ?? 'warehouse';

  const year = new Date().getFullYear();
  const path = integrationPath(vendorSlug, softwareSlug);
  const h1 = `${vendor.name} + ${software.name} integration guide`;
  const title = `${h1} (${year})`;
  let metaDescription = combo.summary.trim();
  if (metaDescription.length > 160) {
    metaDescription = `${metaDescription.slice(0, 157)}…`;
  }

  const affiliate = software.affiliate;
  const showAffiliateCta = Boolean(affiliate?.hasAffiliate && affiliate.trackingUrl);

  return {
    combo,
    vendor,
    software,
    environments,
    relatedBestPages: relatedBestForCombo(vendor, combo.environmentIds),
    path,
    h1,
    title,
    metaDescription,
    matcherHref: `${CATEGORY_ROUTES[primaryCategory]}#matcher`,
    vendorHref: `/vendors/${vendor.slug}`,
    showAffiliateCta,
    affiliateHref: showAffiliateCta ? affiliate!.trackingUrl : undefined,
    affiliateLabel: showAffiliateCta
      ? affiliate!.programName
        ? `Explore ${affiliate!.programName}`
        : `Learn more about ${software.name}`
      : undefined,
    year,
  };
}

export function getIntegrationHubEntries(): ResolvedIntegrationPage[] {
  return getPublishableIntegrationCombos()
    .map((c) => resolveIntegrationPage(c.vendorSlug, c.softwareId))
    .filter((page): page is ResolvedIntegrationPage => page !== null);
}

export function getIntegrationHubBySoftwareCategory(): {
  category: PseoSoftwareCategory;
  label: string;
  pages: ResolvedIntegrationPage[];
}[] {
  const pages = getIntegrationHubEntries();
  const order: PseoSoftwareCategory[] = [
    'WMS',
    'ERP',
    'fleetManager',
    'facilitiesOps',
    'analytics',
    'integrationPlatform',
  ];
  return order
    .map((category) => ({
      category,
      label: SOFTWARE_CATEGORY_LABELS[category],
      pages: pages.filter((p) => p.software.category === category),
    }))
    .filter((group) => group.pages.length > 0);
}

/**
 * Integrations related to a best-for page: share an environment and a vendor
 * already shown on that page.
 */
export function getRelatedIntegrationsForBestPage(
  environmentId: string,
  vendorSlugs: string[],
): ResolvedIntegrationPage[] {
  const slugSet = new Set(vendorSlugs);
  return getIntegrationHubEntries().filter(
    (page) =>
      page.combo.environmentIds.includes(environmentId) &&
      slugSet.has(page.vendor.slug),
  );
}

export type { PseoFaq };
