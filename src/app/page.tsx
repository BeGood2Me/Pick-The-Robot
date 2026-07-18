import { Suspense } from 'react';
import { HomeHeroIllustration } from '@/components/brand/HomeHeroIllustration';
import { FaqBlock } from '@/components/content/FaqBlock';
import { HomeExploreStrip } from '@/components/content/HomeExploreStrip';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import { MatcherSkeleton } from '@/components/matching/MatcherSkeleton';
import { MatchingTool } from '@/components/matching/MatchingToolLoader';
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
        <section className="animate-fade-up mb-6 border-b border-surface-border pb-6 sm:mb-8 sm:pb-8">
          <div className="grid items-center gap-6 sm:grid-cols-[1fr,min(280px,36%)] lg:gap-8">
            <div>
              <h1 className="font-display text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
                Pick the right robot for your business
              </h1>
              <p className="mt-3 max-w-md text-base text-ink-muted">
                Warehouse, cleaning, and restaurant — under two minutes.
              </p>
            </div>
            <HomeHeroIllustration className="mx-auto hidden w-full max-w-[240px] sm:block lg:max-w-sm" />
          </div>
        </section>

        <section id="matcher" className="mb-10 scroll-mt-8 sm:mb-12">
          <Suspense fallback={<MatcherSkeleton />}>
            <MatchingTool />
          </Suspense>
        </section>

        <StickyMatcherCta href="#matcher" />

        <HomeExploreStrip />

        <FaqBlock items={HOME_FAQS} title="Common questions" defaultOpen={null} />
      </div>
    </>
  );
}
