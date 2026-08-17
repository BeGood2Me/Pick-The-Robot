import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_COOKIE = 'ptr_vendor_session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface VendorSessionPayload {
  accountId: string;
  email: string;
  vendorSlug: string;
  exp: number;
}

function sessionSecret(): string {
  const secret = process.env.VENDOR_SESSION_SECRET ?? process.env.API_KEY_ENCRYPTION_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('VENDOR_SESSION_SECRET or API_KEY_ENCRYPTION_KEY is required in production.');
    }
    return 'dev-vendor-session-secret';
  }
  return secret;
}

function sign(payloadB64: string): string {
  return createHmac('sha256', sessionSecret()).update(payloadB64).digest('base64url');
}

export function createVendorSessionToken(payload: Omit<VendorSessionPayload, 'exp'>): string {
  const full: VendorSessionPayload = {
    ...payload,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(full)).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function parseVendorSessionToken(token: string | undefined | null): VendorSessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;

  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as VendorSessionPayload;
    if (!payload.accountId || !payload.email || !payload.vendorSlug || !payload.exp) return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function vendorSessionCookieName(): string {
  return SESSION_COOKIE;
}

export function vendorSessionCookieOptions(maxAgeSeconds = SESSION_TTL_MS / 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}
