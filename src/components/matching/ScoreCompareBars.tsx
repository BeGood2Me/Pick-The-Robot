'use client';

import { ROBOT_TYPE_LABELS } from '@/lib/matching';
import type { RobotMatch } from '@/lib/matching/types';

export function ScoreCompareBars({
  matches,
  bestType,
  limit = 4,
}: {
  matches: RobotMatch[];
  bestType: string;
  limit?: number;
}) {
  const top = [...matches]
    .sort((a, b) => b.score.overallMatch - a.score.overallMatch)
    .slice(0, limit);

  return (
    <div className="space-y-3" role="list" aria-label="Robot type scores compared">
      {top.map((m) => {
        const pct = Math.round(m.score.overallMatch);
        const isBest = m.robotType === bestType;
        return (
          <div key={m.robotType} role="listitem">
            <div className="mb-1 flex justify-between text-sm">
              <span className={isBest ? 'font-semibold text-ink' : 'text-ink-muted'}>
                {ROBOT_TYPE_LABELS[m.robotType]}
                {isBest && <span className="ml-2 text-xs text-accent">Best</span>}
              </span>
              <span className="font-medium text-ink">{pct}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-surface-soft"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${ROBOT_TYPE_LABELS[m.robotType]}: ${pct}%`}
            >
            <div
              className={`h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none print-bar ${isBest ? 'bg-accent' : 'bg-accent/40'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
