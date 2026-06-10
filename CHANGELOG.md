# Changelog

All notable changes to this product. Generated from ship reports.

## [PRD-000] — 2026-06-10
**Ship status:** shipped

### Delivered
- Standalone plain-React static app (`static/`) across 5 routes — Home, Destinations, Experiences, About, Contact — realizing the "Flux" design (Next 16 / React 19 / Tailwind v4 App Router, **zero `@sitecore-*` deps**).
- Dark + light + system theming (FOUC preflight + `useSyncExternalStore`), hydration-safe (T013 gate passed).
- Sitecore-portable component boundaries: flat-prop leaves + folder-of-children containers (ADR-0005), nav excluded.
- `sitecore-content-model.md` — the Act-2 operator CMS runbook (12-step checklist, 11 leaf-flat + 6 folder-of-children mappings, 31 content items copied verbatim).
- Representative cosmos marketing content + real royalty-free imagery (with mesh fallback); tasteful, reduced-motion-safe effects.
- Quality bar: 100 Vitest + 85 Playwright green, 20 screenshot-diff fidelity baselines (≤5%), axe a11y clean (10 route×theme), runtime AA contrast verified, zero horizontal scroll at 375/768/1280.

### Deferred
- Act 3 — head-app scaffold (`create-content-sdk-app`) + SDK field-component port against a live tenant + Vercel deploy → **PRD-001**.
- 3 net-new content-model decisions for PRD-001 kickoff: HeroMeta array flattening, ContactDetails rendering/template, Marquee items sourcing.
- i18n, personalization, real forms backend, search, commerce → future PRDs.
