'use client';

import Link from 'next/link';
import { VendorMonogram } from '@/components/brand/VendorMonogram';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { getOutboundUrl, trackVendorOutboundClick } from '@/lib/analytics/outbound';
import type { Vendor, VendorMatch } from '@/lib/matching';

const DEPLOY_LABELS = { low: 'Fast deployment', medium: 'Moderate', high: 'Complex' } as const;

export function VendorCard({
  match,
  vendor,
  context,
}: {
  match: VendorMatch;
  vendor: Vendor;
  context?: string;
}) {
  return (
    <article className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-3">
          <VendorMonogram
            name={vendor.name}
            sponsored={vendor.sponsored}
            logoUrl={vendor.logoUrl}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">
                <Link href={`/vendors/${vendor.slug}`} className="hover:text-accent">
                  {vendor.name}
                </Link>
              </h3>
              <Badge variant="accent">{Math.round(match.overallMatch)}% match</Badge>
              {vendor.sponsored && <Badge variant="sponsored">Sponsored</Badge>}
            </div>
            <p className="mt-1 text-sm text-ink-muted">{vendor.shortDescription}</p>
          </div>
        </div>
        <ButtonLink
          href={getOutboundUrl(vendor, context)}
          variant="primary"
          className="no-print shrink-0"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackVendorOutboundClick(vendor, context)}
        >
          Visit vendor
        </ButtonLink>
      </div>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-ink">Best for</dt>
          <dd className="text-ink-muted">{vendor.bestFor.slice(0, 3).join(' · ')}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Acquisition</dt>
          <dd className="text-ink-muted">{vendor.acquisitionModelsSupported.join(', ')}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Deployment</dt>
          <dd className="text-ink-muted">{DEPLOY_LABELS[vendor.deploymentComplexity]}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold text-ink">Not ideal if</dt>
          <dd className="text-ink-muted">{vendor.limitations.slice(0, 2).join(' · ')}</dd>
        </div>
      </dl>
    </article>
  );
}
