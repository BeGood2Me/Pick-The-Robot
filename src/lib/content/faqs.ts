import type { FaqItem } from '@/lib/seo/schema';

export const HOME_FAQS: FaqItem[] = [
  {
    question: 'How does PickTheRobot choose a robot?',
    answer:
      'We use a rules-based engine that scores robot types on use-case fit, economic fit, and deployment fit from your answers. There is no black-box AI — the logic is deterministic and transparent.',
  },
  {
    question: 'Does this replace talking to vendors?',
    answer:
      'No. We narrow options and explain why, then link you to vendors that match. You still validate pricing, demos, and contracts directly.',
  },
  {
    question: 'What categories are supported?',
    answer:
      'Warehouse, cleaning, and restaurant robots at launch. Each category has its own questions and robot types.',
  },
  {
    question: 'How do you make money?',
    answer:
      'The matcher is free today. We may add referral or sponsored partnerships later.',
  },
  {
    question: 'Should I buy, lease, or use RaaS?',
    answer:
      'It depends on upfront budget, utilization stability, and tech readiness. The matcher recommends a primary acquisition model and explains why.',
  },
];

export const METHODOLOGY_COPY = {
  title: 'How matching works',
  paragraphs: [
    'You answer operational questions — floor size, pain points, labor cost, layout, and budget preference.',
    'Each robot type receives three scores: use-case fit (45%), economic fit (35%), and deployment fit (20%).',
    'Vendors are ranked against your top robot type and recommended acquisition model. If we add sponsored partnerships later, they will be disclosed and will not override fit.',
    'We do not invent ROI percentages or performance guarantees. Explanations describe fit, not vendor superiority.',
  ],
};
