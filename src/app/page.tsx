import { Suspense } from 'react';
import Link from 'next/link';
import { HomeHeroIllustration } from '@/components/brand/HomeHeroIllustration';
import { FaqBlock } from '@/components/content/FaqBlock';
import { MethodologySection } from '@/components/content/MethodologySection';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import { MatcherSkeleton } from '@/components/matching/MatcherSkeleton';
import { MatchingTool } from '@/components/matching/MatchingTool';
import { HomeCategoryGuideLinks } from '@/components/content/HomeCategoryCards';
import {
  COMPARISON_LINKS,
  DECISION_LINKS,
} from '@/lib/content/navigation';
import { HOME_FAQS } from '@/lib/content/faqs';
import { faqJsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'PickTheRobot — Pick the right robot for your business',
  description:
    'Business robot buying guide and matcher. Compare warehouse, cleaning, and restaurant robots by fit, lease vs buy, and vendor options.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={faqJsonLd(HOME_FAQS)} />

      <div className="container-page py-8 sm:py-10">
        <section className="mb-8 border-b border-surface-border pb-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr,min(360px,40%)]">
            <div>
              <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Pick the right robot for your business
              </h1>
              <p className="mt-2 max-w-2xl text-ink-muted">
                Compare warehouse, cleaning, and restaurant robots by fit, cost model, and deployment
                style. Use the matcher below to get a recommendation in about two minutes.
              </p>
            </div>
            <HomeHeroIllustration className="mx-auto hidden w-full max-w-sm lg:block" />
          </div>
        </section>

        <section id="matcher" className="mb-14 scroll-mt-8">
          <Suspense fallback={<MatcherSkeleton />}>
            <MatchingTool />
          </Suspense>
        </section>

        <StickyMatcherCta href="#matcher" />

        <section className="mb-10 grid items-start gap-6 sm:grid-cols-2" aria-label="Guides and comparisons">
          <div>
            <h2 className="mb-3 text-lg font-semibold">Comparisons</h2>
            <ul className="space-y-2 text-sm">
              {COMPARISON_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-medium text-accent hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-semibold">Acquisition guides</h2>
            <ul className="space-y-2 text-sm">
              {DECISION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-medium text-accent hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mb-10">
          <HomeCategoryGuideLinks />
        </div>

        <div className="mb-10 grid items-start gap-6 lg:grid-cols-2">
          <MethodologySection />
          <section className="card text-sm prose-muted">
            <h2 className="text-lg font-semibold text-ink">How we rank vendors</h2>
            <p className="mt-2">
              Vendors are scored on category fit, robot type support, acquisition model, budget
              tier, facility size, and deployment complexity. We do not invent ROI percentages or
              performance guarantees.
            </p>
            <p className="mt-2">
              The matcher is free today. We may add referral or sponsored partnerships later; any
              would be disclosed. Confirm pricing with vendors directly.
            </p>
          </section>
        </div>

        <FaqBlock items={HOME_FAQS} title="Common questions" />
      </div>
    </>
  );
}
