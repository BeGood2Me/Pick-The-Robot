import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { VendorSuccessClient } from '@/components/vendor/VendorSuccessClient';
import { FOR_VENDORS_PATH } from '@/lib/content/for-vendors';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Vendor checkout complete',
  description: 'Activating your PickTheRobot vendor account.',
  path: `${FOR_VENDORS_PATH}/success`,
  noIndex: true,
});

export default function VendorSuccessPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'For vendors', href: FOR_VENDORS_PATH },
          { label: 'Checkout complete' },
        ]}
      />
      <h1 className="font-display text-3xl font-semibold">Checkout complete</h1>
      <Suspense fallback={<p className="mt-4 text-sm text-ink-muted">Loading…</p>}>
        <div className="mt-4">
          <VendorSuccessClient />
        </div>
      </Suspense>
    </div>
  );
}
