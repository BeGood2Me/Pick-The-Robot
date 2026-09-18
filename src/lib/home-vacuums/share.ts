import { isCompleteHomeVacuumAnswers } from './questions';
import type { HomeVacuumAnswers, WizardHomeVacuumAnswers } from './types';
import { ROBOT_VACUUMS_RESULTS_PATH } from '@/lib/content/home-vacuums';

const SHARE_VERSION = 1;
const TRACK = 'home_vacuum';
const MAX_ENCODED_SHARE_LENGTH = 2000;

export interface HomeVacuumSharePayload {
  v: typeof SHARE_VERSION;
  track: typeof TRACK;
  answers: HomeVacuumAnswers;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

export function buildHomeVacuumSharePayload(answers: HomeVacuumAnswers): HomeVacuumSharePayload {
  return { v: SHARE_VERSION, track: TRACK, answers };
}

export function encodeHomeVacuumSharePayload(payload: HomeVacuumSharePayload): string {
  const json = JSON.stringify(payload);
  if (typeof btoa !== 'undefined') {
    return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return Buffer.from(json, 'utf-8').toString('base64url');
}

export function decodeHomeVacuumSharePayload(encoded: string): HomeVacuumSharePayload | null {
  if (!encoded || encoded.length > MAX_ENCODED_SHARE_LENGTH) return null;
  try {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
    const json =
      typeof atob !== 'undefined'
        ? atob(padded + pad)
        : Buffer.from(padded + pad, 'base64').toString('utf-8');
    const parsed = JSON.parse(json) as unknown;
    if (!isRecord(parsed) || parsed.v !== SHARE_VERSION || parsed.track !== TRACK) return null;
    if (!isRecord(parsed.answers) || !isCompleteHomeVacuumAnswers(parsed.answers as unknown as WizardHomeVacuumAnswers)) {
      return null;
    }
    return { v: SHARE_VERSION, track: TRACK, answers: parsed.answers as unknown as HomeVacuumAnswers };
  } catch {
    return null;
  }
}

export function buildHomeVacuumShareUrl(
  payload: HomeVacuumSharePayload,
  basePath = ROBOT_VACUUMS_RESULTS_PATH,
): string {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picktherobot.com';
  return `${origin}${basePath}?share=${encodeHomeVacuumSharePayload(payload)}`;
}
