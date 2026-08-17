import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'node:crypto';
import { generateLoginToken, hashLoginToken } from '@/lib/vendor/tokens';
import type {
  ProvisionVendorInput,
  VendorAccount,
  VendorEntitlement,
  VendorPortalSummary,
  VendorProfileOverlay,
  VendorSubscription,
  VendorSubscriptionStatus,
} from '@/lib/vendor/types';
import type { VendorTier } from '@/lib/vendor/tiers';

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required.');
  return neon(url);
}

function mapAccount(row: {
  id: string;
  email: string;
  vendor_slug: string;
  stripe_customer_id: string | null;
  created_at: string | Date;
}): VendorAccount {
  return {
    id: row.id,
    email: row.email,
    vendorSlug: row.vendor_slug,
    stripeCustomerId: row.stripe_customer_id,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapSubscription(row: {
  stripe_subscription_id: string;
  vendor_account_id: string;
  tier: VendorTier;
  status: VendorSubscriptionStatus;
  created_at: string | Date;
  updated_at: string | Date;
}): VendorSubscription {
  return {
    stripeSubscriptionId: row.stripe_subscription_id,
    vendorAccountId: row.vendor_account_id,
    tier: row.tier,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function provisionVendorSubscriptionNeon(
  input: ProvisionVendorInput,
): Promise<VendorAccount> {
  const sql = getSql();

  const existing = await sql`
    SELECT id, email, vendor_slug, stripe_customer_id, created_at
    FROM vendor_accounts
    WHERE vendor_slug = ${input.vendorSlug}
    LIMIT 1
  `;

  let accountId: string;
  if (existing.length > 0) {
    accountId = existing[0].id as string;
    await sql`
      UPDATE vendor_accounts
      SET email = ${input.email.toLowerCase()}, stripe_customer_id = ${input.customerId}
      WHERE id = ${accountId}
    `;
  } else {
    accountId = randomUUID();
    await sql`
      INSERT INTO vendor_accounts (id, email, vendor_slug, stripe_customer_id)
      VALUES (${accountId}, ${input.email.toLowerCase()}, ${input.vendorSlug}, ${input.customerId})
    `;
  }

  await sql`
    INSERT INTO vendor_subscriptions (
      stripe_subscription_id, vendor_account_id, tier, status, updated_at
    )
    VALUES (${input.subscriptionId}, ${accountId}, ${input.tier}, 'active', NOW())
    ON CONFLICT (stripe_subscription_id) DO UPDATE
    SET status = 'active', tier = EXCLUDED.tier, updated_at = NOW()
  `;

  const rows = await sql`
    SELECT id, email, vendor_slug, stripe_customer_id, created_at
    FROM vendor_accounts WHERE id = ${accountId} LIMIT 1
  `;
  return mapAccount(rows[0] as Parameters<typeof mapAccount>[0]);
}

export async function updateVendorSubscriptionStatusNeon(
  subscriptionId: string,
  status: VendorSubscriptionStatus,
): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE vendor_subscriptions
    SET status = ${status}, updated_at = NOW()
    WHERE stripe_subscription_id = ${subscriptionId}
  `;
}

export async function getVendorAccountByIdNeon(id: string): Promise<VendorAccount | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, vendor_slug, stripe_customer_id, created_at
    FROM vendor_accounts WHERE id = ${id} LIMIT 1
  `;
  return rows.length ? mapAccount(rows[0] as Parameters<typeof mapAccount>[0]) : null;
}

export async function getVendorAccountByEmailNeon(email: string): Promise<VendorAccount | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, vendor_slug, stripe_customer_id, created_at
    FROM vendor_accounts WHERE email = ${email.toLowerCase()} LIMIT 1
  `;
  return rows.length ? mapAccount(rows[0] as Parameters<typeof mapAccount>[0]) : null;
}

export async function getVendorAccountBySlugNeon(slug: string): Promise<VendorAccount | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, vendor_slug, stripe_customer_id, created_at
    FROM vendor_accounts WHERE vendor_slug = ${slug} LIMIT 1
  `;
  return rows.length ? mapAccount(rows[0] as Parameters<typeof mapAccount>[0]) : null;
}

export async function getVendorSubscriptionsForAccountNeon(
  accountId: string,
): Promise<VendorSubscription[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT stripe_subscription_id, vendor_account_id, tier, status, created_at, updated_at
    FROM vendor_subscriptions WHERE vendor_account_id = ${accountId}
  `;
  return rows.map((row) => mapSubscription(row as Parameters<typeof mapSubscription>[0]));
}

export async function upsertVendorProfileNeon(
  vendorSlug: string,
  patch: { logoUrl?: string | null; affiliateUrl?: string | null },
): Promise<VendorProfileOverlay> {
  const sql = getSql();
  const existing = await sql`
    SELECT vendor_slug, logo_url, affiliate_url, updated_at
    FROM vendor_profiles WHERE vendor_slug = ${vendorSlug} LIMIT 1
  `;

  const logoUrl =
    patch.logoUrl !== undefined
      ? patch.logoUrl
      : ((existing[0]?.logo_url as string | null) ?? null);
  const affiliateUrl =
    patch.affiliateUrl !== undefined
      ? patch.affiliateUrl
      : ((existing[0]?.affiliate_url as string | null) ?? null);

  await sql`
    INSERT INTO vendor_profiles (vendor_slug, logo_url, affiliate_url, updated_at)
    VALUES (${vendorSlug}, ${logoUrl}, ${affiliateUrl}, NOW())
    ON CONFLICT (vendor_slug) DO UPDATE
    SET logo_url = EXCLUDED.logo_url,
        affiliate_url = EXCLUDED.affiliate_url,
        updated_at = NOW()
  `;

  return {
    vendorSlug,
    logoUrl,
    affiliateUrl,
    updatedAt: new Date().toISOString(),
  };
}

export async function getVendorProfileNeon(vendorSlug: string): Promise<VendorProfileOverlay | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT vendor_slug, logo_url, affiliate_url, updated_at
    FROM vendor_profiles WHERE vendor_slug = ${vendorSlug} LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0];
  return {
    vendorSlug: row.vendor_slug as string,
    logoUrl: (row.logo_url as string | null) ?? null,
    affiliateUrl: (row.affiliate_url as string | null) ?? null,
    updatedAt: new Date(row.updated_at as string | Date).toISOString(),
  };
}

export async function recordVendorClickNeon(vendorSlug: string, context?: string): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO vendor_clicks (vendor_slug, context) VALUES (${vendorSlug}, ${context ?? null})
  `;
}

async function isActiveTierNeon(accountId: string, tier: VendorTier): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    SELECT 1 FROM vendor_subscriptions
    WHERE vendor_account_id = ${accountId} AND tier = ${tier} AND status = 'active'
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function getVendorEntitlementsNeon(): Promise<Record<string, VendorEntitlement>> {
  const sql = getSql();
  const accounts = await sql`SELECT id, vendor_slug FROM vendor_accounts`;
  const bySlug: Record<string, VendorEntitlement> = {};

  for (const row of accounts) {
    const accountId = row.id as string;
    const slug = row.vendor_slug as string;
    const profile = await getVendorProfileNeon(slug);
    bySlug[slug] = {
      verified: await isActiveTierNeon(accountId, 'verified'),
      sponsored: await isActiveTierNeon(accountId, 'sponsored'),
      logoUrl: profile?.logoUrl ?? undefined,
      affiliateUrl: profile?.affiliateUrl ?? undefined,
    };
  }

  return bySlug;
}

export async function createLoginTokenNeon(email: string): Promise<string> {
  const sql = getSql();
  const token = generateLoginToken();
  const hash = hashLoginToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await sql`
    INSERT INTO vendor_login_tokens (token_hash, email, expires_at)
    VALUES (${hash}, ${email.toLowerCase()}, ${expiresAt})
  `;
  return token;
}

export async function consumeLoginTokenNeon(token: string): Promise<string | null> {
  const sql = getSql();
  const hash = hashLoginToken(token);
  const rows = await sql`
    SELECT email, expires_at, used_at FROM vendor_login_tokens
    WHERE token_hash = ${hash} LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0];
  if (row.used_at) return null;
  if (new Date(row.expires_at as string | Date).getTime() < Date.now()) return null;

  await sql`UPDATE vendor_login_tokens SET used_at = NOW() WHERE token_hash = ${hash}`;
  return row.email as string;
}

export async function getVendorPortalSummaryNeon(
  accountId: string,
): Promise<VendorPortalSummary | null> {
  const account = await getVendorAccountByIdNeon(accountId);
  if (!account) return null;

  const subs = await getVendorSubscriptionsForAccountNeon(accountId);
  const profile = await getVendorProfileNeon(account.vendorSlug);
  const sql = getSql();
  const allTimeRows = await sql`
    SELECT COUNT(*)::int AS count FROM vendor_clicks WHERE vendor_slug = ${account.vendorSlug}
  `;
  const last30Rows = await sql`
    SELECT COUNT(*)::int AS count FROM vendor_clicks
    WHERE vendor_slug = ${account.vendorSlug}
      AND clicked_at >= NOW() - INTERVAL '30 days'
  `;

  return {
    account,
    subscriptions: subs,
    profile,
    clickStats: {
      allTime: (allTimeRows[0]?.count as number) ?? 0,
      last30Days: (last30Rows[0]?.count as number) ?? 0,
    },
  };
}
