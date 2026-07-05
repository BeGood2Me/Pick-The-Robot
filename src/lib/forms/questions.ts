import type { RobotCategory } from '../matching/types';

export type FieldType = 'number' | 'select';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  min?: number;
  max?: number;
  step?: number;
  options?: SelectOption[];
  helpText?: string;
  /** When true, UI offers sq ft / m² toggle (stored internally as m²). */
  areaUnit?: boolean;
}

const BASE_FIELDS: FormField[] = [
  {
    key: 'laborCostPerHour',
    label: 'Average labor cost ($/hour)',
    type: 'number',
    min: 0,
    step: 1,
    helpText: 'Fully loaded hourly cost for the roles automation would augment.',
  },
  {
    key: 'hoursPerDay',
    label: 'Operating hours per day',
    type: 'number',
    min: 1,
    max: 24,
    helpText: 'Total hours the site operates per day, not just peak periods.',
  },
  {
    key: 'daysPerWeek',
    label: 'Operating days per week',
    type: 'number',
    min: 1,
    max: 7,
  },
  {
    key: 'staffingPressure',
    label: 'Staffing pressure',
    type: 'select',
    helpText: 'How hard is it to hire and retain staff for this work?',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
  },
  {
    key: 'budgetPreference',
    label: 'Budget preference',
    type: 'select',
    helpText: 'Low upfront favors RaaS; long-term ROI favors purchase when utilization is high.',
    options: [
      { value: 'low_upfront', label: 'Low upfront cost' },
      { value: 'balanced', label: 'Balanced' },
      { value: 'maximize_long_term_roi', label: 'Maximize long-term ROI' },
    ],
  },
  {
    key: 'acquisitionPreference',
    label: 'Acquisition preference',
    type: 'select',
    helpText: 'Leave as “recommend for me” unless you already know buy vs lease vs RaaS.',
    options: [
      { value: 'open', label: 'No preference — recommend for me' },
      { value: 'buy', label: 'Buy' },
      { value: 'lease', label: 'Lease' },
      { value: 'raas', label: 'RaaS (subscription)' },
    ],
  },
  {
    key: 'techReadiness',
    label: 'Technology readiness',
    type: 'select',
    helpText: 'Experience with WMS, robots, or automation integrations on your team.',
    options: [
      { value: 'low', label: 'Low — new to automation' },
      { value: 'medium', label: 'Medium — some experience' },
      { value: 'high', label: 'High — experienced team' },
    ],
  },
  {
    key: 'region',
    label: 'Region',
    type: 'select',
    helpText: 'Used to filter vendors that operate in your market.',
    options: [
      { value: 'US', label: 'United States' },
      { value: 'EU', label: 'Europe' },
      { value: 'UK', label: 'United Kingdom' },
      { value: 'APAC', label: 'Asia-Pacific' },
    ],
  },
];

const WAREHOUSE_FIELDS: FormField[] = [
  {
    key: 'facilitySizeSqM',
    label: 'Facility size',
    type: 'number',
    min: 0,
    areaUnit: true,
    helpText: 'Total operational floor area. Toggle sq ft or m² — we store in m².',
  },
  { key: 'ordersPerDay', label: 'Orders per day', type: 'number', min: 0, helpText: 'Outbound orders or shipments per day.' },
  { key: 'picksPerDay', label: 'Picks per day', type: 'number', min: 0, helpText: 'Total pick lines per day across all shifts.' },
  {
    key: 'mainPainPoint',
    label: 'Main pain point',
    type: 'select',
    helpText: 'The single biggest workflow problem you want automation to address.',
    options: [
      { value: 'transport', label: 'Material transport' },
      { value: 'picking', label: 'Picking efficiency' },
      { value: 'pallet_movement', label: 'Pallet movement' },
      { value: 'inventory', label: 'Inventory accuracy' },
      { value: 'labor_shortage', label: 'Labor shortage' },
    ],
  },
  {
    key: 'loadType',
    label: 'Primary load type',
    type: 'select',
    options: [
      { value: 'light_items', label: 'Light items' },
      { value: 'mixed_totes', label: 'Mixed totes' },
      { value: 'pallets', label: 'Pallets' },
    ],
  },
  {
    key: 'layoutStability',
    label: 'Layout stability',
    type: 'select',
    helpText: 'How often pick faces, staging, or routes change.',
    options: [
      { value: 'stable', label: 'Stable' },
      { value: 'some_change', label: 'Some changes' },
      { value: 'frequent_change', label: 'Frequent changes' },
    ],
  },
  {
    key: 'aisleConstraints',
    label: 'Aisle width',
    type: 'select',
    options: [
      { value: 'tight', label: 'Tight' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'wide', label: 'Wide' },
    ],
  },
  {
    key: 'wmsReadiness',
    label: 'WMS readiness',
    type: 'select',
    helpText: 'Warehouse management system integration readiness for pick-assist and AGVs.',
    options: [
      { value: 'none', label: 'None' },
      { value: 'partial', label: 'Partial' },
      { value: 'ready', label: 'Ready for integration' },
    ],
  },
  {
    key: 'temperatureZone',
    label: 'Temperature zone',
    type: 'select',
    helpText: 'Cold-chain sites add hardware and deployment constraints.',
    options: [
      { value: 'ambient', label: 'Ambient' },
      { value: 'cold', label: 'Cold chain / refrigerated' },
    ],
  },
];

