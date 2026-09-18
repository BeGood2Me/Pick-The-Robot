import Link from 'next/link';
import { FaqBlock } from '@/components/content/FaqBlock';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import { MatchingTool } from '@/components/matching/MatchingToolLoader';
import { ButtonLink } from '@/components/ui/Button';
import {
  BUSINESS_HUB_FAQS,
  BUSINESS_HUB_META,
  BUSINESS_HUB_PATH,
  ROBOT_VACUUMS_PATH,
} from '@/lib/content/home-vacuums';
import { CATEGORY_LINKS } from '@/lib/content/navigation';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: BUSINESS_HUB_META.title,
  description: BUSINESS_HUB_META.description,
  path: BUSINESS_HUB_PATH,
});

export default function BusinessHubPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: BUSINESS_HUB_META.h1, path: BUSINESS_HUB_PATH },
        ])}
      />
      <JsonLd data={faqJsonLd(BUSINESS_HUB_FAQS)} />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Business robots' }]} />
        <h1 className="font-display text-4xl font-semibold">{BUSINESS_HUB_META.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          Match a warehouse, commercial cleaning, or restaurant robot — robot type, buy vs lease vs RaaS,
          and a ranked vendor shortlist. This is not the home robot-vacuum matcher.
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          Shopping for a Roomba-class vacuum?{' '}
          <Link href={ROBOT_VACUUMS_PATH} className="font-medium text-accent hover:underline">
            Use the robot vacuum matcher
          </Link>
          .
        </p>

        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {CATEGORY_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-medium text-accent hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <section id="matcher" className="mt-10 scroll-mt-8">
          <MatchingTool />
        </section>

        <div className="mt-12">
          <FaqBlock items={BUSINESS_HUB_FAQS} title="Business matcher questions" />
        </div>

        <p className="mt-10">
          <ButtonLink href="/methodology" variant="secondary">
            How scoring works
          </ButtonLink>
        </p>

        <StickyMatcherCta href="#matcher" />
      </div>
    </>
  );
}
