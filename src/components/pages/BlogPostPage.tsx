import Link from 'next/link';
import { BlogTopBar, BlogTopicList, BlogPillarLabel, BlogEditorialNote } from '@/components/blog/BlogChrome';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import { FaqBlock } from '@/components/content/FaqBlock';
import type { BlogBrandProfile, BlogPostJson } from '@/lib/content/blog-types';
import {
  blogPostPath,
  getBlogPillarBySlug,
  getRelatedPosts,
  resolvePostBrand,
} from '@/lib/content/blog';
import { CATEGORY_ROUTES } from '@/lib/content/navigation';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { BASE_URL, siteMetadata } from '@/lib/seo/metadata';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function blogPostMetadata(post: BlogPostJson) {
  const brand = resolvePostBrand(post);
  const path = blogPostPath(post.slug);
  return siteMetadata({
    title: post.title,
    description: post.metaDescription,
    path,
    ogImage: `${path}/opengraph-image`,
    ogType: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    authors: [brand.name],
    keywords: [post.primaryKeyword, ...post.secondaryKeywords],
  });
}

export type ResolvedBlogPost = BlogPostJson & { brand: BlogBrandProfile };

export function BlogPostPage({ post }: { post: ResolvedBlogPost }) {
  const path = blogPostPath(post.slug);
  const pillar = getBlogPillarBySlug(post.pillarSlug);
  const relatedPosts = getRelatedPosts(post);
  const matcherHref = post.matcherCategory
    ? `${CATEGORY_ROUTES[post.matcherCategory]}#matcher`
    : '/#matcher';

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          ...(pillar
            ? [{ name: pillar.h1, path: `/blog/topics/${pillar.slug}` }]
            : []),
          { name: post.h1, path },
        ])}
      />
      <JsonLd data={faqJsonLd(post.faqs)} />
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.metaDescription,
          path,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          author: {
            type: 'Organization',
            name: post.brand.name,
            url: BASE_URL,
            sameAs: post.brand.sameAs,
          },
        })}
      />

      <BlogTopBar activePillarSlug={post.pillarSlug} />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            ...(pillar
              ? [{ label: pillar.h1, href: `/blog/topics/${pillar.slug}` }]
              : []),
            { label: post.h1 },
          ]}
        />

        <p className="mt-4 text-sm text-ink-muted">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <>
              {' '}
              · Updated{' '}
              <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
            </>
          )}
          {' · '}
          {post.brand.name} editorial
        </p>

        {pillar && (
          <p className="mt-2 text-sm text-ink-muted">
            Topic: <BlogPillarLabel pillarSlug={post.pillarSlug} />
          </p>
        )}

        <h1 className="mt-4 font-display text-4xl font-semibold">{post.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">{post.intro}</p>

        <StickyMatcherCta href={matcherHref} />

        <div className="mt-10 space-y-6">
          {post.sections.map((section) => (
            <section key={section.heading} className="card">
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              {section.paragraphs?.map((p) => (
                <p key={p} className="mt-3 text-sm text-ink-muted">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-10 card border-accent/30 bg-accent-soft/20">
          <h2 className="text-lg font-semibold">Get a recommendation for your operation</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Answer a few questions — we&apos;ll rank robot types, acquisition models, and vendors
            from your inputs.
          </p>
          <p className="mt-4">
            <Link
              href={matcherHref}
              className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Run the matcher
            </Link>
          </p>
        </section>

        {relatedPosts.length > 0 && (
          <section className="mt-10 card">
            <h2 className="font-semibold">Related articles</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {relatedPosts.map((related) => (
                <li key={related.slug}>
                  <Link href={blogPostPath(related.slug)} className="text-accent hover:underline">
                    {related.h1}
                  </Link>
                  <p className="mt-0.5 text-ink-muted">{related.metaDescription}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {post.relatedLinks.length > 0 && (
          <section className="mt-6 card">
            <h2 className="font-semibold">Guides &amp; tools</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {post.relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-accent hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10">
          <FaqBlock items={post.faqs} title="Frequently asked questions" />
        </div>

        <div className="mt-10">
          <BlogEditorialNote disclaimer={post.brand.editorialDisclaimer} />
        </div>

        <BlogTopicList activePillarSlug={post.pillarSlug} />
      </div>
    </>
  );
}
