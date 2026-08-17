import { ScoreMeter } from '@/components/matching/ScoreMeter';
import { Badge } from '@/components/ui/Badge';
import { HOME_HERO_PREVIEW } from '@/lib/content/home-landing';

export function HomeHeroMatchPreview({ className }: { className?: string }) {
  const { scenario, bestMatch, vendors, disclaimer } = HOME_HERO_PREVIEW;

  return (
    <aside
      className={`card border-2 border-accent/35 bg-accent-soft/15 shadow-sm ${className ?? ''}`}
      aria-label="Example match output"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Example output</p>
        <Badge variant="accent">Best match</Badge>
      </div>

      <p className="mt-2 text-sm text-ink-muted">{scenario}</p>

      <div className="mt-4 rounded-lg border border-surface-border bg-surface px-3 py-3">
        <p className="font-display text-lg font-semibold text-ink">{bestMatch.label}</p>
        <p className="mt-0.5 text-sm text-ink-muted">
          {bestMatch.acquisition} · {bestMatch.fit}% overall fit
        </p>
        <div className="mt-3">
          <ScoreMeter label="Overall match" value={bestMatch.fit} />
        </div>
        <ul className="mt-3 list-inside list-disc text-xs text-ink-muted">
          {bestMatch.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        Top vendors
      </p>
      <ol className="mt-2 space-y-2">
        {vendors.map((vendor, index) => (
          <li
            key={vendor.name}
            className="flex items-center justify-between gap-3 rounded-md border border-surface-border bg-surface px-3 py-2 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                {index + 1}
              </span>
              <span className="truncate font-medium text-ink">{vendor.name}</span>
            </span>
            <span className="shrink-0 text-xs font-semibold text-ink-muted">{vendor.fit}%</span>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-xs text-ink-faint">{disclaimer}</p>
    </aside>
  );
}
