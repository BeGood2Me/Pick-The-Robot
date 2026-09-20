# AGENTS.md — PickTheRobot

Instructions for AI coding agents working in this repository.

## Product summary

PickTheRobot.com is a **utility-first, rules-based robot recommendation engine** with **two equal tracks**:

- **Home** — robot vacuums (and later other home robots). Product SKUs, affiliate/retail outbound.
- **Business** — warehouse, commercial cleaning, and restaurant robots. Robot type, buy vs lease vs RaaS, ranked vendors.

It is not a concierge service, lab-test review site, or generic robotics blog. Do **not** mix warehouse AMRs and home vacuums in one wizard or one catalog.

### Home track

Users open `/robot-vacuums`, answer floors / pets / mop / budget, and receive:

- Best class (vacuum-only vs vac+mop) and budget lane
- Ranked models with why / why-not notes
- Shareable results URL (`/robot-vacuums/results?share=`, noindex)

Catalog: **`src/data/home-vacuums.json`** (models, not vendors). Monetization is retail affiliate links via `affiliateUrls` (`US` / `UK`); legacy `affiliateUrl` is a US fallback.

### Business track

Users pick a category (warehouse, commercial cleaning, restaurant), answer a short wizard, and receive:

- Best robot type match with score breakdown
- Buy vs lease vs RaaS recommendation
- Ranked vendor list with explanations
- Shareable results URL (`/results?share=`, noindex)

Monetization is outbound vendor clicks (UTM tracking; `affiliateUrl` when set). Lead capture is intentionally deferred.

## Tech stack

- **Next.js 15** App Router, React 19, TypeScript
- **Tailwind CSS 3**
- **Vitest** for unit tests (no Playwright e2e)
- Client-side matchers — no backend API for recommendations
- Business vendor data in **`src/data/vendors.json`**
- Home vacuum SKUs in **`src/data/home-vacuums.json`**

## Commands

```bash
npm install
npm run dev          # local dev
npm test             # vitest
npm run typecheck    # tsc --noEmit
npm run build        # production build
npm run mcp          # stdio MCP (Grok/Cursor: .mcp.json + mcp-server/README.md)
npm run mcp:http     # local Streamable HTTP on :3928/mcp for grok mcp add --transport http
```

## Architecture map

| Area | Path |
|------|------|
| Homepage tracks | `src/components/home-vacuums/HomeTracks.tsx` — `#tracks` |
| Business matcher UI | `src/components/matching/` — `MatchingTool.tsx` is the B2B wizard |
| Home vacuum matcher | `src/components/home-vacuums/` + `src/lib/home-vacuums/` |
| Forms / validation | `src/lib/forms/` — questions, `buildProfile.ts`, `validateAnswers.ts` |
| Business scoring | `src/lib/matching/engine.ts`, `scoring/` (warehouse, cleaning, restaurant, vendors) |
| Vendor data | `src/data/vendors.json` → `src/lib/matching/vendors.ts` |
| Home vacuum catalog | `src/data/home-vacuums.json` → `src/lib/home-vacuums/` |
| Share links | `src/lib/matching/share.ts` (business) and `src/lib/home-vacuums/share.ts` (home) |
| SEO | `src/lib/seo/`, `src/app/sitemap.ts`, `src/app/robots.ts` |
| Analytics | `src/lib/analytics/` — gated behind cookie consent |
| Content / nav | `src/lib/content/` |
| Public AI docs | `public/llms.txt`, `public/llms-full.txt` |

## Key behaviors (do not break)

1. **Logo / home** links to `/` (`HOME_HREF`). Homepage primary CTA is `#tracks` (`HOME_TRACKS_HREF`). Business matcher CTAs use `/#matcher` (`HOME_MATCHER_RESET_HREF`). Home vacuum matcher is `/robot-vacuums#matcher`.
2. **Category guide links** use `categoryGuideHref()` → `/[category-route]` (educational content; `#guide` still works).
3. **Share payloads** must pass full validation — reject partial/tampered tokens (business `share.ts`, home `home-vacuums/share.ts`).
4. **`staffAssignedToCleaning: 0`** is valid (see `ZERO_VALID_FIELDS` in `validateAnswers.ts`).
5. **Sponsored vendors** get a small score boost only when already relevant — never override fit.
6. **`/results`** and **`/robot-vacuums/results`** are `noindex`.
7. Commercial pages say **commercial cleaning robots**. Home pages say **robot vacuum** / **robot mop**. Do not use “cleaning robots” for both.
8. Do not add home SKUs to `vendors.json`.

## Conventions

- Minimize diff scope; match existing naming and patterns.
- Rules-based scoring only — no ML.
- Edit business vendors in JSON, not hardcoded in TS (legacy `vendors:export` script is deprecated).
- Edit home vacuums in `src/data/home-vacuums.json`.
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
- Lawn, pool, toys, or other home categories until the vacuum matcher is trustworthy
- Mixing home SKUs into the business matcher

## Public documentation for AI assistants

Browsing agents should use **`/llms.txt`** (summary) and **`/llms-full.txt`** (detail) on the deployed site.
