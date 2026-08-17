import { readFileSync, writeFileSync } from 'node:fs';

function loadEnvLocal() {
  const env = { ...process.env };
  try {
    const lines = readFileSync('.env.local', 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
    }
  } catch {
    console.error('Create .env.local first, then add BREVO_API_KEY=xkeysib-...');
    process.exit(1);
  }
  return env;
}

function upsertEnvLocal(updates) {
  const lines = readFileSync('.env.local', 'utf8').split(/\r?\n/);
  const keys = new Set(Object.keys(updates));
  const kept = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return true;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return true;
    return !keys.has(trimmed.slice(0, idx));
  });
  const additions = Object.entries(updates).map(([key, value]) => `${key}=${value}`);
  writeFileSync('.env.local', [...kept, ...additions].join('\n') + '\n', 'utf8');
}

function parseFromAddress(raw) {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) return { name: match[1].trim(), email: match[2].trim() };
  return { name: 'PickTheRobot', email: trimmed };
}

async function sendBrevoTestEmail({ apiKey, to, fromRaw, siteUrl }) {
  const sender = parseFromAddress(fromRaw);
  const portalUrl = `${siteUrl}/for-vendors/portal`;
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender,
      to: [{ email: to }],
      subject: '[test] PickTheRobot vendor portal email',
      textContent: `Brevo is configured for PickTheRobot vendor login emails.\n\nPortal: ${portalUrl}`,
      htmlContent: `<p>Brevo is configured for PickTheRobot vendor login emails.</p><p><a href="${portalUrl}">Vendor portal</a></p>`,
    }),
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      if (body.message) message = body.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

const testEmail = process.argv[2];
const env = loadEnvLocal();
const apiKey = env.BREVO_API_KEY;

if (!apiKey) {
  console.log(`Brevo is not configured yet.

Why Brevo: 300 emails/day free, multiple domains at no extra cost (unlike Resend's paid add-on).

1. Create a free account: https://www.brevo.com/
2. SMTP & API → Generate an API key (starts with xkeysib-)
3. Senders & Domains → Add domain picktherobot.com (DNS records) OR add sender vendors@picktherobot.com
4. Add to .env.local:
     BREVO_API_KEY=xkeysib-...
     BREVO_FROM_EMAIL=PickTheRobot <vendors@picktherobot.com>
5. Test via CLI:
     node scripts/brevo-setup.mjs you@example.com
6. Push to Vercel:
     node scripts/set-vercel-env.mjs

Optional: verify domain via Brevo API (curl):
  curl -sS -X POST https://api.brevo.com/v3/senders/domains \\
    -H "api-key: $BREVO_API_KEY" \\
    -H "content-type: application/json" \\
    -d "{\\"name\\":\\"picktherobot.com\\"}"
`);
  process.exit(1);
}

const from = env.BREVO_FROM_EMAIL || 'PickTheRobot <vendors@picktherobot.com>';
if (!env.BREVO_FROM_EMAIL) {
  upsertEnvLocal({ BREVO_FROM_EMAIL: from });
  console.log(`Added BREVO_FROM_EMAIL=${from} to .env.local`);
}

const siteUrl = (env.NEXT_PUBLIC_SITE_URL || 'https://picktherobot.com').replace(/\/$/, '');

if (!testEmail) {
  console.log(`Brevo API key found.

Smoke test:
  node scripts/brevo-setup.mjs you@example.com

Push env to Vercel:
  node scripts/set-vercel-env.mjs
`);
  process.exit(0);
}

try {
  await sendBrevoTestEmail({ apiKey, to: testEmail, fromRaw: from, siteUrl });
  console.log(`Test email sent to ${testEmail}`);
} catch (err) {
  console.error(`Test email failed: ${err instanceof Error ? err.message : err}`);
  console.error('\nConfirm the sender/domain is verified in Brevo → Senders, Domains & Dedicated IPs.');
  process.exit(1);
}
