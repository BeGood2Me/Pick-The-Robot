import { readFileSync } from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { existsSync, mkdirSync, readFileSync as readStore, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

function loadEnvLocal() {
  const env = { ...process.env };
  try {
    const lines = readFileSync('.env.local', 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      let value = trimmed.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[trimmed.slice(0, idx)] = value;
    }
  } catch {
    // optional
  }
  return env;
}

function generateLoginToken() {
  return `vl_${randomBytes(24).toString('base64url')}`;
}

function hashLoginToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

const STORE_PATH = join(process.cwd(), 'data', 'vendor-partners.json');

async function createLoginToken(email) {
  const token = generateLoginToken();
  const hash = hashLoginToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  if (process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO vendor_login_tokens (token_hash, email, expires_at)
      VALUES (${hash}, ${email.toLowerCase()}, ${expiresAt})
    `;
    return token;
  }

  const store = existsSync(STORE_PATH)
    ? JSON.parse(readStore(STORE_PATH, 'utf8'))
    : { loginTokens: {} };
  store.loginTokens = store.loginTokens ?? {};
  store.loginTokens[hash] = { email: email.toLowerCase(), expiresAt, usedAt: null };
  mkdirSync(dirname(STORE_PATH), { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
  return token;
}

function normalizeDatabaseUrl(url) {
  return url.replace(/([?&])channel_binding=[^&]*/g, '$1').replace(/[?&]$/, '');
}

const email = process.argv[2];
if (!email || !email.includes('@')) {
  console.error('Usage: node scripts/vendor-login-link.mjs vendor@company.com');
  process.exit(1);
}

const env = loadEnvLocal();
process.env.DATABASE_URL = normalizeDatabaseUrl(env.DATABASE_URL ?? '');

const token = await createLoginToken(email);
const site = (env.NEXT_PUBLIC_SITE_URL ?? 'https://picktherobot.com').replace(/\/$/, '');
const url = `${site}/api/vendor/auth/verify?token=${encodeURIComponent(token)}`;

console.log(`Login link for ${email}:`);
console.log(url);
console.log('\nOpen the full URL above in your browser while npm run dev is running.');
console.log('The link includes ?token=... — visiting /api/vendor/auth/verify without it will not sign you in.');
console.log('Link expires in 1 hour.');
