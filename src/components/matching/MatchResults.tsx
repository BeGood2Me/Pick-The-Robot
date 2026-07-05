'use client';

import { useEffect, useState } from 'react';
import {
  AcquisitionCallout,
  RecommendationCard,
} from '@/components/matching/RecommendationCard';
import { ScoreCompareBars } from '@/components/matching/ScoreCompareBars';
import { ScoreBreakdownTable } from '@/components/matching/ScoreBreakdownTable';
import { ScoreMeter } from '@/components/matching/ScoreMeter';
import { VendorCard } from '@/components/matching/VendorCard';
import { Badge } from '@/components/ui/Badge';
import { trackAcquisitionModelViewed } from '@/lib/analytics/outbound';
import {
  ACQUISITION_LABELS,
  ROBOT_TYPE_LABELS,
  type RecommendationResult,
} from '@/lib/matching';
import { topHits } from '@/lib/matching/scoring/trace';
import { fleetSizingDisclaimer } from '@/lib/matching/sizing';
import { getVendorById } from '@/lib/matching/vendors';

const CONFIDENCE_COPY = {
  strong: null,
  moderate: 'Match confidence is moderate — your inputs point this way, but validate with a pilot.',
  weak: 'Weak match — no robot type scored strongly. Treat this as a starting point, not a firm recommendation.',
} as const;

