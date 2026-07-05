import { getRequiredFieldErrors } from '@/lib/forms/validateAnswers';
import type { FormAnswers } from '@/lib/forms/types';
import type { RobotCategory, RecommendationResult } from './types';

const SHARE_VERSION = 1;
const VALID_CATEGORIES = new Set<RobotCategory>(['warehouse', 'cleaning', 'restaurant']);
/** Safe upper bound for query-string share tokens in common browsers. */
const MAX_ENCODED_SHARE_LENGTH = 2000;

export interface SharePayload {
  v: typeof SHARE_VERSION;
  answers: FormAnswers;
}

export interface ShareSummary {
  category: string;
  robotType: string;
  acquisition: string;
  overallMatch: number;
}

function isValidCategory(value: unknown): value is RobotCategory {
  return typeof value === 'string' && VALID_CATEGORIES.has(value as RobotCategory);
}

function isCompleteFormAnswers(answers: unknown): answers is FormAnswers {
  if (!answers || typeof answers !== 'object' || !('category' in answers)) return false;
  const candidate = answers as FormAnswers;
  if (!isValidCategory(candidate.category)) return false;
  return Object.keys(getRequiredFieldErrors(candidate)).length === 0;
}

export function buildSharePayload(answers: FormAnswers): SharePayload {
  return { v: SHARE_VERSION, answers };
}

export function encodeSharePayload(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  if (typeof btoa !== 'undefined') {
    return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return Buffer.from(json, 'utf-8').toString('base64url');
}

export function decodeSharePayload(encoded: string): SharePayload | null {
  if (!encoded || encoded.length > MAX_ENCODED_SHARE_LENGTH) return null;
  try {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
    const json =
      typeof atob !== 'undefined'
        ? atob(padded + pad)
        : Buffer.from(padded + pad, 'base64').toString('utf-8');
    const parsed = JSON.parse(json) as SharePayload;
    if (parsed.v !== SHARE_VERSION || !isCompleteFormAnswers(parsed.answers)) return null;
    return { v: SHARE_VERSION, answers: parsed.answers };
  } catch {
    return null;
  }
}

export function buildShareUrl(payload: SharePayload, basePath = '/results'): string {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picktherobot.com';
  return `${origin}${basePath}?share=${encodeSharePayload(payload)}`;
}

export function summaryFromResult(result: RecommendationResult): ShareSummary {
  return {
    category: result.profile.category,
    robotType: result.bestRobotMatch.robotType,
    acquisition: result.acquisitionRecommendation,
    overallMatch: Math.round(result.bestRobotMatch.score.overallMatch),
  };
}
