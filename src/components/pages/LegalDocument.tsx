import type { ReactNode } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SITE_NAME } from '@/lib/content/navigation';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';

export function LegalDocument({
  title,
  path,
  lastUpdated,
  children,
}: {
  title: string;
  path: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: title, path },
        ])}
      />
      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: title }]} />
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated: {lastUpdated}</p>
        <div className="prose-legal mt-8 max-w-3xl space-y-6 text-sm leading-relaxed text-ink-muted">
          {children}
        </div>
        <p className="mt-10 text-sm">
          <Link href="/" className="font-medium text-accent hover:underline">
            Back to {SITE_NAME}
          </Link>
        </p>
      </div>
    </>
  );
}
