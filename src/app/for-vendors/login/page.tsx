import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { VendorLoginForm } from '@/components/vendor/VendorLoginForm';
import { FOR_VENDORS_PATH } from '@/lib/content/for-vendors';
import { getVendorSession } from '@/lib/vendor/auth-server';
import { redirect } from 'next/navigation';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Vendor login',
  description: 'Sign in to your PickTheRobot vendor portal.',
  path: `${FOR_VENDORS_PATH}/login`,
  noIndex: true,
});

export default async function VendorLoginPage() {
  const session = await getVendorSession();
  if (session) redirect(`${FOR_VENDORS_PATH}/portal`);

  return (
    <div className="container-page py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'For vendors', href: FOR_VENDORS_PATH },
          { label: 'Login' },
        ]}
      />
      <h1 className="font-display text-3xl font-semibold">Vendor login</h1>
      <p className="mt-2 text-sm text-ink-muted">
        New vendor?{' '}
        <Link href={FOR_VENDORS_PATH} className="text-accent hover:underline">
          Subscribe on the for vendors page
        </Link>
        .
      </p>
      <div className="mt-8">
        <VendorLoginForm />
      </div>
    </div>
  );
}
