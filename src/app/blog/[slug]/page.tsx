import { notFound } from 'next/navigation';
import { BlogPostPage, blogPostMetadata } from '@/components/pages/BlogPostPage';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/content/blog';

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return blogPostMetadata(post);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();
  return <BlogPostPage post={post} />;
}
