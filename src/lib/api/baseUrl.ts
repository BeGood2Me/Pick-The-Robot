import { BASE_URL } from '@/lib/seo/metadata';

/**
 * Origin for API-generated links (clickUrl, profileUrl, attribution).
 * Uses the request origin so local dev returns localhost URLs.
 */
export function resolveApiBaseUrl(request: Request): string {
  try {
    const { origin } = new URL(request.url);
    if (origin && origin !== 'null') {
      return origin;
    }
  } catch {
    // fall through to canonical site URL
  }
  return BASE_URL;
}
