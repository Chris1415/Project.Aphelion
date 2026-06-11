# Development Execution Plan

---
document_type: task_breakdown
artifact_name: task-breakdown-20260611T085021Z.md
generated_at: 2026-06-11T08:50:21Z
run_manifest: project-planning/workflow/run-20260611T085021Z.json
source_inputs:
  - project-planning/PRD/prd-001.md
  - project-planning/PRD/prd-minimal-001.md (Developer 08 orientation only; Lead Developer 06 used full PRD)
  - project-planning/architecture/architecture-20260611T085021Z.md (full track — binding blueprint)
  - project-planning/sitecore-content-model.md (operator runbook — canonical componentName registry, content values)
  - project-planning/ADR/adr-0002,0004,0005,0006,0009,0010,0011,0012,0013,0014
  - products/head-application/aphelion/static/src/** (visual + prop-shape oracle, ported verbatim)
consumed_by:
  - QA Specialist (07) enriches this file; Developer (08) implements from this file + prd-minimal only
next_input:
  - project-planning/plans/qa-report.md (optional)
---

<!-- PRD-001 is Act 3 of the Content SDK NEW-site flow: PORT the locked v5b "Flux" static app
     into a real Content SDK head app on a LIVE XM Cloud tenant + deploy. No redesign.
     Structured as the PRD §12 tranches: T-tenant (operator prereq) → T-scaffold → T-home (HARD
     VERIFY GATE) → T-inner → T-smoke → T-deploy. task_breakdown_style left for QA to decide
     (live-Edge port — standard + smoke, NOT pure unit-TDD). -->

## 0. Quick orientation (absorbed from former implementation-runbook)

*Populated by Lead Developer (06). The Developer starts work from this section + `prd-minimal-001.md` + the per-cycle visual oracle in `static/` — without opening the architecture, full PRD, or ADR files.*

### Implementation target directory

- **Target:** `products/head-application/aphelion/sites/aphelion/` — the NEW Content SDK head app (App Router). Created by the scaffold task (T002), NOT hand-written.
- **Container convention:** this product uses a multi-app layout (NOT the default `site/`). `static/` is the frozen visual+content oracle (PRD-000, reference only — never edited); `sites/aphelion/` is the real head app (all PRD-001 code); `authoring/` is the CMS-side baseline. Deviation from default `site/` is intentional and recorded here (ADR-0009).
- **Baseline source (copied in at T001):** `C:/Projects/agentic/SitecoreAI_Authoring/` (token-replaced `cosmos`/`aphelion`).

### Canonical inputs (Developer 08 normal flow loads ONLY these)

- **`prd-minimal-001.md`** — primary scope/orientation.
- **This task breakdown** — execution contract (§ 4c, tasks, tests, order).
- **Visual + content oracle (ALLOWED slim-context exception for this port):** `static/src/components/<X>/index.tsx` (markup/CSS to port verbatim), `static/src/ui/*` + `static/src/lib/*` (theme/reveal/motion to port verbatim), `static/src/content/*.ts` (content values — already seeded into the tenant by the operator). There is no `pocs/` clickdummy folder this PRD — the running `static/` app IS the clickdummy.
- **NO `baseline.md`** exists yet for this product (only 14 ADRs; baseline promotes at the next `/architect` if it crosses the threshold) — so § 4c-2 lists the full relevant ADR set, not a delta.

**NOT loaded** in Developer normal flow: full PRD, architecture file, raw ADR files (use § 4c-2 one-liners), UI variant specs (none — design locked).

### Planned delivery order

*Mirror of § 5 Execution order. The Home gate (after T021) is a HARD STOP — inner routes do not start until it passes.*

```
T000  (operator prerequisite — NOT a Developer task; gate before T001)

— Tranche T-scaffold —
T001  baseline copy + token-replace
T002  create-content-sdk-app scaffold + .env.local (real contextId)
T003  re-verify SDK .d.ts shapes against sites/aphelion/node_modules
T004  port theme/fonts/reveal/motion stack verbatim
T005  /api/layout-debug dev probe route
T006  T-scaffold gate: boot + layout-debug returns real Home layout

— Tranche T-home (HARD VERIFY GATE) —
T007  component-map plumbing (server + client maps, generate-map)
T008  /api/nav-children Route Handler
T009  component-level navigation (server L1 + client lazy L2)
T010  Hero (Client, leaf)
T011  ValueProps + ValueCard (Server container)
T012  DestinationsGrid + DestinationCard (Server container, GridLimit)
T013  ExperienceShowcase + ExperienceItem (Server container)
T014  StatsBand + Stat (Server container, count-up params)
T015  PromoBand (Client, leaf)
T016  Testimonials + TestimonialCard (Server container)
T017  NewsletterCTA (Client, leaf, presentational)
T018  Marquee (Server, derived from Destinations)
T019  Home route assembly + editing-safe wiring
T020  Home Playwright smoke + structural screenshot-diff (both themes)
T021  HOME VERIFY GATE — binary exit criteria + operator visual sign-off

— Tranche T-inner (only after T021 passes) —
T022  PageHero (Server, leaf)
T023  RichTextSection (Server, leaf)
T024  ContactForm (Client, leaf, presentational)
T025  ContactDetails + ContactDetailItem (Server container, NET-NEW)
T026  inner route assembly (Destinations, Experiences, About, Contact)

— Tranche T-smoke —
T027  per-route Playwright smoke + structural screenshot-diff
T028  editing-safe verification (Pages editor / preview)
T029  full build + lint + tsc + axe + motion-ON/client-nav suite

— Tranche T-deploy —
T030  remove /api/layout-debug ONLY (keep /api/nav-children)
T031  Vercel env + deploy + prod-domain smoke
```

### Completion criteria

- **Pre-completion validation gate** (per `06-implement.md` § 9): `npm run build` + `npm run lint` + `npx tsc --noEmit` all green in `sites/aphelion/`; git-status clean except for explicitly-dispositioned untracked files; `.env.local` gitignored and never committed.
- **Smoke gates** (`platform_target: content-sdk`): per-route real-tenant smoke recorded under manifest `smoke_outcomes` — automated (Playwright) + operator-manual split, per `/test` and `/ship`. The **Home gate (T021)** is a hard mid-PRD operator stop; inner routes do not begin until it passes.
- **§ 9 TDD contract** (if QA flips `task_breakdown_style: tdd`): RED→GREEN for any in-scope unit-testable layer. Default expectation for this live-Edge port = standard + smoke; ported unit tests (theme/motion from `static/`) run as regression.

## 1. Implementation Overview

This PRD ports the approved v5b "Flux" static app (`static/`) into a real Sitecore XM Cloud Content SDK head app (`sites/aphelion/`, App Router) serving **live Edge data via stock `client.getPage()`**, then deploys to Vercel. It is an **integration + port**, not a redesign: every component, theme module, and motion controller already exists and is correct. The work is the deliberate transform from plain React props to **SDK field components** (`<Text>`/`<RichText>`/`<Image>`/`<Link>`) driven by the live payload, plus the integration surfaces a head app needs (component-map, two route handlers, editing-safe rendering, deploy).

**The single binding contract is the canonical `componentName` registry** (architecture §4.1 / `sitecore-content-model.md` Step 7 / ADR-0010): 13 placeable renderings, each bound across the operator's tenant, the head-app component-map, and the live payload. A mismatch on any side renders `<MissingComponent>` silently — caught at the Home verify gate.

**Two hard de-risking gates:** (1) the operator builds the FULL tenant up front (T000) — nothing boots without it; (2) the **Home route is a hard verify gate** (T021) — all 9 Home renderings + nav ported and smoke-green (binary criteria + operator sign-off) before the 4 inner routes (mechanical repetition) begin.

## 2. Epics

- **E1 — Scaffold & foundation (T-scaffold).** Baseline copy + token-replace, canonical CLI scaffold, real-contextId `.env.local`, SDK-shape re-verification, theme/motion port, dev probe route, boot gate.
- **E2 — Home port (T-home, HARD VERIFY GATE).** Component-map plumbing, navigation, all 9 Home renderings ported from the live payload, Home route assembly, editing-safe wiring, Home smoke + structural diff, the binary verify gate.
- **E3 — Inner routes (T-inner).** The 4 net components for inner routes (PageHero, RichTextSection, ContactForm, ContactDetails) + assembly of Destinations / Experiences / About / Contact reusing already-ported components.
- **E4 — Smoke & quality (T-smoke).** Per-route real-tenant smoke (automated + operator-manual), editing-safe verification, full build/lint/tsc/axe/motion-ON suite.
- **E5 — Deploy (T-deploy).** Remove `/api/layout-debug` only, Vercel env + deploy, prod-domain smoke.

## 3. Feature Breakdown

- **E1:** F1.1 baseline+scaffold; F1.2 env+SDK-contract verification; F1.3 theme/motion port; F1.4 dev probe + boot gate.
- **E2:** F2.1 component-map split (4 client / 9 server, ADR-0013); F2.2 component-level navigation (ADR-0011); F2.3 the 9 Home renderings (leaf + folder-of-children); F2.4 Home assembly + editing-safe (ADR-0014); F2.5 Home verify gate (ADR-0012).
- **E3:** F3.1 the 4 inner-only renderings; F3.2 inner-route assembly + reuse.
- **E4:** F4.1 per-route smoke; F4.2 editing/preview surface; F4.3 build/lint/tsc/axe/motion suite.
- **E5:** F5.1 debug-route removal; F5.2 deploy + prod smoke.

## 4. Task Breakdown

> **Per-component port transform (applies to T010–T018, T022–T025) — the work, every time:**
> (1) copy the static component's markup/CSS from `static/src/components/<X>/index.tsx` into `sites/aphelion/src/components/<X>/<X>.tsx`;
> (2) probe the live payload via `/api/layout-debug?site=aphelion&locale=en&path=<route>` and read the **actual** `fields` shape for that rendering;
> (3) replace each plain prop with the matching SDK field component, deriving the field **NAMES from the live payload, NOT from static prop names** (ADR-0005 drift trap #1);
> (4) defensive optional-chain to the deepest leaf (empty-state shapes — `fields?.X?.value?.src`);
> (5) register the `componentName` verbatim in the correct map (server or client per ADR-0013) and run `npm run sitecore-tools:generate-map`;
> (6) re-probe `/api/layout-debug` after wiring to confirm the shape still matches;
> (7) screenshot-diff the live page region against the static app's equivalent (structural, text-tolerant).

---

### T000 — [OPERATOR PREREQUISITE, NOT A DEVELOPER TASK] Build + publish the FULL tenant

- **Title:** Operator builds the full Aphelion tenant from `sitecore-content-model.md` and publishes to Edge
- **Description:** **This is an operator CMS-track task, executed before any head-app code (build-flow Phase 5.5 single gate).** The operator works through `project-planning/sitecore-content-model.md` top-to-bottom: site collection (`cosmos`) + site (`aphelion`) nodes; all datasource templates (Step 3), child templates, folder templates (Step 4), parameters templates (Step 6 — `GridLimit`, `CountUp*`); all 13 rendering items with `componentName` quoted **verbatim** (Step 5); Available Renderings (Step 8); all 5 page items + presentation placements (Step 9, incl. `GridLimit=3` on Home DestinationsGrid, `GridLimit=0` on /destinations); all datasource content items with field values copied **verbatim** from `static/src/content/*` (Step 10); then **publish the `cosmos/aphelion` subtree to Edge** (Step 12). Tenant readiness = the canonical `componentName` table (Step 7) all-green + content seeded verbatim. The operator provides the real Edge contextId at the T002 scaffold gate. The nav (SiteHeader/SiteFooter) is excluded from the content model — it is sourced via the component-level nav pattern (T008/T009), not built here.
- **Expected Output:** A live, published XM Cloud tenant where `https://<edge-host>/sitecore/api/layout/render/v1?item=/&sc_apikey=<contextId>&sc_site=aphelion&sc_lang=en` returns `{"sitecore":{"context":{...},"route":{...}}}` for the Home route; real Edge contextId handed to the Developer. **This is the gate before T001 — the head app cannot boot or probe until it is done.**
- **Depends on:** none (operator-side; precedes all code tasks)

---

### T001 — Baseline copy + token replacement

- **Title:** Copy the CMS-side baseline into the product root and token-replace cosmos/aphelion
- **Description:** Copy the entire contents of `C:/Projects/agentic/SitecoreAI_Authoring/` into the product root `products/head-application/aphelion/` (ships `sitecore.json`, `xmcloud.build.json`, `.sitecore/`, `authoring/`, empty `sites/`). Token-replace across every `*.module.json` and `xmcloud.build.json`: `<SITE_COLLECTION_NAME>`→`cosmos`, `<SITE_NAME>`→`aphelion`. Do NOT overwrite the existing `static/` app. Per build-flow Phase 1a/1b and ADR-0009.
- **Expected Output:** Baseline present at the product root; `grep -rn "<SITE_NAME>\|<SITE_COLLECTION_NAME>"` over the product returns zero results; empty `sites/` folder ready for the scaffold; `static/` untouched.
- **Depends on:** T000

### T002 — Scaffold the head app via create-content-sdk-app + .env.local

- **Title:** Run the canonical Content SDK scaffold into sites/aphelion and set the real Edge contextId
- **Description:** From `products/head-application/aphelion/sites/`, run the literal canonical command `npx --yes create-content-sdk-app@latest --yes --template nextjs --destination aphelion` (App Router). **Rule 50-scaffold: NOT `create-next-app`; do NOT hand-write `package.json`/`next.config.*`; if the command fails (network/registry) HARD STOP and report — never reconstruct the shell from training data.** After scaffold: `npm install`; copy `.env.example`/`.env.remote.example` → `.env.local`; set the real Edge contextId (the public + server var names exactly as the scaffold's `.env.example` declares — read them literally, do not assume; OQ-A), `NEXT_PUBLIC_DEFAULT_SITE_NAME=aphelion`, `SITE_COLLECTION_NAME=cosmos`, default language `en`. `.env.local` is gitignored; `.env.example` documents var names only. Per build-flow Phase 1c.
- **Expected Output:** `sites/aphelion/` contains the stock Content SDK App-Router scaffold (proxy chain, catch-all `[site]/[locale]/[[...path]]/page.tsx`, editing API routes, `.sitecore/component-map.ts` + `.client.ts`, `sitecore-tools` scripts); `npm install` clean; `.env.local` populated with the real contextId; `.env.example` updated with documented var names.
- **Depends on:** T001

### T003 — Re-verify SDK field/getPage shapes against the scaffolded node_modules

- **Title:** Confirm the §4.3-cited SDK shapes match the scaffold-pinned @sitecore-content-sdk version
- **Description:** The architecture cited field/getPage shapes from an installed copy in `playgrounds/training`; the scaffold (T002) pins its own SDK version which may differ. Open `sites/aphelion/node_modules/@sitecore-content-sdk/react/types/components/{Text,RichText,Image,Link}.d.ts` and `.../nextjs/types/client/sitecore-nextjs-client.d.ts` and confirm the `TextField`/`RichTextField`/`ImageField`/`LinkField`/`getPage`/`Page`/`LayoutServiceData` shapes match those in § 4c-6. If any shape diverges, update § 4c-6 inline citations to the head-app's own `.d.ts` paths and flag the divergence (rule `40-sdk-contracts`). This is a binding pre-port task — every later port task cites these shapes.
- **Expected Output:** A short confirmation note in the manifest/PR that the §4.3/§4c-6 shapes are identical in `sites/aphelion/node_modules` (or a documented diff with § 4c-6 updated to the scaffold-pinned paths). No port task (T010+) starts until this is recorded.
- **Depends on:** T002

### T004 — Port the theme / fonts / reveal / motion stack verbatim

- **Title:** Port the PRD-000 theme + motion infrastructure from static/ into sites/aphelion (non-component placement)
- **Description:** Port verbatim from `static/` into `sites/aphelion/`: `public/theme-init.js` (FOUC preflight, referenced from the root layout `<head>` — NOT a React inline raw-HTML script); the `useSyncExternalStore` theme provider + toggle (`static/src/ui/theme-provider.tsx`, `theme-toggle.tsx`); the RevealController MutationObserver (`static/src/ui/reveal-controller.tsx`); motion hooks (`static/src/lib/motion/*` — `useCountUp`, `useMagnetic`, `useReveal`); `static/src/ui/primitives.tsx`; the Tailwind v4 `@theme` token block + `@custom-variant dark` + Clash Display self-host. **Placement rule (gen-map trap, ADR-0013/naming-traps):** all of this lands in `sites/aphelion/src/ui/*` and `src/lib/*` — NEVER under `src/components/<X>/` (the `sitecore-tools generate-map` scanner registers anything there as a Sitecore rendering). Wire the theme provider + theme-init into the head app's root layout. Per ADR-0004 (verbatim).
- **Expected Output:** `sites/aphelion/src/ui/*`, `src/lib/motion/*`, `public/theme-init.js` present and wired into the root layout; dark/light/system theme works on a bare head-app boot; no hydration warnings; the ported `static/` theme + motion unit tests pass as regression.
- **Depends on:** T002

### T005 — /api/layout-debug dev probe route

- **Title:** Add the dev-only layout-debug Route Handler for per-component live-payload probing
- **Description:** Create `sites/aphelion/src/app/api/layout-debug/route.ts` (App-Router Route Handler, `GET`, query `?site=aphelion&locale=en&path=/`) returning the raw `getPage` layout JSON for the path, per `custom_content-sdk-debug-layout-probe`. This is the instrument every port task uses to derive props from the **live** payload (ADR-0005). It is **dev-only** — removed at T030. It also satisfies the T006 boot gate.
- **Expected Output:** `GET /api/layout-debug?site=aphelion&locale=en&path=/` returns the live Home layout JSON when the dev server runs against the published tenant.
- **Depends on:** T002

### T006 — T-scaffold gate: boot + layout-debug returns real Home layout

- **Title:** Confirm the head app boots against the live tenant and the layout-debug probe returns real Home layout
- **Description:** Run `npm run dev` (offline-safe note: `sitecore-tools:build` prelude calls Edge — use `npx next dev` if needed) and confirm the head app boots without errors against the published tenant. Hit `/api/layout-debug?site=aphelion&locale=en&path=/` and confirm it returns the real Home layout (not `No sitecore context` — which would mean the site/home route is unpublished, a T000 punch-list item, not a head-app bug). A `<MissingComponent>` at this stage is expected (no components ported yet). This is the **T-scaffold exit gate**.
- **Expected Output:** Dev server boots clean; `/api/layout-debug` returns real Home layout JSON; any gap traced back to a numbered T000 runbook line and surfaced to the operator (not worked around).
- **Depends on:** T003, T004, T005

### T007 — Component-map plumbing (server + client maps)

- **Title:** Establish the component-map server/client split and the generate-map workflow
- **Description:** Set up `.sitecore/component-map.ts` (Server) and `.sitecore/component-map.client.ts` (Client) per ADR-0013. The split is keyed to the static app's `'use client'` boundary: **Client map (4):** `Hero`, `PromoBand`, `NewsletterCTA`, `ContactForm`. **Server map (9):** `PageHero`, `ValueProps`, `DestinationsGrid`, `ExperienceShowcase`, `StatsBand`, `Testimonials`, `RichTextSection`, `ContactDetails`, `Marquee`. **Interactive CHILD components** (`DestinationCard`, `ValueCard`, `ExperienceItem`, `Stat`) get NO map entry — they are imported as Client children by their Server container. Establish `npm run sitecore-tools:generate-map` as the verification step run after every component is added (it scans `src/components/` only — infra must stay in `src/ui`/`src/lib`). Register entries incrementally as T010–T018 land; this task sets up the structure + the verification loop.
- **Expected Output:** Both map files exist with the correct server/client structure; `generate-map` runs clean and registers only Sitecore renderings (no infra pollution); the registration rule documented for the per-component tasks.
- **Depends on:** T006

### T008 — /api/nav-children Route Handler (production nav infrastructure)

- **Title:** Build the lazy-L2 nav Route Handler (NOT a Server Action)
- **Description:** Create `sites/aphelion/src/app/api/nav-children/route.ts` (App-Router Route Handler, `GET`, query `?id=<itemId>&site=aphelion&locale=en`) returning `{ children: [{ id, title, url, hasChildren }] }` for the hovered L1 node, with `NavigationTitle` override and `NavigationFilter` respected, per `custom_content-sdk-component-level-navigation`. **Must be a Route Handler, NEVER a Server Action** (a Server Action auto-fires `router.refresh()` → wipes hover state → flicker, per `custom_nextjs-route-handler-vs-server-action` + ADR-0011). Validate `id`/`site`/`locale` inputs before the Edge call. **This handler SURVIVES to production** (only `/api/layout-debug` is removed at ship, FR-8).
- **Expected Output:** `GET /api/nav-children?id=<L1-id>&site=aphelion&locale=en` returns JSON L2 children for a published L1 node; inputs validated; handler lives at `src/app/api/nav-children/` (outside `src/components/`).
- **Depends on:** T006

### T009 — Component-level navigation (server L1 + client lazy L2)

- **Title:** Build header/footer navigation — server-rendered L1, lazy L2 per-hover, no-flicker dropdown
- **Description:** Build the header + footer nav per `custom_content-sdk-component-level-navigation`: server-render L1 (root + first level, with `hasChildren`) from the Sitecore route tree in the head app's chrome (NOT a placed rendering — it is excluded from the content model, ADR-0005); lazy-load L2 per hover by fetching `/api/nav-children` (T008) from the client nav component with a ~150ms intent delay; dropdown flush with the parent `<li>` (no `mt-*` gap → no flicker). Port the visual treatment from `static/src/components/chrome/SiteHeader`, `SiteFooter`, `MobileNav`. **Placement rule:** the client nav component + its fetch hook live in `src/ui/` or `src/lib/`, NOT under `src/components/` (gen-map trap). No full-document reload on hover.
- **Expected Output:** Header L1 server-rendered on first paint; hovering an L1 with `hasChildren` lazy-loads + shows a flush dropdown with no flicker and no page-reload symptom; footer nav renders; mobile nav works; keyboard-operable (NFR-4).
- **Depends on:** T008

### T010 — Port Hero (Client, leaf — Shape A)

- **Title:** Port Hero to SDK field components (Client map)
- **Description:** Apply the per-component port transform to `Hero`. Static source: `static/src/components/Hero/index.tsx` (`'use client'` — gooey `#gooey` filter + magnetic CTA → **Client map**). Datasource pattern: **Leaf-flat (Shape A)** — `Hero` datasource, 6 flat meta fields. Probe Home payload, then wire: `<Text>` for Eyebrow/Title/TitleAccent + MetaValue1–3/MetaLabel1–3, `<Text>` for Lede (Multi-Line Text → `TextField`), `<Image>` for HeroImage, `<Link>` for PrimaryCta/SecondaryCta (optional). Preserve the gooey perf guard + magnetic CTA + reveal exactly from the static app. Register `"Hero"` verbatim in `component-map.client.ts`.
- **Expected Output:** Hero renders live Home content with 0 `<MissingComponent>`, gooey + magnetic + reveal intact; props derived from the probed payload; registered in client map; `generate-map` clean.
- **Depends on:** T007

### T011 — Port ValueProps + ValueCard (Server container — Shape B)

- **Title:** Port ValueProps container + ValueCard children (Server map, folder-of-children)
- **Description:** Port `ValueProps` (container, `'use client'` absent → **Server map**) reading **folder-of-children (Shape B)** — `ValuePropsFolder` → `ValueCard` children (Children resolver `{2F5C334E-5615-423C-8281-9FC180191302}`). Container fields: `<Text>` Heading/Eyebrow/HeadingAccent. Per child (`ValueCard`, interactive hover → imported as Client child, NO own map entry): `<Text>` Icon/CardTitle/Body. Probe the live payload to confirm how children reach the container (resolver shape). Defensive: zero children → empty section, not a crash. Register `"ValueProps"` verbatim in `component-map.ts` (server).
- **Expected Output:** ValueProps renders the container heading + the ValueCard children from live Edge; 0 `<MissingComponent>`; container Server, child Client; registered in server map.
- **Depends on:** T007

### T012 — Port DestinationsGrid + DestinationCard (Server container — Shape B, GridLimit)

- **Title:** Port DestinationsGrid container + DestinationCard children (Server map, GridLimit param) — the Home folder-of-children canary
- **Description:** Port `DestinationsGrid` (Server map) reading **folder-of-children (Shape B)** — `DestinationsGridFolder` → `DestinationCard` children. Container fields: `<Text>` Heading/Eyebrow/HeadingAccent/Intro. Per child (`DestinationCard`, `<img>` onError fallback → Client child, NO own map entry): `<Text>` Name/Tagline/Distance/Detail, `<Image>` CardImage, `<Link>` CardLink. Honor the `GridLimit` rendering parameter (Home=3) limiting rendered child count. **This is the Home canary for the folder-of-children resolver shape** — probe carefully; if the resolver shape is wrong here it is wrong everywhere (de-risk for T013/T016/T025). Register `"DestinationsGrid"` verbatim in server map.
- **Expected Output:** DestinationsGrid renders exactly 3 DestinationCards on Home (GridLimit=3) from live Edge; images/links/fields resolve; 0 `<MissingComponent>`; resolver shape confirmed and documented for the other containers.
- **Depends on:** T007

### T013 — Port ExperienceShowcase + ExperienceItem (Server container — Shape B)

- **Title:** Port ExperienceShowcase container + ExperienceItem children (Server map)
- **Description:** Port `ExperienceShowcase` (Server map) reading **folder-of-children (Shape B)** — `ExperienceShowcaseFolder` → `ExperienceItem` children. Container fields: `<Text>`. Per child (`ExperienceItem`, `<img>` onError → Client child, NO own map entry): `<Text>` ItemTitle/Summary/Duration, `<Image>` ItemImage, `<Link>` Cta. Reuse the resolver-shape understanding from T012. Register `"ExperienceShowcase"` verbatim in server map.
- **Expected Output:** ExperienceShowcase renders its ExperienceItem children from live Edge; 0 `<MissingComponent>`; registered server map.
- **Depends on:** T012

### T014 — Port StatsBand + Stat (Server container — Shape B, count-up params)

- **Title:** Port StatsBand container + Stat children (Server map, count-up via rendering params)
- **Description:** Port `StatsBand` (Server map) reading **folder-of-children (Shape B)** — `StatsBandFolder` → `Stat` children. Container field: `<Text>` BandHeading. Per child (`Stat`, client count-up animation → Client child, NO own map entry): `<Text>` StatValue/StatLabel, plus the count-up animation driven by `useCountUp` (ported T004). Count-up metadata (`CountUpSuffix`/`CountUpPrefix`/`CountUpDecimals`) comes from **rendering parameters** (StatsBandParams), not datasource fields — read them from the rendering params in the payload. Register `"StatsBand"` verbatim in server map.
- **Expected Output:** StatsBand renders Stat children with count-up animation honoring the rendering-parameter suffix/prefix/decimals from live Edge; 0 `<MissingComponent>`; server map.
- **Depends on:** T012

### T015 — Port PromoBand (Client, leaf — Shape A)

- **Title:** Port PromoBand to SDK field components (Client map)
- **Description:** Port `PromoBand` (`'use client'` — CSS mesh + magnetic CTA → **Client map**), **Leaf-flat (Shape A)** — `PromoBand` datasource. Fields: `<Text>` Eyebrow/Heading/HeadingAccent/Body, `<Link>` Cta, `<Image>` PromoImage (optional — the Home content leaves it empty, CSS mesh backdrop used; defensive optional-chain so empty image renders nothing, not a crash). Preserve the CSS mesh + magnetic CTA exactly. Register `"PromoBand"` verbatim in `component-map.client.ts`.
- **Expected Output:** PromoBand renders live Home content with CSS mesh + magnetic CTA; empty PromoImage handled gracefully; 0 `<MissingComponent>`; client map.
- **Depends on:** T007

### T016 — Port Testimonials + TestimonialCard (Server container — Shape B)

- **Title:** Port Testimonials container + TestimonialCard children (Server map)
- **Description:** Port `Testimonials` (Server map) reading **folder-of-children (Shape B)** — `TestimonialsFolder` → `TestimonialCard` children. Container fields: `<Text>`. Per child (`TestimonialCard` — pure presentational, **Server child**): `<Text>` Quote/Author/Role, `<Image>` Avatar (optional). Register `"Testimonials"` verbatim in server map.
- **Expected Output:** Testimonials renders TestimonialCard children from live Edge; 0 `<MissingComponent>`; server map.
- **Depends on:** T012

### T017 — Port NewsletterCTA (Client, leaf, presentational — Shape A)

- **Title:** Port NewsletterCTA to SDK field components (Client map, presentational-only)
- **Description:** Port `NewsletterCTA` (`'use client'` — form input state → **Client map**), **Leaf-flat (Shape A)** — `NewsletterCTA` datasource. Fields: `<Text>` Heading/HeadingAccent/Body/Placeholder/ButtonLabel. **Presentational only (ADR-0006)** — full client-side UI + validation + states, but **no network submit, no backend**. Register `"NewsletterCTA"` verbatim in `component-map.client.ts`.
- **Expected Output:** NewsletterCTA renders live copy/labels with working client-side form states but no submit; 0 `<MissingComponent>`; client map.
- **Depends on:** T007

### T018 — Port Marquee (Server, derived from Destinations)

- **Title:** Port Marquee — derive item names from the published Destination children (no datasource)
- **Description:** Port `Marquee` (Server map — pure CSS infinite scroll, 0 hooks verified). **No datasource (FR-5).** At render it reads the published `Destination` children, takes each child's `Name` field in **Sitecore source order, no truncation**, and renders the CSS scroll strip. **Probe the Home layout (OQ-B) to determine HOW the Destinations children reach the Marquee placement** — whether they are delivered inline in the Marquee rendering payload or the head app must read the published Destinations folder separately. The live payload is the contract; do not guess. Register `"Marquee"` verbatim in server map (registration needed so it can be placed even though it has no datasource).
- **Expected Output:** Marquee renders all Destination names in source order, no truncation, CSS scroll intact; OQ-B resolved and documented (inline vs separate read); 0 `<MissingComponent>`; server map.
- **Depends on:** T012

### T019 — Home route assembly + editing-safe wiring

- **Title:** Assemble the Home route from the ported renderings and wire editing-safe rendering
- **Description:** Confirm the stock catch-all page (`[site]/[locale]/[[...path]]/page.tsx`) renders the Home placeholder tree with all 9 ported Home renderings + nav chrome (the page itself is stock — not hand-written). Wire **editing-safe rendering (ADR-0014):** the catch-all branches on `draftMode()` and, when active, fetches via `getPreview`/`getDesignLibraryData` from `searchParams` instead of `getPage` (stock path — no custom editing route). Confirm every Home component optional-chains empty fields so it renders in Pages without crashing. Confirm the component-map resolves every Home `componentName` in the editing API.
- **Expected Output:** Home (`/`) renders the full ordered rendering tree (Hero → Marquee → ValueProps → DestinationsGrid → ExperienceShowcase → StatsBand → PromoBand → Testimonials → NewsletterCTA) from live Edge; editing-safe path wired; component-map resolves all 9 Home renderings + 0 `<MissingComponent>`.
- **Depends on:** T009, T010, T011, T012, T013, T014, T015, T016, T017, T018

### T020 — Home Playwright smoke + structural screenshot-diff (both themes)

- **Title:** Automated Home smoke — MissingComponent/empty checks, nav, axe, motion-ON, structural diff vs static
- **Description:** Author the automated Home smoke suite (Playwright): 0 `<MissingComponent>` on Home; 0 empty/placeholder renderings; component-map resolves every Home `componentName`; nav functional (hover dropdown opens, no full-document reload on hover); axe clean both themes; **motion-ON + client-nav checks** (the gate that catches hydration/RSC errors vitest+build cannot — framework `/test § 1d-ii.5b`); **structural screenshot-diff vs the static Home, both themes** (text-tolerant — layout/structure, not exact text). Re-probe `/api/layout-debug` to confirm shapes still match. The static app (`static/src/app/page.tsx`) is the visual oracle.
- **Expected Output:** Passing automated Home smoke suite covering all binary Home-gate automated criteria; structural diff clean both themes; any failure is a blocker, not a warning.
- **Depends on:** T019

### T021 — HOME VERIFY GATE (binary exit criteria + operator visual sign-off)

- **Title:** Home gate — ALL automated criteria pass + operator visual sign-off; inner routes do not start until this passes
- **Description:** **HARD STOP GATE (ADR-0012).** Confirm the full binary Home-gate exit criteria (prd-minimal Success criteria): automated — 0 `<MissingComponent>` on Home, 0 empty renderings, component-map resolves every Home `componentName`, `npm run build` + `npm run lint` + `npx tsc --noEmit` green, nav functional (hover dropdown, no full reload), axe clean, motion-ON + client-nav pass, structural screenshot-diff vs static Home passes both themes; **PLUS operator sign-off on Home visual fidelity** (the operator is the fidelity arbiter — automated diff is text-tolerant). Record the gate outcome in the manifest `smoke_outcomes`. **The 4 inner routes (T022+) MUST NOT begin until this gate passes.** A systemic problem (resolver shape, map mismatch, SDK-shape misunderstanding) surfaces here on one route, not five.
- **Expected Output:** Every binary criterion green + operator visual sign-off recorded; manifest `smoke_outcomes` Home entry = pass; explicit go/no-go for inner routes. If any criterion fails → fix before proceeding (no inner-route work).
- **Depends on:** T020

### T022 — Port PageHero (Server, leaf — Shape A)

- **Title:** Port PageHero to SDK field components (Server map) — used by all 4 inner routes
- **Description:** Port `PageHero` (Server map — pure presentational), **Leaf-flat (Shape A)** — `PageHero` datasource. Fields: `<Text>` Title/Subtitle, `<Image>` HeroImage (optional — inner-route content leaves it empty; defensive optional-chain). Used by /destinations, /experiences, /about, /contact. Register `"PageHero"` verbatim in server map.
- **Expected Output:** PageHero renders live inner-route hero content; empty HeroImage handled gracefully; 0 `<MissingComponent>`; server map.
- **Depends on:** T021

### T023 — Port RichTextSection (Server, leaf — Shape A)

- **Title:** Port RichTextSection to SDK field components (Server map)
- **Description:** Port `RichTextSection` (Server map), **Leaf-flat (Shape A)** — `RichTextSection` datasource. Fields: `<Text>` SectionHeading, `<RichText>` Body (the one true `RichTextField`/`<RichText>` in the registry — confirm the delivered shape is `RichTextField` via probe). Used by /about (AboutStory). Register `"RichTextSection"` verbatim in server map.
- **Expected Output:** RichTextSection renders the heading + the rich-text body (the 3 About paragraphs) from live Edge; 0 `<MissingComponent>`; server map.
- **Depends on:** T021

### T024 — Port ContactForm (Client, leaf, presentational — Shape A)

- **Title:** Port ContactForm to SDK field components (Client map, presentational-only)
- **Description:** Port `ContactForm` (`'use client'` — form input state → **Client map**), **Leaf-flat (Shape A)** — `ContactForm` datasource. Fields: `<Text>` FormHeading/Intro/NameLabel/EmailLabel/MessageLabel/ButtonLabel — all presentational copy. **Presentational only (ADR-0006)** — full client-side UI + validation + states, **no network submit, no backend**. Register `"ContactForm"` verbatim in `component-map.client.ts`.
- **Expected Output:** ContactForm renders live labels/copy with working client-side validation + states but no submit; 0 `<MissingComponent>`; client map.
- **Depends on:** T021

### T025 — Port ContactDetails + ContactDetailItem (Server container — Shape B, NET-NEW)

- **Title:** Port ContactDetails container + ContactDetailItem children (Server map, NET-NEW rendering)
- **Description:** Port `ContactDetails` (Server map) reading **folder-of-children (Shape B)** — `ContactDetailsFolder` → `ContactDetailItem` children (Children resolver). **This is a NET-NEW rendering** — the static app rendered it inline in `static/src/app/contact/page.tsx` (no `src/components/ContactDetails/` folder), so port the markup from the contact route file + `static/src/content/contact.ts` shapes. Container field: `<Text>` SectionHeading. Per child (`ContactDetailItem`): `<Text>` DetailLabel/DetailValue, `<Link>` DetailLink (optional — the ResponseTime item has no link; defensive optional-chain so the missing link renders nothing). Reuse the resolver-shape understanding from T012. Register `"ContactDetails"` verbatim in server map.
- **Expected Output:** ContactDetails renders the section heading + ContactDetailItem children (incl. the link-less ResponseTime item) from live Edge; 0 `<MissingComponent>`; server map.
- **Depends on:** T021

### T026 — Inner route assembly (Destinations, Experiences, About, Contact)

- **Title:** Assemble the 4 inner routes from ported components + editing-safe wiring
- **Description:** Confirm the stock catch-all renders all 4 inner routes from the live payload, reusing already-ported components: **/destinations** (PageHero → DestinationsGrid `GridLimit=0`/all → NewsletterCTA); **/experiences** (PageHero → ExperienceShowcase → StatsBand → NewsletterCTA); **/about** (PageHero → RichTextSection → ValueProps → Testimonials); **/contact** (PageHero → ContactForm → ContactDetails). DestinationsGrid on /destinations must render ALL destinations (GridLimit=0, vs 3 on Home) — confirm via probe. Editing-safe path applies to every inner route too (ADR-0014).
- **Expected Output:** All 4 inner routes render their full ordered rendering trees from live Edge with 0 `<MissingComponent>` and 0 empty renderings; DestinationsGrid shows all 6 destinations on /destinations; reused components (NewsletterCTA, StatsBand, ValueProps, Testimonials) render identically to Home.
- **Depends on:** T022, T023, T024, T025

