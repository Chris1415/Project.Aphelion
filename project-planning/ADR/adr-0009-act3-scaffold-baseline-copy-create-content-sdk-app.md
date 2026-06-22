# ADR-0009: Act-3 scaffold via baseline-copy + create-content-sdk-app

## Status

Accepted

## Context

PRD-001 stands up the real Content SDK head app. PRD-000's static app was scaffolded with `create-next-app` (zero Sitecore). Act 3 needs the actual head-app shell wired to XM Cloud (proxy chain, sitecore.config, component-map, env). Rule `50-scaffold` forbids hand-writing `package.json`/`next.config.*` (pinned versions drift). The repo ships a CMS-side baseline at `C:/Projects/agentic/SitecoreAI_Authoring` (sitecore.json, xmcloud.build.json, authoring/, empty `sites/`) with `<SITE_NAME>`/`<SITE_COLLECTION_NAME>` tokens.

## Decision

Scaffold Act 3 in two steps: (1) copy the baseline into the product root and token-replace `<SITE_COLLECTION_NAME>`→`cosmos`, `<SITE_NAME>`→`aphelion` across all `*.module.json` etc.; (2) run the canonical `npx create-content-sdk-app@latest --template nextjs --destination aphelion` into `sites/aphelion/` (App Router), then copy `.env.local` and set the real Edge contextId. **Not** `create-next-app`. The static app stays at `static/` as the visual oracle; the head app lives at `sites/aphelion/`.

## Consequences

- **Easier:** the head app is 100% stock (proxy chain, getPage, component-map, editing routes all from the scaffold); versions are scaffold-pinned; the CMS-side baseline + tokens give a reproducible tenant-side structure.
- **Easier:** clean separation — `static/` (reference) vs `sites/aphelion/` (real head app) vs `authoring/` (CMS items).
- **Harder:** two app trees in one repo; the port copies markup/CSS from `static/` into `sites/aphelion/src/components/` by hand (the deliberate transform).
- If the scaffold command fails (network/registry), HARD STOP per rule 50 — never hand-write the shell.

## Date

2026-06-11
