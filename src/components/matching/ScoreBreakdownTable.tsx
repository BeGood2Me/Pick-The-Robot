'use client';

import { ROBOT_TYPE_LABELS } from '@/lib/matching';
import { MATCH_THRESHOLDS } from '@/lib/matching/types';
import type { RobotMatch } from '@/lib/matching/types';

function rowMeta(m: RobotMatch, bestType: string, runnerUpType?: string) {
  const isBest = m.robotType === bestType;
  const isRunnerUp = m.robotType === runnerUpType;
  const belowThreshold = m.score.overallMatch < MATCH_THRESHOLDS.runnerUp;
  return { isBest, isRunnerUp, belowThreshold };
}

const cellHead = 'px-4 py-3 text-left font-medium';
const cellBody = 'px-4 py-3 align-top';

export function ScoreBreakdownTable({
  matches,
  bestType,
  runnerUpType,
}: {
  matches: RobotMatch[];
  bestType: string;
  runnerUpType?: string;
}) {
  return (
    <>
      <div className="space-y-2 md:hidden">
        {matches.map((m) => {
          const { isBest, isRunnerUp, belowThreshold } = rowMeta(m, bestType, runnerUpType);
          return (
            <div
              key={m.robotType}
              className={[
                'rounded-lg border border-surface-border p-3',
                isBest ? 'border-accent/40 bg-accent-soft/40' : '',
                belowThreshold && !isBest ? 'opacity-70' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-ink">{ROBOT_TYPE_LABELS[m.robotType]}</span>
                <span className="text-sm font-semibold text-ink">
                  {Math.round(m.score.overallMatch)}%
                </span>
              </div>
              {(isBest || isRunnerUp) && (
                <span className="mt-1 block text-xs text-accent">
                  {isBest ? 'Best match' : 'Runner-up'}
                </span>
              )}
              <dl className="mt-2 grid grid-cols-3 gap-2 text-xs text-ink-muted">
                <div>
                  <dt>Use case</dt>
                  <dd className="font-medium text-ink">{Math.round(m.score.useCaseFit)}</dd>
                </div>
                <div>
                  <dt>Economic</dt>
                  <dd className="font-medium text-ink">{Math.round(m.score.economicFit)}</dd>
                </div>
                <div>
                  <dt>Deploy</dt>
                  <dd className="font-medium text-ink">{Math.round(m.score.deploymentFit)}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-md border border-surface-border md:block">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <thead className="bg-surface-soft text-ink-muted">
            <tr className="border-b border-surface-border">
              <th className={cellHead}>Robot type</th>
              <th className={cellHead}>Use case</th>
              <th className={cellHead}>Economic</th>
              <th className={cellHead}>Deployment</th>
              <th className={cellHead}>Overall</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => {
              const { isBest, isRunnerUp, belowThreshold } = rowMeta(m, bestType, runnerUpType);
              return (
                <tr
                  key={m.robotType}
                  className={[
                    'border-b border-surface-border last:border-b-0',
                    isBest ? 'bg-accent-soft/40 font-medium' : '',
                    isRunnerUp && !isBest ? 'bg-surface-soft' : '',
                    belowThreshold && !isBest ? 'text-ink-muted opacity-70' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <td className={cellBody}>
                    {ROBOT_TYPE_LABELS[m.robotType]}
                    {isBest && <span className="ml-2 text-xs text-accent">Best</span>}
                    {isRunnerUp && !isBest && (
                      <span className="ml-2 text-xs text-ink-muted">Runner-up</span>
                    )}
                  </td>
                  <td className={cellBody}>{Math.round(m.score.useCaseFit)}</td>
                  <td className={cellBody}>{Math.round(m.score.economicFit)}</td>
                  <td className={cellBody}>{Math.round(m.score.deploymentFit)}</td>
                  <td className={cellBody}>{Math.round(m.score.overallMatch)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
