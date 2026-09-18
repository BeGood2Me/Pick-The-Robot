import {
  BUDGET_LANE_LABELS,
  CLASS_LABELS,
  HOME_VACUUM_AFFILIATE_DISCLOSURE,
  PRICE_BAND_LABELS,
} from '@/lib/content/home-vacuums';
import { getHomeVacuumCatalog } from './catalog';
import { pickBudgetLane, pickHomeVacuumClass, scoreHomeVacuumProduct } from './scoring';
import type {
  HomeMatchConfidence,
  HomeProductMatch,
  HomeVacuumAnswers,
  HomeVacuumRecommendation,
} from './types';

const MAX_MATCHES = 5;
const STRONG_MATCH = 70;
const MODERATE_MATCH = 50;

function matchConfidence(overall: number): HomeMatchConfidence {
  if (overall >= STRONG_MATCH) return 'strong';
  if (overall >= MODERATE_MATCH) return 'moderate';
  return 'weak';
}

function floorLabel(answers: HomeVacuumAnswers): string {
  if (answers.floorMix === 'hard') return 'mostly hard floors';
  if (answers.floorMix === 'carpet') return 'mostly carpet';
  return 'mixed hard floors and carpet';
}

function petLabel(answers: HomeVacuumAnswers): string {
  if (answers.pets === 'none') return 'no pets';
  if (answers.pets === 'cat') return 'cats';
  if (answers.pets === 'dog') return 'dogs';
  return 'cats and dogs';
}

function buildClassReasons(answers: HomeVacuumAnswers): string[] {
  const reasons: string[] = [];
  if (answers.mopNeeded === 'yes') {
    reasons.push('You asked for mopping, so a vacuum + mop combo is the starting class.');
  } else if (answers.mopNeeded === 'nice_to_have' && answers.floorMix !== 'carpet') {
    reasons.push('Hard or mixed floors plus optional mopping usually favor a combo.');
  } else if (answers.mopNeeded === 'no') {
    reasons.push('Vacuum-only avoids paying for a mop dock you will not use.');
  } else {
    reasons.push('Carpet-first homes rarely benefit from mop hardware.');
  }

  if (answers.pets !== 'none' || answers.hairLength === 'long') {
    reasons.push('Hair and pet fur matter more than marketing suction numbers — we weight pet-hair class heavily.');
  }
  if (answers.selfEmpty === 'required') {
    reasons.push('A self-empty dock is treated as a hard requirement, not a bonus.');
  }
  return reasons;
}

function buildSummary(answers: HomeVacuumAnswers, top: HomeProductMatch): string {
  const mopBit =
    answers.mopNeeded === 'yes'
      ? 'with mopping'
      : answers.mopNeeded === 'nice_to_have'
        ? 'where mopping is optional'
        : 'without mopping';
  return `For ${floorLabel(answers)} in a ${answers.homeSize} home (${petLabel(answers)}, ${mopBit}), ${top.product.brand} ${top.product.name} is the closest spec match in this catalog at ${Math.round(top.score.overallMatch)}% overall fit. This is a rules-based shortlist from public specs — not a lab ranking or a “best robot vacuum 2026” list. Confirm current price, firmware, and features on the retailer or manufacturer page.`;
}

function uniqueMessages(items: string[], limit: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

export function recommendHomeVacuum(answers: HomeVacuumAnswers): HomeVacuumRecommendation {
  const bestClass = pickHomeVacuumClass(answers);
  const budgetLane = pickBudgetLane(answers);
  const classReasons = buildClassReasons(answers);

  const matches: HomeProductMatch[] = getHomeVacuumCatalog()
    .map((product) => {
      const scored = scoreHomeVacuumProduct(product, answers);
      return {
        product,
        score: scored.score,
        reasons: uniqueMessages([...scored.reasons, ...product.strengths], 5),
        cautions: uniqueMessages([...scored.cautions, ...product.limitations], 4),
      };
    })
    .sort((a, b) => {
      const classBoostA = a.product.class === bestClass ? 4 : 0;
      const classBoostB = b.product.class === bestClass ? 4 : 0;
      return b.score.overallMatch + classBoostB - (a.score.overallMatch + classBoostA);
    })
    .slice(0, MAX_MATCHES);

  const top = matches[0];
  if (!top) {
    throw new Error('Home vacuum catalog is empty.');
  }

  const cautions = uniqueMessages(
    [
      HOME_VACUUM_AFFILIATE_DISCLOSURE,
      'Street prices move weekly. Treat the budget band as a filter, not a quote.',
      ...top.cautions,
    ],
    6,
  );

  return {
    answers,
    bestClass,
    budgetLane,
    classReasons,
    matches,
    matchConfidence: matchConfidence(top.score.overallMatch),
    summary: buildSummary(answers, top),
    cautions,
    affiliateDisclosure: HOME_VACUUM_AFFILIATE_DISCLOSURE,
  };
}

export function homeVacuumMatchHeadline(result: HomeVacuumRecommendation): string {
  const top = result.matches[0];
  if (!top) return CLASS_LABELS[result.bestClass];
  return `${top.product.brand} ${top.product.name}`;
}

export function homeVacuumLaneCopy(result: HomeVacuumRecommendation): string {
  return `${CLASS_LABELS[result.bestClass]} · ${BUDGET_LANE_LABELS[result.budgetLane]} · up to ${PRICE_BAND_LABELS[result.answers.budgetBand]}`;
}
