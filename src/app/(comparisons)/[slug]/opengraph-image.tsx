import { COMPARISONS } from '@/lib/content/comparisons';
import { createOgImage } from '@/lib/seo/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return Object.keys(COMPARISONS).map((slug) => ({ slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = COMPARISONS[slug];
  if (!page) {
    return createOgImage('PickTheRobot', 'Robot buying guide and matcher');
  }
  return createOgImage(page.h1, page.metaDescription);
}
