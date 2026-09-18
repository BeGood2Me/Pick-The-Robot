'use client';



import { HomeBenefits } from '@/components/home/HomeBenefits';

import { HomeFinalCta } from '@/components/home/HomeFinalCta';

import { HomeHero } from '@/components/home/HomeHero';

import { HomeHowItWorks } from '@/components/home/HomeHowItWorks';

import { HomeTaglineReveal } from '@/components/home/HomeTaglineReveal';

import { FaqBlock } from '@/components/content/FaqBlock';

import { HomeSeoGuides } from '@/components/content/HomeSeoGuides';

import { HomeExploreStrip } from '@/components/content/HomeExploreStrip';

import { HomeTracks } from '@/components/home-vacuums/HomeTracks';

import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';

import { HOME_FAQS } from '@/lib/content/faqs';



export function HomePageContent() {

  return (

    <div className="no-print">

      <HomeHero />

      <HomeTracks />

      <StickyMatcherCta href="#tracks" />

      <HomeBenefits />

      <HomeHowItWorks />

      <HomeTaglineReveal />

      <HomeExploreStrip />

      <HomeSeoGuides />

      <FaqBlock items={HOME_FAQS} title="Common questions" defaultOpen={null} />

      <HomeFinalCta />

    </div>

  );

}

