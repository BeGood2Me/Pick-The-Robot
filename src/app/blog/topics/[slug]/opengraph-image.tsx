import { getAllBlogPillars, getBlogPillarBySlug } from '@/lib/content/blog';
import { createOgImage } from '@/lib/seo/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllBlogPillars().map((pillar) => ({ slug: pillar.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pillar = getBlogPillarBySlug(slug);
  if (!pillar) {
    return createOgImage('PickTheRobot Blog', 'Topic guides');
  }
  return createOgImage(pillar.h1, pillar.metaDescription);
}
