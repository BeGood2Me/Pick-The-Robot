export const HOME_HERO = {
  h1: 'Pick the right robot for your warehouse, floor, or restaurant',
  subhead:
    'Answer a short wizard. Get a scored robot type, buy vs lease vs RaaS, and a ranked vendor list — free, no account.',
  ctaLabel: 'Start matching',
  ctaHref: '#matcher',
  proof: 'Rules-based scoring. No black-box AI. Under two minutes.',
} as const;

export const HOME_BENEFITS = [
  {
    title: 'Shortlist in one sitting',
    body: 'Stop tabbing through vendor sites before you know which robot type fits your operation.',
  },
  {
    title: 'Know buy vs lease vs RaaS',
    body: 'Acquisition guidance from your budget and utilization answers — not a one-size pitch.',
  },
  {
    title: 'See why vendors rank',
    body: 'Explanations tied to your inputs. Sponsored boosts never override fit when they appear.',
  },
] as const;

export const HOME_HOW_IT_WORKS = {
  title: 'How matching works',
  steps: [
    {
      title: 'Answer a few questions',
      body: 'Pick warehouse, cleaning, or restaurant, then share floor size, pain points, labor, and budget preference.',
    },
    {
      title: 'Get scored robot types',
      body: 'We score on use-case fit (45%), economic fit (35%), and deployment fit (20%) — deterministic rules, not a black box.',
    },
    {
      title: 'Review ranked vendors',
      body: 'See matched vendors with reasons, then open outbound links when you are ready to talk to sales.',
    },
  ],
} as const;

export const HOME_TAGLINE_LINES = [
  'Match the robot to the job.',
  'Not the loudest vendor pitch.',
] as const;

export const HOME_FINAL_CTA = {
  title: 'Ready to shortlist?',
  body: 'Free matcher. No account. Under two minutes.',
  ctaLabel: 'Start matching',
  ctaHref: '#matcher',
} as const;
