import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/content/blog';
import { createOgImage } from '@/lib/seo/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return createOgImage('PickTheRobot Blog', 'Robot buying guides');
  }
  return createOgImage(post.h1, post.metaDescription);
}
