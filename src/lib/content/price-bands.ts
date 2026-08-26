/**
 * Indicative USD price bands shared across category hubs, guides, pSEO, and blog posts.
 * Update here when ranges change — keep JSON blog posts in sync manually.
 */
export const WAREHOUSE_PRICE_BANDS = {
  amrPurchase: '$25k–$150k',
  amrRaas: '$2k–$8k/mo',
  /** Per guided vehicle; fixed-path infrastructure is often quoted separately. */
  agvVehiclePurchase: '$15k–$75k',
  agvInfrastructure: '$50k–$200k',
  pickingAssistPurchase: '$30k–$70k',
  pickingAssistRaas: '$2k–$8k/mo',
  palletMoverPurchase: '$80k–$200k+',
} as const;

export const CLEANING_PRICE_BANDS = {
  compactVacuumPurchase: '$15k–$40k',
  midScrubberPurchase: '$40k–$70k',
  largeScrubberPurchase: '$60k–$96k+',
  compactRaas: '$800–$2k/mo',
  largeScrubberRaas: '$2k–$5k/mo',
  industrialCleanerPurchase: '$50k–$120k+',
  industrialCleanerRaas: '$2.5k–$6k/mo',
} as const;

export const RESTAURANT_PRICE_BANDS = {
  servingPurchase: '$15k–$40k',
  servingLeaseRaas: '$500–$1.5k/mo',
  bussingPurchase: '$15k–$35k',
  bussingLeaseRaas: '$500–$1.4k/mo',
  kitchenAutomationPurchase: '$50k–$200k+',
} as const;

/** Long-form copy for FAQs and blog-style prose. */
export const RESTAURANT_SERVING_PURCHASE_COPY =
  `${RESTAURANT_PRICE_BANDS.servingPurchase} per unit`;

export const RESTAURANT_SERVING_LEASE_COPY =
  `${RESTAURANT_PRICE_BANDS.servingLeaseRaas} per unit`;

/** AGV vehicle band with infrastructure caveat for guides and comparisons. */
export const WAREHOUSE_AGV_GUIDE_COPY =
  '$15,000–$75,000 per vehicle (+ $50,000–$200,000 infrastructure on larger sites)';
