import { redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { VendorPortalClient } from '@/components/vendor/VendorPortalClient';
import { getVendorBySlug } from '@/lib/matching/vendors';
import { FOR_VENDORS_PATH } from '@/lib/content/for-vendors';
import { getVendorPortalForSession, getVendorSession } from '@/lib/vendor/auth-server';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Vendor portal',
  description: 'Manage your PickTheRobot vendor listing.',
  path: `${FOR_VENDORS_PATH}/portal`,
  noIndex: true,
});

export default async function VendorPortalPage() {
  const session = await getVendorSession();
  if (!session) redirect(`${FOR_VENDORS_PATH}/login`);

  const summary = await getVendorPortalForSession();
  if (!summary) redirect(`${FOR_VENDORS_PATH}/login`);

  const vendor = getVendorBySlug(summary.account.vendorSlug);
  const vendorListingName = vendor?.name ?? 'Your vendor listing';

  return (
    <div className="container-page py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'For vendors', href: FOR_VENDORS_PATH },
          { label: 'Portal' },
        ]}
      />
      <VendorPortalClient initial={summary} vendorListingName={vendorListingName} />
    </div>
  );
}
