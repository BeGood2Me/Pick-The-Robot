import { DevelopersSuccessPage } from '@/components/pages/DevelopersSuccessPage';
import { DEVELOPERS_PATH } from '@/lib/content/developers';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'API key ready',
  description: 'Your PickTheRobot API key after checkout.',
  path: `${DEVELOPERS_PATH}/success`,
  noIndex: true,
});

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default function Page({ searchParams }: PageProps) {
  return <DevelopersSuccessPage searchParams={searchParams} />;
}
