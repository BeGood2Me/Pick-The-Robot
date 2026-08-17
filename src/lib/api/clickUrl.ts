export type ApiClickContext = 'match' | 'catalog';

/** Tracked vendor click URL for API consumers — always routes through /out/[slug]. */
export function buildApiClickUrl(
  baseUrl: string,
  vendorSlug: string,
  context: ApiClickContext = 'match',
): string {
  const url = new URL(`/out/${vendorSlug}`, baseUrl.replace(/\/$/, ''));
  url.searchParams.set('utm_source', 'api');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_content', context);
  return url.toString();
}
export function buildVendorProfileUrl(baseUrl: string, vendorSlug: string): string {
  return `${baseUrl.replace(/\/$/, '')}/vendors/${vendorSlug}`;
}
