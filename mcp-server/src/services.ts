import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { toPublicMatchResponse } from '@/lib/api/publicMatch';
import {
  catalogLimitForTier,
  filterVendorsForCatalog,
  toPublicVendorCatalogEntry,
} from '@/lib/api/publicVendors';
import { COMPARISONS } from '@/lib/content/comparisons';
import {
  CLEANING_PRICE_BANDS,
  RESTAURANT_PRICE_BANDS,
  WAREHOUSE_PRICE_BANDS,
} from '@/lib/content/price-bands';
import { METHODOLOGY_SUMMARY, SCORING_DIMENSIONS } from '@/lib/content/methodology';
import { getFormFields } from '@/lib/forms/questions';
import type { FormAnswers } from '@/lib/forms/types';
import { getRequiredFieldErrors, validateFormAnswers } from '@/lib/forms/validateAnswers';
import { onFormSubmit } from '@/lib/matching/adapter';
import { buildSharePayload, buildShareUrl } from '@/lib/matching/share';
import type { RobotCategory } from '@/lib/matching/types';
import { compareVendorsForDisplay, getVendorBySlug, VENDORS } from '@/lib/matching/vendors';
import { mcpApiTier, siteBaseUrl } from './config.js';

const VALID_CATEGORIES = new Set<RobotCategory>(['warehouse', 'cleaning', 'restaurant']);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

export function matcherFieldsForCategory(category: RobotCategory) {
  return getFormFields(category).map((field) => ({
    key: field.key,
    label: field.label,
    type: field.type,
    required: !['tableCount', 'cleaningLaborCostPerHour'].includes(field.key),
    ...(field.options ? { options: field.options } : {}),
    ...(field.helpText ? { helpText: field.helpText } : {}),
    ...(field.min !== undefined ? { min: field.min } : {}),
    ...(field.max !== undefined ? { max: field.max } : {}),
  }));
}

export function runMatch(answers: FormAnswers) {
  if (!VALID_CATEGORIES.has(answers.category)) {
    throw new Error('category must be warehouse, cleaning, or restaurant.');
  }

  const fieldErrors = getRequiredFieldErrors(answers);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false as const,
      error: 'validation_failed',
      message: 'Complete all required matcher fields.',
      fields: fieldErrors,
    };
  }

  const warnings = validateFormAnswers(answers);
  const tier = mcpApiTier();
  const baseUrl = siteBaseUrl();
  const result = onFormSubmit(answers);
  const match = toPublicMatchResponse(result, tier, {
    matchId: randomUUID(),
    baseUrl,
  });
  const shareUrl = buildShareUrl(buildSharePayload(answers));

  return {
    ok: true as const,
    warnings,
    match,
    shareUrl,
    matcherUrl: `${baseUrl}/business?category=${answers.category}#matcher`,
    disclaimer:
      'Informational only — verify pricing, safety, and deployment fit with vendors. PickTheRobot is not a dealer or integrator.',
  };
}

export function listVendors(category: RobotCategory, region?: string) {
  const tier = mcpApiTier();
  const baseUrl = siteBaseUrl();
  const filtered = filterVendorsForCatalog(VENDORS, category, region).sort(compareVendorsForDisplay);
  const vendors = filtered
    .slice(0, catalogLimitForTier(tier))
    .map((vendor) => toPublicVendorCatalogEntry(vendor, tier, baseUrl));

  return { tier, category, region, count: vendors.length, vendors };
}

export function getVendorProfile(slug: string) {
  const vendor = getVendorBySlug(slug);
  if (!vendor) return null;
  const baseUrl = siteBaseUrl();
  const tier = mcpApiTier();
  return toPublicVendorCatalogEntry(vendor, tier, baseUrl);
}

export function priceBandsReference() {
  return {
    warehouse: WAREHOUSE_PRICE_BANDS,
    cleaning: CLEANING_PRICE_BANDS,
    restaurant: RESTAURANT_PRICE_BANDS,
    note: 'Indicative USD bands for budgeting — not vendor quotes.',
  };
}

export function listComparisonPages() {
  return Object.values(COMPARISONS).map((page) => ({
    slug: page.slug,
    title: page.title,
    h1: page.h1,
    matcherCategory: page.matcherCategory,
    path: `/${page.slug}`,
  }));
}

export function getComparisonPage(slug: string) {
  const page = COMPARISONS[slug];
  if (!page) return null;
  const baseUrl = siteBaseUrl();
  return {
    slug: page.slug,
    title: page.title,
    h1: page.h1,
    intro: page.intro,
    metaDescription: page.metaDescription,
    url: `${baseUrl}/${page.slug}`,
    rows: page.rows,
    whenA: page.whenA,
    whenB: page.whenB,
    faqs: page.faqs,
    relatedLinks: page.relatedLinks.map((link) => ({
      ...link,
      href: link.href.startsWith('http') ? link.href : `${baseUrl}${link.href}`,
    })),
  };
}

export function methodologyText() {
  const lines = [
    'PickTheRobot — rules-based buyer-side matcher',
    '',
    ...METHODOLOGY_SUMMARY.map((line) => `- ${line}`),
    '',
    'Scoring dimensions:',
    ...SCORING_DIMENSIONS.map((d) => `- ${d.name} (${d.weight}): ${d.summary}`),
  ];
  return lines.join('\n');
}

export async function readLlmsSummary(): Promise<string> {
  const llmsPath = path.join(REPO_ROOT, 'public', 'llms.txt');
  return readFile(llmsPath, 'utf-8');
}
