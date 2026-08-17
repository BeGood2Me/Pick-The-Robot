CREATE TABLE IF NOT EXISTS vendor_accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  vendor_slug TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vendor_accounts_email_idx ON vendor_accounts (email);

CREATE TABLE IF NOT EXISTS vendor_subscriptions (
  stripe_subscription_id TEXT PRIMARY KEY,
  vendor_account_id TEXT NOT NULL REFERENCES vendor_accounts (id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('verified', 'sponsored')),
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vendor_subscriptions_account_idx ON vendor_subscriptions (vendor_account_id);

CREATE TABLE IF NOT EXISTS vendor_profiles (
  vendor_slug TEXT PRIMARY KEY,
  logo_url TEXT,
  affiliate_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_login_tokens (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vendor_login_tokens_email_idx ON vendor_login_tokens (email);

CREATE TABLE IF NOT EXISTS vendor_clicks (
  id BIGSERIAL PRIMARY KEY,
  vendor_slug TEXT NOT NULL,
  context TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vendor_clicks_slug_idx ON vendor_clicks (vendor_slug, clicked_at DESC);
