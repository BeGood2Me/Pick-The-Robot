'use client';

import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { ScoreMeter } from '@/components/matching/ScoreMeter';
import { CLASS_LABELS, PRICE_BAND_LABELS } from '@/lib/content/home-vacuums';
import {
  getHomeVacuumOutboundUrl,
  HOME_AFFILIATE_LOCALE_LABELS,
  productHasAffiliate,
  trackHomeVacuumOutboundClick,
} from '@/lib/home-vacuums/outbound';
import type { HomeAffiliateLocale, HomeProductMatch } from '@/lib/home-vacuums/types';

export function HomeVacuumProductCard({
  match,
  rank,
  context = 'results',
  affiliateLocale = 'US',
}: {
  match: HomeProductMatch;
  rank: number;
  context?: string;
  affiliateLocale?: HomeAffiliateLocale;
}) {
  const { product, score, reasons, cautions } = match;
  const href = getHomeVacuumOutboundUrl(product, context, affiliateLocale);
  const isAffiliate = productHasAffiliate(product, affiliateLocale);
  const ctaLabel = isAffiliate
    ? `Check price on ${HOME_AFFILIATE_LOCALE_LABELS[affiliateLocale]}`
    : `Visit ${product.brand}`;

  return (
    <article className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">#{rank}</p>
          <h3 className="mt-1 text-lg font-semibold text-ink">
            {product.brand} {product.name}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">{product.shortDescription}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="accent">{Math.round(score.overallMatch)}% match</Badge>
            <Badge>{CLASS_LABELS[product.class]}</Badge>
            <Badge>{PRICE_BAND_LABELS[product.priceBand]}</Badge>
            {isAffiliate && <Badge variant="sponsored">Affiliate link</Badge>}
          </div>
        </div>
        <ButtonLink
          href={href}
          variant="primary"
          className="no-print shrink-0"
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackHomeVacuumOutboundClick(product, context, affiliateLocale)}
        >
          {ctaLabel}
        </ButtonLink>
      </div>

      <div className="mt-4 max-w-md">
        <ScoreMeter label="Overall match" value={score.overallMatch} />
      </div>
      <dl className="mt-3 grid gap-2 text-xs text-ink-muted sm:grid-cols-3">
        <div>
          <dt className="font-semibold text-ink">Floors &amp; job</dt>
          <dd>{Math.round(score.useCaseFit)}%</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Budget</dt>
          <dd>{Math.round(score.economicFit)}%</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Dock &amp; navigation</dt>
          <dd>{Math.round(score.deploymentFit)}%</dd>
        </div>
      </dl>

      {reasons.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-ink">Why this ranked</p>
          <ul className="mt-1 list-inside list-disc text-sm text-ink-muted">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
      {cautions.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-semibold text-ink">Why not / watch-outs</p>
          <ul className="mt-1 list-inside list-disc text-sm text-ink-muted">
            {cautions.map((caution) => (
              <li key={caution}>{caution}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
