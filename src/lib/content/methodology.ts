import type { FaqItem } from '@/lib/seo/schema';

export const METHODOLOGY_PATH = '/methodology';

export const METHODOLOGY_META = {
  title: 'How matching works',
  description:
    'How PickTheRobot scores warehouse, cleaning, and restaurant robots: rules-based weights, vendor ranking, sponsored disclosure, and what we do not guarantee.',
} as const;

export const METHODOLOGY_LAST_UPDATED = 'August 2026';

/** Short bullets for About page and other summaries. */
export const METHODOLOGY_SUMMARY = [
  'You answer operational questions — floor size, pain points, labor cost, layout, and budget preference.',
  'Each robot type receives three scores: use-case fit (45%), economic fit (35%), and deployment fit (20%).',
  'Vendors are ranked against your top robot type and recommended acquisition model.',
  'Sponsored listings receive a small boost only when already a reasonable fit — never enough to override poor relevance.',
  'Cleaning, warehouse, and restaurant results may include an indicative labor offset from published cost bands. We do not promise payback, headcount cuts, or vendor performance.',
] as const;

export const SCORING_DIMENSIONS = [
  {
    name: 'Use-case fit',
    weight: '45%',
    summary:
      'How well a robot type matches your stated pain point, load profile, layout, and category-specific inputs (e.g. picks per day, floor area, table count).',
  },
  {
    name: 'Economic fit',
    weight: '35%',
    summary:
      'Alignment between your budget preference, labor cost context, and typical acquisition models (buy, lease, RaaS) for that robot type.',
  },
  {
    name: 'Deployment fit',
    weight: '20%',
    summary:
      'Technology readiness, integration prerequisites (such as WMS readiness in warehouses), region, and deployment complexity signals.',
  },
] as const;

export const MATCH_CONFIDENCE_EXPLAINER = {
  title: 'Match confidence',
  paragraphs: [
    'Results include a confidence label — strong, moderate, or weak — when your inputs suggest an unusually good or poor fit across robot types.',
    'Weak confidence means the engine sees tension in your profile (for example low volume with high automation ambition, or missing integration readiness). It is not a verdict that automation is impossible — it is a prompt to validate assumptions with vendors and a site walk.',
    'We do not use confidence labels to rank vendors up or down. They describe the recommendation quality for your inputs, not vendor quality.',
  ],
} as const;

export const VENDOR_RANKING_RULES = [
  'Vendors must support your category, recommended robot type, acquisition model, and listed region to appear in the shortlist.',
  'Overall match combines the same three dimensions, weighted toward use-case and economic fit for vendor comparison.',
  'Vendors below a minimum match threshold are excluded and may show an explanatory reason.',
  'Sponsored vendors receive a small score adjustment (+3 points) only when overall match is already at least 40 — enough to break ties among similar fits, not to promote irrelevant vendors.',
  'Sponsored listings are labeled on vendor cards and profile pages.',
] as const;

export const SPONSORSHIP_POLICY = {
  title: 'Sponsored listings & referrals',
  paragraphs: [
    'PickTheRobot is free for buyers. We may earn revenue from outbound vendor traffic through referral or affiliate links, or from disclosed sponsored placements when commercial relationships exist.',
    'Sponsorship does not buy placement for vendors that do not match your profile. A sponsored vendor with poor fit should still rank below a stronger non-sponsored match.',
    'We disclose sponsorship where it applies. Terms of use describe affiliate and sponsored listings in more detail.',
  ],
} as const;

export const WHAT_WE_DO_NOT_CLAIM = [
  'Binding quotes, contracts, or availability from any vendor',
  'Guaranteed ROI, payback periods, or labor savings on every site',
  'Safety certification, regulatory compliance, or fitness for your jurisdiction',
  'On-site deployment, integration, or engineering services',
  'Endorsement of any vendor — outbound links are for your research convenience',
] as const;

export const EDITORIAL_STANDARDS = [
  'Blog and guide price ranges are illustrative — useful for budgeting before vendor quotes, not substitutes for written proposals.',
  'Vendor profiles reflect publicly stated positioning. Confirm specifications, pricing, and regional support directly with vendors.',
  'Humanoid Track content is editorial coverage with readiness labels — not scored matcher results for robots you cannot procure like standard AMRs.',
  'We update scoring rules and content when categories or market norms shift materially. Scoring logic is rules-based and deterministic, not machine-learning black box output.',
] as const;

export const METHODOLOGY_FAQS: FaqItem[] = [
  {
    question: 'Is PickTheRobot AI or machine learning?',
    answer:
      'No. Scoring is rules-based and deterministic from your answers. The same inputs produce the same results. Explanations reference the criteria that moved each score.',
  },
  {
    question: 'Can a vendor pay to rank first?',
    answer:
      'Fit comes first. Sponsored vendors may receive a small boost only when they already match your profile reasonably well. They cannot buy their way to the top of an irrelevant shortlist.',
  },
  {
    question: 'Does the matcher replace vendor demos?',
    answer:
      'No. It narrows robot types and vendors to investigate. You should still validate pricing, pilots, integration scope, and contracts directly with vendors.',
  },
  {
    question: 'Are labor offset numbers guaranteed savings?',
    answer:
      'No. Matcher results may show indicative labor offset ranges from published cost bands and your inputs. They are budgeting aids across warehouse, cleaning, and restaurant categories — not promises of headcount reduction or payback.',
  },
];
