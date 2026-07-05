# PickTheRobot

Utility-first robot recommendation engine for warehouse, cleaning, and restaurant operators.

## Documentation

| Audience | File |
|----------|------|
| AI coding agents (Cursor, etc.) | [AGENTS.md](./AGENTS.md) |
| AI assistants browsing the live site | [/llms.txt](https://picktherobot.com/llms.txt) · [/llms-full.txt](https://picktherobot.com/llms-full.txt) |
| Deploy, Search Console, analytics | [docs/DEPLOY.md](./docs/DEPLOY.md) |

## Run locally

```bash
cp .env.example .env.local   # optional: GA4 / Plausible
npm install
npm run dev
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for sitemap and share links |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console HTML tag verification |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible domain |

Match events (`match_generated`, `vendor_clicked`, etc.) dispatch to configured providers via `AnalyticsProvider`.

## Deploy

See **[docs/DEPLOY.md](./docs/DEPLOY.md)** for Vercel setup, production smoke test, Search Console, and analytics.

Quick preflight:

```bash
npm test && npm run build
npm run start   # separate terminal
npm run smoke   # hits http://localhost:3000
```

Set `NEXT_PUBLIC_SITE_URL=https://picktherobot.com` in Vercel before going live.

## Vendor data

Edit **`src/data/vendors.json`** directly. No vendors use monetization fields yet — see [docs/DEPLOY.md](./docs/DEPLOY.md#phase-2--monetization-when-partnerships-exist) when partnerships exist.

## Share results

After a match, click **Copy share link** — opens at `/results?share=…` with the same recommendation.

## Scripts

- `npm run dev` — dev server
- `npm test` — unit tests
- `npm run build` — production build
- `npm run smoke` — HTTP smoke test (set `SMOKE_BASE_URL` for production)
- `npm run vendors:export` — legacy export from TS (vendors now live in JSON)
