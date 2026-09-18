export const VENDOR_LOGO_MAX_BYTES = 2 * 1024 * 1024;

/** Shown in the vendor portal upload UI. */
export const VENDOR_LOGO_UPLOAD_GUIDANCE =
  'Square image, 512×512 px recommended (minimum 256×256). PNG or WebP with a transparent background works best. Max file size 2 MB.';

export const VENDOR_LOGO_MIME_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
} as const;

export type VendorLogoMimeType = keyof typeof VENDOR_LOGO_MIME_TYPES;

export function extensionForVendorLogoMime(mime: string): string | null {
  return VENDOR_LOGO_MIME_TYPES[mime as VendorLogoMimeType] ?? null;
}

export function detectVendorLogoMime(buffer: Buffer): VendorLogoMimeType | null {
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }

  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

export function isAllowedVendorLogoUrl(url: string): boolean {
  if (url.startsWith('/uploads/vendor-logos/') && !url.includes('..')) {
    return /^\/uploads\/vendor-logos\/[a-z0-9-]+\.(png|jpe?g|webp)$/i.test(url);
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
