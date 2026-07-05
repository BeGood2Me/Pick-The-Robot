import { ACQUISITION_LABELS, ROBOT_TYPE_LABELS, type RecommendationResult } from '@/lib/matching';

export function formatResultsSummary(result: RecommendationResult): string {
  const { bestRobotMatch, runnerUpRobotMatch, vendorMatches, explanation, matchConfidence } =
    result;
  const lines: string[] = [
    'PickTheRobot — Match summary',
    '',
    `Best match: ${ROBOT_TYPE_LABELS[bestRobotMatch.robotType]} (${Math.round(bestRobotMatch.score.overallMatch)}% fit)`,
    `Acquisition: ${ACQUISITION_LABELS[bestRobotMatch.acquisitionModel]}`,
    `Confidence: ${matchConfidence}`,
    '',
    explanation.summary,
  ];

  if (runnerUpRobotMatch) {
    lines.push(
      '',
      `Runner-up: ${ROBOT_TYPE_LABELS[runnerUpRobotMatch.robotType]} (${Math.round(runnerUpRobotMatch.score.overallMatch)}%)`,
    );
  }

  if (vendorMatches.length > 0) {
    lines.push('', 'Top vendors:');
    for (const vm of vendorMatches.slice(0, 3)) {
      lines.push(`• ${vm.vendorName} — ${Math.round(vm.overallMatch)}% match`);
    }
  }

  if (explanation.cautions.length > 0) {
    lines.push('', 'Things to watch:');
    for (const c of explanation.cautions) {
      lines.push(`• ${c}`);
    }
  }

  lines.push('', 'Generated at picktherobot.com — validate with vendors before purchasing.');
  return lines.join('\n');
}
