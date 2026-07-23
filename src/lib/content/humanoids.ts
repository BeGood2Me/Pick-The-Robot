import humanoidsData from '@/data/humanoids.json';

export const HUMANOID_HUB_PATH = '/humanoid-robots';

export type HumanoidReadiness = 'research' | 'pilot' | 'early-commercial';

export interface HumanoidMatcherAlternative {
  href: string;
  label: string;
  reason: string;
}

export interface HumanoidCompany {
  id: string;
  slug: string;
  name: string;
  productName: string;
  shortDescription: string;
  readiness: HumanoidReadiness;
  headquarters: string;
  regions: string[];
  targetUseCases: string[];
  strengths: string[];
  limitations: string[];
  matcherAlternative: HumanoidMatcherAlternative;
  outboundUrl: string;
}

export const HUMANOID_READINESS_LABELS: Record<HumanoidReadiness, string> = {
  research: 'Research & demos',
  pilot: 'Enterprise pilots',
  'early-commercial': 'Early commercial',
};

const humanoids = humanoidsData as HumanoidCompany[];

export function getAllHumanoids(): HumanoidCompany[] {
  return humanoids;
}

export function getHumanoidBySlug(slug: string): HumanoidCompany | undefined {
  return humanoids.find((h) => h.slug === slug);
}

export function humanoidProfilePath(slug: string): string {
  return `/humanoids/${slug}`;
}

export const HUMANOID_HUB = {
  title: 'Humanoid robots — research tracker & buyer guide',
  h1: 'Humanoid robots',
  metaDescription:
    'Track Figure, Apptronik, 1X, Neura, and Boston Dynamics humanoids — readiness, use cases, and when AMRs or scrubbers are the practical choice today.',
  intro:
    'Humanoid robots dominate headlines, but most operators cannot buy them like an AMR or scrubber yet. PickTheRobot tracks major platforms for research — and routes you to deployable warehouse, cleaning, and restaurant robots when you need automation this year.',
  sections: [
    {
      heading: 'Match vs Track',
      paragraphs: [
        'Match is our scored matcher for robots you can procure today. Track is editorial coverage of humanoids — profiles, comparisons, and honest readiness labels — without fake fit scores.',
      ],
    },
    {
      heading: 'When a humanoid might make sense (eventually)',
      bullets: [
        'Human-scale environments with varied manipulation tasks',
        'Enterprise pilots with vendor engineering support',
        'Facilities willing to co-develop workflows over 12–24 months',
      ],
    },
    {
      heading: 'What to deploy instead in 2026',
      bullets: [
        'Warehouse transport → AMRs or AGVs',
        'Picking pain → pick-assist AMRs',
        'Floor cleaning → autonomous scrubbers or vacuums',
        'Restaurant running → serving robots in open layouts',
      ],
    },
  ],
  faqs: [
    {
      question: 'Can I buy a Figure or Apptronik humanoid today?',
      answer:
        'Most buyers cannot order from a public catalog. Programs are pilot-based with enterprise sales and integration. Use our profiles for research — use the warehouse matcher for deployable options.',
    },
    {
      question: 'Why are humanoids not in the matcher?',
      answer:
        'We only score robots when operators can realistically shortlist, pilot, and procure with transparent workflow fit. Humanoids are tracked separately until buyer programs mature.',
    },
    {
      question: 'Is Tesla Optimus included?',
      answer:
        'Yes — see our Tesla Optimus research profile. It is not in the matcher until a real commercial buyer program exists.',
    },
  ],
  relatedLinks: [
    { href: '/humanoid-vs-amr', label: 'Humanoid vs AMR for warehouses' },
    { href: '/warehouse-robots#matcher', label: 'Warehouse matcher' },
    { href: '/amr-vs-agv', label: 'AMR vs AGV' },
    { href: '/vendors', label: 'Deployable vendor index' },
  ],
} as const;