const CLEANING_FIELDS: FormField[] = [
  {
    key: 'floorAreaSqM',
    label: 'Floor area',
    type: 'number',
    min: 0,
    areaUnit: true,
    helpText: 'Total cleanable floor area. Toggle sq ft or m² — we store in m².',
  },
  {
    key: 'environmentType',
    label: 'Environment type',
    type: 'select',
    helpText: 'Primary building use — drives robot class (office vs industrial).',
    options: [
      { value: 'office', label: 'Office' },
      { value: 'retail', label: 'Retail' },
      { value: 'warehouse', label: 'Warehouse' },
      { value: 'industrial', label: 'Industrial' },
      { value: 'mixed', label: 'Mixed' },
    ],
  },
  {
    key: 'cleaningFrequencyPerDay',
    label: 'Cleaning frequency (times per day)',
    type: 'number',
    min: 0,
    step: 0.5,
    helpText: 'Average full cleaning passes per day across the site.',
  },
  {
    key: 'messLevel',
    label: 'Typical mess level',
    type: 'select',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'heavy', label: 'Heavy' },
    ],
  },
  {
    key: 'obstacleComplexity',
    label: 'Obstacle complexity',
    type: 'select',
    helpText: 'Furniture, cords, displays, and foot traffic that robots must navigate.',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
  },
  {
    key: 'cleaningType',
    label: 'Primary cleaning type',
    type: 'select',
    options: [
      { value: 'vacuum', label: 'Vacuum' },
      { value: 'scrub', label: 'Scrub' },
      { value: 'sweep', label: 'Sweep' },
      { value: 'combo', label: 'Combo' },
    ],
  },
  {
    key: 'floorSurface',
    label: 'Floor surface',
    type: 'select',
    helpText: 'Carpet favors vacuums; hard floors favor scrubbers.',
    options: [
      { value: 'hard', label: 'Hard (tile, concrete, vinyl)' },
      { value: 'carpet', label: 'Mostly carpet' },
      { value: 'mixed', label: 'Mixed' },
    ],
  },
  {
    key: 'cleaningLaborCostPerHour',
    label: 'Janitorial labor cost ($/hour)',
    type: 'number',
    min: 0,
    step: 1,
    helpText: 'Hourly cost for cleaning staff specifically. Defaults to general labor cost if similar.',
  },
  {
    key: 'staffAssignedToCleaning',
    label: 'Staff assigned to cleaning',
    type: 'number',
    min: 0,
  },
];

const RESTAURANT_FIELDS: FormField[] = [
  {
    key: 'venueType',
    label: 'Venue type',
    type: 'select',
    helpText: 'Service model affects which robot classes are practical.',
    options: [
      { value: 'qsr', label: 'Quick service (QSR)' },
      { value: 'full_service', label: 'Full service' },
      { value: 'buffet', label: 'Buffet' },
      { value: 'hotel_restaurant', label: 'Hotel restaurant' },
      { value: 'food_hall', label: 'Food hall' },
    ],
  },
  {
    key: 'seatsPerDay',
    label: 'Covers (seats served) per day',
    type: 'number',
    min: 0,
    helpText: 'Total guests served across all dayparts.',
  },
  {
    key: 'peakHoursPerDay',
    label: 'Peak service hours per day',
    type: 'number',
    min: 0,
    helpText: 'Hours when the dining room is at busiest — must not exceed operating hours.',
  },
  {
    key: 'tableCount',
    label: 'Table count (optional)',
    type: 'number',
    min: 0,
    helpText: 'Improves layout and vendor fit for full-service venues. Leave 0 if unknown.',
  },
  {
    key: 'mainPainPoint',
    label: 'Main pain point',
    type: 'select',
    options: [
      { value: 'food_running', label: 'Food running' },
      { value: 'bussing', label: 'Bussing / table turnover' },
      { value: 'kitchen_bottleneck', label: 'Kitchen bottleneck' },
      { value: 'staff_shortage', label: 'Staff shortage' },
      { value: 'guest_guidance', label: 'Guest guidance' },
    ],
  },
  {
    key: 'layoutComplexity',
    label: 'Layout complexity',
    type: 'select',
    helpText: 'How tight are dining paths and table spacing?',
    options: [
      { value: 'tight', label: 'Tight' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'open', label: 'Open' },
    ],
  },
  {
    key: 'aisleWidth',
    label: 'Aisle width',
    type: 'select',
    options: [
      { value: 'narrow', label: 'Narrow' },
      { value: 'normal', label: 'Normal' },
      { value: 'wide', label: 'Wide' },
    ],
  },
  {
    key: 'serviceIntensity',
    label: 'Service intensity',
    type: 'select',
    helpText: 'How fast-paced is service during peak periods?',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
  },
];

