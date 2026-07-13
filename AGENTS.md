# AGENTS.md — PickTheRobot

Instructions for AI coding agents working in this repository.

## Product summary

PickTheRobot.com is a **utility-first, rules-based robot recommendation engine** for businesses. It is not a concierge service or generic robotics blog.

Users pick a category (warehouse, cleaning, restaurant), answer a short wizard, and receive:

- Best robot type match with score breakdown
- Buy vs lease vs RaaS recommendation
- Ranked vendor list with explanations
- Shareable results URL

Monetization is outbound vendor clicks (UTM tracking; `affiliateUrl` when set). Lead capture is intentionally deferred.

## Tech stack

- **Next.js 15** App Router, React 19, TypeScript
- **Tailwind CSS 3**
- **Vitest** for unit tests (no Playwright e2e)
- Client-side matcher — no backend API for recommendations
- Vendor data in **`src/data/vendors.json`**

## Commands

```bash
npm install
npm run dev          # local dev
npm test             # vitest
npm run typecheck    # tsc --noEmit
npm run build        # production build
```

## Architecture map

| Area | Path |
|------|------|
| Matcher UI | `src/components/matching/` — `MatchingTool.tsx` is the main wizard |
| Forms / validation | `src/lib/forms/` — questions, `buildProfile.ts`, `validateAnswers.ts` |
| Scoring engine | `src/lib/matching/engine.ts`, `scoring/` (warehouse, cleaning, restaurant, vendors) |
| Vendor data | `src/data/vendors.json` → `src/lib/matching/vendors.ts` |
| Share links | `src/lib/matching/share.ts` — base64url payload in `?share=` |
| SEO | `src/lib/seo/`, `src/app/sitemap.ts`, `src/app/robots.ts` |
| Analytics | `src/lib/analytics/` — gated behind cookie consent |
| Content / nav | `src/lib/content/` |
| Public AI docs | `public/llms.txt`, `public/llms-full.txt` |

## Key behaviors (do not break)

1. **Logo / home** links to `/?matcher=category` (`HOME_MATCHER_RESET_HREF`) to reset the homepage matcher.
2. **Category guide links** use `categoryGuideHref()` → `/[category-route]#guide` (educational content below matcher).
3. **Share payloads** must pass full validation in `share.ts` — reject partial/tampered tokens.
4. **`staffAssignedToCleaning: 0`** is valid (see `ZERO_VALID_FIELDS` in `validateAnswers.ts`).
5. **Sponsored vendors** get a small score boost only when already relevant — never override fit.
6. **`/results`** is `noindex`.

## Conventions

- Minimize diff scope; match existing naming and patterns.
- Rules-based scoring only — no ML.
- Edit vendors in JSON, not hardcoded in TS (legacy `vendors:export` script is deprecated).
- Use `siteMetadata()` for page metadata; add JSON-LD via `src/lib/seo/schema.ts`.
- Tests live in `tests/*.test.ts` — run after logic changes.

## Environment variables

See `.env.example`. Important:

- `NEXT_PUBLIC_SITE_URL` — canonical domain for sitemap, OG, share URLs
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — Search Console HTML tag (optional)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — analytics (consent-gated)

## What not to add without explicit request

- Lead capture forms / CRM integration
- Blog or CMS
- Playwright e2e suite
- Force-push or amend commits unless asked

## Public documentation for AI assistants

Browsing agents should use **`/llms.txt`** (summary) and **`/llms-full.txt`** (detail) on the deployed site.
