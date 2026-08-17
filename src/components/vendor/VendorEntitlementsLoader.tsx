'use client';

import { useEffect } from 'react';
import { setVendorEntitlementCache } from '@/lib/vendor/entitlements';

export function VendorEntitlementsLoader() {
  useEffect(() => {
    let cancelled = false;
    void fetch('/api/vendor/entitlements')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (!cancelled) setVendorEntitlementCache(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
