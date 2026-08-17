import { DevelopersReferencePage } from '@/components/pages/DevelopersReferencePage';
import { API_REFERENCE_PATH } from '@/lib/content/developers';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'API reference',
  description:
    'PickTheRobot REST API reference: authentication, rate limits, match and vendor endpoints.',
  path: API_REFERENCE_PATH,
});

export default function Page() {
  return <DevelopersReferencePage />;
}
