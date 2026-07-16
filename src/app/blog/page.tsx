import Link from 'next/link';
import { BlogTopBar, BlogTopicList } from '@/components/blog/BlogChrome';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  blogPostPath,
  blogPillarPath,
  getAllBlogPillars,
  getAllBlogPosts,
} from '@/lib/content/blog';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Robot buying insights & guides',
  description:
    'SEO guides on warehouse robot cost, AMR vs AGV, cleaning and restaurant robot pricing, and RaaS — organized by topic for operations teams.',
  path: '/blog',
});

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const pillars = getAllBlogPillars();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />

      <BlogTopBar />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
        <h1 className="mt-4 font-display text-4xl font-semibold">Robot buying insights</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          Practical guides on warehouse automation, cleaning robots, restaurant serving bots, and
          acquisition models — written for buyers, not vendors.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Topic clusters</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <Link
                key={pillar.slug}
                href={blogPillarPath(pillar.slug)}
                className="card transition hover:border-accent/40"
              >
                <h3 className="font-semibold text-ink">{pillar.h1}</h3>
                <p className="mt-2 text-sm text-ink-muted">{pillar.metaDescription}</p>
                <p className="mt-3 text-xs font-medium text-accent">
                  {pillar.postSlugs.length} article{pillar.postSlugs.length === 1 ? '' : 's'} →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold">Latest articles</h2>
          <ul className="mt-4 space-y-6">
            {posts.map((post) => (
              <li key={post.slug} className="card">
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                  {post.primaryKeyword}
                </p>
                <Link
                  href={blogPostPath(post.slug)}
                  className="mt-1 block text-lg font-semibold text-ink hover:text-accent"
                >
                  {post.h1}
                </Link>
                <p className="mt-2 text-sm text-ink-muted">{post.metaDescription}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12">
          <BlogTopicList />
        </div>
      </div>
    </>
  );
}
