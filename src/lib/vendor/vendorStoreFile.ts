import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
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

interface VendorStoreData {
  accounts: Record<string, VendorAccount>;
  accountsByEmail: Record<string, string>;
  accountsBySlug: Record<string, string>;
  subscriptions: Record<string, VendorSubscription>;
  profiles: Record<string, VendorProfileOverlay>;
  loginTokens: Record<string, { email: string; expiresAt: string; usedAt: string | null }>;
  clicks: { vendorSlug: string; context: string | null; clickedAt: string }[];
}

const STORE_PATH =
  process.env.VENDOR_STORE_PATH ?? join(process.cwd(), 'data', 'vendor-partners.json');

function emptyStore(): VendorStoreData {
  return {
    accounts: {},
    accountsByEmail: {},
    accountsBySlug: {},
    subscriptions: {},
    profiles: {},
    loginTokens: {},
    clicks: [],
  };
}

function readStore(): VendorStoreData {
  if (!existsSync(STORE_PATH)) return emptyStore();
  try {
    const parsed = JSON.parse(readFileSync(STORE_PATH, 'utf8')) as VendorStoreData;
    return {
      accounts: parsed.accounts ?? {},
      accountsByEmail: parsed.accountsByEmail ?? {},
      accountsBySlug: parsed.accountsBySlug ?? {},
      subscriptions: parsed.subscriptions ?? {},
      profiles: parsed.profiles ?? {},
      loginTokens: parsed.loginTokens ?? {},
      clicks: parsed.clicks ?? [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(data: VendorStoreData): void {
  mkdirSync(dirname(STORE_PATH), { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function accountFromRow(id: string, store: VendorStoreData): VendorAccount | null {
  return store.accounts[id] ?? null;
}

export function provisionVendorSubscriptionFile(input: ProvisionVendorInput): VendorAccount {
  const store = readStore();
  let accountId = store.accountsBySlug[input.vendorSlug];
  let account = accountId ? store.accounts[accountId] : null;

  if (!account) {
    accountId = randomUUID();
    account = {
      id: accountId,
      email: input.email.toLowerCase(),
      vendorSlug: input.vendorSlug,
      stripeCustomerId: input.customerId,
      createdAt: new Date().toISOString(),
    };
    store.accounts[accountId] = account;
    store.accountsByEmail[account.email] = accountId;
    store.accountsBySlug[input.vendorSlug] = accountId;
  } else {
    account.email = input.email.toLowerCase();
    account.stripeCustomerId = input.customerId;
    store.accounts[account.id] = account;
    store.accountsByEmail[account.email] = account.id;
  }

  store.subscriptions[input.subscriptionId] = {
    stripeSubscriptionId: input.subscriptionId,
    vendorAccountId: account.id,
    tier: input.tier,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  writeStore(store);
  return account;
}

export function updateVendorSubscriptionStatusFile(
  subscriptionId: string,
  status: VendorSubscriptionStatus,
): void {
  const store = readStore();
  const sub = store.subscriptions[subscriptionId];
  if (!sub) return;
  sub.status = status;
  sub.updatedAt = new Date().toISOString();
  store.subscriptions[subscriptionId] = sub;
  writeStore(store);
}

export function getVendorAccountByIdFile(id: string): VendorAccount | null {
  return accountFromRow(id, readStore());
}

export function getVendorAccountByEmailFile(email: string): VendorAccount | null {
  const store = readStore();
  const id = store.accountsByEmail[email.toLowerCase()];
  return id ? store.accounts[id] ?? null : null;
}

export function getVendorAccountBySlugFile(slug: string): VendorAccount | null {
  const store = readStore();
  const id = store.accountsBySlug[slug];
  return id ? store.accounts[id] ?? null : null;
}

export function getVendorSubscriptionsForAccountFile(accountId: string): VendorSubscription[] {
  const store = readStore();
  return Object.values(store.subscriptions).filter((s) => s.vendorAccountId === accountId);
}

export function upsertVendorProfileFile(
  vendorSlug: string,
  patch: { logoUrl?: string | null; affiliateUrl?: string | null },
): VendorProfileOverlay {
  const store = readStore();
  const existing = store.profiles[vendorSlug];
  const profile: VendorProfileOverlay = {
    vendorSlug,
    logoUrl: patch.logoUrl !== undefined ? patch.logoUrl : (existing?.logoUrl ?? null),
    affiliateUrl:
      patch.affiliateUrl !== undefined ? patch.affiliateUrl : (existing?.affiliateUrl ?? null),
    updatedAt: new Date().toISOString(),
  };
  store.profiles[vendorSlug] = profile;
  writeStore(store);
  return profile;
}

export function getVendorProfileFile(vendorSlug: string): VendorProfileOverlay | null {
  return readStore().profiles[vendorSlug] ?? null;
}

export function recordVendorClickFile(vendorSlug: string, context?: string): void {
  const store = readStore();
  store.clicks.push({
    vendorSlug,
    context: context ?? null,
    clickedAt: new Date().toISOString(),
  });
  writeStore(store);
}

function isActiveTier(subs: VendorSubscription[], tier: VendorTier): boolean {
  return subs.some((s) => s.tier === tier && s.status === 'active');
}

export function getVendorEntitlementsFile(): Record<string, VendorEntitlement> {
  const store = readStore();
  const bySlug: Record<string, VendorEntitlement> = {};

  for (const account of Object.values(store.accounts)) {
    const subs = getVendorSubscriptionsForAccountFile(account.id);
    const profile = store.profiles[account.vendorSlug];
    bySlug[account.vendorSlug] = {
      verified: isActiveTier(subs, 'verified'),
      sponsored: isActiveTier(subs, 'sponsored'),
      logoUrl: profile?.logoUrl ?? undefined,
      affiliateUrl: profile?.affiliateUrl ?? undefined,
    };
  }

  return bySlug;
}

export function getVendorEntitlementForSlugFile(slug: string): VendorEntitlement | null {
  return getVendorEntitlementsFile()[slug] ?? null;
}

export function createLoginTokenFile(email: string): string {
  const store = readStore();
  const token = generateLoginToken();
  store.loginTokens[hashLoginToken(token)] = {
    email: email.toLowerCase(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    usedAt: null,
  };
  writeStore(store);
  return token;
}

export function consumeLoginTokenFile(token: string): string | null {
  const store = readStore();
  const hash = hashLoginToken(token);
  const row = store.loginTokens[hash];
  if (!row || row.usedAt) return null;
  if (new Date(row.expiresAt).getTime() < Date.now()) return null;
  row.usedAt = new Date().toISOString();
  store.loginTokens[hash] = row;
  writeStore(store);
  return row.email;
}

export function getVendorPortalSummaryFile(accountId: string): VendorPortalSummary | null {
  const account = getVendorAccountByIdFile(accountId);
  if (!account) return null;

  const store = readStore();
  const subs = getVendorSubscriptionsForAccountFile(accountId);
  const profile = store.profiles[account.vendorSlug] ?? null;
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const slugClicks = store.clicks.filter((c) => c.vendorSlug === account.vendorSlug);

  return {
    account,
    subscriptions: subs,
    profile,
    clickStats: {
      allTime: slugClicks.length,
      last30Days: slugClicks.filter((c) => new Date(c.clickedAt).getTime() >= thirtyDaysAgo)
        .length,
    },
  };
}

export function resetVendorStoreForTests(): void {
  writeStore(emptyStore());
}
