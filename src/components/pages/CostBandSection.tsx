import { ButtonLink } from '@/components/ui/Button';
import type { PseoCostBand } from '@/lib/content/pseo-types';
import type { RobotCategory } from '@/lib/matching';

export function CostBandSection({
  robotTypeLabel,
  band,
  costGuide,
  matcherHref,
  category,
}: {
  robotTypeLabel: string;
  band: PseoCostBand;
  costGuide: { href: string; label: string };
  matcherHref: string;
  category: RobotCategory;
}) {
  const showRaasLink = category === 'warehouse' || category === 'cleaning';

  return (
    <section className="mt-10 card">
      <h2 className="text-xl font-semibold">Typical cost bands for {robotTypeLabel}</h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-ink">Purchase (indicative)</dt>
          <dd className="mt-1 text-ink-muted">{band.purchaseBand}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Monthly / RaaS (indicative)</dt>
          <dd className="mt-1 text-ink-muted">{band.monthlyBand}</dd>
        </div>
      </dl>

      <h3 className="mt-6 text-sm font-semibold text-ink">What moves the number</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
        {band.costDrivers.map((driver) => (
          <li key={driver}>{driver}</li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-ink-faint">{band.caveat}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <ButtonLink href={costGuide.href} variant="secondary">
          {costGuide.label}
        </ButtonLink>
        {showRaasLink && (
          <ButtonLink href="/raas-pricing" variant="secondary">
            RaaS pricing
          </ButtonLink>
        )}
        <ButtonLink href={matcherHref}>Run matcher</ButtonLink>
      </div>
    </section>
  );
}
