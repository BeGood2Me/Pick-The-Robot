'use client';

import { ButtonLink } from '@/components/ui/Button';
import { getOutboundUrl, trackVendorOutboundClick } from '@/lib/analytics/outbound';
import type { Vendor } from '@/lib/matching';

export function VendorOutboundButton({
  vendor,
  label,
  context,
}: {
  vendor: Vendor;
  label?: string;
  context?: string;
}) {
  return (
    <ButtonLink
      href={getOutboundUrl(vendor)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackVendorOutboundClick(vendor, context)}
    >
      {label ?? `Visit ${vendor.name}`}
    </ButtonLink>
  );
}
