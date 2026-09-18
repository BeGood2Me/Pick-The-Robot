import type { HomeVacuumAnswers, WizardHomeVacuumAnswers } from './types';

export interface HomeVacuumFieldOption {
  value: string;
  label: string;
}

export interface HomeVacuumField {
  key: keyof HomeVacuumAnswers;
  label: string;
  helpText?: string;
  type: 'select' | 'boolean';
  options?: HomeVacuumFieldOption[];
}

export interface HomeVacuumFieldGroup {
  title: string;
  description?: string;
  fields: HomeVacuumField[];
}

export const HOME_VACUUM_FIELD_GROUPS: HomeVacuumFieldGroup[] = [
  {
    title: 'Floors & space',
    description: 'Used for carpet vs hard-floor fit and dock size.',
    fields: [
      {
        key: 'floorMix',
        label: 'Main floors',
        type: 'select',
        helpText: 'Pick the surface the robot will clean most days.',
        options: [
          { value: 'hard', label: 'Mostly hard floors (tile, wood, vinyl)' },
          { value: 'carpet', label: 'Mostly carpet or rugs' },
          { value: 'mixed', label: 'Mix of hard floors and carpet' },
        ],
      },
      {
        key: 'homeSize',
        label: 'Home size',
        type: 'select',
        options: [
          { value: 'small', label: 'Small — studio or 1 bedroom' },
          { value: 'medium', label: 'Medium — 2–3 bedrooms' },
          { value: 'large', label: 'Large — 4+ bedrooms or open plan' },
        ],
      },
      {
        key: 'multiFloor',
        label: 'More than one level?',
        type: 'boolean',
        helpText: 'Multi-floor maps help if you carry the robot between stories.',
        options: [
          { value: 'false', label: 'Single floor' },
          { value: 'true', label: 'Two or more floors' },
        ],
      },
    ],
  },
  {
    title: 'Pets, hair & mopping',
    fields: [
      {
        key: 'pets',
        label: 'Pets',
        type: 'select',
        options: [
          { value: 'none', label: 'No pets' },
          { value: 'cat', label: 'Cat(s)' },
          { value: 'dog', label: 'Dog(s)' },
          { value: 'both', label: 'Cats and dogs' },
        ],
      },
      {
        key: 'hairLength',
        label: 'Hair on the floor',
        type: 'select',
        helpText: 'Long hair and pet fur clog brushes on weaker models.',
        options: [
          { value: 'none', label: 'Not much hair' },
          { value: 'short', label: 'Short hair / light shed' },
          { value: 'long', label: 'Long hair or heavy shed' },
        ],
      },
      {
        key: 'mopNeeded',
        label: 'Do you want mopping?',
        type: 'select',
        options: [
          { value: 'no', label: 'Vacuum only' },
          { value: 'nice_to_have', label: 'Mop would be nice' },
          { value: 'yes', label: 'I want vacuum + mop' },
        ],
      },
    ],
  },
  {
    title: 'Budget & extras',
    fields: [
      {
        key: 'budgetBand',
        label: 'Budget',
        type: 'select',
        helpText: 'Typical street prices in USD — not a quote.',
        options: [
          { value: 'under_300', label: 'Under $300' },
          { value: '300_600', label: '$300–$600' },
          { value: '600_1000', label: '$600–$1,000' },
          { value: 'over_1000', label: 'Over $1,000' },
        ],
      },
      {
        key: 'selfEmpty',
        label: 'Self-empty dock',
        type: 'select',
        options: [
          { value: 'not_needed', label: 'Not needed' },
          { value: 'preferred', label: 'Nice to have' },
          { value: 'required', label: 'Required' },
        ],
      },
      {
        key: 'obstacles',
        label: 'Clutter and cables',
        type: 'select',
        options: [
          { value: 'low', label: 'Mostly open floors' },
          { value: 'medium', label: 'Some chairs, toys, or cables' },
          { value: 'high', label: 'Busy rooms — lots of obstacles' },
        ],
      },
    ],
  },
];

export function emptyHomeVacuumAnswers(): WizardHomeVacuumAnswers {
  return {};
}

const ALLOWED: { [K in keyof HomeVacuumAnswers]: readonly HomeVacuumAnswers[K][] } = {
  floorMix: ['hard', 'carpet', 'mixed'],
  homeSize: ['small', 'medium', 'large'],
  pets: ['none', 'cat', 'dog', 'both'],
  hairLength: ['none', 'short', 'long'],
  mopNeeded: ['no', 'nice_to_have', 'yes'],
  budgetBand: ['under_300', '300_600', '600_1000', 'over_1000'],
  selfEmpty: ['not_needed', 'preferred', 'required'],
  multiFloor: [false, true],
  obstacles: ['low', 'medium', 'high'],
};

function isAllowed<K extends keyof HomeVacuumAnswers>(
  key: K,
  value: unknown,
): value is HomeVacuumAnswers[K] {
  return (ALLOWED[key] as readonly unknown[]).includes(value);
}

export function getHomeVacuumFieldErrors(
  answers: WizardHomeVacuumAnswers,
  keys?: (keyof HomeVacuumAnswers)[],
): Record<string, string> {
  const check = keys ?? HOME_VACUUM_FIELD_GROUPS.flatMap((g) => g.fields.map((f) => f.key));
  const errors: Record<string, string> = {};
  for (const key of check) {
    const value = answers[key];
    if (value === undefined) {
      errors[key] = 'This field is required.';
    } else if (!isAllowed(key, value)) {
      errors[key] = 'This field is required.';
    }
  }
  return errors;
}

export function isCompleteHomeVacuumAnswers(
  answers: WizardHomeVacuumAnswers,
): answers is HomeVacuumAnswers {
  return Object.keys(getHomeVacuumFieldErrors(answers)).length === 0;
}
