/**
 * UI adapter — call from category form submit handlers.
 */
import { buildUserProfile } from '../forms/buildProfile';
import type { FormAnswers } from '../forms/types';
import { generateRecommendation } from './engine';
import type { RecommendationResult, UserProfile } from './types';

export type { UserProfile, RecommendationResult, FormAnswers };

/**
 * Submit handler when the wizard already produces a normalized UserProfile.
 */
export function onProfileSubmit(profile: UserProfile): RecommendationResult {
  return generateRecommendation(profile);
}

/**
 * Submit handler for raw form answers — validates, builds profile, runs engine.
 */
export function onFormSubmit(answers: FormAnswers): RecommendationResult {
  const profile = buildUserProfile(answers);
  return generateRecommendation(profile);
}
