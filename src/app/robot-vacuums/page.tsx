import Link from 'next/link';
import { FaqBlock } from '@/components/content/FaqBlock';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import { HomeVacuumMatcher } from '@/components/home-vacuums/HomeVacuumMatcherLoader';
import { ButtonLink } from '@/components/ui/Button';
import {
  BUSINESS_HUB_PATH,
  HOME_HUB_PATH,
  ROBOT_VACUUMS_FAQS,
  ROBOT_VACUUMS_INTRO,
  ROBOT_VACUUMS_META,
  ROBOT_VACUUMS_PATH,
} from '@/lib/content/home-vacuums';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: ROBOT_VACUUMS_META.title,
  description: ROBOT_VACUUMS_META.description,
  path: ROBOT_VACUUMS_PATH,
});

export default function RobotVacuumsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Home robots', path: HOME_HUB_PATH },
          { name: ROBOT_VACUUMS_META.h1, path: ROBOT_VACUUMS_PATH },
        ])}
      />
      <JsonLd data={faqJsonLd(ROBOT_VACUUMS_FAQS)} />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Home robots', href: HOME_HUB_PATH },
            { label: 'Robot vacuums' },
          ]}
        />
        <h1 className="font-display text-4xl font-semibold">{ROBOT_VACUUMS_META.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">{ROBOT_VACUUMS_INTRO}</p>
        <p className="mt-3 text-sm text-ink-muted">
          Looking for a commercial floor scrubber?{' '}
          <Link href={BUSINESS_HUB_PATH} className="font-medium text-accent hover:underline">
            Use the business robot matcher
          </Link>
          .
        </p>

        <section id="matcher" className="mt-10 scroll-mt-8">
          <HomeVacuumMatcher />
        </section>

        <div className="mt-12">
          <FaqBlock items={ROBOT_VACUUMS_FAQS} title="Robot vacuum questions" />
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
