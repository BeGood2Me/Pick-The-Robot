import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ScoreMeter } from '@/components/matching/ScoreMeter';
import { ROBOT_TYPE_INFO } from '@/lib/content/categories';
import {
  ACQUISITION_LABELS,
  ROBOT_TYPE_LABELS,
  type RobotMatch,
} from '@/lib/matching';

export function RecommendationCard({
  match,
  label,
  acquisitionOverride,
}: {
  match: RobotMatch;
  label: string;
  acquisitionOverride?: string;
}) {
  const info = ROBOT_TYPE_INFO[match.robotType];
  const robotLabel = ROBOT_TYPE_LABELS[match.robotType];
  const acqLabel = acquisitionOverride ?? ACQUISITION_LABELS[match.acquisitionModel];

  return (
    <article className="card flex h-full flex-col">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="accent">{label}</Badge>
        <Badge>{Math.round(match.score.overallMatch)}% match</Badge>
      </div>
      <h3 className="text-lg font-semibold">{robotLabel}</h3>
      <p className="mt-1 text-sm text-ink-muted">{acqLabel}</p>
      <div className="mt-4 space-y-2">
        <ScoreMeter label="Use-case fit" value={match.score.useCaseFit} />
        <ScoreMeter label="Economic fit" value={match.score.economicFit} />
        <ScoreMeter label="Deployment fit" value={match.score.deploymentFit} />
      </div>
      <div className="mt-4 flex-1 text-sm">
        <p className="font-semibold text-ink">Best for</p>
        <ul className="mt-1 list-inside list-disc text-ink-muted">
          {info.bestFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 font-semibold text-ink">Not ideal if</p>
        <ul className="mt-1 list-inside list-disc text-ink-muted">
          {info.notIdealIf.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function AcquisitionCallout({
  model,
  reasons,
}: {
  model: string;
  reasons: string[];
}) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold">Recommended acquisition: {model}</h3>
      <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <p className="mt-3 text-sm">
        <Link href="/robot-leasing-vs-buying" className="font-medium text-accent hover:underline">
          Lease vs buy guide
        </Link>
        {' · '}
        <Link href="/robotics-as-a-service" className="font-medium text-accent hover:underline">
          RaaS guide
        </Link>
      </p>
    </div>
  );
}
