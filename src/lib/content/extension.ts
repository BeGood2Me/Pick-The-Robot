/** Chrome extension listing — keep in sync with the Web Store developer console. */
export const CHROME_EXTENSION_ID = 'jpfhebaojbnjfealeleiegbddghjhcmi';

export const CHROME_EXTENSION_NAME = 'PickTheRobot — Robot Matcher Shortcut';

export const CHROME_EXTENSION_STORE_URL = `https://chromewebstore.google.com/detail/${CHROME_EXTENSION_ID}`;

export const EXTENSION_PAGE_PATH = '/extension';

export const EXTENSION_SHORTCUTS = [
  { label: 'Warehouse robot matcher', href: '/warehouse-robots#matcher' },
  { label: 'Cleaning robot matcher', href: '/cleaning-robots#matcher' },
  { label: 'Restaurant robot matcher', href: '/restaurant-robots#matcher' },
  { label: 'Warehouse robot buyer checklist', href: '/resources/warehouse-robot-buyer-checklist' },
  { label: 'Commercial cleaning buyer checklist', href: '/resources/commercial-cleaning-robot-buyer-checklist' },
  { label: 'Humanoid robots research track', href: '/humanoid-robots' },
] as const;
