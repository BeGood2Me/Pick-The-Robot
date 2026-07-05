'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/**
 * Vendor avatar: initials monogram by default.
 * Logo image only when vendor is sponsored and `logoUrl` is set.
 */
export function VendorMonogram({
  name,
  sponsored,
  logoUrl,
  className,
  size = 'md',
}: {
  name: string;
  sponsored?: boolean;
  logoUrl?: string;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const dim = size === 'sm' ? 'h-9 w-9 text-xs' : 'h-11 w-11 text-sm';
  const showLogo = sponsored && logoUrl && !imageFailed;

  if (showLogo) {
    return (
      <img
        src={logoUrl}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
        className={cn(
          'rounded-lg border border-surface-border object-contain bg-surface p-1',
          dim,
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg border border-surface-border bg-accent-soft font-semibold text-accent',
        dim,
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
