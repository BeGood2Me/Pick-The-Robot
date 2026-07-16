import Link from 'next/link';
import { BlogTopBar, BlogTopicList } from '@/components/blog/BlogChrome';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FaqBlock } from '@/components/content/FaqBlock';
import type { BlogPillarJson } from '@/lib/content/blog-types';
import {
  blogPostPath,
  blogPillarPath,
  getPostsForPillar,
} from '@/lib/content/blog';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export function blogPillarMetadata(pillar: BlogPillarJson) {
  const path = blogPillarPath(pillar.slug);
  return siteMetadata({
    title: pillar.title,
    description: pillar.metaDescription,
    path,
    ogImage: `${path}/opengraph-image`,
  });
}

export function BlogPillarPage({ pillar }: { pillar: BlogPillarJson }) {
  const path = blogPillarPath(pillar.slug);
  const posts = getPostsForPillar(pillar.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: pillar.h1, path },
        ])}
      />
      <JsonLd data={faqJsonLd(pillar.faqs)} />
      <JsonLd
        data={articleJsonLd({
          title: pillar.title,
          description: pillar.metaDescription,
          path,
        })}
      />

      <BlogTopBar activePillarSlug={pillar.slug} />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: pillar.h1 },
          ]}
        />

        <h1 className="mt-4 font-display text-4xl font-semibold">{pillar.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">{pillar.intro}</p>

        <div className="mt-10 space-y-6">
          {pillar.summarySections.map((section) => (
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

        <section className="mt-10 card">
          <h2 className="font-semibold">Articles in this topic</h2>
          <ul className="mt-4 space-y-4">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-surface-border pb-4 last:border-0 last:pb-0">
                <Link
                  href={blogPostPath(post.slug)}
                  className="text-lg font-medium text-accent hover:underline"
                >
                  {post.h1}
                </Link>
                <p className="mt-1 text-sm text-ink-muted">{post.metaDescription}</p>
                <p className="mt-1 text-xs text-ink-faint">
                  Primary topic: {post.primaryKeyword}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {pillar.relatedLinks.length > 0 && (
          <section className="mt-8 card">
            <h2 className="font-semibold">Guides &amp; tools</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {pillar.relatedLinks.map((link) => (
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
          <FaqBlock items={pillar.faqs} title="Frequently asked questions" />
        </div>

        <div className="mt-10">
          <BlogTopicList activePillarSlug={pillar.slug} />
        </div>
      </div>
    </>
  );
}
