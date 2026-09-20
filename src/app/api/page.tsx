import { DevelopersPage } from '@/components/pages/DevelopersPage';
import { DEVELOPERS_PATH } from '@/lib/content/developers';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Developer API',
  description:
    'Embed PickTheRobot’s rules-based matchers in your app — home robot vacuums plus warehouse, commercial cleaning, and restaurant. Starter and Pro plans; API key required.',
  path: DEVELOPERS_PATH,
});

export default function Page() {
  return <DevelopersPage />;
}
