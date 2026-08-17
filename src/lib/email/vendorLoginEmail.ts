import { FOR_VENDORS_PORTAL_PATH } from '@/lib/content/for-vendors';
import { BASE_URL } from '@/lib/seo/metadata';

export interface VendorLoginEmailContent {
  subject: string;
  text: string;
  html: string;
}

export interface VendorLoginFromAddress {
  name: string;
  email: string;
}

export function buildVendorLoginEmail(loginUrl: string): VendorLoginEmailContent {
  const portalUrl = `${BASE_URL.replace(/\/$/, '')}${FOR_VENDORS_PORTAL_PATH}`;
  const subject = 'Sign in to your PickTheRobot vendor portal';
  const text = [
    'Use this link to sign in to your PickTheRobot vendor portal:',
    '',
    loginUrl,
    '',
    'This link expires in 1 hour and can only be used once.',
    '',
    'If you did not request this email, you can ignore it.',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
  <body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111827;">
    <p>Sign in to your PickTheRobot vendor portal:</p>
    <p><a href="${loginUrl}" style="color: #2563eb;">Sign in to vendor portal</a></p>
    <p style="color: #6b7280; font-size: 14px;">
      This link expires in 1 hour and can only be used once.
      If you did not request this email, you can ignore it.
    </p>
    <p style="color: #6b7280; font-size: 14px;">
      Portal: <a href="${portalUrl}">${portalUrl}</a>
    </p>
  </body>
</html>`;

  return { subject, text, html };
}

export function parseVendorLoginFromAddress(raw: string): VendorLoginFromAddress {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: 'PickTheRobot', email: trimmed };
}

export function defaultVendorLoginFromAddress(): string {
  return process.env.BREVO_FROM_EMAIL?.trim() || 'PickTheRobot <vendors@picktherobot.com>';
}

export function isVendorLoginEmailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY?.trim());
}
