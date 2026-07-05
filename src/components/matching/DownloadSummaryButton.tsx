'use client';

import { Button } from '@/components/ui/Button';
import { formatResultsSummary } from '@/lib/matching/formatSummary';
import { ROBOT_TYPE_LABELS, type RecommendationResult } from '@/lib/matching';

export function DownloadSummaryButton({ result }: { result: RecommendationResult }) {
  function handleDownload() {
    const robotLabel = ROBOT_TYPE_LABELS[result.bestRobotMatch.robotType]
      .toLowerCase()
      .replace(/\s+/g, '-');
    const text = formatResultsSummary(result);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `picktherobot-match-${robotLabel}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button type="button" variant="ghost" onClick={handleDownload}>
      Download .txt
    </Button>
  );
}
