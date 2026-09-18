import { COMPARISON_LINKS, CATEGORY_ROUTES, HOME_MATCHER_RESET_HREF, HOME_TRACKS_HREF } from '@/lib/content/navigation';
import {
  BUSINESS_HUB_PATH,
  HOME_HUB_PATH,
  ROBOT_VACUUMS_PATH,
  ROBOT_VACUUMS_RESULTS_PATH,
} from '@/lib/content/home-vacuums';

const MATCHER_PAGE_PATHS = new Set<string>([
  '/results',
  BUSINESS_HUB_PATH,
  HOME_HUB_PATH,
  ROBOT_VACUUMS_PATH,
  ROBOT_VACUUMS_RESULTS_PATH,
  ...COMPARISON_LINKS.map((link) => link.href),
]);

const BUSINESS_CATEGORY_PATHS = new Set(Object.values(CATEGORY_ROUTES));

/** CTA href that keeps users on the current page's matcher when one exists. */
export function getMatcherCtaHref(pathname: string): string {
  if (pathname === '/') return '#tracks';
  if (MATCHER_PAGE_PATHS.has(pathname)) {
    return `${pathname}#matcher`;
  }
  if (BUSINESS_CATEGORY_PATHS.has(pathname)) {
    return HOME_MATCHER_RESET_HREF;
  }
  return HOME_TRACKS_HREF;
}