### T027 — Per-route real-tenant smoke + structural screenshot-diff

- **Title:** Per-route automated smoke + operator-manual smoke (all 5 routes)
- **Description:** Extend the automated smoke (T020) across all 5 routes: per route — 0 `<MissingComponent>`, 0 empty renderings, no full-document reload on nav hover, structural screenshot-diff vs the static equivalent (both themes), axe, motion-ON + client-nav. **Operator-manual split (per route):** visual-fidelity sign-off (the arbiter), the Pages-editor experience, nav "feel" (no flicker). BOTH automated + operator-manual required per route (prd-minimal smoke split model). Record each route's outcome in manifest `smoke_outcomes`.
- **Expected Output:** Automated smoke green for all 5 routes; manifest `smoke_outcomes` has one entry per route (automated + operator-manual); operator visual sign-off recorded per route.
- **Depends on:** T026

### T028 — Editing-safe verification (Pages editor / preview)

- **Title:** Verify every component renders safely in the Pages editor + preview surface
- **Description:** Exercise the editing surface (not just `localhost`): confirm every ported component resolves in the editing API component-map and renders under `draftMode()` + `getPreview`/`getDesignLibraryData` without crashing (ADR-0014). Verify empty/unpopulated fields while authoring render empty states (defensive optional-chaining), not thrown errors. Per `content-sdk-app-router-editing-safe-rendering` + `troubleshoot-editing`. A crash in the editor is Critical; a non-crashing render fault is Major (even when the standalone render is clean).
- **Expected Output:** Every component renders in the Pages editor + preview without crashing; empty-field authoring states render gracefully; editing/preview checks recorded (manual where the editor surface isn't automatable).
- **Depends on:** T026

### T029 — Full build + lint + tsc + axe + motion-ON/client-nav suite

- **Title:** Green the full quality suite across the whole app
- **Description:** `npm run build` + `npm run lint` + `npx tsc --noEmit` all green in `sites/aphelion/`. Run the full axe pass (AA contrast both themes, NFR-4) and the motion-ON + client-nav suite across all routes (NFR-2 hydration safety — framework `/test § 1d-ii.5b`). Confirm the ported `static/` theme + motion regression tests pass. Soft target NFR-1: Lighthouse ≥ 85 on Home in prod (verified at T031, noted here).
- **Expected Output:** build/lint/tsc green; axe clean both themes all routes; motion-ON + client-nav green all routes; ported regression tests green.
- **Depends on:** T027, T028

### T030 — Remove /api/layout-debug ONLY (keep /api/nav-children)

- **Title:** Remove the dev-only debug route before deploy; keep production nav infra
- **Description:** Delete `sites/aphelion/src/app/api/layout-debug/route.ts` (dev-only info-disclosure surface, FR-8/NFR-5). **Keep `sites/aphelion/src/app/api/nav-children/route.ts`** — it is production nav infrastructure (ADR-0011), NOT debug. Confirm no remaining code references the removed route. Re-run build/lint/tsc to confirm the removal is clean.
- **Expected Output:** `/api/layout-debug` removed; `/api/nav-children` intact; build/lint/tsc still green; no dangling references to the debug route.
- **Depends on:** T029

### T031 — Vercel env + deploy + prod-domain smoke

- **Title:** Deploy to Vercel with env set, then smoke the production domain
- **Description:** Set all env vars in the Vercel project (real Edge contextId + `NEXT_PUBLIC_*` + `NEXT_PUBLIC_DEFAULT_SITE_NAME=aphelion` + `SITE_COLLECTION_NAME=cosmos` + language `en`; `.env.local` never committed). Deploy. **Vercel project + domain provisioning is an operator prerequisite at `/ship`** (OQ-3). Run the final smoke on the prod domain: all 5 routes render live published content, 0 `<MissingComponent>`, nav works, both themes; confirm Lighthouse ≥ 85 on Home (NFR-1 soft target).
- **Expected Output:** Deployed Vercel app serving all 5 Aphelion routes from live Edge; prod-domain smoke green (all routes, both themes, nav, 0 `<MissingComponent>`); Lighthouse ≥ 85 on Home recorded; manifest `smoke_outcomes` prod entry = pass.
- **Depends on:** T030

## 4b. Important Test Cases (by epic / feature)

*Strengthened by QA (07). Each case is traceable to a § 10 test spec and a § 10a evidence-map row.*

- **E1 — Scaffold & foundation**
  - Scaffold produced a stock App-Router Content SDK app (proxy chain, catch-all, editing routes present) — structural, T002-1
  - SDK `.d.ts` shapes in `sites/aphelion/node_modules` match § 4c-6 citations — manual contract, T003-1..5 (BINDING PRE-PORT GATE)
  - Theme dark/light/system works on bare boot; no hydration warning in console — E2E/Playwright `e2e/theme-smoke.spec.ts`, T004-1..4; ported Vitest regression T004-5..6
  - `/api/layout-debug` returns real Home layout against the published tenant — E2E/smoke T006-2
  - `.env.local` is gitignored and never appears in git history — T002-2, T031-6

- **E2 — Home port (verify gate)**
  - 0 `<MissingComponent>` on Home; component-map resolves all 9 Home renderings — E2E/Playwright T020-1; generate-map T007-1..4
  - Each Home rendering shows expected live content; containers resolve folder-of-children; DestinationsGrid honors GridLimit=3 — E2E/Playwright T020-2, T012-1
  - **Marquee derives all Destination names in source order, no truncation** — RED-first unit test T018-R1..3 + GREEN T018-1..3; E2E T018-4
  - **GridLimit slice helper correct for both Home (limit=3) and /destinations (limit=0)** — RED-first unit test T012-R1..3 + GREEN T012-2..5
  - Nav: hover dropdown opens, flush (no gap), no full-document reload, ~150ms intent delay — E2E/Playwright T009-2..4, T020-3; operator nav-feel T027-7
  - **Motion-ON visibility: no reveal elements stuck at opacity:0 after full scroll, DEFAULT motion (the PRD-000 regression)** — E2E/Playwright `e2e/reveal-smoke.spec.ts` T020-6 (NOT forced `prefers-reduced-motion`)
  - **Client-nav: click each nav link (soft-nav), content visible after settle+scroll** — E2E/Playwright `e2e/client-nav-smoke.spec.ts` T020-7
  - Runtime contrast AA both themes (computed `getComputedStyle` values, not `toHaveClass`) — E2E `e2e/contrast-smoke.spec.ts` T020-5
  - Structural screenshot-diff vs static Home, both themes (operator is fidelity arbiter on text delta) — E2E/Playwright T020-8..9
  - axe clean both themes — E2E/axe T020-4

- **E3 — Inner routes**
  - All 4 inner routes render with 0 `<MissingComponent>`, 0 empty renderings — E2E/Playwright `e2e/inner-routes-smoke.spec.ts`, T026-1..5
  - DestinationsGrid on /destinations renders ALL destinations (GridLimit=0) — E2E T026-2
  - Reused components (NewsletterCTA, StatsBand, ValueProps, Testimonials) render identically across routes (no structural drift) — E2E screenshot-diff T026-6
  - **ContactDetails link-less item (ResponseTime) renders without crash; optional empty link renders nothing** — unit/Vitest T025-3..4 (defensive-read)
  - RichTextSection Body confirmed as `RichTextField` via probe; rendered as HTML not escaped entities — manual contract T023-3; E2E T023-2

- **E4 — Smoke & quality**
  - Per-route real-tenant smoke green (automated + operator-manual) for all 5 routes — E2E `e2e/per-route-smoke.spec.ts` T027-1; operator sign-off T027-6
  - Every component renders in Pages editor + preview without crashing — E2E `e2e/editing-safe.spec.ts` T028-2; operator walkthrough T028-7
  - **Empty-field authoring states: Image `{value:{}}` → nothing; Link `{value:{href:""}}` → nothing; zero-child container → empty section** — unit/Vitest T028-3..5
  - build/lint/tsc green; full axe + motion-ON + client-nav suite green — regression T029-1..8
  - **Forms are presentational-only (no outbound requests)** — E2E network-intercept T017-2, T024-2
  - **nav-children shaping helper correct (NavigationTitle override, NavigationFilter, hasChildren)** — RED-first unit T008-R1..3 + GREEN T008-1..4

- **E5 — Deploy**
  - `/api/layout-debug` removed (returns 404), `/api/nav-children` intact — E2E T030-1..2
  - No dangling references to the debug route in source — shell grep T030-3
  - Prod-domain smoke: all 5 routes live, 0 `<MissingComponent>`, both themes, nav works — E2E `e2e/prod-smoke.spec.ts` T031-1..4
  - Lighthouse ≥ 85 on Home in prod (soft target) — Lighthouse CLI T031-5
  - All 7 manifest `smoke_outcomes` entries cleared by operator — manual gate (§ 8 table)

## 4c. Implementation execution contract (for Developer 08)

### 4c-1. Non-negotiable technical boundaries

- **`architecture_budget: mindful`** — this is a port, not a build. Introduce NO new abstraction the static app did not already justify. The only new surfaces are the two route handlers (§ 4c-6) and the server/client component-map split. No state store, queue, or custom cache beyond Edge defaults.
- **The canonical `componentName` registry is THE binding contract (ADR-0010).** The 13 placeable renderings (§ 4c-5 table) bind across the operator's tenant, the head-app component-map, and the live `getPage` payload. Register every `componentName` **verbatim** (exact case) or it renders `<MissingComponent>` silently. Do not restate the component list ad hoc — the registry is the single source of truth.
- **Derive props from the LIVE `getPage` payload, NOT from the static app's prop names (ADR-0005 drift trap #1).** Probe `/api/layout-debug?site=aphelion&locale=en&path=<route>` per component; re-probe after wiring. The static names guided the content model; the live payload is the contract.
- **100% stock data layer — NO mock infrastructure.** The head app reaches Edge only via `client.getPage()` (and `getPreview`/`getDesignLibraryData` in editing). The tenant is real. No `if (mock)` branches, no fixtures, no data seam.
- **Helpers/types/queries/route-handlers/sub-components live OUTSIDE `src/components/<X>/`** (gen-map scanner trap, ADR-0013). Only Sitecore-registered `.tsx` (and `.<Variant>.tsx` siblings) live under `src/components/<X>/`. Theme/reveal/motion/nav-client + hooks → `src/ui/` or `src/lib/`; route handlers → `src/app/api/`.
- **Nav lazy-L2 is a Route Handler at `/api/nav-children`, NEVER a Server Action** (a Server Action auto-fires `router.refresh()` → flicker, ADR-0011). The same Route-Handler-not-Server-Action rule applies to any future client-triggered read.
- **Theme/fonts/reveal/motion port VERBATIM from `static/`** (ADR-0004) — `public/theme-init.js` (NOT a React inline raw-HTML script), `useSyncExternalStore` provider, RevealController, gooey perf guard, Clash Display self-host, Tailwind v4 `@theme` tokens (hex tokens used via `var(--token)` directly, never wrapped in `hsl()`).
- **Editing-safe rendering on EVERY component (ADR-0014):** stock `draftMode()` + `getPreview`/`getDesignLibraryData` from `searchParams` (no custom editing route); defensive optional-chain to the deepest leaf so empty/authoring fields render empty states, not crashes.
- **Forms are presentational-only (ADR-0006):** NewsletterCTA + ContactForm have full client UI/validation/states but NO network submit and NO backend.
- **Scaffold via the canonical CLI on the baseline copy (ADR-0009, rule 50-scaffold):** `create-content-sdk-app` (App Router), NOT `create-next-app`; never hand-write `package.json`/`next.config.*`; scaffold failure → HARD STOP.
- **`/api/nav-children` SURVIVES to production; `/api/layout-debug` is removed at ship (FR-8).** Only the debug route is deleted at T030.
- **Secrets:** Edge contextId → `.env.local` (gitignored, never committed/chat); `.env.example` documents var names only; no `.env` editing without explicit ask (rule 20-boundaries).
- **Home is a hard verify gate (ADR-0012):** inner routes (T022+) do NOT start until T021 passes (binary criteria + operator sign-off).

### 4c-2. ADR one-liners (full relevant set — no baseline.md exists yet for this product)

- **ADR-0002:** Tenant-coupled work was deferred to Act 3 (this PRD); Acts 1–2 (static app + spec) carried no Sitecore code — so PRD-001 is where the live-tenant integration happens.
- **ADR-0004:** Theme = FOUC preflight via `public/theme-init.js` + `useSyncExternalStore` provider + Tailwind v4 `@theme` tokens; dark/light/system; ports verbatim from PRD-000; hex tokens via `var(--token)` never `hsl()`. Playwright is the only gate that catches hydration regressions.
- **ADR-0005:** Content-model boundary — leaf components = flat datasource fields (Shape A); container/list components = folder-of-children (Shape B, Children resolver); nav excluded from the model. **Drift trap: derive props from the live payload, not static prop names.**
- **ADR-0006:** NewsletterCTA + ContactForm are presentational-only in v1 — full client UI/validation, no submit, no backend; copy/labels are Sitecore datasource fields.
- **ADR-0009:** Scaffold via baseline-copy (`SitecoreAI_Authoring`, token-replaced) + `create-content-sdk-app` (App Router), NOT `create-next-app`; `static/` stays as the visual oracle, head app at `sites/aphelion/`; scaffold failure → HARD STOP (rule 50).
- **ADR-0010:** One canonical `componentName` registry is the port contract; operator renderings + head-app component-map + live payload all bind to it; mismatch = silent `<MissingComponent>`; the Home gate checks every Home `componentName` resolves.
- **ADR-0011:** Navigation = component-level pattern — server-rendered L1 (root + first level + `hasChildren`) + lazy L2 per-hover via Route Handler `/api/nav-children` (NEVER a Server Action); flush dropdown, 150ms intent delay; the handler survives to production.
- **ADR-0012:** Home route is a hard verify-gate tranche — port + smoke Home FIRST against binary exit criteria + operator sign-off; the 4 inner routes begin only after Home passes.
- **ADR-0013:** Component-map server/client split keyed to the static `'use client'` boundary — Client map (4): Hero, PromoBand, NewsletterCTA, ContactForm; Server map (9): the rest; interactive child components (DestinationCard, ValueCard, ExperienceItem, Stat) get NO map entry — imported as Client children by their Server container.
- **ADR-0014:** Editing-safe rendering via stock App-Router `draftMode()` + `getPreview`/`getDesignLibraryData` (no custom editing route); every component defensive-optional-chains empty fields so it renders in Pages without crashing; an editor crash is Critical.

### 4c-3. Stack / tooling specifics

- **Scaffold:** baseline-copy from `C:/Projects/agentic/SitecoreAI_Authoring` + token-replace `<SITE_COLLECTION_NAME>`→`cosmos` / `<SITE_NAME>`→`aphelion`, then `npx --yes create-content-sdk-app@latest --yes --template nextjs --destination aphelion` (App Router) into `sites/aphelion/`. **NOT `create-next-app`** (that was PRD-000's static app). Never hand-write `package.json`/`next.config.*` — scaffold failure → HARD STOP (rule 50-scaffold).
- **Package manager:** `npm` (the scaffold pins it).
- **Framework:** Next.js App Router (scaffold-pinned version).
- **Head SDK:** `@sitecore-content-sdk/react` + `/nextjs` + `/content` (scaffold-pinned). Re-verify the field/getPage `.d.ts` shapes against `sites/aphelion/node_modules` at T003 (the §4c-6 citations are from an installed `playgrounds/training` copy and the scaffold may pin a different version).
- **Build:** `npm run build`. **Type check:** `npx tsc --noEmit`. **Lint:** `npm run lint`. All three green is the pre-completion gate.
- **Component-map generation:** `npm run sitecore-tools:generate-map` after every component is added (scans `src/components/` only).
- **Tests:** **Playwright** (smoke / structural screenshot-diff / axe / motion-ON + client-nav — the only gate for hydration + nav-flicker; vitest/build cannot catch these) + **Vitest** (port the existing `static/` theme + motion unit tests as regression). Dev-server offline note: `npm run dev` runs a `sitecore-tools:build` prelude that calls Edge — use `npx next dev` if offline.
- **`task_breakdown_style`:** left for QA to set — this is a live-Edge port (standard + smoke), not a pure unit-TDD build.

### 4c-4. UI implementation notes

- **No new UI variant — design is LOCKED (v5b "Flux").** The running static app at `static/` IS the visual + content oracle (there is no separate `pocs/` clickdummy folder this PRD).
- **Per-component visual oracle:** `static/src/components/<X>/index.tsx` (markup/CSS ported verbatim) — Hero, ValueProps(+ValueCard), DestinationsGrid(+DestinationCard), ExperienceShowcase(+ExperienceItem), StatsBand(+Stat), PromoBand, Testimonials(+TestimonialCard), NewsletterCTA, Marquee, PageHero, RichTextSection, ContactForm; ContactDetails is inline in `static/src/app/contact/page.tsx` (NET-NEW rendering). Chrome: `static/src/components/chrome/{SiteHeader,SiteFooter,MobileNav}`.
- **Theme tokens/fonts/motion (ported verbatim, ADR-0004):** Tailwind v4 `@theme` token block + `@custom-variant dark`; Clash Display self-hosted; gooey `#gooey` SVG filter perf guard; RevealController MutationObserver; `useCountUp`/`useMagnetic`/`useReveal`. Dark + light + system (mandatory). Hex tokens via `var(--token)` directly, never `hsl()`.
- **When the structural diff flags text, the OPERATOR is the fidelity arbiter** — the automated diff is text-tolerant (layout/structure). Content is seeded verbatim from `static/src/content/*` into the tenant, so the static app is BOTH visual and content oracle.

### 4c-5. File / module structure and naming conventions

- **Target app:** `products/head-application/aphelion/sites/aphelion/` (App Router head app). `static/` is frozen reference (never edited).
- **Components:** `src/components/<ComponentName>/<ComponentName>.tsx` — `<ComponentName>` matches the `componentName` registry key **exactly** (PascalCase). Only Sitecore-registered renderings (and `.<Variant>.tsx` siblings) live here.
- **Non-component infrastructure (gen-map trap):** theme/reveal/motion/primitives → `src/ui/*`; motion hooks/types/queries/nav-client-component + fetch hook → `src/lib/<feature>/*`. NEVER under `src/components/<X>/`.
- **Route handlers:** `src/app/api/nav-children/route.ts` (prod), `src/app/api/layout-debug/route.ts` (dev-only, removed at T030).
- **Component maps:** `.sitecore/component-map.ts` (Server — 9: PageHero, ValueProps, DestinationsGrid, ExperienceShowcase, StatsBand, Testimonials, RichTextSection, ContactDetails, Marquee) + `.sitecore/component-map.client.ts` (Client — 4: Hero, PromoBand, NewsletterCTA, ContactForm). Interactive child components (DestinationCard, ValueCard, ExperienceItem, Stat) get NO map entry. Verify with `npm run sitecore-tools:generate-map`.
- **FOUC preflight:** `public/theme-init.js` referenced from the root layout `<head>`.
- **The canonical 13-rendering registry (datasource pattern + map side):**

  | # | componentName | Map | Pattern | Datasource template |
  |---|---------------|-----|---------|---------------------|
  | 1 | `Hero` | Client | Leaf-flat (A) | `Hero` (6 flat meta fields) |
  | 2 | `PageHero` | Server | Leaf-flat (A) | `PageHero` |
  | 3 | `ValueProps` | Server | Children (B) | `ValuePropsFolder`→`ValueCard` |
  | 4 | `DestinationsGrid` | Server | Children (B) | `DestinationsGridFolder`→`DestinationCard`; `GridLimit` param |
  | 5 | `ExperienceShowcase` | Server | Children (B) | `ExperienceShowcaseFolder`→`ExperienceItem` |
  | 6 | `StatsBand` | Server | Children (B) | `StatsBandFolder`→`Stat`; count-up params |
  | 7 | `PromoBand` | Client | Leaf-flat (A) | `PromoBand` |
  | 8 | `Testimonials` | Server | Children (B) | `TestimonialsFolder`→`TestimonialCard` |
  | 9 | `NewsletterCTA` | Client | Leaf-flat (A) | `NewsletterCTA` |
  | 10 | `RichTextSection` | Server | Leaf-flat (A) | `RichTextSection` |
  | 11 | `ContactForm` | Client | Leaf-flat (A) | `ContactForm` |
  | 12 | `ContactDetails` | Server | Children (B) | `ContactDetailsFolder`→`ContactDetailItem` (NET-NEW) |
  | 13 | `Marquee` | Server | Derived (no datasource) | reads published `Destination` children, `Name` only, source order |

  Children resolver GUID (Shape B): `{2F5C334E-5615-423C-8281-9FC180191302}`.

### 4c-6. Integration and API contract notes

**Data layer — 100% stock `client.getPage()` (single `.layout` unwrap, NOT double `.data.data`).** Field/getPage shapes cited from the installed Content SDK; **re-verify at T003 against `sites/aphelion/node_modules`** (the scaffold may pin a different version — these citation paths are from `playgrounds/training/sites/training/node_modules`):

- `getPage(path, pageOptions, options?): Promise<Page | null>`
  `// shape: node_modules/@sitecore-content-sdk/nextjs/types/client/sitecore-nextjs-client.d.ts:35 → getPage`
- Editing: `getPreview(previewData): Promise<Page | null>` (line 48), `getDesignLibraryData(d): Promise<Page>` (line 42)
- `Page = { layout: LayoutServiceData; siteName?: string; locale: string; mode: PageMode }`
  `// shape: node_modules/@sitecore-content-sdk/content/types/client/sitecore-client.d.ts:63 → Page`
- `LayoutServiceData` `// shape: .../content/types/layout/models.d.ts:5`; `ComponentRendering<T>` (line 94); `Item` (line 131)
- **Unwrap:** layout is at `page.layout` (single access). Component fields reached via `page.layout.sitecore.route.placeholders[<name>][i].fields` — the stock catch-all performs that traversal; ported components receive resolved `fields` props. (The double `.data.data` unwrap is the *Marketplace* `xmc.*` GraphQL envelope — a DIFFERENT SDK; do NOT apply it here.)

**SDK field component shapes (request = the `field` prop; response = the field value):**

- `<Text field={fields.X} />` — `// shape: node_modules/@sitecore-content-sdk/react/types/components/Text.d.ts:8 → TextField { value?: string | number }`
- `<RichText field={fields.Body} />` — `// shape: .../react/types/components/RichText.d.ts:8 → RichTextField { value?: string }`
- `<Image field={fields.X} />` — `// shape: .../react/types/components/Image.d.ts:8,16 → ImageFieldValue { src?: string; [k]: unknown } ; ImageField { value?: ImageFieldValue }`
- `<Link field={fields.X} />` — `// shape: .../react/types/components/Link.d.ts:8,24 → LinkFieldValue { href?, text?, target?, title?, anchor?, querystring?, linktype? } ; LinkField { value: LinkFieldValue }`
- `Field<T>` generic — `// shape: .../@sitecore-content-sdk/content/types/layout/models.d.ts:115 → Field<T> { value: T } extends FieldMetadata`

**Defensive read (empty-state trap):** optional-chain to the deepest leaf — `fields?.HeroImage?.value?.src`, `fields?.PrimaryCta?.value?.href`. Empty datasource fields deliver present-but-empty (`{ value: {} }` / `{ value: "" }`), NOT `undefined`. Containers with zero children render an empty section, not a crash.

**Field-type mapping note:** Multi-Line Text fields (Lede, Body, Summary, Detail, Quote, Intro on non-RichText templates) deliver as `TextField` (`value: string`) → render with `<Text>`. Only `RichTextSection.Body` is a `RichTextField` → `<RichText>`. **Confirm the actual delivered shape per field via `/api/layout-debug` before wiring** — the live payload is the contract.

**Route Handler `/api/nav-children` (prod, ADR-0011):**
- `GET /api/nav-children?id=<itemId>&site=aphelion&locale=en` → `{ children: [{ id, title, url, hasChildren }] }` (L2 nodes; `NavigationTitle` override + `NavigationFilter` respected). Validate `id`/`site`/`locale`. Route Handler, NEVER a Server Action.

**Route Handler `/api/layout-debug` (dev-only, removed at T030):**
- `GET /api/layout-debug?site=aphelion&locale=en&path=/` → raw `getPage` layout JSON for the path.

**Marquee derivation (FR-5, OQ-B):** no datasource — at render read the published `Destination` children, take each `Name` in Sitecore source order, no truncation. **Probe the Home layout at T018 to determine whether the children are delivered inline in the Marquee placement payload or must be read from the published Destinations folder separately** — the live payload decides; do not guess.

### 4c-7. Parity / rebuild pointers

`analysis_mode: greenfield` for the manifest — but this PRD has **dual binding contracts** that function like parity pointers, so this is NOT a blank `N/A`:

- **Visual + content oracle = the static app (`products/head-application/aphelion/static/`).** Per-route structural screenshot-diff (text-tolerant) against the static equivalent is the fidelity gate; the **operator is the fidelity arbiter** when the diff flags text. Route→component mapping mirrors the static app: `static/src/app/page.tsx` (Home) → the 9 Home renderings; `static/src/app/{destinations,experiences,about,contact}/page.tsx` → the inner routes (see § 4c-5 registry + `sitecore-content-model.md` Step 9 for exact per-route placements).
- **Data contract = the live `getPage` payload** (probed per component via `/api/layout-debug`). Content was seeded into the tenant **verbatim** from `static/src/content/*.ts`, so the static app's content is the expected value for every field (the operator's runbook copied it). When the live payload field NAMES diverge from static prop names, the live payload wins (ADR-0005).
- **No asset bundle / content-dump** — content lives in the live tenant (operator-built, T000), not a serialized dump.

## 5. Dependencies

### Ordering constraints

- **T000 (operator tenant) gates everything** — no head-app code can boot or probe without the published tenant. It is the build-flow Phase 5.5 single operator stop gate.
- **T001 → T002 → {T003, T004, T005} → T006:** baseline before scaffold; scaffold before SDK-verify / theme-port / probe-route; all three before the boot gate.
- **T003 is a binding pre-port task** — no port task (T010+) starts until the SDK shapes are confirmed against the scaffold-pinned `node_modules`.
- **T007 (component-map plumbing) gates all port tasks** — every component registers into the maps it establishes.
- **T012 (DestinationsGrid) is the folder-of-children canary** — T013, T016 (and T025 later) reuse its confirmed resolver shape, so they depend on it.
- **T019 (Home assembly) depends on ALL 9 Home renderings + nav** (T009–T018).
- **T021 is the HARD VERIFY GATE** — every inner-route task (T022–T025) depends on it; nothing in T-inner starts until Home is green + operator-signed-off.
- **T026 depends on the 4 inner-only renderings** (T022–T025).
- **T-smoke (T027/T028) → T029 → T030 → T031:** smoke + editing-safe before the full quality suite; quality green before debug-route removal; removal before deploy.

### Execution order

```
T000 (operator prerequisite — gate before all code)
T001, T002, T003, T004, T005, T006,
T007, T008, T009,
T010, T011, T012, T013, T014, T015, T016, T017, T018,
T019, T020, T021 (HOME VERIFY GATE — hard stop),
T022, T023, T024, T025, T026,
T027, T028, T029,
T030, T031
```

### Parallel groups

```
Group 0 (operator prerequisite): T000

Group 1 (sequential — scaffold foundation): T001 → T002
Group 2 (parallel — depends on T002): T003, T004, T005
Group 3 (sequential gate — depends on T003+T004+T005): T006

Group 4 (parallel — depends on T006): T007, T008
Group 5 (sequential — depends on T008): T009

Group 6 (parallel — depends on T007, leaf + standalone-container ports):
  T010, T011, T012, T015, T017
Group 7 (parallel — depends on T012 canary): T013, T014, T016, T018

Group 8 (sequential — depends on T009 + Group 6 + Group 7): T019 → T020 → T021 (HARD GATE)

Group 9 (parallel — depends on T021): T022, T023, T024, T025
Group 10 (sequential — depends on Group 9): T026

Group 11 (parallel — depends on T026): T027, T028
Group 12 (sequential — depends on Group 11): T029 → T030 → T031
```

Note: parallelism within the port groups is OPTIONAL — the Team Lead MAY run them sequentially (T010→T018 in registry order) since each is a small, self-contained transform. The Home gate (T021) is a non-negotiable serialization point regardless.

## 6. Suggested Milestones

- **M1 — Boots on live Edge (T006).** Scaffold green, theme ported, `/api/layout-debug` returns real Home layout.
- **M2 — HOME GATE GREEN (T021).** All 9 Home renderings + nav ported, binary criteria + operator sign-off. The de-risk milestone — inner routes are now low-risk repetition.
- **M3 — All 5 routes rendering (T026).** Inner routes assembled, 0 `<MissingComponent>` everywhere.
- **M4 — Quality green (T029).** Per-route smoke + editing-safe + build/lint/tsc/axe/motion suite all green.
- **M5 — Shipped (T031).** Debug route removed, deployed to Vercel, prod-domain smoke green.

## 7. Risk Areas

- **Operator CMS build diverges from the canonical table** → `<MissingComponent>`/empty (High). Mitigated: ADR-0010 single registry; `/api/layout-debug` gate (T006); Home verify gate (T021) surfaces early. Divergence = a numbered `sitecore-content-model.md` punch-list item for the operator, NOT a head-app bug.
- **Port drift — props from static names, not live payload** (High). Mitigated: derive from `/api/layout-debug`; re-probe after wiring (port transform steps 2/3/6).
- **component-map `componentName` mismatch (case/typo)** (High). Mitigated: register verbatim from the § 4c-5 registry; `generate-map` check; Home smoke catches `<MissingComponent>`.
- **Wrong map side (server vs client) → hydration / RSC error** (Med). Mitigated: ADR-0013 rule keyed to static `'use client'`; the motion-ON + client-nav Playwright suite (T020) is the gate (vitest/build can't catch).
- **Folder-of-children resolver shape wrong** (Med). Mitigated: T012 (DestinationsGrid) is the Home canary; probe first, reuse the confirmed shape for T013/T016/T025.
- **Nav flicker / full-reload symptom** (Med). Mitigated: Route Handler not Server Action (ADR-0011); intent-delay; no-gap dropdown.
- **Editing/preview crash** (Med). Mitigated: ADR-0014 stock editing path + defensive optional-chaining on every component; T028 exercises the editor surface.
- **Marquee reads wrong children source** (Low). Mitigated: probe Home layout (OQ-B) at T018; Name field only, source order, no truncation.
- **SDK version drift (cited from playgrounds, not the head app's own node_modules)** (Low). Mitigated: T003 re-verifies the shapes against `sites/aphelion/node_modules` before any port.
- **Scaffold command fails (network/registry)** (Low). Mitigated: HARD STOP per rule 50 — never hand-write the shell.

## 8. What Needs To Be Tested (global testing runbook)

- **Unit tests (Vitest):** ported `static/` theme provider + motion-hook tests run as regression in `sites/aphelion/` (existence + pass). No new unit-heavy logic introduced by the port (it is a markup/field-component transform) — the binding gates are Playwright + smoke. **RED-first unit tests apply to three pure helpers** (see § 9 for the precise scope): Marquee name-derivation/source-order helper, GridLimit slice helper, and nav-children response-shaping helper. These are the only places where a RED-GREEN-REFACTOR loop is enforced before implementation.
- **UI / component tests (Playwright):** structural screenshot-diff per route vs the static equivalent (both themes); axe per route both themes; component-map resolves every `componentName` (0 `<MissingComponent>`). **Runtime contrast assertion (both themes):** for components using theme tokens (`bg-primary`, `text-primary-foreground`, etc.), tests assert *resolved* foreground/background contrast via `getComputedStyle(el).color` + `backgroundColor` — NOT merely `toHaveClass()`. The `hsl(var(--token))` trap (hex token value = broken color parse) is the failure mode; always assert computed values.
- **E2E / smoke (Playwright + manual split):** per-route real-tenant smoke — 0 `<MissingComponent>`, 0 empty renderings, no full-document reload on nav hover, **motion-ON + client-nav** (framework `/test § 1d-ii.5b`); operator-manual: visual-fidelity sign-off, Pages-editor experience, nav "feel". The **Home gate (T021)** is the first hard smoke stop; per-route smoke (T027) follows; prod-domain smoke (T031) is final. Motion-ON checks run in DEFAULT motion (never `prefers-reduced-motion: reduce` — that force-shows content and masks reveal bugs). Client-nav checks click real nav links (soft-nav), not only `page.goto()`. All Playwright runs use a **fresh build, not a reused dev server** (stale-port trap produces false greens).
- **Editing-safe (T028):** every component renders in the Pages editor + preview without crashing; empty-field authoring states graceful. Defensive-read checks: `Image {value:{}}`, `Link {value:{href:""}}`, zero-child containers — all render empty, none crash.
- **Regression:** full suite (build + lint + tsc + axe + motion-ON) green before release (T029).
- **Test commands:** `npm run build`, `npm run lint`, `npx tsc --noEmit`, `npm run sitecore-tools:generate-map`, the Playwright suite, Vitest (ported regression). Offline dev: `npx next dev`.
- **Smoke gates → manifest `smoke_outcomes`:** Initialize the following entries in `manifest.smoke_outcomes` (all `outcome: pending` until operator records them). The run status is `tested_pending_smoke` until ALL entries clear — real-tenant visual verification is not optional for this port:

  | Entry key | Category | Route / scope | Operator confirms |
  |-----------|----------|--------------|-------------------|
  | `smoke_home` | `live_walkthrough` | `/` (Home) | (a) 0 `<MissingComponent>`, (b) all 9 renderings show expected content, (c) nav works no-flicker, (d) editor/preview safe |
  | `smoke_destinations` | `live_walkthrough` | `/destinations` | Same (a–d); DestinationsGrid shows ALL destinations (GridLimit=0) |
  | `smoke_experiences` | `live_walkthrough` | `/experiences` | Same (a–d) |
  | `smoke_about` | `live_walkthrough` | `/about` | Same (a–d); RichTextSection body renders HTML correctly |
  | `smoke_contact` | `live_walkthrough` | `/contact` | Same (a–d); ContactDetails link-less item (ResponseTime) renders without crash |
  | `smoke_operator_visual_walk` | `operator_visual_walk` | All 5 routes | Motion ON (default); click each nav link (not just reload); both dark + light themes; no empty bands / stuck content / blank pages; nav feel no flicker |
  | `smoke_prod_domain` | `live_walkthrough` | Vercel prod domain | All 5 routes live, 0 `<MissingComponent>`, both themes, nav works, Lighthouse ≥ 85 on Home |

  All seven entries must have `outcome: passed` (with operator-recorded evidence) before the run transitions from `tested_pending_smoke` to `tested`. `/ship` with pending entries → `shipped_with_caveats`.

## 9. TDD and quality contract

**Model: `standard + smoke` (live-Edge port). `task_breakdown_style: standard`.**

This is a live-tenant integration port, not a pure unit-TDD build. The decision is deliberate:

- **No pure-TDD for component port tasks (T010–T018, T022–T025).** The binding contract for ported components is the live `getPage` payload — fixtures against a paraphrased shape are the failure mode that shipped QuickCopy v0.1 broken with 167 passing tests. The gates are (a) Playwright smoke against the real tenant, (b) structural screenshot-diff vs the `static/` oracle (both themes), and (c) editing-safe verification. Vitest cannot catch hydration errors, map-side mismatches, or RSC/client boundary failures — Playwright is the only instrument that can.

- **RED-first treatment enforced for three pure helpers.** These have no SDK dependency and are fully unit-testable in isolation. Failing test FIRST, implementation second:
  1. **Marquee name-derivation helper** — given a `ComponentRendering[]` of Destination children (probed from the live payload at T018), returns an array of Name strings in Sitecore source order, no truncation, no dedup. Test file: `sites/aphelion/src/lib/marquee/__tests__/derive-marquee-names.test.ts`. Fixture provenance: the live `/api/layout-debug` Home payload captured at T018 (record the shape in the test file as `// source: real-tenant capture, /api/layout-debug?site=aphelion&locale=en&path=/ — T018 probe`). Scenarios: (a) 6 children → 6 names in order; (b) zero children → empty array; (c) child with empty Name field → empty-string entry preserved (not dropped).
  2. **GridLimit slice helper** — given a list of children and a `GridLimit` param value (number or string), returns the sliced subarray. Test file: `sites/aphelion/src/lib/grid-limit/__tests__/apply-grid-limit.test.ts`. Fixture provenance: shape derived from `sites/aphelion/node_modules/@sitecore-content-sdk/react/types/components/` `.d.ts` (re-verified at T003) — `// source: sites/aphelion/node_modules/@sitecore-content-sdk/react/types/... (T003 re-verification)`. Scenarios: (a) limit=3, 6 items → 3 items; (b) limit=0 → all items (the /destinations semantics); (c) limit=undefined → all items (defensive); (d) limit > items.length → all items (no crash).
  3. **Nav-children response-shaping helper** — given a raw Content SDK route-tree node list, returns the `{ children: [{ id, title, url, hasChildren }] }` shape with `NavigationTitle` override applied and `NavigationFilter` respected. Test file: `sites/aphelion/src/lib/nav/__tests__/shape-nav-children.test.ts`. Fixture provenance: shape derived from the Content SDK `.d.ts` — `// source: sites/aphelion/node_modules/@sitecore-content-sdk/content/types/layout/models.d.ts — Item, ComponentRendering (T003 re-verification)`. Scenarios: (a) node with `NavigationTitle` override → override wins; (b) node with `NavigationFilter=false` → excluded; (c) `hasChildren` reflects real child count; (d) empty node list → `{ children: [] }`.

- **Ported `static/` unit tests run as regression.** The existing theme-provider and motion-hook tests from `static/src/` are ported verbatim into `sites/aphelion/src/` (same assertions, same coverage) as a regression suite. These are not new tests — they verify that the port did not break the theme/motion stack.

- **Playwright suite is the primary gate.** Every ported component, nav behavior, and editing-safe rendering is validated there. The suite is committed (not ad-hoc) and runs from a fresh build.

- **Motion-ON visibility gate (mandatory, per framework `/test § 1d-ii.5b`).** The PRD-000 regression: content was invisible because E2E ran with `prefers-reduced-motion: reduce`, which force-shows hidden-by-default reveal elements. This run: Playwright runs in DEFAULT motion. After load + full scroll, assert zero `[data-reveal]`-style elements stuck at computed `opacity:0`. This check is in the committed E2E spec at `sites/aphelion/e2e/reveal-smoke.spec.ts`.

- **Client-nav gate (mandatory, per framework `/test § 1d-ii.5b`).** Each nav link is clicked (soft-nav), not reached via `page.goto()`. After click + settle + scroll, assert route content is visible. This catches RSC/client boundary failures that `goto()` masks.

- **Fresh-build gate.** All Playwright smoke runs against `npm run build` output, not a reused dev server. The dev-server reuse / stale-port trap reports false greens. The spec's `webServer` config must NOT set `reuseExistingServer: true`.

- **Runtime contrast assertion.** For every component that applies theme tokens (`bg-primary`, `text-primary-foreground`, `border-destructive`, etc.), the Playwright spec asserts `getComputedStyle(el).color` + `backgroundColor` and verifies the contrast ratio meets AA (≥ 4.5:1 for text) in BOTH themes. `toHaveClass("bg-primary")` is rejected as the sole assertion — it passes even when the token resolves to the wrong value. Use `jest-axe` contrast rule OR a contrast-helper comparison against the resolved palette.

- **SDK fixture provenance rule (rule `40-sdk-contracts`).** The three pure helpers above each cite a `// source:` in their fixture. No fixture is paraphrased from the Lead Developer's task description or skill-catalog prose. All other tests operate against the live tenant (no fixture needed). There is no Marketplace-style mock layer — this is Content SDK; the field shapes are cited from the architecture's § 4.3 `.d.ts` paths.

- **Task_breakdown_style recommendation to Team Lead: set `task_breakdown_style: standard` in the run manifest.**

### RED-before-GREEN dependency rewiring (pure helpers only)

The three helper tasks (Marquee name-derivation, GridLimit slice, nav-children shaping) are logically embedded in T018, T012, and T008 respectively. The RED test for each helper must exist and fail BEFORE the helper implementation is written. In practice:
- T012 port cannot complete until `apply-grid-limit.test.ts` is RED, then GREEN.
- T008 route handler cannot complete until `shape-nav-children.test.ts` is RED, then GREEN.
- T018 port cannot complete until `derive-marquee-names.test.ts` is RED, then GREEN.

This is the only place TDD ordering is enforced. All other tasks follow the standard + smoke model.

## 10. Per-task test specifications

*QA model: standard + smoke. Pure-helper RED-first tasks are marked [RED-FIRST]. All Playwright specs committed to `sites/aphelion/e2e/`. All Vitest specs committed under `sites/aphelion/src/**/__tests__/`. Fresh build, motion ON, both themes for every smoke run.*

---

### T000 — Operator tenant prerequisite

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T000-1 | `/api/layout-debug?site=aphelion&locale=en&path=/` returns real layout JSON | `result.layout.sitecore.route` is populated; no 500 / `No sitecore context` error | E2E / manual | T006 boot gate — verified when T006 runs |
| T000-2 | Canonical componentName table all-green | Every rendering in § 4c-5 appears in the published `availableRenderings` for the aphelion site | Manual (operator) | T000 runbook completion check |

---

### T001 — Baseline copy + token replacement

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T001-1 | No token strings remain after replacement | `grep -rn "<SITE_NAME>\|<SITE_COLLECTION_NAME>" products/head-application/aphelion/` returns zero results | Regression / shell | Post-T001 verification |
| T001-2 | `static/` directory is untouched | `static/src/` files byte-for-byte identical to pre-T001 (git diff clean on `static/`) | Regression | Git status check |

---

### T002 — Scaffold

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T002-1 | Scaffold produced a stock App-Router Content SDK head app | `sites/aphelion/` contains: proxy chain, catch-all `[site]/[locale]/[[...path]]/page.tsx`, editing API routes, `.sitecore/component-map.ts`, `.sitecore/component-map.client.ts`, `sitecore-tools` scripts | Manual / structural | Post-scaffold directory check |
| T002-2 | `.env.local` is gitignored and never committed | `git ls-files sites/aphelion/.env.local` returns empty | Regression / git | Git check |
| T002-3 | `npm install` exits 0 | No peer-dep errors; `node_modules/@sitecore-content-sdk/react` present | Regression | `npm install` output |

---

### T003 — SDK shape re-verification [BINDING PRE-PORT GATE]

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T003-1 | `TextField` shape matches § 4c-6 citation | `sites/aphelion/node_modules/@sitecore-content-sdk/react/types/components/Text.d.ts` declares `interface TextField extends FieldMetadata { value?: string \| number }` | Manual / contract | T003 re-verification note in task completion record |
| T003-2 | `ImageField` shape matches § 4c-6 citation | `ImageField { value?: ImageFieldValue }` where `ImageFieldValue { src?: string }` | Manual / contract | Same |
| T003-3 | `LinkField` shape matches § 4c-6 citation | `LinkField { value: LinkFieldValue }` where `value.href?` present | Manual / contract | Same |
| T003-4 | `getPage` signature matches § 4c-6 citation | `getPage(path, pageOptions, options?): Promise<Page \| null>` | Manual / contract | Same |
| T003-5 | Any shape divergence triggers § 4c-6 update | If any shape differs, § 4c-6 is updated inline with the head-app's own `.d.ts` path before any port task begins | Manual | T003 completion note |

---

### T004 — Theme / fonts / reveal / motion port

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T004-1 | Dark theme applied on bare boot, no hydration warning | `document.documentElement.classList.contains('dark')` true when dark selected; no hydration warning in console | E2E / Playwright | `e2e/theme-smoke.spec.ts` |
| T004-2 | Light theme applied correctly | `classList.contains('dark')` false when light selected; computed background matches light palette | E2E / Playwright | Same |
| T004-3 | System theme follows `prefers-color-scheme` | Playwright `colorScheme: 'dark'` → dark applied; `colorScheme: 'light'` → light applied | E2E / Playwright | Same |
| T004-4 | No FOUC on page load | Screenshot taken immediately after navigation shows correct theme (not a flash of unstyled default) | E2E / Playwright | Same |
| T004-5 | Ported theme-provider Vitest regression suite passes | All tests from `static/src/ui/theme-provider.test.ts` (and siblings) pass in `sites/aphelion/` | Unit / Vitest | `src/ui/__tests__/theme-provider.test.ts` |
| T004-6 | Ported motion-hook Vitest regression suite passes | All tests from `static/src/lib/motion/*.test.ts` pass in `sites/aphelion/` | Unit / Vitest | `src/lib/motion/__tests__/*.test.ts` |
| T004-7 | `public/theme-init.js` is referenced in root layout as an external script, NOT as inline raw HTML | Root layout contains a `<script src="/theme-init.js">` reference (or equivalent next/script strategy), not an inline raw-HTML injection | Manual / structural | Code review at T004 completion |

---

### T005 — /api/layout-debug route

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T005-1 | `GET /api/layout-debug?site=aphelion&locale=en&path=/` returns real Home layout | Response has `result.layout.sitecore.route.placeholders` populated (not a 500 or empty) | E2E / manual | T006 gate |
| T005-2 | Non-home path returns that route's layout | `?path=/destinations` returns `/destinations` placeholders | E2E / manual | Developer manual check during T-home probing |
| T005-3 | Route is absent from the production build | After T030, `GET /api/layout-debug` returns 404 | Regression / E2E | `e2e/deploy-smoke.spec.ts` (T030/T031) |

---

### T006 — T-scaffold boot gate

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T006-1 | Dev server boots without errors | `npm run dev` exits cleanly (or `npx next dev`); no unhandled exception in server output | Manual / smoke | Boot check |
| T006-2 | `/api/layout-debug` returns real Home layout | Response `result.layout.sitecore.route` populated; root page shows `<MissingComponent>` placeholders (expected — no components yet), NOT a 500 | E2E / smoke | Manual probe check |
| T006-3 | A `No sitecore context` 500 is traced to T000 punch-list, not treated as a head-app bug | Finding surfaced to operator with the exact T000 runbook step number | Manual / gate | Operator escalation |

---

### T007 — Component-map plumbing

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T007-1 | `generate-map` runs clean with no infra pollution | `npm run sitecore-tools:generate-map` exits 0 and registers zero files from `src/ui/*` or `src/lib/*` | Regression | `npm run sitecore-tools:generate-map` output |
| T007-2 | Component-map files exist at canonical paths | `.sitecore/component-map.ts` and `.sitecore/component-map.client.ts` exist with the correct server/client structure | Structural | Directory check |
| T007-3 | Client map contains exactly the 4 client renderings | Hero, PromoBand, NewsletterCTA, ContactForm — and no others | Structural | Code review |
| T007-4 | Server map contains exactly the 9 server renderings | PageHero, ValueProps, DestinationsGrid, ExperienceShowcase, StatsBand, Testimonials, RichTextSection, ContactDetails, Marquee — and no others | Structural | Code review |

---

### T008 — /api/nav-children Route Handler [RED-FIRST for response-shaping helper]

**RED-FIRST helper:** `shape-nav-children.test.ts` must be RED before the helper is implemented. Fixture provenance: shapes derived from `sites/aphelion/node_modules/@sitecore-content-sdk/content/types/layout/models.d.ts` (re-verified at T003). Each fixture includes `// source: sites/aphelion/node_modules/@sitecore-content-sdk/content/types/layout/models.d.ts — T003 re-verification`.

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T008-R1 | [RED] Helper returns `{ children: [] }` for empty node list | Test written, failing (no implementation) | Unit / Vitest [RED] | `src/lib/nav/__tests__/shape-nav-children.test.ts` |
| T008-R2 | [RED] `NavigationTitle` override wins over default title | Test written, failing | Unit / Vitest [RED] | Same |
| T008-R3 | [RED] Node with `NavigationFilter=false` is excluded | Test written, failing | Unit / Vitest [RED] | Same |
| T008-1 | Helper: empty node list → `{ children: [] }` | GREEN after implementation | Unit / Vitest | Same |
| T008-2 | Helper: `NavigationTitle` override wins | GREEN | Unit / Vitest | Same |
| T008-3 | Helper: `NavigationFilter=false` excluded | GREEN | Unit / Vitest | Same |
| T008-4 | Helper: `hasChildren` reflects real child count | GREEN | Unit / Vitest | Same |
| T008-5 | `GET /api/nav-children?id=<id>&site=aphelion&locale=en` returns L2 children JSON | `{ children: [{ id, title, url, hasChildren }] }` for a published L1 node with children | E2E / Playwright | `e2e/nav-smoke.spec.ts` |
| T008-6 | Missing/invalid `id` param returns 400 | Response status 400 with descriptive error | E2E / Playwright | Same |
| T008-7 | Handler is a Route Handler, NOT a Server Action | `src/app/api/nav-children/route.ts` exists; no `"use server"` directive in that file | Structural | Code review |
| T008-8 | Handler survives to production (present after T030) | File still exists after the T030 cleanup; build still green | Regression | T030 verification |

---

### T009 — Component-level navigation

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T009-1 | L1 nav is server-rendered on first paint | Header L1 items visible in the server HTML (no JavaScript required to see them) | E2E / Playwright | `e2e/nav-smoke.spec.ts` |
| T009-2 | Hovering an L1 with children lazy-loads L2 dropdown | Dropdown appears after the ~150ms hover intent delay; `GET /api/nav-children` fired once (not on every mouse move) | E2E / Playwright | Same |
| T009-3 | Dropdown is flush with parent `<li>` — no gap at the top | No visible gap between L1 item bottom edge and dropdown top edge (screenshot check or computed margin assertion) | E2E / Playwright | Same |
| T009-4 | No full-document reload on nav hover | JS sentinel `window.__sentinelNavTest = true` set before hover; still `true` after hover; same `document` instance | E2E / Playwright | Same |
| T009-5 | Nav is keyboard-operable | Tab through L1 items; Enter/Space opens dropdown; Escape closes; visible focus ring at each step | E2E / axe | `e2e/nav-a11y.spec.ts` |
| T009-6 | Mobile nav renders and opens | At 375px viewport, hamburger visible; tap opens mobile nav drawer | E2E / Playwright | `e2e/nav-mobile.spec.ts` |
| T009-7 | Footer nav renders | Footer `<nav>` has links matching published L1 route set | E2E / Playwright | `e2e/nav-smoke.spec.ts` |

---

### T010 — Hero port (Client, leaf)

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T010-1 | Hero renders live content with 0 `<MissingComponent>` | No element matching `[data-component="MissingComponent"]` or text "Missing Component" on Home | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T010-2 | Hero fields populated from live payload | Eyebrow, Title, Lede, PrimaryCta text non-empty and match tenant content (probed at T010 via `/api/layout-debug`) | E2E / Playwright | Same |
| T010-3 | Hero `componentName` registered verbatim in client map | `component-map.client.ts` contains the string `"Hero"` (exact case); `generate-map` clean | Structural | Code review + generate-map |
| T010-4 | Gooey SVG filter and magnetic CTA behavior intact | `#gooey` SVG element present in DOM; CTA button has magnetic event listeners | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T010-5 | Empty HeroImage renders nothing, not a broken `<img>` | When `fields.HeroImage.value` is `{}`, no `<img src="">` in DOM | Unit / Vitest | `src/components/Hero/__tests__/Hero.test.tsx` |
| T010-6 | Runtime contrast AA both themes — Hero text on hero background | `getComputedStyle` on hero text element: foreground color vs background color contrast ratio ≥ 4.5:1 in both dark and light themes | E2E / Playwright | `e2e/contrast-smoke.spec.ts` |

---

### T011 — ValueProps + ValueCard port (Server container)

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T011-1 | ValueProps renders with 0 `<MissingComponent>` | No MissingComponent marker on Home | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T011-2 | Container heading fields non-empty | Heading, Eyebrow rendered from live tenant | E2E / Playwright | Same |
| T011-3 | ValueCard children rendered from folder-of-children resolver | At least 1 ValueCard child visible; Icon/CardTitle/Body non-empty per card | E2E / Playwright | Same |
| T011-4 | Zero children → empty section, not a crash | When container has no children, renders an empty `<section>` without error | Unit / Vitest | `src/components/ValueProps/__tests__/ValueProps.test.tsx` |
| T011-5 | ValueProps registered in server map | `component-map.ts` contains `"ValueProps"` | Structural | Code review |

---

### T012 — DestinationsGrid + DestinationCard port (Server container, GridLimit) [RED-FIRST for GridLimit helper]

**RED-FIRST helper:** `apply-grid-limit.test.ts` must be RED before the helper is implemented. Fixture provenance: shapes derived from `sites/aphelion/node_modules/@sitecore-content-sdk/react/types/` (re-verified at T003). Each fixture includes `// source: sites/aphelion/node_modules/@sitecore-content-sdk/react/types/... — T003 re-verification`.

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T012-R1 | [RED] limit=3, 6 items → 3 items returned | Test written, failing | Unit / Vitest [RED] | `src/lib/grid-limit/__tests__/apply-grid-limit.test.ts` |
| T012-R2 | [RED] limit=0 → all items returned (the /destinations semantics) | Test written, failing | Unit / Vitest [RED] | Same |
| T012-R3 | [RED] limit=undefined → all items, no crash | Test written, failing | Unit / Vitest [RED] | Same |
| T012-1 | GridLimit=3 on Home → exactly 3 DestinationCards | DestinationCard count = 3 on Home page | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T012-2 | Helper: limit=3, 6 items → 3 items | GREEN | Unit / Vitest | Same test file |
| T012-3 | Helper: limit=0 → all items | GREEN | Unit / Vitest | Same |
| T012-4 | Helper: limit=undefined → all items | GREEN | Unit / Vitest | Same |
| T012-5 | Helper: limit > items.length → all items, no crash | GREEN | Unit / Vitest | Same |
| T012-6 | DestinationCard fields from live payload (Name/Tagline/CardImage/CardLink) | Each rendered card shows non-empty Name and Tagline from the tenant | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T012-7 | `<img>` onError fallback renders without crash | When CardImage fails to load, card renders the fallback state, not an unhandled error | Unit / Vitest | `src/components/DestinationsGrid/__tests__/DestinationCard.test.tsx` |
| T012-8 | Resolver shape confirmed and documented for T013/T016/T025 | Folder-of-children shape noted in task completion record as the canary baseline | Manual | T012 completion note |
| T012-9 | DestinationsGrid registered in server map | `component-map.ts` contains `"DestinationsGrid"` | Structural | Code review |

---

### T013 — ExperienceShowcase + ExperienceItem port

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T013-1 | ExperienceShowcase renders with 0 `<MissingComponent>` on Home | No MissingComponent on Home | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T013-2 | ExperienceItem children rendered from folder-of-children | At least 1 ExperienceItem; ItemTitle/Summary non-empty | E2E / Playwright | Same |
| T013-3 | `<img>` onError fallback handled in ExperienceItem | Image error → fallback state, no crash | Unit / Vitest | `src/components/ExperienceShowcase/__tests__/ExperienceItem.test.tsx` |
| T013-4 | Registered in server map | `component-map.ts` contains `"ExperienceShowcase"` | Structural | Code review |

---

### T014 — StatsBand + Stat port (Server container, count-up params)

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T014-1 | StatsBand renders with 0 `<MissingComponent>` on Home | No MissingComponent on Home | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T014-2 | Stat children rendered with count-up animation active | At least 1 Stat child visible; `useCountUp` animates from 0 to the StatValue | E2E / Playwright | Same |
| T014-3 | Count-up suffix/prefix/decimals driven from rendering parameters | Stat display matches `CountUpSuffix`/`CountUpPrefix`/`CountUpDecimals` set on the rendering placement | E2E / manual | Operator confirms at T021 gate |
| T014-4 | Registered in server map | `component-map.ts` contains `"StatsBand"` | Structural | Code review |

---

### T015 — PromoBand port (Client, leaf)

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T015-1 | PromoBand renders with 0 `<MissingComponent>` on Home | No MissingComponent on Home | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T015-2 | CSS mesh backdrop present | `background` computed style on the PromoBand element contains a gradient or mesh pattern (not the plain page background) | E2E / Playwright | Same |
| T015-3 | Empty PromoImage renders nothing, not a broken `<img>` | When `fields.PromoImage.value` is `{}`, no `<img src="">` in DOM | Unit / Vitest | `src/components/PromoBand/__tests__/PromoBand.test.tsx` |
| T015-4 | Magnetic CTA intact | CTA element has magnetic event listeners (same check as T010-4) | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T015-5 | Registered in client map | `component-map.client.ts` contains `"PromoBand"` | Structural | Code review |

---

### T016 — Testimonials + TestimonialCard port (Server container)

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T016-1 | Testimonials renders with 0 `<MissingComponent>` on Home | No MissingComponent on Home | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T016-2 | TestimonialCard children rendered from folder-of-children | At least 1 TestimonialCard; Quote/Author non-empty | E2E / Playwright | Same |
| T016-3 | Optional Avatar renders nothing when empty (`{value:{}}`) | No broken `<img>` for cards without an avatar | Unit / Vitest | `src/components/Testimonials/__tests__/TestimonialCard.test.tsx` |
| T016-4 | Registered in server map | `component-map.ts` contains `"Testimonials"` | Structural | Code review |

---

### T017 — NewsletterCTA port (Client, leaf, presentational)

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T017-1 | NewsletterCTA renders with 0 `<MissingComponent>` on Home | No MissingComponent on Home | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T017-2 | Form is presentational-only — no network submit | Filling email and submitting triggers client-side state but sends no outbound fetch/POST (Playwright network intercept confirms) | E2E / Playwright | `e2e/form-presentational.spec.ts` |
| T017-3 | Client-side validation state works | Empty submit → error state shown; valid email → success state shown (all client-side) | E2E / Playwright | Same |
| T017-4 | Registered in client map | `component-map.client.ts` contains `"NewsletterCTA"` | Structural | Code review |

---

### T018 — Marquee port (Server, derived from Destinations) [RED-FIRST for name-derivation helper]

**RED-FIRST helper:** `derive-marquee-names.test.ts` must be RED before the helper is implemented. Fixture provenance: sourced from the live `/api/layout-debug` Home payload captured at T018. Fixture includes `// source: real-tenant capture, /api/layout-debug?site=aphelion&locale=en&path=/ — T018 probe`. This is a progressive capture per operator preference (not a blocked gate — capture and fix on divergence).

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T018-R1 | [RED] 6 destination children → 6 names in order | Test written, failing. Fixture shape sourced from T018 live probe | Unit / Vitest [RED] | `src/lib/marquee/__tests__/derive-marquee-names.test.ts` |
| T018-R2 | [RED] Zero children → empty array | Test written, failing | Unit / Vitest [RED] | Same |
| T018-R3 | [RED] Empty Name field → empty-string entry preserved, not dropped | Test written, failing | Unit / Vitest [RED] | Same |
| T018-1 | Helper: 6 destinations → 6 names, correct order | GREEN after implementation | Unit / Vitest | Same test file |
| T018-2 | Helper: zero children → empty array | GREEN | Unit / Vitest | Same |
| T018-3 | Helper: empty Name → empty string preserved | GREEN | Unit / Vitest | Same |
| T018-4 | Marquee renders all Destination names, no truncation | Marquee strip shows all published Destination names (count matches the tenant's published destination count); none truncated | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T018-5 | CSS infinite scroll animation active (DEFAULT motion) | `animation` computed style on the scroll strip is not `none` when `prefers-reduced-motion` is not forced | E2E / Playwright | Same |
| T018-6 | OQ-B resolved and documented | How Destinations children reach the Marquee placement (inline vs separate read) is recorded in the task completion note | Manual | T018 completion note |
| T018-7 | Registered in server map | `component-map.ts` contains `"Marquee"` | Structural | Code review |

---

### T019 — Home route assembly + editing-safe wiring

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T019-1 | Home route renders the full ordered rendering tree | All 9 renderings (Hero → Marquee → ValueProps → DestinationsGrid → ExperienceShowcase → StatsBand → PromoBand → Testimonials → NewsletterCTA) present in DOM in that order | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T019-2 | Stock catch-all page — not hand-written | `sites/aphelion/src/app/[site]/[locale]/[[...path]]/page.tsx` is the scaffold-generated file; no custom `getPage` calls added by hand | Structural | Code review |
| T019-3 | Editing-safe: route renders under `draftMode()` without throwing | Simulated editing-safe path (preview query params); page renders without thrown exception | E2E / Playwright | `e2e/editing-safe.spec.ts` |
| T019-4 | Component-map resolves all 9 Home componentNames | `generate-map` shows all 9 server + 4 client renderings registered; 0 `<MissingComponent>` on Home | Regression | `npm run sitecore-tools:generate-map` + Playwright |

---

### T020 — Home Playwright smoke + structural screenshot-diff

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T020-1 | 0 `<MissingComponent>` on Home | No `[data-component="MissingComponent"]` in DOM | E2E / Playwright | `e2e/home-smoke.spec.ts` |
| T020-2 | 0 empty renderings on Home | Every rendering has at least one non-empty field visible (text or image) | E2E / Playwright | Same |
| T020-3 | Nav hover dropdown opens, no full-document reload | Sentinel `window.__sentinelNavTest` survives hover; dropdown visible | E2E / Playwright | `e2e/nav-smoke.spec.ts` |
| T020-4 | axe clean on Home — both themes | No critical or serious axe violations on Home in dark theme AND light theme | E2E / axe | `e2e/home-a11y.spec.ts` |
| T020-5 | Runtime contrast AA — Home, both themes | For each component with theme tokens: `getComputedStyle` foreground + background contrast ≥ 4.5:1 in both themes | E2E / Playwright | `e2e/contrast-smoke.spec.ts` |
| T020-6 | **Motion-ON visibility** — no reveal elements stuck at opacity:0 after full scroll | After page load + full programmatic scroll: zero elements matching the reveal selector have computed `opacity === 0`. Run in DEFAULT motion (do NOT force `prefers-reduced-motion: reduce`). This is the PRD-000 regression gate. | E2E / Playwright | `e2e/reveal-smoke.spec.ts` |
| T020-7 | **Client-nav** — click each nav link, content visible | Playwright clicks Home → Destinations → Experiences → About → Contact via real nav links (soft-nav). After each: settle + scroll; assert content visible and no blank sections. | E2E / Playwright | `e2e/client-nav-smoke.spec.ts` |
| T020-8 | Structural screenshot-diff vs `static/` Home — light theme | Full-page screenshot diff against the `static/` Home reference capture; layout/structure pass (text-tolerant); operator is fidelity arbiter on any text delta | E2E / Playwright | `e2e/screenshot-diff.spec.ts` |
| T020-9 | Structural screenshot-diff vs `static/` Home — dark theme | Same as T020-8, dark theme | E2E / Playwright | Same |
| T020-10 | Playwright suite runs from fresh build | `playwright.config.ts` `webServer` does NOT set `reuseExistingServer: true`; suite invokes `npm run build` | Structural | `playwright.config.ts` review |

---

### T021 — HOME VERIFY GATE (binary exit criteria + operator sign-off)

This is not a test task — it is the hard gate. All 13 criteria must be checked before inner routes begin:

1. `[ ]` 0 `<MissingComponent>` on Home (automated — T020-1)
2. `[ ]` 0 empty renderings on Home (automated — T020-2)
3. `[ ]` Component-map resolves every Home `componentName` (generate-map + automated — T007-1..4, T020-1)
4. `[ ]` `npm run build` green (automated)
5. `[ ]` `npm run lint` green (automated)
6. `[ ]` `npx tsc --noEmit` green (automated)
7. `[ ]` Nav functional: hover dropdown opens, no full-document reload (automated — T020-3)
8. `[ ]` axe clean, both themes (automated — T020-4)
9. `[ ]` Runtime contrast AA, both themes (automated — T020-5)
10. `[ ]` Motion-ON: no reveal elements stuck at opacity:0 after full scroll, DEFAULT motion (automated — T020-6)
11. `[ ]` Client-nav: click each nav link, content visible after settle+scroll (automated — T020-7)
12. `[ ]` Structural screenshot-diff vs `static/` Home passes, both themes (automated — T020-8/9)
13. `[ ]` Operator visual sign-off on Home fidelity (manual — operator records in `smoke_outcomes.smoke_home`)

A single failing item blocks inner routes. No exceptions.

---

### T022 — PageHero port (Server, leaf)

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T022-1 | PageHero renders with 0 `<MissingComponent>` on at least one inner route | No MissingComponent on /destinations (first inner route) | E2E / Playwright | `e2e/inner-routes-smoke.spec.ts` |
| T022-2 | Optional HeroImage handles empty value — no broken `<img>` | When HeroImage value is `{}`, no `<img src="">` rendered | Unit / Vitest | `src/components/PageHero/__tests__/PageHero.test.tsx` |
| T022-3 | Registered in server map | `component-map.ts` contains `"PageHero"` | Structural | Code review |

---

### T023 — RichTextSection port (Server, leaf)

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T023-1 | RichTextSection renders with 0 `<MissingComponent>` on /about | No MissingComponent | E2E / Playwright | `e2e/inner-routes-smoke.spec.ts` |
| T023-2 | Body renders as interpreted HTML (not escaped markup) | Body content displays as rendered HTML, not as a string of escaped entities | E2E / Playwright | Same |
| T023-3 | Body field confirmed as `RichTextField` via `/api/layout-debug` | Probe documents the actual delivered field type before wiring; recorded in T023 completion note | Manual / contract | T023 completion note |
| T023-4 | Registered in server map | `component-map.ts` contains `"RichTextSection"` | Structural | Code review |

---

### T024 — ContactForm port (Client, leaf, presentational)

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T024-1 | ContactForm renders with 0 `<MissingComponent>` on /contact | No MissingComponent | E2E / Playwright | `e2e/inner-routes-smoke.spec.ts` |
| T024-2 | Form is presentational-only — no network submit | No outbound fetch/POST on form submit (Playwright network intercept confirms) | E2E / Playwright | `e2e/form-presentational.spec.ts` |
| T024-3 | Client-side validation states work | Name/Email/Message validation fires client-side on empty submit | E2E / Playwright | Same |
| T024-4 | All copy fields rendered from tenant | FormHeading, Intro, label fields non-empty and match tenant content | E2E / Playwright | `e2e/inner-routes-smoke.spec.ts` |
| T024-5 | Registered in client map | `component-map.client.ts` contains `"ContactForm"` | Structural | Code review |

---

### T025 — ContactDetails + ContactDetailItem port (Server container, NET-NEW)

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T025-1 | ContactDetails renders with 0 `<MissingComponent>` on /contact | No MissingComponent | E2E / Playwright | `e2e/inner-routes-smoke.spec.ts` |
| T025-2 | ContactDetailItem children rendered from folder-of-children | At least 1 item visible; DetailLabel/DetailValue non-empty | E2E / Playwright | Same |
| T025-3 | Link-less item (ResponseTime) renders without crash | ResponseTime ContactDetailItem (no DetailLink) renders without thrown error | Unit / Vitest | `src/components/ContactDetails/__tests__/ContactDetailItem.test.tsx` |
| T025-4 | Optional DetailLink with empty href renders nothing | No `<a href="">` in DOM for link-less items | Unit / Vitest | Same |
| T025-5 | Registered in server map | `component-map.ts` contains `"ContactDetails"` | Structural | Code review |

---

### T026 — Inner route assembly

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T026-1 | /destinations renders 0 `<MissingComponent>` and 0 empty renderings | All renderings visible with content | E2E / Playwright | `e2e/inner-routes-smoke.spec.ts` |
| T026-2 | /destinations DestinationsGrid shows ALL destinations (GridLimit=0) | DestinationCard count matches total published destinations (not capped at 3) | E2E / Playwright | Same |
| T026-3 | /experiences renders 0 `<MissingComponent>` | Same | E2E / Playwright | Same |
| T026-4 | /about renders 0 `<MissingComponent>`; RichText body visible | RichTextSection shows About story paragraphs | E2E / Playwright | Same |
| T026-5 | /contact renders 0 `<MissingComponent>` | ContactForm + ContactDetails both visible | E2E / Playwright | Same |
| T026-6 | Reused components render identically across routes | Screenshot-diff between Home instance and inner-route instance of each reused component (NewsletterCTA, StatsBand, ValueProps, Testimonials) shows no structural drift | E2E / Playwright | `e2e/screenshot-diff.spec.ts` |

---

### T027 — Per-route real-tenant smoke + screenshot-diff

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T027-1 | Per-route automated: 0 `<MissingComponent>`, 0 empty renderings (all 5 routes) | Pass for /, /destinations, /experiences, /about, /contact | E2E / Playwright | `e2e/per-route-smoke.spec.ts` |
| T027-2 | Per-route structural screenshot-diff vs `static/` oracle — both themes (all 5 routes) | Layout/structure pass for all routes; any text delta escalated to operator | E2E / Playwright | `e2e/screenshot-diff.spec.ts` |
| T027-3 | axe clean on all inner routes — both themes | No critical/serious violations on /destinations, /experiences, /about, /contact in dark and light | E2E / axe | `e2e/per-route-a11y.spec.ts` |
| T027-4 | Runtime contrast AA — all inner routes, both themes | `getComputedStyle` contrast ≥ 4.5:1 for themed components on each inner route, both themes | E2E / Playwright | `e2e/contrast-smoke.spec.ts` |
| T027-5 | Nav no full-document reload on any route | Sentinel check on each inner route | E2E / Playwright | `e2e/nav-smoke.spec.ts` |
| T027-6 | Operator manual: visual-fidelity sign-off per route | Operator reviews each route and records approval in `smoke_outcomes` | Manual | Operator gate |
| T027-7 | Operator manual: nav feel (no flicker, L2 loads smoothly) | Operator confirms nav feel on real hardware | Manual | Operator gate |

---

### T028 — Editing-safe verification

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T028-1 | Every component resolves in the editing API component-map | No `<MissingComponent>` in Pages editor for any registered rendering | Manual / editing | Pages editor walkthrough |
| T028-2 | Every component renders under `draftMode()` without throwing | Playwright simulates the editing-safe path (preview query params); each route renders without thrown exception | E2E / Playwright | `e2e/editing-safe.spec.ts` |
| T028-3 | Empty Image field `{value:{}}` → renders empty, no crash | No `<img src="">`, no thrown exception | Unit / Vitest | Per-component `__tests__/*.test.tsx` (T010-5, T015-3, T022-2, T016-3) |
| T028-4 | Empty Link field `{value:{href:""}}` → renders empty, no crash | No `<a href="">`, no thrown exception | Unit / Vitest | Per-component `__tests__/*.test.tsx` (T025-4, T012-7, others with optional links) |
| T028-5 | Zero-child container → empty section, no crash | Containers (ValueProps, DestinationsGrid, ExperienceShowcase, StatsBand, Testimonials, ContactDetails) render an empty section when child array is empty | Unit / Vitest | Per-component `__tests__/*.test.tsx` (T011-4, T012-R3 downstream, T013-3, T016-3, T025) |
| T028-6 | An editor crash is treated as Critical (severity rule) | Any crash found at T028 blocks T029 — no exceptions | QA rule | N/A |
| T028-7 | Operator confirms Pages editor walkthrough | Operator records result in manifest `smoke_outcomes` | Manual | Operator gate |

---

### T029 — Full build + lint + tsc + axe + motion-ON/client-nav suite

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T029-1 | `npm run build` green | Exit 0; no type errors; no missing-module errors | Regression | Build output |
| T029-2 | `npm run lint` green | Exit 0; 0 ESLint errors | Regression | Lint output |
| T029-3 | `npx tsc --noEmit` green | Exit 0; 0 TypeScript errors | Regression | tsc output |
| T029-4 | Full axe pass — all routes, both themes | 0 critical/serious violations across all 5 routes × 2 themes | E2E / axe | `e2e/per-route-a11y.spec.ts` |
| T029-5 | Motion-ON reveal suite — all routes | After load + full scroll on each route: 0 elements with reveal selector at computed opacity:0 (DEFAULT motion) | E2E / Playwright | `e2e/reveal-smoke.spec.ts` |
| T029-6 | Client-nav suite — all routes | Click-nav from Home through all routes; content visible on each after settle+scroll | E2E / Playwright | `e2e/client-nav-smoke.spec.ts` |
| T029-7 | Ported Vitest regression suite — theme + motion | All ported `static/` unit tests green in `sites/aphelion/` | Unit / Vitest | `src/ui/__tests__/`, `src/lib/motion/__tests__/` |
| T029-8 | All three RED-first helper suites GREEN | `derive-marquee-names.test.ts`, `apply-grid-limit.test.ts`, `shape-nav-children.test.ts` all green | Unit / Vitest | `src/lib/*/___tests___/*.test.ts` |

---

### T030 — Remove /api/layout-debug

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T030-1 | `/api/layout-debug` returns 404 after removal | `GET /api/layout-debug` → 404 (file deleted, no route match) | Regression / E2E | `e2e/deploy-smoke.spec.ts` |
| T030-2 | `/api/nav-children` still returns correct L2 children | Same response as T008-5 | Regression / E2E | `e2e/nav-smoke.spec.ts` |
| T030-3 | No dangling references to the removed route | `grep -rn "layout-debug" sites/aphelion/src/` returns zero results | Regression / shell | Post-removal grep |
| T030-4 | `npm run build` still green after removal | Exit 0; no import errors | Regression | Build output |

---

### T031 — Vercel deploy + prod-domain smoke

| # | Scenario | Expected outcome | Test type | Location |
|---|----------|-----------------|-----------|----------|
| T031-1 | All 5 prod-domain routes return 200 | `GET https://<prod-domain>/<route>` → 200 for /, /destinations, /experiences, /about, /contact | E2E / Playwright | `e2e/prod-smoke.spec.ts` (against prod URL) |
| T031-2 | 0 `<MissingComponent>` on prod domain, all routes | Same check as per-route smoke, against the prod URL | E2E / Playwright | Same |
| T031-3 | Both themes work on prod domain | Theme toggle applies dark/light correctly on the real deployment | E2E / Playwright | Same |
| T031-4 | Nav works on prod domain | Hover dropdown, no full reload | E2E / Playwright | Same |
| T031-5 | Lighthouse ≥ 85 on Home (soft target) | Lighthouse performance score on prod Home ≥ 85 | Performance | Lighthouse CLI |
| T031-6 | `.env.local` was never committed | `git log --all -- sites/aphelion/.env.local` returns empty | Security / regression | Git history check |
| T031-7 | Manifest `smoke_outcomes.smoke_prod_domain` = passed | Operator records the prod smoke outcome | Manual | Operator gate |

## 10a. Requirement-to-test evidence map

*One row per User Story AC + the Home-gate binary criteria + per-route smoke + editing-safe + deploy. Status: covered (automated), manual-only (operator gate), or not-applicable.*

| Requirement / AC | Task ID(s) | Test type | Test location / command | Coverage status |
|------------------|------------|-----------|-------------------------|-----------------|
| **US-1 AC1** — Scaffold boots; `/api/layout-debug` returns real layout | T002, T005, T006 | E2E / smoke | `e2e/` boot gate + T006 manual probe | covered |
| **US-1 AC2** — Home renders with 0 `<MissingComponent>`, 0 empty renderings | T019, T020, T021 | E2E / Playwright | `e2e/home-smoke.spec.ts` — T020-1, T020-2 | covered |
| **US-1 AC3** — No mock/data-seam code | T003, T004, T006 | Structural / code review | Code review at each task; no `if (mock)` branches in `src/` | covered |
| **US-2 AC1** — Each component uses SDK field components with `.d.ts`-cited types | T003, T010–T018, T022–T025 | Structural / contract | T003 re-verification note; per-component code review | covered |
| **US-2 AC2** — Props derived from live `getPage` payload (probed, not from static names) | T010–T018, T022–T025 | Manual / contract | `/api/layout-debug` probe documented per component at each port task | manual-only (per-task probing) |
| **US-2 AC3** — `componentName` matches verbatim; containers resolve folder-of-children; helpers outside `src/components/<X>/` | T007–T018, T022–T025 | Structural + E2E | `generate-map` clean; `e2e/home-smoke.spec.ts` 0 MissingComponent checks | covered |
| **US-3 AC1** — Screenshot-diff per route vs static app, both themes | T020, T027 | E2E / Playwright | `e2e/screenshot-diff.spec.ts` — T020-8, T020-9, T027-2 | covered |
| **US-3 AC2** — Theme, reveal, gooey, fonts behave as in PRD-000 | T004, T020 | Unit + E2E | `e2e/theme-smoke.spec.ts` (T004-1..4); `e2e/reveal-smoke.spec.ts` (T020-6); ported Vitest regression (T004-5, T004-6) | covered |
| **US-4 AC1** — L1 server-rendered; L2 lazy-loads per hover; flush dropdown; no flicker; no reload; 150ms intent | T008, T009, T020, T027 | E2E / Playwright | `e2e/nav-smoke.spec.ts` — T009-1..4, T020-3; operator manual T027-7 | covered + manual |
| **US-5 AC1** — Components render under `draftMode()` + `getPreview`; editor/preview checks pass | T019, T028 | E2E + manual | `e2e/editing-safe.spec.ts` (T028-2); Pages editor walkthrough (T028-1, T028-7) | covered + manual |
| **US-6 AC1** — Build/lint/tsc green; deployed; per-route smoke green, Home first; prod smoke green | T021, T027, T029, T031 | Regression + E2E + manual | Build commands; `e2e/per-route-smoke.spec.ts`; `e2e/prod-smoke.spec.ts`; operator gates T021/T027/T031 | covered + manual |
| **Home gate #1** — 0 `<MissingComponent>` on Home | T020 | E2E | `e2e/home-smoke.spec.ts` T020-1 | covered |
| **Home gate #2** — 0 empty renderings on Home | T020 | E2E | `e2e/home-smoke.spec.ts` T020-2 | covered |
| **Home gate #3** — Component-map resolves every Home `componentName` | T007, T020 | Structural + E2E | `generate-map`; T020-1 | covered |
| **Home gate #4** — `npm run build` green | T021 | Regression | `npm run build` | covered |
| **Home gate #5** — `npm run lint` green | T021 | Regression | `npm run lint` | covered |
| **Home gate #6** — `npx tsc --noEmit` green | T021 | Regression | `npx tsc --noEmit` | covered |
| **Home gate #7** — Nav functional: hover dropdown, no full reload | T020 | E2E | `e2e/nav-smoke.spec.ts` T020-3 | covered |
| **Home gate #8** — axe clean, both themes | T020 | E2E / axe | `e2e/home-a11y.spec.ts` T020-4 | covered |
| **Home gate #9** — Runtime contrast AA, both themes | T020 | E2E | `e2e/contrast-smoke.spec.ts` T020-5 | covered |
| **Home gate #10** — Motion-ON: no reveal elements stuck at opacity:0, DEFAULT motion | T020 | E2E | `e2e/reveal-smoke.spec.ts` T020-6 | covered |
| **Home gate #11** — Client-nav: click nav links, content visible | T020 | E2E | `e2e/client-nav-smoke.spec.ts` T020-7 | covered |
| **Home gate #12** — Structural screenshot-diff vs static Home, both themes | T020 | E2E | `e2e/screenshot-diff.spec.ts` T020-8/9 | covered |
| **Home gate #13** — Operator visual sign-off | T021 | Manual | Operator records in `smoke_outcomes.smoke_home` | manual-only |
| **Per-route smoke (all 5 routes)** — 0 `<MissingComponent>`, 0 empty, nav no-reload, axe, contrast, motion-ON, client-nav, screenshot-diff | T027, T029 | E2E + manual | `e2e/per-route-smoke.spec.ts`; `e2e/screenshot-diff.spec.ts`; operator per-route sign-off T027-6 | covered + manual |
| **Editing-safe (all components)** — renders under draftMode without crash; empty-field authoring states graceful | T028 | E2E + unit + manual | `e2e/editing-safe.spec.ts`; per-component `__tests__/*.test.tsx`; T028-7 operator walkthrough | covered + manual |
| **Debug route removed at ship** — `/api/layout-debug` returns 404 in production | T030 | E2E | `e2e/deploy-smoke.spec.ts` T030-1 | covered |
| **Nav handler survives to production** — `/api/nav-children` intact after T030 | T030 | E2E | `e2e/nav-smoke.spec.ts` T030-2 | covered |
| **Deploy: prod-domain smoke green** | T031 | E2E + manual | `e2e/prod-smoke.spec.ts`; operator T031-7 | covered + manual |
| **NFR-1 Lighthouse ≥ 85 on Home (soft)** | T031 | Performance | Lighthouse CLI on prod Home | covered (soft — not a hard gate) |
| **NFR-2 Hydration safety** — no browser globals in render/SSR-init | T004, T020, T029 | E2E | `e2e/theme-smoke.spec.ts`; `e2e/reveal-smoke.spec.ts`; `e2e/client-nav-smoke.spec.ts` | covered |
| **NFR-4 Accessibility AA** — axe clean, keyboard-operable nav | T009, T020, T027, T029 | E2E / axe | `e2e/home-a11y.spec.ts`; `e2e/per-route-a11y.spec.ts`; `e2e/nav-a11y.spec.ts`; contrast checks | covered |
| **Smoke outcomes: all 7 manifest entries cleared** | T021, T027, T028, T031 | Manual | Operator records in `smoke_outcomes` (7 entries per § 8) | manual-only (gate) |

## Handoff Metadata
- Canonical run manifest: `project-planning/workflow/run-20260611T085021Z.json`
- Source PRD: `project-planning/PRD/prd-001.md`
- Source architecture: `project-planning/architecture/architecture-20260611T085021Z.md` (full track — binding blueprint; no baseline.md yet)
- Recommended next command: `/task-breakdown` QA enrichment (QA Specialist 07 fills § 9, § 10, § 10a; decides `task_breakdown_style`), then `/implement`
- Recommended next input file: `project-planning/plans/qa-report.md` (if produced)
