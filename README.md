# Aphelion

A marketing website for **Aphelion** — a premium commercial-spaceflight & cosmos-lifestyle brand. Built as a dogfood of the Sitecore Content SDK NEW-site build flow (static-app → port). **PRD-000 (this release)** delivers Acts 1–2: a standalone, plain-React **static reference app** (the "Flux" design — bioluminescent neon mesh, gooey motion, real cosmos imagery) across five routes (Home, Destinations, Experiences, About, Contact), plus a derived `sitecore-content-model.md` operator CMS runbook. The head-app port to a live Sitecore tenant + deploy is **PRD-001 (Act 3)**.

## Status

`shipped` — latest PRD: **PRD-000** (Acts 1–2: static app + content-model spec). See `CHANGELOG.md` for history and `project-planning/` for PRDs, ADRs, and the ship report. The static app is a reference deliverable (not deployed); deploy is PRD-001.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Vitest + Playwright · **zero `@sitecore-*` dependencies** (by design — Act 1). Dark + light + system theme via `useSyncExternalStore` + FOUC preflight.

## Getting started

```bash
cd static
npm install
npm run dev        # http://localhost:3000

npm run test       # Vitest (100 unit/component)
npm run test:e2e   # Playwright (theme, fidelity screenshot-diff, axe a11y)
npm run build      # production build (NOT static export)
```

No environment variables are required for PRD-000 (no backend, no live SDK). Real imagery hotlinks from Unsplash (royalty-free) with a generated mesh fallback offline.
