import { ForVendorsPage } from '@/components/pages/ForVendorsPage';
import { FOR_VENDORS_PATH } from '@/lib/content/for-vendors';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Vendor partnerships — PickTheRobot',
  description:
    'Reach warehouse, cleaning, and restaurant buyers through directory listings and fit-scored matcher placement. Verified partner subscriptions launching soon.',
  path: FOR_VENDORS_PATH,
});

export default function ForVendorsRoute() {
  return <ForVendorsPage />;
}
