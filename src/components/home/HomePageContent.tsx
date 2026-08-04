'use client';

import { useCallback, useState } from 'react';
import { HomeBenefits } from '@/components/home/HomeBenefits';
import { HomeFinalCta } from '@/components/home/HomeFinalCta';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeHowItWorks } from '@/components/home/HomeHowItWorks';
import { HomeTaglineReveal } from '@/components/home/HomeTaglineReveal';
import { FaqBlock } from '@/components/content/FaqBlock';
import { HomeExploreStrip } from '@/components/content/HomeExploreStrip';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import {
  MatchingTool,
  type MatcherPhase,
} from '@/components/matching/MatchingToolLoader';
import { HOME_FAQS } from '@/lib/content/faqs';

/**
 * Homepage shell: landing sections only while the matcher is on the category picker.
 * Hidden during questions/results so print-to-PDF and the wizard stay focused.
 */
export function HomePageContent() {
  const [phase, setPhase] = useState<MatcherPhase>('category');
  const showLanding = phase === 'category';
  const onPhaseChange = useCallback((next: MatcherPhase) => {
    setPhase(next);
  }, []);

  return (
    <>
      {showLanding && (
        <div className="no-print">
          <HomeHero />
        </div>
      )}

      <section id="matcher" className="mb-12 scroll-mt-8 sm:mb-16">
        <MatchingTool onPhaseChange={onPhaseChange} />
      </section>

      {showLanding && (
        <div className="no-print">
          <StickyMatcherCta href="#matcher" />
          <HomeBenefits />
          <HomeHowItWorks />
          <HomeTaglineReveal />
          <HomeExploreStrip />
          <FaqBlock items={HOME_FAQS} title="Common questions" defaultOpen={null} />
          <HomeFinalCta />
        </div>
      )}
    </>
  );
}
