import {
  buildVendorLoginEmail,
  defaultVendorLoginFromAddress,
  isVendorLoginEmailConfigured,
  parseVendorLoginFromAddress,
} from '@/lib/email/vendorLoginEmail';

export { isVendorLoginEmailConfigured };

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export async function sendVendorLoginEmail(input: {
  to: string;
  loginUrl: string;
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured.');
  }

  const { subject, text, html } = buildVendorLoginEmail(input.loginUrl);
  const sender = parseVendorLoginFromAddress(defaultVendorLoginFromAddress());

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender,
      to: [{ email: input.to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    let message = `Brevo API error (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }
}
