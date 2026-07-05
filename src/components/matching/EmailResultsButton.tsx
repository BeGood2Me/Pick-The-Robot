'use client';

import { ButtonLink } from '@/components/ui/Button';
import { formatResultsSummary } from '@/lib/matching/formatSummary';
import type { RecommendationResult } from '@/lib/matching';
import { ROBOT_TYPE_LABELS } from '@/lib/matching';

const MAX_MAILTO_BODY = 1800;

export function EmailResultsButton({ result }: { result: RecommendationResult }) {
  const robotLabel = ROBOT_TYPE_LABELS[result.bestRobotMatch.robotType];
  const subject = encodeURIComponent(`PickTheRobot match: ${robotLabel}`);
  let body = encodeURIComponent(formatResultsSummary(result));

  if (body.length > MAX_MAILTO_BODY) {
    body = encodeURIComponent(
      [
        'PickTheRobot match summary',
        '',
        `Best match: ${robotLabel} (${Math.round(result.bestRobotMatch.score.overallMatch)}%)`,
        '',
        result.explanation.summary,
        '',
        'Open your saved link or run the matcher again at picktherobot.com for full details.',
      ].join('\n'),
    );
  }

  return (
    <ButtonLink href={`mailto:?subject=${subject}&body=${body}`} variant="ghost">
      Email summary
    </ButtonLink>
  );
}
