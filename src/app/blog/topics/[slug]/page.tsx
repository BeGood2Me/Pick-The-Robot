import { notFound } from 'next/navigation';
import { BlogPillarPage, blogPillarMetadata } from '@/components/pages/BlogPillarPage';
import { getAllBlogPillars, getBlogPillarBySlug } from '@/lib/content/blog';

export function generateStaticParams() {
  return getAllBlogPillars().map((pillar) => ({ slug: pillar.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pillar = getBlogPillarBySlug(slug);
  if (!pillar) return {};
  return blogPillarMetadata(pillar);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pillar = getBlogPillarBySlug(slug);
  if (!pillar) notFound();
  return <BlogPillarPage pillar={pillar} />;
}
