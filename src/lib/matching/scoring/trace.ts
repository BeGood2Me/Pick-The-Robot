import type { RuleHit, ScoreDimension, ScoringTrace } from '../types';

export function createTrace(): ScoringTrace {
  return { hits: [] };
}

export function recordHit(trace: ScoringTrace, hit: RuleHit): void {
  trace.hits.push(hit);
}

export function applyDelta(
  score: number,
  trace: ScoringTrace,
  id: string,
  delta: number,
  dimension: ScoreDimension,
  message: string,
): number {
  if (delta !== 0) {
    recordHit(trace, { id, delta, dimension, message });
  }
  return score + delta;
}

export function setBaseScore(
  trace: ScoringTrace,
  score: number,
  dimension: ScoreDimension,
  id: string,
  message: string,
): number {
  recordHit(trace, { id, delta: score, dimension, message });
  return score;
}

/** Top hits by absolute delta for explanations. */
export function topHits(trace: ScoringTrace, limit = 5): RuleHit[] {
  return [...trace.hits]
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, limit);
}

export function hitsForDimension(trace: ScoringTrace, dimension: ScoreDimension): RuleHit[] {
  return trace.hits.filter((h) => h.dimension === dimension);
}
