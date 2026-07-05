import type { WizardAnswers } from './types';
import type { RobotCategory } from '../matching/types';
const DRAFT_PREFIX = 'ptr-draft-';

export function draftKey(category: RobotCategory): string {
  return `${DRAFT_PREFIX}${category}`;
}

export function saveDraft(category: RobotCategory, answers: WizardAnswers): void {  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(draftKey(category), JSON.stringify({ answers, savedAt: Date.now() }));
  } catch {
    // ignore quota errors
  }
}

export function loadDraft(category: RobotCategory): WizardAnswers | null {  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(draftKey(category));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { answers: WizardAnswers };
    if (parsed.answers?.category === category) return parsed.answers;  } catch {
    // ignore
  }
  return null;
}

export function clearDraft(category: RobotCategory): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(draftKey(category));
  } catch {
    // ignore
  }
}

export function hasDraft(category: RobotCategory): boolean {
  return loadDraft(category) !== null;
}
