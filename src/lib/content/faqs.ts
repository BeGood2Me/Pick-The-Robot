import type { FaqItem } from '@/lib/seo/schema';

export const HOME_FAQS: FaqItem[] = [
  {
    question: 'Is PickTheRobot for homes or businesses?',
    answer:
      'Both, as two separate tracks. Home is robot vacuums matched to floors, pets, mopping, and budget. Business is warehouse, commercial cleaning, and restaurant robots — type, buy vs lease vs RaaS, and vendors. The wizards are not mixed.',
  },
  {
    question: 'How does PickTheRobot choose a robot?',
    answer:
      'We use a rules-based engine that scores options on use-case fit, economic fit, and deployment fit from your answers. There is no black-box AI — the logic is deterministic and transparent.',
  },
  {
    question: 'Are robot vacuum rankings based on lab tests?',
    answer:
      'No. Home results match public specs to your constraints. We are not RTINGS or Vacuum Wars. Confirm price, firmware, and reviews before you buy. Some product links may be affiliates.',
  },
  {
    question: 'Does this replace talking to vendors?',
    answer:
      'No. The business matcher narrows robot types and vendors, then links you to official sites. You still validate pricing, demos, and contracts directly.',
  },
  {
    question: 'What business categories are supported?',
    answer:
      'Warehouse, commercial cleaning, and restaurant robots. Each category has its own questions and robot types. Home robot vacuums use a separate catalog of product models.',
  },
  {
    question: 'How long does a matcher take?',
    answer:
      'Most people finish in under two minutes. Pick a track, answer a short wizard, and get scored results immediately in the browser.',
  },
  {
    question: 'Do I need an account or email?',
    answer:
      'No. Matchers run in your browser without signup. Share links encode answers in the URL if you want to send results to someone else.',
  },
  {
    question: 'Are rankings paid?',
    answer:
      'Fit comes first. Sponsored business vendors are disclosed and only boost listings that already match your profile. Home product links may be affiliates; that does not change the score.',
  },
];

import { METHODOLOGY_SUMMARY } from '@/lib/content/methodology';

export const METHODOLOGY_COPY = {
  title: 'How matching works',
  paragraphs: [...METHODOLOGY_SUMMARY],
};
