# Deploy checklist

**Live production:** [https://pick-the-robot.vercel.app](https://pick-the-robot.vercel.app) (Vercel project `sed6/pick-the-robot`)

Use this after `npm test` and `npm run build` pass locally.

## Phase 0 — Vercel deploy

1. **Connect repository** in [Vercel](https://vercel.com/new) → import this repo → framework preset **Next.js** (default).
   - CLI alternative from project root: `npx vercel deploy --prod --yes -e NEXT_PUBLIC_SITE_URL=https://picktherobot.com`
2. **Build settings** (should match `package.json`):
   - Build command: `npm run build`
   - Output: Next.js default (no `vercel.json` required)
3. **Environment variables** (Production + Preview):

   | Variable | Required | Value |
   |----------|----------|-------|
   | `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://picktherobot.com` (your live domain) |
   | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Search Console HTML tag `content` value only |
   | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | GA4 ID (e.g. `G-XXXXXXXXXX`) |
   | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | e.g. `picktherobot.com` |

4. **Deploy** → confirm build succeeds on Vercel.
5. **Persist env vars** in Vercel → Project → Settings → Environment Variables (the `-e` flag on CLI only applies to that deploy).
6. **Custom domain** → add `picktherobot.com` in Vercel → point DNS (A/CNAME per Vercel) → wait for HTTPS.
7. **Smoke test** on production:

   ```bash
   SMOKE_BASE_URL=https://picktherobot.com npm run smoke
   ```

   Manually verify: homepage matcher (full category flow), copy share link, one vendor outbound click, `/vendors`, privacy/terms, mobile layout.

### Local smoke test (before deploy)

```bash
npm run build
npm run start
# separate terminal:
npm run smoke
```

## Phase 1 — Google Search Console

1. In [Search Console](https://search.google.com/search-console), add property `https://picktherobot.com`.
2. Choose **HTML tag** verification → copy the `content="..."` value (not the full tag).
3. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel → **redeploy** so `layout.tsx` emits the meta tag.
4. Click **Verify** in Search Console.
5. **Sitemaps** → submit `https://picktherobot.com/sitemap.xml`.
6. **URL inspection** → request indexing for `https://picktherobot.com` (use **https**, not `http://`).
7. **“Page with redirect” for `http://`**: Expected — HTTP permanently redirects to HTTPS. Google indexes the HTTPS URL, not HTTP. Click **Validate fix** in Search Console after deploy; do not try to index the `http://` URL.
8. After the first week, check **Pages** and **Indexing** for crawl errors.

## Phase 1 — Analytics

Pick **one** provider (both can be set, but one is usually enough):

| Provider | Env var | Notes |
|----------|---------|-------|
| **Plausible** | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=picktherobot.com` | Lighter EU compliance; no cookie banner required in many cases, but consent banner still shows if any analytics env is set |
| **GA4** | `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` | Consent banner blocks scripts until user accepts (already wired) |

1. Create account / property in Plausible or Google Analytics.
2. Add env var in Vercel **Production**.
3. Redeploy.
4. Visit site → accept cookies → confirm events in provider dashboard.
5. Confirm privacy policy is live before enabling analytics.

## Phase 2 — Monetization (when partnerships exist)

Infrastructure is ready; **no vendors** currently use `affiliateUrl` or `sponsored`.

When a partnership closes:

1. Edit `src/data/vendors.json` for that vendor:

   ```json
   {
     "outboundUrl": "https://vendor.com/...",
     "affiliateUrl": "https://vendor.com/...?ref=picktherobot",
     "sponsored": true
   }
   ```

   - `affiliateUrl` must be HTTPS and same host as `outboundUrl` (validated by tests).
   - `sponsored` applies a small score boost only when match score is already ≥ 40.

2. Run `npm test` (vendors + outbound tests).
3. Review **FAQ**, homepage methodology, and **terms** (`Affiliate and sponsored listings`) if live monetization changes disclosure needs.
4. Redeploy — no architecture change required.

Until then, outbound links use UTM tracking only (`utm_medium=referral`).