export function getFormFields(category: RobotCategory): FormField[] {
  const categoryFields =
    category === 'warehouse'
      ? WAREHOUSE_FIELDS
      : category === 'cleaning'
        ? CLEANING_FIELDS
        : RESTAURANT_FIELDS;
  return [...BASE_FIELDS, ...categoryFields];
}

export type StepIconId =
  | 'labor'
  | 'staffing'
  | 'budget'
  | 'readiness'
  | 'facility'
  | 'workflow'
  | 'specifics';

export interface FormFieldGroup {
  title: string;
  description?: string;
  fields: FormField[];
  icon?: StepIconId;
}

export function getFormFieldGroups(category: RobotCategory): FormFieldGroup[] {
  const categoryFields =
    category === 'warehouse'
      ? WAREHOUSE_FIELDS
      : category === 'cleaning'
        ? CLEANING_FIELDS
        : RESTAURANT_FIELDS;

  const laborFields = BASE_FIELDS.filter((f) =>
    ['laborCostPerHour', 'hoursPerDay', 'daysPerWeek'].includes(f.key),
  );
  const staffingField = BASE_FIELDS.filter((f) => f.key === 'staffingPressure');
  const budgetFields = BASE_FIELDS.filter((f) =>
    ['budgetPreference', 'acquisitionPreference'].includes(f.key),
  );
  const readinessFields = BASE_FIELDS.filter((f) =>
    ['techReadiness', 'region'].includes(f.key),
  );

  const categorySteps: FormFieldGroup[] = [];
  if (category === 'warehouse') {
    categorySteps.push(
      {
        title: 'Facility & volume',
        icon: 'facility' as const,
        fields: categoryFields.filter((f) =>
          ['facilitySizeSqM', 'ordersPerDay', 'picksPerDay'].includes(f.key),
        ),
      },
      {
        title: 'Workflow',
        icon: 'workflow' as const,
        fields: categoryFields.filter((f) =>
          ['mainPainPoint', 'loadType', 'layoutStability'].includes(f.key),
        ),
      },
      {
        title: 'Site constraints',
        icon: 'specifics' as const,
        fields: categoryFields.filter((f) =>
          ['aisleConstraints', 'wmsReadiness', 'temperatureZone'].includes(f.key),
        ),
      },
    );
  } else if (category === 'cleaning') {
    categorySteps.push(
      {
        title: 'Space & environment',
        icon: 'facility' as const,
        fields: categoryFields.filter((f) =>
          ['floorAreaSqM', 'environmentType', 'floorSurface'].includes(f.key),
        ),
      },
      {
        title: 'Cleaning needs',
        icon: 'workflow' as const,
        fields: categoryFields.filter((f) =>
          ['cleaningFrequencyPerDay', 'messLevel', 'cleaningType'].includes(f.key),
        ),
      },
      {
        title: 'Operations',
        icon: 'specifics' as const,
        fields: categoryFields.filter((f) =>
          ['obstacleComplexity', 'cleaningLaborCostPerHour', 'staffAssignedToCleaning'].includes(
            f.key,
          ),
        ),
      },
    );
  } else {
    categorySteps.push(
      {
        title: 'Venue & volume',
        icon: 'facility' as const,
        fields: categoryFields.filter((f) =>
          ['venueType', 'seatsPerDay', 'peakHoursPerDay'].includes(f.key),
        ),
      },
      {
        title: 'Layout',
        icon: 'workflow' as const,
        fields: categoryFields.filter((f) =>
          ['tableCount', 'layoutComplexity', 'aisleWidth'].includes(f.key),
        ),
      },
      {
        title: 'Service & pain point',
        icon: 'specifics' as const,
        fields: categoryFields.filter((f) =>
          ['mainPainPoint', 'serviceIntensity'].includes(f.key),
        ),
      },
    );
  }

  return [
    {
      title: 'Labor & hours',
      description: 'Used to estimate economic fit.',
      icon: 'labor' as const,
      fields: laborFields,
    },
    {
      title: 'Staffing pressure',
      icon: 'staffing' as const,
      fields: staffingField,
    },
    {
      title: 'Budget & acquisition',
      description: 'Drives buy vs lease vs RaaS recommendations.',
      icon: 'budget' as const,
      fields: budgetFields,
    },
    {
      title: 'Readiness & region',
      icon: 'readiness' as const,
      fields: readinessFields,
    },
    ...categorySteps.map((step) => ({
      ...step,
      title: step.title,
      description: `${CATEGORY_LABELS[category]} — ${step.title.toLowerCase()}`,
    })),
  ];
}

export const CATEGORY_LABELS: Record<RobotCategory, string> = {
  warehouse: 'Warehouse robots',
  cleaning: 'Cleaning robots',
  restaurant: 'Restaurant robots',
};

export const CATEGORY_DESCRIPTIONS: Record<RobotCategory, string> = {
  warehouse: 'AMRs, AGVs, picking assist, and pallet movers for fulfillment and distribution.',
  cleaning: 'Autonomous scrubbers and vacuums for offices, retail, and industrial floors.',
  restaurant: 'Serving, bussing, kitchen, and reception robots for food service.',
};
