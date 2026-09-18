'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { ScoreMeter } from '@/components/matching/ScoreMeter';
import { HomeVacuumProductCard } from '@/components/home-vacuums/HomeVacuumProductCard';
import { CLASS_LABELS } from '@/lib/content/home-vacuums';
import { homeVacuumLaneCopy } from '@/lib/home-vacuums/engine';
import type { HomeVacuumRecommendation } from '@/lib/home-vacuums/types';

const CONFIDENCE_COPY = {
  strong: null,
  moderate: 'Match confidence is moderate — a few constraints compete. Read the why-not notes before you buy.',
  weak: 'Weak match — nothing in this catalog scored strongly against your constraints. Treat this as a starting point, not a purchase list.',
} as const;

export function HomeVacuumResults({ result }: { result: HomeVacuumRecommendation }) {
  const top = result.matches[0];
  const [scoresOpen, setScoresOpen] = useState(false);
  const confidenceNote = CONFIDENCE_COPY[result.matchConfidence];

  return (
    <div id="match-results" className="print-results space-y-6">
      <p className="rounded-lg border border-surface-border bg-surface-soft/60 px-3 py-2 text-xs text-ink-muted">
        {result.affiliateDisclosure}
      </p>

      {top && (
        <section className="card print-hero border-2 border-accent/40 bg-accent-soft/20">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-accent">Best spec match</p>
              <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                {top.product.brand} {top.product.name}
              </h2>
              <p className="mt-1 text-sm text-ink-muted">{homeVacuumLaneCopy(result)}</p>
            </div>
            {result.matchConfidence !== 'strong' && (
              <Badge variant="confidence">{result.matchConfidence} confidence</Badge>
            )}
          </div>

          <div className="mt-4 max-w-md">
            <ScoreMeter label="Overall match" value={top.score.overallMatch} />
          </div>
          <p className="mt-3 text-sm prose-muted">{result.summary}</p>
          {confidenceNote && (
            <p className="mt-2 text-sm text-warn" role="status">
              {confidenceNote}
            </p>
          )}
        </section>
      )}

      <section className="card">
        <h3 className="text-sm font-semibold text-ink">Recommended class</h3>
        <p className="mt-1 font-medium text-ink">{CLASS_LABELS[result.bestClass]}</p>
        <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
          {result.classReasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Ranked models</h3>
        {result.matches.map((match, index) => (
          <HomeVacuumProductCard key={match.product.id} match={match} rank={index + 1} />
        ))}
      </section>

      <section>
        <button
          type="button"
          onClick={() => setScoresOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-lg border border-surface-border bg-surface px-4 py-3 text-left text-sm font-semibold text-ink hover:bg-surface-soft"
          aria-expanded={scoresOpen}
        >
          {scoresOpen ? 'Hide score table' : 'See all scores'}
          <span aria-hidden className="text-ink-muted">
            {scoresOpen ? '−' : '+'}
          </span>
        </button>
        {scoresOpen && (
          <div className="mt-3 overflow-x-auto rounded-lg border border-surface-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-soft text-ink-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Model</th>
                  <th className="px-3 py-2 font-medium">Overall</th>
                  <th className="px-3 py-2 font-medium">Floors</th>
                  <th className="px-3 py-2 font-medium">Budget</th>
                  <th className="px-3 py-2 font-medium">Dock</th>
                </tr>
              </thead>
              <tbody>
                {result.matches.map((match) => (
                  <tr key={match.product.id} className="border-t border-surface-border">
                    <td className="px-3 py-2 font-medium text-ink">
                      {match.product.brand} {match.product.name}
                    </td>
                    <td className="px-3 py-2">{Math.round(match.score.overallMatch)}</td>
                    <td className="px-3 py-2">{Math.round(match.score.useCaseFit)}</td>
                    <td className="px-3 py-2">{Math.round(match.score.economicFit)}</td>
                    <td className="px-3 py-2">{Math.round(match.score.deploymentFit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
