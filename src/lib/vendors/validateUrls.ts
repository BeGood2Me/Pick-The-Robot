import type { Vendor } from '@/lib/matching/types';

/** Hostnames that must never be used as vendor outbound URLs. */
export const BLOCKED_OUTBOUND_HOSTS = new Set([
  'autoguide.com', // automotive media site — not AutoGuide Mobile Robots
]);

/** Optional strict allowlist: vendor slug → permitted hostnames (without www). */
export const OFFICIAL_VENDOR_HOSTS: Record<string, readonly string[]> = {
  'locus-robotics': ['locusrobotics.com'],
  'otto-motors': ['ottomotors.com'],
  '6-river-systems': ['ocadointelligentautomation.com'],
  'mir-mobile-industrial-robots': ['mobile-industrial-robots.com'],
  'softbank-robotics-whiz': ['softbankrobotics.com'],
  'avidbots': ['avidbots.com'],
  'nilfisk': ['nilfisk.com'],
  'gausium': ['gausium.com'],
  'ice-cobotics': ['icecobotics.com'],
  'bear-robotics': ['bearrobotics.ai'],
  'pudu-robotics': ['pudurobotics.com'],
  'miso-robotics': ['misorobotics.com'],
  'keenon-robotics': ['keenon.com', 'keenonrobot.com'],
  'richtech-robotics': ['richtechrobotics.com'],
};

export function hostnameOf(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '');
}

export function isHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Returns an error message if the vendor URL config is invalid. */
export function validateVendorUrls(vendor: Vendor): string | null {
  if (!isHttpsUrl(vendor.outboundUrl)) {
    return `${vendor.slug}: outboundUrl must be a valid https URL`;
  }

  const outboundHost = hostnameOf(vendor.outboundUrl);
  if (BLOCKED_OUTBOUND_HOSTS.has(outboundHost)) {
    return `${vendor.slug}: outboundUrl host "${outboundHost}" is blocked`;
  }

  const allowed = OFFICIAL_VENDOR_HOSTS[vendor.slug];
  if (!allowed) {
    return `${vendor.slug}: missing from OFFICIAL_VENDOR_HOSTS allowlist`;
  }
  if (!allowed.includes(outboundHost)) {
    return `${vendor.slug}: outboundUrl host "${outboundHost}" not in allowlist [${allowed.join(', ')}]`;
  }

  if (vendor.affiliateUrl) {
    if (!isHttpsUrl(vendor.affiliateUrl)) {
      return `${vendor.slug}: affiliateUrl must be https`;
    }
    const affiliateHost = hostnameOf(vendor.affiliateUrl);
    if (BLOCKED_OUTBOUND_HOSTS.has(affiliateHost)) {
      return `${vendor.slug}: affiliateUrl host "${affiliateHost}" is blocked`;
    }
    if (affiliateHost !== outboundHost) {
      return `${vendor.slug}: affiliateUrl must use the same host as outboundUrl`;
    }
  }

  return null;
}

export function validateAllVendorUrls(vendors: Vendor[]): string[] {
  return vendors.map(validateVendorUrls).filter((msg): msg is string => msg !== null);
}
