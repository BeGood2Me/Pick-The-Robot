import { ButtonLink } from '@/components/ui/Button';
import {
  ACQUISITION_LABELS,
  ROBOT_TYPE_LABELS,
  formatMonthRange,
  formatUsd,
  formatUsdRange,
  type CleaningRoiEstimate,
} from '@/lib/matching';
import { fleetSizingDisclaimer } from '@/lib/matching/sizing';

const VIABILITY_HEADLINE: Record<CleaningRoiEstimate['viability'], string> = {
  strong: 'Labor offset can cover typical robot cost',
  moderate: 'Labor offset is mixed on published bands',
  weak: 'Coverage estimate, not a savings case',
};

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-md bg-surface-soft px-3 py-3 sm:px-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="mt-1 font-display text-xl font-semibold text-pretty text-ink">{value}</dd>
      {hint ? <p className="mt-1 text-xs text-pretty text-ink-faint">{hint}</p> : null}
    </div>
  );
}

export function CleaningRoiPanel({ roi }: { roi: CleaningRoiEstimate }) {
  const robotLabel = ROBOT_TYPE_LABELS[roi.robotType];
  const acquisitionLabel = ACQUISITION_LABELS[roi.acquisitionModel];
  const netPositivePossible = roi.monthlyNet.high > 0;
  const robotWord = roi.robotCount === 1 ? 'robot' : 'robots';

  return (
    <section className="card print-roi border-2 border-accent/30 bg-accent-soft/10">
      <p className="text-sm font-medium text-accent">Cleaning labor offset</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-balance">
        {VIABILITY_HEADLINE[roi.viability]}
      </h2>
      <p className="mt-2 max-w-xl text-sm text-pretty text-ink-muted">
        Built from your floor area, frequency, wage, and staff count. Cost bands match our cleaning
        robot cost guide. This is not a quote.
      </p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Robots to cover the floor"
          value={roi.robotCount === 0 ? 'None' : `${roi.robotCount} ${robotWord}`}
          hint={`${robotLabel}. About ${roi.coverageSqMPerOuting.toLocaleString()} m² per outing.`}
        />
        <Stat
          label="Hours robots could take"
          value={`${roi.weeklyHoursDisplaced} / week`}
          hint={`${roi.weeklyFloorHours} floor hours in your profile. The rest stays with people.`}
        />
        <Stat
          label="Labor offset"
          value={`${formatUsd(roi.monthlyLaborSavings)} / mo`}
          hint={`At ${formatUsd(roi.wageUsed)} / hour janitorial wage.`}
        />
        <Stat
          label={`${acquisitionLabel} cost`}
          value={`${formatUsdRange(roi.monthlyRobotCost)} / mo`}
          hint="Published band, not a vendor price."
        />
      </dl>

      {netPositivePossible ? (
        <p className="mt-4 text-sm text-pretty text-ink">
          <span className="font-semibold">Indicative net:</span> {formatUsdRange(roi.monthlyNet)} per
          month after robot cost.
          {roi.paybackMonths ? (
            <>
              {' '}
              Purchase payback on capex alone: {formatMonthRange(roi.paybackMonths)}.
            </>
          ) : null}
        </p>
      ) : (
        <p className="mt-4 text-sm text-pretty text-ink">
          Labor offset does not cover typical {acquisitionLabel} cost on these inputs.
        </p>
      )}

      <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-pretty text-ink-muted">
        {roi.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <details className="mt-4 text-sm text-ink-muted">
        <summary className="cursor-pointer font-semibold text-ink">How we calculated this</summary>
        <ul className="mt-2 list-inside list-disc space-y-1 text-pretty">
          {roi.assumptions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </details>

      <p className="mt-4 text-xs text-pretty text-ink-faint">{fleetSizingDisclaimer()}</p>

      <div className="mt-4">
        <ButtonLink href="/cleaning-robot-cost" variant="secondary">
          See cleaning cost bands
        </ButtonLink>
      </div>
    </section>
  );
}