export function MatchResults({ result }: { result: RecommendationResult }) {
  const {
    explanation,
    vendorMatches,
    acquisitionRecommendation,
    matchConfidence,
    vendorsLowConfidence,
    vendorExclusionReasons,
    fleetSizingHint,
    allRobotMatches,
    bestRobotMatch,
    runnerUpRobotMatch,
  } = result;

  const [scoresOpen, setScoresOpen] = useState(false);

  useEffect(() => {
    trackAcquisitionModelViewed(acquisitionRecommendation, 'results');
  }, [acquisitionRecommendation]);

  const confidenceNote = CONFIDENCE_COPY[matchConfidence];
  const winnerLabel = ROBOT_TYPE_LABELS[bestRobotMatch.robotType];
  const vendorCards = vendorMatches.flatMap((vm) => {
    const vendor = getVendorById(vm.vendorId);
    return vendor ? [{ vm, vendor }] : [];
  });
  const missingVendorCount = vendorMatches.length - vendorCards.length;
  const winnerReasons = topHits(bestRobotMatch.trace, 2).map((h) => h.message);
  const runnerUpWithin10 =
    runnerUpRobotMatch &&
    bestRobotMatch.score.overallMatch - runnerUpRobotMatch.score.overallMatch <= 10;

  return (
    <div id="match-results" className="print-results space-y-6">
      <div className="print-only print-header">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">PickTheRobot</p>
        <h1 className="font-display text-2xl font-semibold">Match results</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {winnerLabel} · {Math.round(bestRobotMatch.score.overallMatch)}% fit ·{' '}
          {new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}
        </p>
      </div>

      <section className="card print-hero border-2 border-accent/40 bg-accent-soft/20">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-accent">Your best match</p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{winnerLabel}</h2>
            <p className="mt-1 text-sm text-ink-muted">
              {ACQUISITION_LABELS[bestRobotMatch.acquisitionModel]} ·{' '}
              {Math.round(bestRobotMatch.score.overallMatch)}% overall fit
            </p>
          </div>
          {matchConfidence !== 'strong' && (
            <Badge variant="confidence">{matchConfidence} confidence</Badge>
          )}
        </div>

        <div className="mt-4 max-w-md">
          <ScoreMeter label="Overall match" value={bestRobotMatch.score.overallMatch} />
        </div>

        {winnerReasons.length > 0 && (
          <ul className="mt-4 list-inside list-disc text-sm text-ink-muted">
            {winnerReasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}

        <p className="mt-3 text-sm prose-muted">{explanation.summary}</p>
        {confidenceNote && (
          <p className="mt-2 text-sm text-warn" role="status">
            {confidenceNote}
          </p>
        )}
      </section>

      {runnerUpWithin10 && runnerUpRobotMatch && (
        <p className="text-sm text-ink-muted">
          <span className="font-medium text-ink">Close runner-up:</span>{' '}
          {ROBOT_TYPE_LABELS[runnerUpRobotMatch.robotType]} (
          {Math.round(runnerUpRobotMatch.score.overallMatch)}%)
        </p>
      )}

      <section className="card print-score-compare">
        <h3 className="text-sm font-semibold text-ink">Score comparison</h3>
        <div className="mt-3">
          <ScoreCompareBars matches={allRobotMatches} bestType={bestRobotMatch.robotType} />
        </div>
      </section>

      <section className="print-scores-section">
        <button
          type="button"
          onClick={() => setScoresOpen((o) => !o)}
          className="scores-collapsible-toggle flex w-full items-center justify-between rounded-lg border border-surface-border bg-surface px-4 py-3 text-left text-sm font-semibold text-ink hover:bg-surface-soft"
          aria-expanded={scoresOpen}
        >
          {scoresOpen ? 'Hide all scores' : 'See all scores'}
          <span aria-hidden className="text-ink-muted">
            {scoresOpen ? '−' : '+'}
          </span>
        </button>
        <div
          className={`scores-detail-panel mt-3 card ${scoresOpen ? '' : 'hidden print:block'}`}
        >
            <p className="mb-4 text-sm text-ink-muted">
              Scores are 0–100 across use case, economic, and deployment fit.
            </p>
            <ScoreBreakdownTable
              matches={allRobotMatches}
              bestType={bestRobotMatch.robotType}
              runnerUpType={runnerUpRobotMatch?.robotType}
            />
          </div>
      </section>

      <section className="print-vendors">
        <h2 className="mb-1 text-xl font-semibold">Top matching vendors</h2>
        {vendorsLowConfidence && (
          <div className="mb-4 space-y-2">
            <p className="text-sm text-ink-muted">
              No vendor scored a strong fit — showing closest options. Confirm region, robot type, and
              acquisition support before contacting.
            </p>
            {vendorExclusionReasons && vendorExclusionReasons.length > 0 && (
              <div className="rounded-lg border border-warn/30 bg-warn-soft/30 px-3 py-2 text-sm text-ink-muted">
                <p className="font-medium text-ink">Why vendors may not qualify:</p>
                <ul className="mt-1 list-inside list-disc">
                  {vendorExclusionReasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {vendorMatches.length === 0 ? (
          <p className="card text-sm text-ink-muted">
            No vendors in our dataset matched this profile. Try adjusting region or acquisition
            preference, or browse category vendor lists below.
          </p>
        ) : (
          <div className="space-y-4">
            {missingVendorCount > 0 && (
              <p className="text-sm text-ink-muted">
                Some vendor listings are no longer available.
              </p>
            )}
            {vendorCards.map(({ vm, vendor }) => (
              <VendorCard key={vm.vendorId} match={vm} vendor={vendor} context="results" />
            ))}
          </div>
        )}
        {explanation.vendorChoiceReasons.length > 0 && (
          <ul className="mt-4 list-inside list-disc text-sm text-ink-muted">
            {explanation.vendorChoiceReasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}
      </section>

      {(result.bestLowUpfrontMatch || result.bestLongTermRoiMatch || runnerUpRobotMatch) && (
        <section className="print-other-perspectives">
          <h2 className="mb-3 text-lg font-semibold">Other perspectives</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {runnerUpRobotMatch && !runnerUpWithin10 && (
              <RecommendationCard match={runnerUpRobotMatch} label="Runner-up" />
            )}
            {result.bestLowUpfrontMatch && (
              <RecommendationCard
                match={result.bestLowUpfrontMatch}
                label="Low upfront"
                acquisitionOverride={ACQUISITION_LABELS[result.bestLowUpfrontMatch.acquisitionModel]}
              />
            )}
            {result.bestLongTermRoiMatch && (
              <RecommendationCard
                match={result.bestLongTermRoiMatch}
                label="Long-term ROI"
                acquisitionOverride={ACQUISITION_LABELS[result.bestLongTermRoiMatch.acquisitionModel]}
              />
            )}
          </div>
        </section>
      )}

      {fleetSizingHint && (
        <section className="card border-surface-border bg-surface-soft/80">
          <h3 className="text-lg font-semibold">Fleet sizing guidance</h3>
          <p className="mt-2 text-sm text-ink-muted">{fleetSizingHint}</p>
          <p className="mt-2 text-xs text-ink-muted">{fleetSizingDisclaimer()}</p>
        </section>
      )}

      {explanation.runnerUpComparison && explanation.runnerUpComparison.length > 0 && (
        <section className="card">
          <h3 className="text-lg font-semibold">Why not the runner-up?</h3>
          <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
            {explanation.runnerUpComparison.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      <AcquisitionCallout
        model={ACQUISITION_LABELS[acquisitionRecommendation]}
        reasons={explanation.acquisitionReasons}
      />

      <section className="card">
        <h3 className="text-lg font-semibold">Why this robot</h3>
        <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
          {explanation.robotChoiceReasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      {explanation.cautions.length > 0 && (
        <section className="card border-warn/30 bg-warn-soft/40">
          <h3 className="text-lg font-semibold text-warn">Things to watch</h3>
          <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
            {explanation.cautions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="print-only print-footer text-xs text-ink-muted">
        Rules-based recommendation from PickTheRobot — not vendor-provided. Confirm pricing,
        integration, and pilot results with vendors before purchasing.
      </p>
    </div>
  );
}
