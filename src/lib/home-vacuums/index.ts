export type {
  HomeAffiliateLocale,
  HomeAffiliateUrls,
  HomeBudgetBand,
  HomeBudgetLane,
  HomeFloorMix,
  HomeHairLength,
  HomeMatchConfidence,
  HomeMatchScore,
  HomeMopNeeded,
  HomeMopType,
  HomeObstacleAvoidance,
  HomeObstacles,
  HomePetHair,
  HomePets,
  HomeProductMatch,
  HomeSelfEmpty,
  HomeSize,
  HomeSuctionClass,
  HomeVacuumAnswers,
  HomeVacuumClass,
  HomeVacuumProduct,
  HomeVacuumRecommendation,
  WizardHomeVacuumAnswers,
} from './types';

export { getHomeVacuumCatalog, getHomeVacuumById, getHomeVacuumBySlug } from './catalog';
export {
  emptyHomeVacuumAnswers,
  getHomeVacuumFieldErrors,
  HOME_VACUUM_FIELD_GROUPS,
  isCompleteHomeVacuumAnswers,
} from './questions';
export { recommendHomeVacuum, homeVacuumLaneCopy, homeVacuumMatchHeadline } from './engine';
export {
  pickBudgetLane,
  pickHomeVacuumClass,
  scoreHomeVacuumProduct,
} from './scoring';
export {
  buildHomeVacuumSharePayload,
  buildHomeVacuumShareUrl,
  decodeHomeVacuumSharePayload,
  encodeHomeVacuumSharePayload,
} from './share';
export {
  detectHomeAffiliateLocaleFromBrowser,
  getHomeVacuumOutboundUrl,
  HOME_AFFILIATE_LOCALE_LABELS,
  HOME_AFFILIATE_LOCALES,
  isHomeAffiliateLocale,
  productHasAffiliate,
  resolveHomeAffiliateUrl,
  trackHomeVacuumOutboundClick,
} from './outbound';
