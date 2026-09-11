import type { ApiTier } from '@/lib/api/tierLimits';

export function siteBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picktherobot.com';
  return url.replace(/\/$/, '');
}

/** Tier used for MCP match payloads (defaults to pro for full explanations). */
export function mcpApiTier(): ApiTier {
  const raw = process.env.PICKTHEROBOT_MCP_TIER?.toLowerCase();
  if (raw === 'starter') return 'starter';
  return 'pro';
}
