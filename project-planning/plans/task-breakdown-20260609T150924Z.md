# Development Execution Plan

---
document_type: task_breakdown
artifact_name: task-breakdown-20260609T150924Z.md
generated_at: 2026-06-10T00:00:00Z
run_manifest: project-planning/workflow/run-20260609T150924Z.json
source_inputs:
  - project-planning/PRD/prd-000.md
  - project-planning/PRD/prd-minimal-000.md (Developer 08 orientation only; Lead Developer 06 used full PRD)
  - project-planning/architecture/architecture-20260609T150924Z.md
  - project-planning/ADR/ (adr-0002..adr-0008)
  - project-planning/ui-design/ui-design-20260609T150924Z-v5b.md (+ POC pocs/poc-v5b-prd000/)
consumed_by:
  - QA Specialist (07) enriches this file; Developer Code Monkey (08) implements from this file + prd-minimal only
next_input:
  - project-planning/plans/qa-report.md (optional)
---

<!-- platform_target: content-sdk. task_breakdown_style: tdd (QA enriched 2026-06-10). PRD-000 = Acts 1–2 ONLY: standalone plain-React static app + derived content-model spec. Act 3 (head-app scaffold/port/deploy) is PRD-001 — NOT planned here. No baseline.md exists (8 ADRs; promotion deferred). -->

## 0. Quick orientation (absorbed from former implementation-runbook)

*Populated by Lead Developer (06). The Developer (08) starts from this section + the canonical inputs below WITHOUT reading the architecture, full PRD, or ADR files.*

### Implementation target directory

- **Target:** `products/head-application/aphelion/static/` — a **standalone `create-next-app`** project (its own `package.json`, App Router, TypeScript, Tailwind v4). This is **not** under `site/`; it is the Act-1 reference deliverable per ADR-0003/0007. Record any deviation with reason.
- **Container convention:** the static app is self-contained; all source lives under `static/src/` and `static/public/`. The derived spec (T-spec) is written one level up at `products/head-application/aphelion/project-planning/sitecore-content-model.md`.
- **Hard invariant:** **ZERO `@sitecore-content-sdk/*` (or any `@sitecore-*`) dependency** anywhere in `static/`. This is CI-assertable (T034) and is the defining constraint of the whole PRD.

### Canonical inputs (Developer 08 normal flow loads ONLY these)

- **`prd-minimal-000.md`** — primary scope/orientation.
- **This task breakdown** — execution contract (§ 4c, tasks, tests, order).
- **Winning POC clickdummy:** `pocs/poc-v5b-prd000/` (`index.html` + `styles.css` + `theme.js`) — **THE visual source of truth.** The Developer MUST open these files and build from the clickdummy markup/CSS, not from prose. When prose and POC diverge, the POC wins for look-and-feel. **The POC is Home-only** — inner routes are fleshed from the same components + tokens.
- **No `baseline.md`** exists yet — use § 4c-2 ADR one-liners for inherited constitution.

**NOT loaded** in Developer normal flow: full PRD, architecture file, raw ADR files, UI variant spec.

### Planned delivery order

```
T-foundation (scaffold + theme + chrome; THE uncertainty — test theme/hydration EARLY)
  T001  T002  T003  T004  T005  T006a[RED]  T006b[GREEN]  T007  T008  T009  T010  T011  T012  T013(GATE)

T-home (Home route + all home-band components) — IMPLEMENTED 2026-06-10
  T014✓ T015✓ T016✓ T017✓ T018✓ T019✓ T020✓ T021✓ T022✓ T023a[RED]✓ T023b[GREEN]✓ T024✓ T025✓

T-inner (Destinations, Experiences, About, Contact routes + remaining components) — IMPLEMENTED 2026-06-10
  T026✓ T027✓ T028a[RED]✓ T028b[GREEN]✓ T029✓ T030✓ T031✓ T032✓

T-fidelity (screenshot-diff gate + a11y/contrast + component/theme tests + zero-SDK assertion)
  T033  T034  T035  T036  T037  T038(GATE)

T-spec (derive sitecore-content-model.md mechanically from props)
  T039  T040
```

### Completion criteria

- **Pre-completion validation gate** (per `06-implement.md` § 9): `npm run lint`, `next build` (NOT export), `npx tsc --noEmit` all green; git-status clean or untracked files dispositioned.
- **Ship gates (PRD §12 — ALL must pass):** build + lint + tsc green · Vitest component/theme suite passes · Playwright screenshot-diff fidelity gate passes (structural parity + ≤~5% per-route pixel delta, both themes, 390 + 1440, all 5 routes) · a11y/contrast AA both themes · `sitecore-content-model.md` complete.
- **Non-gate:** NFR-1 Lighthouse (soft target).
- **No real-tenant smoke** (no tenant exists in PRD-000 — that is PRD-001). Fidelity is the gate here.
- **§ 9 TDD contract green** (when QA flips `task_breakdown_style: tdd`): every RED test for in-scope tasks has a passing GREEN; theme + presentational-form logic are the prime TDD candidates.

## 1. Implementation Overview

PRD-000 delivers **two design-time artifacts, no runtime backend**:

1. **The static app** (`static/`) — a standalone Next.js App Router site (TS + Tailwind v4, zero Sitecore deps) realizing the v5b "Flux" clickdummy across **5 routes** (Home, Destinations, Experiences, About, Contact). Content is hard-coded plain props in `src/content/*`. Reference deliverable; not deployed (ADR-0003).
2. **`sitecore-content-model.md`** — a spec mechanically derived from the component prop boundaries (ADR-0005); the operator's Act-2 CMS runbook.

The single through-line is **prop-boundary-as-content-model**: every component is shaped so the future Act-3 port (PRD-001) is a mechanical field-component swap. That portability constraint — not any runtime concern — drives the directory layout (`src/components` vs `src/ui`), the flat-prop rule, and the verbatim-portable theme stack.

**Build approach (per always-tranche + test-tranche-first preference):** T-foundation carries the project's single highest risk — **theme hydration / FOUC**. A Playwright hydration + console-error check (T012) is wired and **must pass (T013 GATE)** before any content band is built. This buys clarity on the uncertain bit before committing build effort.

## 2. Epics

| Epic | ID range | Description |
|------|----------|-------------|
| **E1 — Foundation (T-foundation)** | T001–T013 | Scaffold static app, port theme stack (tokens, preflight, provider, toggle), build chrome (header/nav/footer/mobile-nav), motion-utility hooks, root layout. **Theme-hydration test gate.** |
| **E2 — Home (T-home)** | T014–T025 | Home route + every home-band component (Hero, marquee, ValueProps, DestinationsGrid, ExperienceShowcase, StatsBand, PromoBand, Testimonials, NewsletterCTA). |
| **E3 — Inner routes (T-inner)** | T026–T032 | PageHero, RichTextSection, ContactForm + the 4 inner routes that compose existing components. |
| **E4 — Fidelity & quality (T-fidelity)** | T033–T038 | Playwright screenshot-diff gate (all routes × themes × viewports), zero-SDK import assertion, a11y/contrast AA, Vitest component/theme suite. **Fidelity gate.** |
| **E5 — Content-model spec (T-spec)** | T039–T040 | Mechanically derive `sitecore-content-model.md` from props (leaf→flat datasource, container→folder-of-children, nav excluded). |

## 3. Feature Breakdown

- **Theme stack (E1):** ports verbatim from `pocs/poc-v5b-prd000/theme.js` + `styles.css` into React: `public/theme-init.js` preflight, `src/ui/theme-provider.tsx` (`useSyncExternalStore`), `src/ui/theme-toggle.tsx` (mounted-flag), Tailwind v4 `@theme` tokens in `globals.css`.
- **Chrome (E1):** `SiteHeader` (brand + desktop nav + ThemeToggle + menu button), `MobileNav` drawer (focus-trap + Esc), `SiteFooter`. Nav tree is a static const in `src/content/navigation.ts`, **excluded from content-model derivation** (ADR-0005 rule 3). Nav links point to real routes (`/destinations`, etc.), NOT the POC's `#anchors`.
- **Motion utilities (E1):** `useReveal` (IntersectionObserver scroll reveal), `useCountUp` (easeOutCubic, scroll-triggered), `useMagnetic` (pointer-fine + reduced-motion gated). All in `src/lib/motion/` — browser globals ONLY inside `useEffect`.
- **Leaf components (E2/E3):** `Hero`, `ValueCard`, `DestinationCard`, `ExperienceItem`, `Stat`, `PromoBand`, `TestimonialCard`, `NewsletterCTA`, `RichTextSection`, `PageHero`, `ContactForm` — one flat `Props` object each (ADR-0005 rule 1).
- **Container/list components (E2):** `ValueProps`, `DestinationsGrid`, `ExperienceShowcase`, `StatsBand`, `Testimonials` — accept `array-of-child + own scalar(s)` (ADR-0005 rule 2 / folder-of-children).
- **Routes (E2/E3):** 5 App-Router pages, each a thin server component importing from `src/content/<route>.ts`.

## 4. Task Breakdown

---

### E1 — Foundation (T-foundation)

---

**Task ID:** T001
**Title:** Scaffold the static app with `create-next-app`
**Description:** From `products/head-application/aphelion/`, run the canonical scaffold **literally** per rule `50-scaffold`: `npx create-next-app@latest static --ts --app --tailwind --eslint --src-dir --import-alias "@/*"` (accept Tailwind v4 / App Router / `src/` dir; **not** `create-content-sdk-app`). Do NOT hand-write `package.json` or `next.config.*` — pinned versions come from the scaffold. If the scaffold command fails, HARD STOP and report (rule 50). After scaffold, confirm `next.config.*` has **no** `output: 'export'` (ADR-0003/0007 — standard `next build`).
**Expected Output:** `static/` project boots via `npm run dev`; `npm run lint`, `next build`, `npx tsc --noEmit` green on the bare scaffold; `output: 'export'` absent.
**Depends on:** none

**Task ID:** T002
**Title:** Install Vitest + Playwright + RTL test stack
**Description:** Add dev-deps for the two-layer test stack (ADR-0008): `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` for unit; `@playwright/test` for E2E. Add `vitest.config.ts` (jsdom env, RTL setup file), `playwright.config.ts` (projects/viewports stubbed — wired fully at T033), and `package.json` scripts: `test` (vitest run), `test:watch`, `test:e2e` (playwright). Do NOT pin versions by hand beyond what the install resolves.
**Expected Output:** `npm run test` runs (0 tests pass), `npx playwright test` runs (0 tests), configs committed.
**Depends on:** T001

**Task ID:** T003
**Title:** Port Tailwind v4 `@theme` tokens + base CSS into `globals.css`
**Description:** Port the full token system from `pocs/poc-v5b-prd000/styles.css` into `src/app/globals.css` using Tailwind v4 `@import "tailwindcss"; @theme { ... }` + `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))`. Carry BOTH theme blocks (dark `:root[data-theme='dark']` + light `:root[data-theme='light']`), the type scale, reset, `.kinetic` gradient headline (with `@supports not` solid-`--fg` fallback), `.flux-field`/`.blob`/`.mesh`/`.stars`, the full `@media (prefers-reduced-motion: reduce)` freeze block, and all component classes used by the POC. **Tokens are hex literals consumed via `var(--token)` directly — NEVER `hsl(var(--token))`** (ADR-0004; `hsl_var_token_broken_with_hex_values`). Alpha via `color-mix(in oklch, ...)` / SVG `stopOpacity`, exactly as the POC does.
**Expected Output:** `globals.css` carries every token + class from the POC; `next build` green; visual smoke (manual) shows tokens resolving in both `data-theme` states.
**Depends on:** T001

**Task ID:** T004
**Title:** Self-host display font (Clash Display) + wire Outfit
**Description:** Per OQ-1 (winning = Flux): self-host **Clash Display** from Fontshare into `src/app/fonts/` (or `public/fonts/`) and expose it as `--font-display`; wire **Outfit** (Google or self-host) as `--font-sans`. Match the POC fallback chain `'Clash Display','Fraunces','Outfit',system-ui` for display and `'Outfit',system-ui,...` for sans. If self-hosting Clash Display is blocked, fall back to **Outfit-as-display** (the POC's shipped fallback) and note it. Do not introduce layout shift from font load (NFR-1 / theme-init ordering).
**Expected Output:** Both font families load; display headings render in Clash Display (or documented Outfit fallback); no FOUT-driven CLS regression in the fidelity capture.
**Depends on:** T003

**Task ID:** T005
**Title:** Theme preflight `public/theme-init.js` (FOUC-safe, real file)
**Description:** Port the `initThemeEarly` IIFE from `pocs/poc-v5b-prd000/theme.js` into `static/public/theme-init.js` as a **real served file**. It reads `localStorage('aphelion-theme')` → resolves `light|dark|system` against `matchMedia('(prefers-color-scheme: dark)')` → sets `data-theme` + `data-theme-choice` on `<html>` before paint. Reference it from the root layout `<head>` as `<script src="/theme-init.js"></script>` (parser-blocking, no `async`/`defer`). **Do NOT** inline the preflight via React's raw-HTML script prop — security tooling blocks that form (ADR-0004 / architecture §8); the `<script src>` form gives identical parser-blocking behaviour. Add `{/* eslint-disable-next-line @next/next/no-sync-scripts */}` on the tag.
**Expected Output:** `public/theme-init.js` exists; root layout references it via `<script src>`; hard reload sets the theme class before first paint (verified in T012).
**Depends on:** T001

**Task ID:** T006a
**Title:** [RED] Write failing Vitest tests for `ThemeProvider` / `useTheme` store behaviour
**Description:** **(TDD — RED phase.)** Before any implementation of `ThemeProvider`, write the failing unit test file at `static/src/ui/__tests__/theme-provider.test.ts` (Vitest + jsdom). Tests must be RED (compile + run but fail with "module not found" or assertion failures) until T006b implements the store. Cover TC-04 through TC-08: (a) `system` resolves to `dark` when `matchMedia` returns `matches: true`; (b) `system` resolves to `light` when `matches: false`; (c) `setChoice('dark')` writes `data-theme="dark"` on `documentElement` and `localStorage`; (d) click-cycle order is `light → dark → system → light`; (e) `storage` event triggers re-sync; (f) `matchMedia change` while on `system` re-applies theme without persisting. Mock `localStorage` and `matchMedia` at the jsdom level — do NOT import `ThemeProvider` until T006b creates it.
**Expected Output:** Test file exists; `npm run test` reports failures for all theme-store cases (expected RED — module missing). This is the TDD RED checkpoint.
**Depends on:** T002

**Task ID:** T006b
**Title:** [GREEN] `ThemeProvider` via `useSyncExternalStore`
**Description:** **(TDD — GREEN phase. Depends on RED tests from T006a.)** Create `src/ui/theme-provider.tsx` (client component) implementing the 3-state theme store with `useSyncExternalStore` (server snapshot = `'system'`) — NOT setState-in-effect (ADR-0004; Next16/React19 react-hooks plugin ERRORS on setState-in-effect for client-only state). Subscribe to `storage` events + `matchMedia` system-change. Expose `{ choice, setChoice, resolved }` via context. On `setChoice`, write `data-theme` + `data-theme-choice` on `<html>` and persist to `localStorage('aphelion-theme')` (cycle order `light → dark → system`, matching the POC). **All browser-global reads (`localStorage`, `matchMedia`) live inside the store subscribe/getSnapshot, never in render** (NFR-2). Lives in `src/ui/` (NOT `src/components/`) per ADR-0007. Implementation is complete when T006a tests go GREEN.
**Expected Output:** `ThemeProvider` exports a provider + `useTheme()` hook; all T006a tests GREEN; switching choice updates `<html data-theme>` and persists; no hydration warning (verified T012).
**Depends on:** T003, T005, T006a

**Task ID:** T007
**Title:** `ThemeToggle` (mounted-flag, 3-state)
**Description:** Create `src/ui/theme-toggle.tsx` (client). Consumes `useTheme()`; renders the POC toggle markup (`[data-theme-icon]` glyph + `[data-theme-text]` label, `aria-label="Theme: <Label>. Activate to change."`). Glyphs/labels per POC: `light:☀ Light · dark:☾ Dark · system:◑ System`. Click cycles choice. Use the **mounted-flag** pattern so the label/glyph render a stable placeholder on the server and the real choice only after mount (avoids SSR/CSR text mismatch). Toggle visibility MAY be gated by `NEXT_PUBLIC_SHOW_THEME_TOGGLE` (per dark-mode policy) but defaults visible. Lives in `src/ui/`.
**Expected Output:** Toggle cycles light→dark→system, glyph/label update, no hydration warning, keyboard-operable with visible focus ring. T006a cycle-order test (TC-06) covers the cycle contract.
**Depends on:** T006b

**Task ID:** T008
**Title:** UI primitives in `src/ui/` (Container, Section, Button)
**Description:** Create small presentational primitives in `src/ui/` (NOT `src/components/`, ADR-0007): `Container` (`.wrap` max-width + gutter), `Section`/`Band` (`.band`/`.band.atmos` padding + optional `.mesh`), `Button` (`.btn` + `.btn-primary`/`.btn-ghost`, supporting the magnetic `--mx/--my` transform vars and `disabled`). These are styling conveniences, not Sitecore renderings — keeping them in `src/ui/` prevents the future generate-map scanner from registering them.
**Expected Output:** Primitives render with POC classes; reused by chrome + components downstream.
**Depends on:** T003

**Task ID:** T009
**Title:** Motion utility hooks in `src/lib/motion/`
**Description:** Create three hooks in `src/lib/motion/` (NOT `src/components/`): `useReveal` (IntersectionObserver adds `.in`; reduced-motion or no-IO → immediately reveal), `useCountUp(target, {decimals, suffix, prefix})` (scroll-triggered easeOutCubic over ~1400ms; reduced-motion jumps to final), `useMagnetic(strength)` (pointer-fine + reduced-motion gated; sets `--mx/--my` on pointermove, resets on leave). **Every browser-global (`IntersectionObserver`, `matchMedia`, `window`) access is inside `useEffect`** — never in render/init (NFR-2; `hydration_mismatch_pattern` memory). Mirror the exact behaviors in `pocs/poc-v5b-prd000/theme.js` (reveal/count-up/magnetic sections).
**Expected Output:** Hooks exported; each respects `prefers-reduced-motion`; unit-testable reduced-motion branch returns final state synchronously.
**Depends on:** T001

**Task ID:** T010
**Title:** `SiteHeader` + desktop nav + brand mark
**Description:** Create `src/components/chrome/SiteHeader/` (sticky, blur, `.brand` with spinning conic-gradient `.mark`, `.nav-desktop` links, `.header-actions` with `ThemeToggle` + menu button). Nav links come from `src/content/navigation.ts` and point to **real routes** (`/destinations`, `/experiences`, `/about`, `/contact`) — NOT the POC's `#anchors`. Use Next `<Link>`. The header is chrome and intentionally lives under `src/components/chrome/` (a folder explicitly noted as nav-exception, ADR-0005 rule 3 — not a content-model rendering).
**Expected Output:** Header renders with brand mark, desktop nav, theme toggle, menu button; nav uses `<Link>` to real routes; matches POC `§ header`.
**Depends on:** T007, T008

**Task ID:** T011
**Title:** `MobileNav` drawer (focus-trap + Esc + scrim)
**Description:** Create `src/components/chrome/MobileNav/` porting the POC drawer: `.nav-scrim` + `.mobile-nav` slide-in (`min(82vw,340px)`), `[data-menu-open]`/`[data-menu-close]` wiring, focus-trap on Tab, `Esc` closes, focus returns to trigger, link-click closes (ADR/UI a11y matrix). Open/close state is React state; all DOM/keyboard wiring in `useEffect`. Links use `<Link>` to real routes. Show below `720px` per POC responsive rules.
**Expected Output:** Drawer opens/closes via menu button, scrim, Esc, link-click; focus trapped + returned; `aria-hidden`/`aria-expanded` toggle correctly; matches POC `§ mobile-nav`.
**Depends on:** T008, T010

**Task ID:** T012
**Title:** Root layout + Playwright theme/hydration probe (TEST-TRANCHE-FIRST)
**Description:** Build `src/app/layout.tsx`: `<html suppressHydrationWarning>` (on `<html>` only — masks the preflight-set attribute, NOT child mismatches), `<head>` `<script src="/theme-init.js">`, `<body>` wrapping `<ThemeProvider>` → `SiteHeader` / `{children}` / `SiteFooter` (footer stub OK until T024; minimal `<main id="main">`). Then wire a **focused Playwright probe** (`tests/e2e/theme.spec.ts`): for `/` in light AND dark + a system-pref toggle, assert (a) zero hydration-mismatch console warnings, (b) zero console errors, (c) `data-theme` correctly set before first paint (no FOUC flash — check computed `background` immediately after `goto`), (d) toggle cycles + persists across reload. This is the **uncertain-item test tranche run FIRST** (PRD §12 / tranche preference) to de-risk theme hydration before content build.
**Expected Output:** `theme.spec.ts` exists and runs; surfaces any hydration/FOUC issue early. (Gate is T013.)
**Depends on:** T006, T007, T010, T009

**Task ID:** T013
**Title:** **GATE — theme/hydration probe green**
**Description:** Run T012's probe and the bare component/theme unit tests. **Hard gate:** zero hydration-mismatch warnings, zero console errors, no FOUC, toggle persists — in both themes. If RED, fix the theme stack (T005–T007) before ANY content-band work begins. This gate exists because vitest+build structurally cannot catch hydration/FOUC (ADR-0008; PRD risk #1).
**Expected Output:** T012 probe + theme unit tests pass; foundation is proven hydration-safe; content tranche unblocked.
**Depends on:** T012

---

### E2 — Home (T-home)

---

**Task ID:** T014
**Title:** Content modules + `src/content/navigation.ts`
**Description:** Create `src/content/` with: `navigation.ts` (header + footer nav trees — static, the documented content-model exception), and `home.ts` carrying the hard-coded plain-prop objects for every Home band (hero, valueProps, destinations[6], experiences[3], stats[4], promo, testimonials[3], newsletter). Use the verbatim POC copy + the Unsplash image URLs from the UI spec §7 (`https://images.unsplash.com/<id>?w=<n>&q=80&auto=format&fit=crop`). Each object's shape IS the future datasource — keep it flat per ADR-0005. Content is textually adjacent to its future content-model entry (the T-spec derivation reads this).
**Expected Output:** `src/content/navigation.ts` + `src/content/home.ts` typed and exported; image URLs match UI spec §7; copy matches POC.
**Depends on:** T001

**Task ID:** T015
**Title:** `Hero` leaf component (gooey blobs + morphing art frame + magnetic CTAs)
**Description:** Create `src/components/Hero/`. Flat props: `{ eyebrow: string; title: string; titleAccent: string; lede: string; primaryCta: {label;href}; secondaryCta?: {label;href}; image: {src;alt}; meta: {value;label}[] }`. Render: `.flux-field` 4-blob field behind copy (the inline `#gooey` SVG filter must be present once in the layout — see note), `.stars` SVG, `.hero-grid` 2-col (copy + `.hero-art` morphing-frame `<img>` with `.art-mesh` fallback + `data-fallback onerror`), `.kinetic` accent span on the title, magnetic CTAs via `useMagnetic`. **The inline gooey SVG filter (`<filter id="gooey">`)** must be injected once (root layout `<body>` top, mirroring POC) so `.flux-field { filter:url(#gooey) }` resolves. Image `onerror` reveals the mesh (port from POC).
**Expected Output:** Hero matches POC `§ hero` at 1440 + 390; blobs drift, frame morphs, CTAs magnetic (pointer-fine), all freeze under reduced-motion; image fallback works.
**Depends on:** T008, T009, T014

**Task ID:** T016
**Title:** `Marquee` (infinite destination names, pause-on-hover)
**Description:** Create `src/components/Marquee/`. Props: `{ items: string[] }`. Render the POC `.marquee` (masked edges, `.marquee-track` duplicated set for seamless loop, `✦` separators, `animation-play-state:paused` on hover). `aria-hidden` (decorative duplicate text). Frozen under reduced-motion (CSS already handles via global freeze).
**Expected Output:** Marquee scrolls infinitely, pauses on hover, `aria-hidden`, matches POC `§ marquee`.
**Depends on:** T008, T014

**Task ID:** T017
**Title:** `ValueCard` (leaf) + `ValueProps` (container, flowborder)
**Description:** `src/components/ValueCard/` — flat props `{ icon: string; title: string; body: string }`, render `.card.flowborder` (animated gradient edge on hover/focus) + `.glyph` + magnetic (`data-magnetic`). `src/components/ValueProps/` — container props `{ heading: string; eyebrow?: string; items: ValueCardProps[] }` (ADR-0005 rule 2: array → folder-of-children; `heading`/`eyebrow` → folder scalars). Renders `.section-head` + `.grid.grid-3` of `ValueCard`. Reveal-on-scroll with staggered `data-delay`.
**Expected Output:** ValueProps band matches POC `§ valueprops`; flowborder animates on hover; cards reveal staggered; reduced-motion freezes.
**Depends on:** T008, T009, T014

**Task ID:** T018
**Title:** `DestinationCard` (leaf) + `DestinationsGrid` (container)
**Description:** `src/components/DestinationCard/` — flat props `{ name; tagline; image:{src;alt}; distance; detail; link:{label;href} }`, render `.card.dest-card` (`.dest-media` with `.sky` mesh fallback + `mix-blend` `<img>` + `data-fallback`, `.dest-body` with `.dest-row` name+tag, body copy, `.dest-link` arrow). `src/components/DestinationsGrid/` — container props `{ heading; eyebrow?; intro?; items: DestinationCardProps[] }`. Renders `.section-head` + `.grid.grid-3`. Supports a `limit?` prop so Home shows a preview (per architecture Home composition) and `/destinations` shows full set — derive via prop, not a separate component.
**Expected Output:** Grid matches POC `§ destinations`; hover image-zoom; image→mesh fallback; reveal staggered; reduced-motion freezes.
**Depends on:** T008, T009, T014

**Task ID:** T019
**Title:** `ExperienceItem` (leaf) + `ExperienceShowcase` (container, alternating)
**Description:** `src/components/ExperienceItem/` — flat props `{ title; summary; image:{src;alt}; duration; cta:{label;href} }`, render `.exp-item` 2-col (`.exp-media` render image + `.exp-copy` with `.dur`, title, summary, `.dest-link`). `src/components/ExperienceShowcase/` — container props `{ heading; items: ExperienceItemProps[] }`. Alternating layout via `:nth-child(even)` order swap (POC CSS). Reveal-on-scroll.
**Expected Output:** Showcase matches POC `§ experiences`; alternating 2-col on desktop, stacked on mobile; image fallback; reduced-motion freezes.
**Depends on:** T008, T009, T014

**Task ID:** T020
**Title:** `Stat` (leaf) + `StatsBand` (container, scroll count-up)
**Description:** `src/components/Stat/` — flat props `{ value: string; label: string }` plus count-up metadata (`countTo: number; decimals?: number; suffix?: string; prefix?: string`) — the displayed value animates from 0 to `countTo` via `useCountUp`. `src/components/StatsBand/` — container props `{ heading?: string; items: StatProps[] }`, render `.stats-band.atmos` + `.stats-grid` (4-up desktop, 2-up mobile). Count-up scroll-triggered; reduced-motion jumps to final. `.kinetic` on the numeral.
**Expected Output:** StatsBand matches POC `§ stats`; numbers count up on scroll into view; reduced-motion shows final immediately; 4→2 reflow.
**Depends on:** T008, T009, T014

**Task ID:** T021
**Title:** `PromoBand` (leaf)
**Description:** `src/components/PromoBand/` — flat props `{ eyebrow; heading; body; cta:{label;href}; image?:{src;alt} }` (image optional; POC promo uses CSS `.art-mesh` only). Render `.promo` rounded panel with `.art-mesh` backdrop, `.promo-inner` copy + `.kinetic` accent + magnetic CTA. Reveal-on-scroll.
**Expected Output:** Promo band matches POC `§ promo`; magnetic CTA; reveal; reduced-motion freezes.
**Depends on:** T008, T009, T014

**Task ID:** T022
**Title:** `TestimonialCard` (leaf) + `Testimonials` (container)
**Description:** `src/components/TestimonialCard/` — flat props `{ quote; author; role; avatar?:{src;alt} }`, render `.card.quote-card` (blockquote display type, `.quote-author` with conic-gradient `.quote-avatar` + name/role). `src/components/Testimonials/` ("Mission Log") — container props `{ heading; items: TestimonialCardProps[] }`, render `.section-head` + `.grid.grid-3`. Reveal staggered.
**Expected Output:** Testimonials match POC `§ testimonials`; reveal staggered; reduced-motion freezes.
**Depends on:** T008, T009, T014

**Task ID:** T023a
**Title:** [RED] Write failing Vitest tests for `NewsletterCTA` validation logic
**Description:** **(TDD — RED phase.)** Before implementing `NewsletterCTA`, write the failing unit test file at `static/src/components/NewsletterCTA/__tests__/NewsletterCTA.test.tsx` (Vitest + RTL). Tests must be RED until T023b implements the component. Cover TC-24 through TC-28: (a) empty submit → `aria-invalid="true"` + "Email is required." text + input has focus; (b) invalid email string → `aria-invalid="true"` + "Enter a valid email address."; (c) valid email submit → form is hidden (or removed), `.nl-success` element is visible + focused, `role="status"` attribute present; (d) `input` event after invalid state clears `aria-invalid`; (e) submit handler **never calls `window.fetch`** — assert `vi.spyOn(window, 'fetch')` was never called. Also assert the four flat props (`heading`, `body`, `placeholder`, `buttonLabel`) are rendered in the DOM (TC-19 coverage for this component). Mock `fetch` at module level.
**Expected Output:** Test file exists; all newsletter tests RED (module not found). TDD RED checkpoint.
**Depends on:** T002, T014

**Task ID:** T023b
**Title:** [GREEN] `NewsletterCTA` (leaf, presentational)
**Description:** **(TDD — GREEN phase. Depends on RED tests from T023a.)** `src/components/NewsletterCTA/` — flat props `{ heading; body; placeholder; buttonLabel }` (ADR-0006: presentational only). Port POC `.newsletter` panel + `.nl-form`: email `<input>` with `aria-describedby`/`aria-invalid`, `[role=alert]` error, `[role=status]` success live region, `novalidate`. Submit handler `preventDefault` → client-side email regex → on invalid set `aria-invalid` + error text (required vs invalid) + focus input; on valid hide form, reveal `.nl-success` + focus it. **No network submit, ever** (ADR-0006 / architecture §5). Input clears `aria-invalid` on `input` event. Magnetic button. Implementation is complete when T023a tests go GREEN.
**Expected Output:** Newsletter matches POC `§ newsletter`; default/focus/error/empty/success states all work; all T023a tests GREEN; never fetches; a11y live regions correct.
**Depends on:** T008, T009, T014, T023a

**Task ID:** T024
**Title:** `SiteFooter`
**Description:** Create `src/components/chrome/SiteFooter/` porting POC footer: `.footer-grid` (brand col + 3 nav columns + bottom legal row), faint `.mesh`. Nav columns from `src/content/navigation.ts` (footer tree). Links use `<Link>` to real routes (external/social may be `#` placeholders as in POC). Chrome / nav-exception — not a content-model rendering.
**Expected Output:** Footer matches POC `§ footer`; columns from nav content; responsive 4→2→1 reflow.
**Depends on:** T008, T014

**Task ID:** T025
**Title:** Home route `src/app/page.tsx`
**Description:** Compose the Home route per architecture §2.1: `Hero → Marquee → ValueProps → DestinationsGrid (preview, e.g. limit 3) → ExperienceShowcase → StatsBand → PromoBand → Testimonials → NewsletterCTA`. Thin server component importing all props from `src/content/home.ts`, passing plain props in. Ensure the inline `#gooey` SVG filter is present (via layout) for the hero blob field.
**Expected Output:** `/` renders the full Home composition matching POC `index.html` at 1440 + 390, both themes; zero console errors.
**Depends on:** T015, T016, T017, T018, T019, T020, T021, T022, T023b

---

### E3 — Inner routes (T-inner)

---

**Task ID:** T026
**Title:** `PageHero` (leaf, inner-page header)
**Description:** `src/components/PageHero/` — flat props `{ title; subtitle; image?:{src;alt} }`. A compact inner-page header reusing the hero token language (kinetic title accent, optional morphing art frame or mesh backdrop), lighter than the Home `Hero`. Since the POC is Home-only, build it from the shared tokens/classes (`.kinetic`, `.section-head`, `.hero-art`/`.art-mesh`) so it reads as the same family. Reveal-on-scroll.
**Expected Output:** `PageHero` renders title/subtitle/(optional image) in the Flux visual language; both themes; reduced-motion safe.
**Depends on:** T008, T009, T014

**Task ID:** T027
**Title:** `RichTextSection` (leaf, About story body)
**Description:** `src/components/RichTextSection/` — flat props `{ heading: string; body: string }` where `body` is **HTML/markup** (→ future Rich Text field). Render `.section-head` heading + a prose body block. Sanitization is not required (static trusted content) but render via a contained prose wrapper. This is the one component whose `body` prop maps to a Rich Text field rather than Single-Line.
**Expected Output:** `RichTextSection` renders heading + HTML body in-theme; readable prose width; both themes.
**Depends on:** T008, T014

**Task ID:** T028a
**Title:** [RED] Write failing Vitest tests for `ContactForm` validation logic
**Description:** **(TDD — RED phase.)** Before implementing `ContactForm`, write the failing unit test file at `static/src/components/ContactForm/__tests__/ContactForm.test.tsx` (Vitest + RTL). Tests must be RED until T028b implements the component. Cover TC-32 through TC-35: (a) empty name submit → `aria-invalid="true"` on name field + error copy visible + focus sent to name input; (b) empty email submit → `aria-invalid="true"` on email field; (c) invalid email string → `aria-invalid="true"` + "Enter a valid email address." (d) all fields valid → success state visible, `role="status"` present; (e) `input` event on a field that has `aria-invalid` clears that attribute; (f) submit handler **never calls `window.fetch`** — assert `vi.spyOn(window, 'fetch')` was never called. Also assert all six flat props (`heading`, `intro`, `nameLabel`, `emailLabel`, `messageLabel`, `buttonLabel`) are rendered (TC-19 coverage). Mock `fetch` at module level.
**Expected Output:** Test file exists; all contact-form tests RED (module not found). TDD RED checkpoint.
**Depends on:** T002, T014

**Task ID:** T028b
**Title:** [GREEN] `ContactForm` (leaf, presentational)
**Description:** **(TDD — GREEN phase. Depends on RED tests from T028a.)** `src/components/ContactForm/` — flat props `{ heading; intro; nameLabel; emailLabel; messageLabel; buttonLabel }` (ADR-0006: presentational only, no submit target). Build from the newsletter form's token language (`.input`, `.field-error`, `.nl-success`, focus/error/success states) extended to name + email + message fields. `novalidate`; client-side validation (required + email format); `aria-describedby`/`aria-invalid`/`role=alert` per field; `role=status` success; **no network submit** — `preventDefault` → validate → show success state. Default/focus/error/empty/success coverage (UI state matrix). Implementation is complete when T028a tests go GREEN.
**Expected Output:** `ContactForm` renders all fields + labels; validation + error/success states work; all T028a tests GREEN; never fetches; a11y correct; visually consistent with newsletter.
**Depends on:** T008, T009, T014, T028a

**Task ID:** T029
**Title:** Content modules for inner routes
**Description:** Add `src/content/destinations.ts`, `experiences.ts`, `about.ts`, `contact.ts` with the flat-prop objects each route needs (PageHero props, full destination/experience sets, About rich-text body + values + testimonials, Contact form copy/labels). Reuse the home destination/experience data where the route shows the full set. Keep flat per ADR-0005.
**Expected Output:** Four content modules typed + exported; copy on-brand (not lorem); image URLs from UI spec §7 where applicable.
**Depends on:** T014

**Task ID:** T030
**Title:** Destinations + Experiences routes
**Description:** `src/app/destinations/page.tsx` = `PageHero → DestinationsGrid (full) → NewsletterCTA`. `src/app/experiences/page.tsx` = `PageHero → ExperienceShowcase (full) → StatsBand → NewsletterCTA`. Thin server components importing from `src/content/*`. Reuse existing components (no new ones).
**Expected Output:** `/destinations` + `/experiences` render their compositions, both themes, zero console errors; chrome wraps via layout.
**Depends on:** T018, T019, T020, T023, T026, T029

**Task ID:** T031
**Title:** About route
**Description:** `src/app/about/page.tsx` = `PageHero → RichTextSection → ValueProps → Testimonials`, per architecture §2.1. Thin server component importing `src/content/about.ts`.
**Expected Output:** `/about` renders its composition, both themes, zero console errors.
**Depends on:** T017, T022, T026, T027, T029

**Task ID:** T032
**Title:** Contact route
**Description:** `src/app/contact/page.tsx` = `PageHero → ContactForm`, per architecture §2.1. Thin server component importing `src/content/contact.ts`.
**Expected Output:** `/contact` renders PageHero + presentational ContactForm, both themes, zero console errors.
**Depends on:** T026, T028b, T029

---

### E4 — Fidelity & quality (T-fidelity)

---

**Task ID:** T033
**Title:** Wire Playwright screenshot-diff fidelity gate
**Description:** Fully wire `playwright.config.ts` + `tests/e2e/fidelity.spec.ts`: capture every route (`/`, `/destinations`, `/experiences`, `/about`, `/contact`) at **390 + 1440** in **light AND dark**, via `toHaveScreenshot` with `maxDiffPixelRatio ≈ 0.05` (ADR-0008). Stabilize: disable animations during capture (force `prefers-reduced-motion` / inject `animation:none`), wait for fonts (`document.fonts.ready`), wait network-idle for Unsplash imagery (or stub to the CSS mesh fallback for deterministic capture). Baseline = the Flux visual contract (build-from-POC); resolve OQ-4 (built-in `maxDiffPixelRatio` vs explicit `pixelmatch`) here — default to `toHaveScreenshot` unless baselines prove unstable. Generate baselines on a consistent runner.
**Expected Output:** `fidelity.spec.ts` runs 5×2×2 = 20 captures; baselines committed; diffs within ≤5% per route per theme.
**Depends on:** T025, T030, T031, T032

**Task ID:** T034
**Title:** Zero-Sitecore-dependency CI assertion
**Description:** Add an automated assertion (a Vitest test or a `package.json` `prebuild`/lint script) that **fails** if any `@sitecore-content-sdk/*` or `@sitecore-*` package appears in `static/package.json` deps OR any `import` from `@sitecore-*` exists under `static/src`. This enforces the defining invariant (ADR-0003/0007; PRD non-negotiable) mechanically so scope-creep toward Act 3 is caught.
**Expected Output:** Assertion passes on the current tree and would fail on any Sitecore import; wired into the test/build pipeline.
**Depends on:** T001

**Task ID:** T035
**Title:** Vitest component render-from-props suite
**Description:** Add Vitest + RTL tests asserting each component renders from its flat props: required text/links/images present, `alt` text rendered, container components render N children from an array, presentational forms expose the right labels. Include the leaf + container inventory (Hero, ValueCard/ValueProps, DestinationCard/DestinationsGrid, ExperienceItem/ExperienceShowcase, Stat/StatsBand, PromoBand, TestimonialCard/Testimonials, NewsletterCTA, PageHero, RichTextSection, ContactForm). (QA 07 expands to per-task specs in § 10.)
**Expected Output:** Component suite passes; every component has at least a render-from-props test.
**Depends on:** T025, T030, T031, T032

**Task ID:** T036
**Title:** Vitest theme-provider behaviour suite
**Description:** Test the `useSyncExternalStore` theme store: `system` resolves to dark/light per a mocked `matchMedia`; `setChoice` persists to `localStorage` and updates `<html data-theme>`; cycle order `light→dark→system`; `storage`/`matchMedia change` re-resolve. Test the presentational form logic (newsletter + contact): invalid email → error + `aria-invalid`; valid → success state; never calls `fetch` (assert `fetch` not invoked).
**Expected Output:** Theme + form-logic unit tests pass; reduced-motion branches of motion hooks covered.
**Depends on:** T013, T023b, T028b

**Task ID:** T037
**Title:** Accessibility + contrast AA pass (both themes)
**Description:** Add an automated a11y check (e.g. `@axe-core/playwright`) across the 5 routes in both themes asserting zero serious/critical violations: landmarks, keyboard-operable nav/toggle/drawer/forms, visible focus, `alt` text, and **WCAG 2.1 AA color-contrast on BOTH themes** (the UI spec §6 computed ratios are the target — runtime-verify). Verify `prefers-reduced-motion` freezes all motion (reveal shown, count-up final, blobs/marquee/magnetic/morph frozen).
**Expected Output:** axe reports zero serious/critical issues both themes; reduced-motion verified; focus order logical.
**Depends on:** T033

**Task ID:** T038
**Title:** **GATE — full quality bar green**
**Description:** Run the full bar: `npm run lint` + `next build` + `npx tsc --noEmit` + Vitest suite + Playwright fidelity + a11y + zero-SDK assertion. **Ship gate (PRD §12).** All must pass before operator review. NFR-1 Lighthouse is measured (`next build && next start`, Home, desktop) but is a **soft target, non-blocking**.
**Expected Output:** All gates green; PRD §12 ship gates satisfied; ready for operator fidelity review.
**Depends on:** T033, T034, T035, T036, T037

---

### E5 — Content-model spec (T-spec)

---

**Task ID:** T039
**Title:** Derive `sitecore-content-model.md` from component props
**Description:** Mechanically derive `project-planning/sitecore-content-model.md` by walking every `src/components/*/Props` interface + `src/content/*` values, applying ADR-0005 rules (architecture §4.4): **leaf → one datasource template, one field per scalar** (string-as-text→Single-Line, string-as-HTML→Rich Text, `<img src>`→Image, `<a href>`→General Link); **container/list → one folder template + one child template** (array elements → child fields; container scalars → folder fields or rendering parameters); **nav → SKIP** (documented exception); **unmappable prop → flag NET-NEW** for operator decision. Mirror the PRD §10 / architecture §4 tables but make them **path-exact** (`SITE_COLLECTION_NAME=cosmos`, `SITE_NAME=aphelion`).
**Expected Output:** `sitecore-content-model.md` exists with: per-rendering table (verbatim `componentName` + datasource template + fields + SDK types + resolver + variants), container folder-of-children mappings, per-page placeholder composition for all 5 routes, content items with verbatim field values, publish targets — net-new props flagged.
**Depends on:** T025, T030, T031, T032

**Task ID:** T040
**Title:** Author the content-model spec as a dependency-ordered operator checklist
**Description:** Restructure/augment `sitecore-content-model.md` into a **dependency-ordered operator runbook** (US-4): site collection + site nodes with exact tree paths first, then templates (folder templates before child templates), then content items (folders before children), then page composition, then publish — so the operator can execute top-to-bottom without back-references or guessing. Confirm nav is documented as the exception (sourced in Act 3 / PRD-001), not omitted silently.
**Expected Output:** `sitecore-content-model.md` is a complete, dependency-ordered, exact-path checklist an operator can execute end-to-end without further questions (PRD success criterion + US-4 ACs).
**Depends on:** T039

## 4b. Important Test Cases (by epic / feature)

*Strengthened by QA Specialist (07) — each case is traced to a Task ID and test type. Per § 9: no production code before a RED test exists for in-scope behavioral cases. Full per-task specs are in § 10.*

### E1 — Foundation / theme (T001–T013)

| Case ID | Description | Task | Type | Priority |
|---------|-------------|------|------|----------|
| TC-01 | Theme preflight sets `data-theme` on `<html>` BEFORE first paint; no FOUC on hard reload in dark, light, system | T012, T013 | E2E (Playwright) | CRITICAL — the cliff vitest can't see |
| TC-02 | Zero hydration-mismatch console warnings on `/` in both themes after full reload | T012, T013 | E2E (Playwright) | CRITICAL |
| TC-03 | Zero console errors on `/` both themes (first load and post-toggle) | T012, T013 | E2E (Playwright) | HIGH |
| TC-04 | `useSyncExternalStore` store — `system` resolves to dark when `matchMedia('(prefers-color-scheme: dark)').matches` is true; to light otherwise | T006a | unit (Vitest) | HIGH |
| TC-05 | `setChoice('dark')` writes `data-theme="dark"` on `<html>` AND persists `localStorage('aphelion-theme')` | T006a | unit (Vitest) | HIGH |
| TC-06 | Click-cycle order is `light → dark → system → light` — not any other sequence | T007 | unit (Vitest) | HIGH |
| TC-07 | `storage` event from another tab triggers store re-sync | T006a | unit (Vitest) | MED |
| TC-08 | `matchMedia change` event while on `system` re-resolves the applied theme without persisting | T006a | unit (Vitest) | MED |
| TC-09 | ThemeToggle mounted-flag: server render emits a stable placeholder glyph/label; hydrated client updates to correct choice without text-content flash | T007 | unit + E2E | HIGH |
| TC-10 | NEVER `hsl(var(--token))` — all token usages are `var(--token)` directly; alpha uses `color-mix(in oklch, ...)` or SVG `stopOpacity` | T003 | lint / unit assertion | HIGH — `hsl_var_token_broken_with_hex_values` |
| TC-11 | `public/theme-init.js` exists on disk and is referenced via `<script src="/theme-init.js">` (NOT inline raw-HTML) | T005 | unit (file existence + DOM) | HIGH |
| TC-12 | `useReveal` — reduced-motion or no-IO returns `.in` immediately without waiting for intersection | T009 | unit (Vitest) | MED |
| TC-13 | `useCountUp` — reduced-motion returns the target value synchronously on first call | T009 | unit (Vitest) | MED |
| TC-14 | `useMagnetic` — coarse pointer or reduced-motion: `--mx`/`--my` are never set (hook returns no-op) | T009 | unit (Vitest) | MED |
| TC-15 | MobileNav: Tab-key focus is trapped inside the open drawer; Shift+Tab wraps to last focusable | T011 | E2E (Playwright) | HIGH |
| TC-16 | MobileNav: `Escape` closes drawer; focus returns to trigger button | T011 | E2E (Playwright) | HIGH |
| TC-17 | MobileNav: link click closes drawer | T011 | E2E (Playwright) | MED |
| TC-18 | MobileNav: `aria-hidden` toggled correctly; `aria-expanded` on trigger button | T011 | E2E (Playwright) | HIGH |

### E2 — Home components (T014–T025)

| Case ID | Description | Task | Type | Priority |
|---------|-------------|------|------|----------|
| TC-19 | Each leaf component renders required text/links/`alt` text from its flat prop object | T015–T024 | unit (Vitest + RTL) | HIGH |
| TC-20 | Container components (ValueProps, DestinationsGrid, ExperienceShowcase, StatsBand, Testimonials) render exactly N children from an array prop | T017–T022 | unit (Vitest + RTL) | HIGH |
| TC-21 | `DestinationsGrid` `limit` prop: when supplied, renders only `limit` cards (not the full array) | T018 | unit (Vitest) | MED |
| TC-22 | `useCountUp` — easeOutCubic animates from 0 to target over ~1400ms; final value equals `countTo` exactly | T020 | unit (Vitest) | MED |
| TC-23 | Image `onerror`: setting `data-failed` on an `<img>` reveals the `.art-mesh` / `.sky` CSS fallback (opacity change) | T015, T018 | unit (Vitest + RTL) | MED |
| TC-24 | `NewsletterCTA` — empty submit: `aria-invalid="true"` + error message "Email is required." + input focused | T023a | unit (Vitest) | HIGH |
| TC-25 | `NewsletterCTA` — invalid email submit: `aria-invalid="true"` + "Enter a valid email address." | T023a | unit (Vitest) | HIGH |
| TC-26 | `NewsletterCTA` — valid email submit: form hidden, `.nl-success` shown + focused, `role="status"` present | T023a | unit (Vitest) | HIGH |
| TC-27 | `NewsletterCTA` — `input` event clears `aria-invalid` while it is set | T023a | unit (Vitest) | MED |
| TC-28 | `NewsletterCTA` — submit handler **never calls `fetch`** (ADR-0006 regression-critical) | T023a | unit (Vitest, assert `fetch` not invoked) | CRITICAL |
| TC-29 | Marquee `aria-hidden="true"` present; CSS `animation-play-state: paused` on hover | T016 | unit + E2E | MED |
| TC-30 | Home route composition order matches architecture §2.1 (Hero → Marquee → ValueProps → DestinationsGrid → ExperienceShowcase → StatsBand → PromoBand → Testimonials → NewsletterCTA) | T025 | E2E (Playwright — DOM order) | MED |

### E3 — Inner routes (T026–T032)

| Case ID | Description | Task | Type | Priority |
|---------|-------------|------|------|----------|
| TC-31 | All 5 routes render with zero console errors, both themes | T025, T030–T032 | E2E (Playwright) | HIGH |
| TC-32 | `ContactForm` — each required field empty: `aria-invalid="true"` + error copy + focus sent to first invalid field | T028a | unit (Vitest) | HIGH |
| TC-33 | `ContactForm` — invalid email in email field: `aria-invalid="true"` + "Enter a valid email address." | T028a | unit (Vitest) | HIGH |
| TC-34 | `ContactForm` — all fields valid: success state shown, `role="status"` present | T028a | unit (Vitest) | HIGH |
| TC-35 | `ContactForm` — submit handler **never calls `fetch`** (ADR-0006 regression-critical) | T028a | unit (Vitest, assert `fetch` not invoked) | CRITICAL |
| TC-36 | `RichTextSection` renders `body` as HTML (not escaped text); prose width wrapper present | T027 | unit (Vitest + RTL) | MED |

### E4 — Fidelity & quality (T033–T038)

| Case ID | Description | Task | Type | Priority |
|---------|-------------|------|------|----------|
| TC-37 | Screenshot-diff: all 5 routes × 2 viewports (390, 1440) × 2 themes ≤~5% pixel delta vs committed baselines | T033 | E2E (Playwright `toHaveScreenshot`) | CRITICAL — ship gate |
| TC-38 | Zero `@sitecore-content-sdk/*` or `@sitecore-*` package in `static/package.json` deps | T034 | unit / CI assertion | CRITICAL — defining invariant |
| TC-39 | Zero `import` from `@sitecore-*` anywhere under `static/src` | T034 | unit / CI assertion | CRITICAL |
| TC-40 | axe: zero serious/critical a11y violations across 5 routes in dark theme | T037 | E2E (axe-core/playwright) | HIGH — ship gate |
| TC-41 | axe: zero serious/critical a11y violations across 5 routes in light theme | T037 | E2E (axe-core/playwright) | HIGH — ship gate |
| TC-42 | Runtime AA contrast — dark theme: `getComputedStyle` on body text element → computed `color` vs `backgroundColor` ratio ≥4.5:1 (target ~17.82 per UI spec §6) | T037 | E2E (Playwright computed-style assertion) | HIGH |
| TC-43 | Runtime AA contrast — light theme: body text contrast ratio ≥4.5:1 (target ~16.24 per UI spec §6) | T037 | E2E (Playwright computed-style assertion) | HIGH |
| TC-44 | Runtime AA contrast — dark theme: `--accent-500` (`#c64bff`) vs `--bg` (`#060410`) ratio ≥4.5:1 (POC-verified: 5.63) | T037 | E2E (Playwright computed-style assertion) | HIGH |
| TC-45 | Runtime AA contrast — light theme: `--accent-500` (`#7a1fd6`) vs `--bg` (`#f6f2ff`) ratio ≥4.5:1 (POC-verified: 5.49) | T037 | E2E (Playwright computed-style assertion) | HIGH |
| TC-46 | `prefers-reduced-motion: reduce` — all 27 `[data-reveal]` elements have class `in` immediately; no animation running | T037 | E2E (Playwright with media-feature override) | HIGH |
| TC-47 | `prefers-reduced-motion: reduce` — stat count-up shows final values (not 0) on initial render | T037 | E2E (Playwright) | HIGH |
| TC-48 | `prefers-reduced-motion: reduce` — marquee `animation-play-state` is `paused` or `animation` is `none` | T037 | E2E (Playwright) | MED |
| TC-49 | Unsplash image network failure: `<img>` sets `data-failed="true"` + CSS mesh fallback remains visible (opacity check) | T033 | E2E (Playwright — abort network requests for Unsplash) | MED |

### E5 — Content-model spec (T039–T040)

| Case ID | Description | Task | Type | Priority |
|---------|-------------|------|------|----------|
| TC-50 | Every leaf component has exactly one flat prop object; every scalar maps to exactly one field in the spec table | T039 | manual review vs US-3 ACs | HIGH |
| TC-51 | Every container component maps to a folder-of-children (NOT multilist/repeating field); container scalars map to folder fields | T039 | manual review | HIGH |
| TC-52 | Nav (`src/content/navigation.ts`) is documented as the exception and NOT present in the derivation tables | T039 | manual review | MED |
| TC-53 | `sitecore-content-model.md` lists all 5 page compositions with `SITE_COLLECTION_NAME=cosmos`, `SITE_NAME=aphelion` paths | T039 | manual review vs US-4 ACs | HIGH |
| TC-54 | Spec is dependency-ordered (site collection → site → templates → content items → pages → publish); operator can execute top-to-bottom | T040 | manual review vs US-4 ACs | HIGH |

## 4c. Implementation execution contract (for Developer 08)

### 4c-1. Non-negotiable technical boundaries

- **ZERO `@sitecore-content-sdk/*` (or any `@sitecore-*`) dependency or import** anywhere in `static/` — the defining invariant (ADR-0003/0007). CI-asserted by T034. No SDK field components, no field types, no `client.*`/`xmc.*`/Edge GraphQL.
- **No backend, no API routes, no server actions, no data fetching** (architecture §5). Forms are presentational: submit handlers `preventDefault` + transition local UI state, **never `fetch`** (ADR-0006). Any apparent need for an endpoint is scope-creep toward Act 3 — reject it.
- **Flat-prop discipline (ADR-0005):** every **leaf** component exposes ONE flat prop object, each scalar mapping 1:1 to a single future Sitecore field; every **container/list** component takes `array-of-child + own scalar(s)` (folder-of-children). No computed/nested "convenience" props — they become content-model dead ends.
- **Nav is the documented exception (ADR-0005 rule 3):** header/footer nav is a static tree in `src/content/navigation.ts`, EXCLUDED from content-model derivation. Do not flag it as a flat-prop violation; do not derive a datasource for it.
- **No browser globals in render/SSR-init paths (NFR-2):** `typeof window`, `matchMedia`, `IntersectionObserver`, `localStorage`, `navigator` belong inside `useEffect` / the `useSyncExternalStore` subscribe/getSnapshot — never in `useState` init or render body. (Playwright is the only gate; vitest+build can't catch — `hydration_mismatch_pattern`.)
- **Hex tokens via `var(--token)` directly — NEVER `hsl(var(--token))`** (ADR-0004; `hsl_var_token_broken_with_hex_values`). Alpha via `color-mix(in oklch, ...)` / SVG `stopOpacity`.
- **`src/components/` vs `src/ui/`/`src/lib/` split (ADR-0007):** ONLY portable, content-bearing components live under `src/components/<Name>/` (chrome under `src/components/chrome/`). Theme provider/toggle + UI primitives → `src/ui/`; motion hooks + utilities → `src/lib/`. This keeps the future head-app `generate-map` scanner from registering infra as a Sitecore rendering. Do NOT place types/hooks/sub-utilities loosely inside a component folder if they aren't part of that single rendering's contract.
- **Theme preflight is a REAL file** (`public/theme-init.js`) referenced via `<script src>` — NEVER inlined via React's raw-HTML script prop (security tooling blocks that form — ADR-0004 / architecture §8). `suppressHydrationWarning` only on `<html>`.
- **Build mode = standard `next build` — NOT `output: 'export'`/SSG** (ADR-0003; architecture §6). A static export would misrepresent the SSR/proxy head-app target.
- **All motion gated by `prefers-reduced-motion`** (NFR-3): reveal shown, count-up final, blobs/marquee/magnetic/morph-frame/spin frozen. No autoplay audio/video.
- **Imagery royalty-free/placeholder/generated only** (PRD §9): use the Unsplash IDs from § 4c-4; every `<img>` has a CSS mesh fallback + `onerror`. No copyrighted brand assets.

### 4c-2. ADR one-liners (no baseline.md yet — full set for affecting ADRs)

- **ADR-0002:** Two-PRD split — Acts 1–2 (static app + content-model spec) are PRD-000; Act 3 (head-app scaffold/port/live tenant/deploy) is PRD-001. Do not build Act-3 anything here.
- **ADR-0003:** Build a standalone plain-React `create-next-app` static app FIRST with zero Sitecore deps; it is a reference deliverable, not deployed; the head app is not scaffolded until Act 3.
- **ADR-0004:** Theme = FOUC preflight via `public/theme-init.js` (real file, not inlined raw-HTML) + `useSyncExternalStore` provider (not setState-in-effect) + mounted-flag + Tailwind v4 `@theme` tokens used via `var(--token)` directly. Ports verbatim to the head app.
- **ADR-0005:** Component prop boundary IS the content model — leaf = one flat prop object (1 scalar → 1 field); container/list = folder-of-children (NOT multilist/repeating field); nav excluded; unmappable → flagged net-new.
- **ADR-0006:** Newsletter + Contact are presentational-only in v1 — full client-side validation + default/focus/error/success/empty states, NO network submit, NO backend; their copy/labels still get a datasource template.
- **ADR-0007:** Scaffold with `create-next-app` (App Router/TS/Tailwind v4) literally per rule 50; self-contained `src/components/<Name>/` per component; theme/UI infra in `src/ui/` (+ `src/lib/`), never `src/components/`; zero-SDK invariant enforced; standard `next build`.
- **ADR-0008:** Two-layer tests — Vitest (props + theme/form logic) + Playwright (`toHaveScreenshot` `maxDiffPixelRatio≈0.05` fidelity gate across 5 routes × 2 viewports × 2 themes, AND the hydration/console-error check vitest can't see). Baseline = the Flux clickdummy; build from POC markup, not prose.

### 4c-3. Stack / tooling specifics

- **Scaffold:** **`create-next-app`** — App Router, TypeScript, Tailwind v4, ESLint, `src/` dir, import alias `@/*`. Command: `npx create-next-app@latest static --ts --app --tailwind --eslint --src-dir --import-alias "@/*"` from `products/head-application/aphelion/`. **NOT `create-content-sdk-app`** (that is PRD-001). Run literally per rule `50-scaffold`; if it fails, HARD STOP and report — never hand-write `package.json`/`next.config.*`.
- **Package manager:** **npm** (whatever `create-next-app` pins — do not introduce pnpm/yarn).
- **Test runner:** **Vitest** (+ `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) for unit; **Playwright** (`@playwright/test`, `@axe-core/playwright` for a11y) for E2E/fidelity/hydration.
- **Build:** **`next build`** (standard production build) — **NOT** `output: 'export'`/SSG. Quality bar (all local, no CI service): `npm run lint` · `next build` · `npx tsc --noEmit` · `npm run test` (vitest) · `npm run test:e2e` (playwright). NFR-1 perf measured via `next build && next start` (soft, non-blocking).
- **Tailwind v4:** config lives in `src/app/globals.css` (`@import "tailwindcss"; @theme {...}; @custom-variant dark`) — there is **no `tailwind.config.js`** in v4.
- **Fonts:** self-host **Clash Display** (Fontshare) for `--font-display`; **Outfit** for `--font-sans` (Outfit-as-display is the documented fallback if Clash self-host is blocked — OQ-1).
- **Versions:** scaffold-pinned only — do not assume versions from training data (rule 50; Next 16 / React 19 era — react-hooks plugin ERRORS on setState-in-effect, so the `useSyncExternalStore` provider is mandatory).

### 4c-4. UI implementation notes

- **Winning POC clickdummy (THE visual source of truth):** `pocs/poc-v5b-prd000/` (`index.html` + `styles.css` + `theme.js`). **Build from the POC markup/CSS, not prose** (`feedback_poc_is_implementation_contract`); when spec text and POC diverge, the POC wins. **The POC is Home-only** — flesh inner routes from the same components + tokens. It inherits the base v5 token system (`pocs/poc-v5-prd000/styles.css`).
- **Direction = "Flux" (Nebula Drift, abstract-render edition).** Signature effects (all in the POC, all reduced-motion-frozen):
  - **Gooey morphing blob field** — `.flux-field` with 4 `.blob`s, driven by the **inline SVG `<filter id="gooey">`** (`feGaussianBlur stdDeviation=18` + `feColorMatrix` alpha-threshold). Inject the `#gooey` `<svg>` once at top of `<body>` in the root layout so `filter:url(#gooey)` resolves.
  - **Magnetic CTAs/cards** — `data-magnetic` → element follows cursor via `--mx/--my` translate (pointer-fine + reduced-motion gated).
  - **Scroll count-up** — `data-countup` easeOutCubic on the stats band.
  - **Infinite marquee** — 6 destination names, duplicated track, pause-on-hover, `aria-hidden`.
  - **Flowing gradient border** — `.flowborder::before` animated edge on value cards.
  - **Kinetic gradient headlines** — `.kinetic` `background-size:260%` on a 7s cycle, with `@supports not` solid-`--fg` fallback.
  - **Morphing hero art frame** (`border-radius` keyframe morph) + spinning conic-gradient brand `.mark` + drifting `.mesh` + `.stars`.
- **Tokens (dark default / light "daybreak"):** key values — `--bg #060410 / #f6f2ff`, `--surface #110a26 / #ffffff`, `--fg #f4eeff / #1b1132`, `--fg-muted #b1a3d8 / #574a78`, `--accent-500 #c64bff / #7a1fd6`, `--neon-cyan #3df0ff / #5ed6ef`, `--neon-magenta #ff4dd2 / #ff7ae0`, `--neon-violet #9d6bff / #b89bff`, `--neon-lime #8affd4 / #4fd6a8`, `--danger-500 #ff6b81 / #c8203f`, `--success-500 #46e6b0 / #0c8f67`. Plus `--blob-opacity`, `--img-overlay`, `--media-blend` (screen/normal), `--mesh-opacity`, `--orb-bloom` (full per-theme set in POC `styles.css` — port verbatim). **Hex literals via `var(--token)` directly.**
- **Type:** display `'Clash Display','Fraunces','Outfit',system-ui`; sans `'Outfit',system-ui`. Scale `--step--1 … --step-4` (clamps in POC). `--maxw 1180px`, `--radius 22px`, `--band-y clamp(5rem,12vh,8.5rem)`.
- **Responsive (fidelity viewports 390 + 1440):** desktop 2-col hero / 3-up grids / alternating experiences / 4-up stats / full blob field; mobile single-col, hero art stacks above copy, hamburger drawer below 720px, grids → 1 col, stats → 2-up, blob/mesh reduced. Breakpoints `980px` + `720px` per POC.
- **A11y (UI spec §6, runtime-verify):** AA contrast BOTH themes (computed ratios all ≥4.5:1 — body text rides solid `--surface`/`--bg`, never neon/mesh); kinetic headlines are LARGE display (≥30px) with solid fallback; visible focus ring `--accent-500`; drawer focus-trap + Esc + return; forms `aria-describedby`/`aria-invalid`/`role=alert`/`role=status`; state icons are monochrome glyphs `✓`/`✕` (**no emoji codepoints**); all decorative art `aria-hidden`, content images carry descriptive `alt`.
- **Imagery (royalty-free Unsplash, commercial-OK, no attribution — UI spec §7):** URL form `https://images.unsplash.com/<id>?w=<n>&q=80&auto=format&fit=crop`. Hero `photo-1743010314082-43bb0749436e`; destinations `photo-1620121692029-d088224ddc74`, `photo-1618005182384-a83a8bd57fbe`, `photo-1620641788421-7a1c342ea42e`, `photo-1635776062127-d379bfcba9f8`, `photo-1614851099175-e5b30eb6f696`, `photo-1462331940025-496dfbfc7564`; experiences `photo-1639762681485-074b7f938ba0`, `photo-1502691876148-a84978e59af8`. Every `<img>` has a CSS mesh fallback + `onerror` reveal.
- **Copy:** use the verbatim POC copy (eyebrows, headlines, destination/experience/testimonial text, newsletter copy) as the on-brand baseline; OQ-2 lets the operator adjust names/count later.

### 4c-5. File / module structure and naming conventions

```
products/head-application/aphelion/static/
├── public/
│   └── theme-init.js                 # FOUC preflight (real file; <script src>)
├── src/
│   ├── app/
│   │   ├── layout.tsx                # <html suppressHydrationWarning>; <head><script src="/theme-init.js">;
│   │   │                             #   inline #gooey <svg> at top of <body>; <ThemeProvider> → SiteHeader/{children}/SiteFooter
│   │   ├── globals.css               # @import "tailwindcss"; @theme tokens; @custom-variant dark; all POC classes
│   │   ├── page.tsx                  # Home
│   │   ├── destinations/page.tsx
│   │   ├── experiences/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── components/<Name>/            # ONE portable, content-bearing component each (THE port unit → PRD-001)
│   │   index.tsx + types co-located  #   Hero, ValueCard, ValueProps, DestinationCard, DestinationsGrid,
│   │                                 #   ExperienceItem, ExperienceShowcase, Stat, StatsBand, PromoBand,
│   │                                 #   TestimonialCard, Testimonials, NewsletterCTA, Marquee,
│   │                                 #   PageHero, RichTextSection, ContactForm
│   │   chrome/                       #   SiteHeader, MobileNav, SiteFooter (nav exception — NOT renderings)
│   ├── ui/                           # NOT scanned as renderings (ADR-0007)
│   │   theme-provider.tsx (useSyncExternalStore) · theme-toggle.tsx (mounted-flag) · Container/Section/Button
│   ├── lib/
│   │   motion/                       # useReveal · useCountUp · useMagnetic (browser globals only in useEffect)
│   └── content/<route>.ts            # hard-coded plain props (future datasource values) + navigation.ts (excluded)
└── tests/
    ├── unit (Vitest + RTL)           # *.test.ts(x) — render-from-props + theme/form logic
    └── e2e (Playwright)              # theme.spec.ts (hydration/FOUC) · fidelity.spec.ts (screenshot-diff) · a11y
```

- **Naming:** component files `PascalCase` folders, `index.tsx` entry; `Props` interface co-located + exported. Hooks `useCamelCase` in `src/lib/motion/`. Content modules lowercase `src/content/<route>.ts`. Tests `*.test.tsx` (unit, co-located or under `tests/unit`) / `*.spec.ts` (Playwright under `tests/e2e`).
- **Each `src/components/<Name>/` contains ONLY that single rendering's contract** (component + its `Props`) — do not stash unrelated types/hooks/sub-utilities there (ADR-0007 / naming-traps; matters for the Act-3 port).
- **Container/leaf naming:** leaf card components (`ValueCard`, `DestinationCard`, `ExperienceItem`, `TestimonialCard`, `Stat`) + their containers (`ValueProps`, `DestinationsGrid`, `ExperienceShowcase`, `Testimonials`, `StatsBand`) are SEPARATE folders — the leaf is the child template, the container is the folder datasource (ADR-0005).

### 4c-6. Integration and API contract notes

**N/A — no backend, no live SDK, no API in PRD-000.**

- The static app makes **zero** live SDK calls (`client.*`, `xmc.*`, Edge GraphQL) — so there are **no request/response `.d.ts` shapes to cite** under rule `40-sdk-contracts`. The SDK-contract verification gate is **deferred in full to PRD-001 / Act 3**, where `client.getPage()` + Edge GraphQL shapes become real and must be cited from `node_modules` `.d.ts`.
- The content-model **field types** in § 4c-4 / the T-spec are **design-time targets** (what a future datasource field will be), NOT observed wire shapes.
- Forms (`NewsletterCTA`, `ContactForm`) are presentational: handlers `preventDefault` + local state only — **never `fetch`** (ADR-0006). The "contract" they satisfy is the UI state matrix (default/focus/error/success/empty), not a network contract.

### 4c-7. Parity / rebuild pointers

`analysis_mode: greenfield` — **no source rebuild.** BUT the **v5b "Flux" POC is the fidelity oracle** (not optional):

- **Oracle:** `pocs/poc-v5b-prd000/` (`index.html` + `styles.css` + `theme.js`). Build from its markup/CSS; the screenshot-diff gate (T033) is baselined against the Flux visual contract.
- **Parity definition (PRD §1.5 / ADR-0008):** structural + visual parity — same sections, order, layout — with **≤~5% per-route pixel delta per theme**, at **390 (mobile) + 1440 (desktop)**, in **light AND dark**, across all **5 routes**. NOT literal pixel-perfect.
- **Per-route parity notes:** Home (`/`) maps directly to the POC `index.html` band order (Hero→Marquee→ValueProps→DestinationsGrid preview→ExperienceShowcase→StatsBand→PromoBand→Testimonials→NewsletterCTA). Inner routes have no POC frame — parity is "same component visual language + tokens," verified by the same screenshot-diff against their own committed baselines (generated at T033), plus a11y/contrast AA.
- **Capture stabilization:** disable animations, await `document.fonts.ready`, settle imagery (or fall back to CSS mesh) for deterministic baselines; `maxDiffPixelRatio≈0.05` absorbs AA/subpixel noise.

## 5. Dependencies

- **Ordering constraints:**
  - T001 (scaffold) precedes everything. T003 (tokens) gates all visual work. T005→T006→T007 is the theme chain; T002 (test stack) precedes any test wiring.
  - **T-foundation must finish AND pass its hydration gate (T013) before T-home** — theme hydration is the project's single highest risk, so its test tranche runs first (PRD §12 / tranche-first preference). Content bands are not started until T013 is green.
  - Components (T015–T024, T026–T028) depend on primitives (T008), motion hooks (T009), and content (T014/T029) — not on each other, so they parallelize within their content set.
  - Routes (T025, T030–T032) depend on the components they compose. Fidelity/quality (T033–T038) depends on all routes existing. T-spec (T039–T040) depends on the final component/route set.
- **Execution order (valid dependency order — the execution agent runs this sequence):**

```
T001, T002, T003, T004, T005, T006a, T006b, T007, T008, T009, T010, T011, T012, T013,
T014, T015, T016, T017, T018, T019, T020, T021, T022, T023a, T023b, T024, T025,
T026, T027, T028a, T028b, T029, T030, T031, T032,
T033, T034, T035, T036, T037, T038,
T039, T040
```

- **Parallel groups:**

```
Group 1 (sequential — scaffold + theme base):       T001 → T002, T003 → T004, T005
Group 2 (sequential — theme runtime TDD):            T006a[RED] → T006b[GREEN] → T007
Group 3 (parallel — infra):                          T008 (primitives, needs T003), T009 (motion hooks, needs T001)
Group 4 (sequential — chrome):                       T010 → T011
Group 5 (GATE — foundation):                         T012 → T013   (must pass before Group 6)
Group 6 (parallel — Home content + components):      T014 first; then T015,T016,T017,T018,T019,T020,T021,T022,T023a[RED]+T023b[GREEN],T024 parallel
Group 7 (sequential — Home route):                   T025  (depends on Group 6)
Group 8 (parallel — inner components TDD):           T026, T027, T028a[RED]+T028b[GREEN]  (depend on T008/T009/T014)
Group 9 (sequential — inner content + routes):       T029 → {T030, T031, T032 parallel}
Group 10 (parallel — quality):                       T034 (anytime after T001); T033 then T035,T036,T037 after routes
Group 11 (GATE — quality bar):                       T038
Group 12 (sequential — spec):                        T039 → T040
```

Rules: groups execute in order; a group starts only when ALL its dependencies are complete. T013 and T038 are hard gates — do not proceed past them on RED.

## 6. Suggested Milestones

1. **M1 — Foundation proven (end of T013):** scaffold + theme stack + chrome built; hydration/FOUC gate GREEN. The riskiest thing is de-risked.
2. **M2 — Home faithful (end of T025):** Home route renders the full Flux composition, both themes.
3. **M3 — All routes (end of T032):** 5 routes render, both themes, zero console errors.
4. **M4 — Quality bar green (end of T038):** fidelity ≤5%, a11y AA, zero-SDK, all suites pass — operator fidelity review ready (PRD §12 ship gates).
5. **M5 — Operator runbook (end of T040):** `sitecore-content-model.md` complete + dependency-ordered. PRD-000 shippable.

## 7. Risk Areas

- **Theme hydration / FOUC (HIGH).** Mitigated by the test-first gate (T012/T013) + exact adherence to ADR-0004 (`useSyncExternalStore`, real preflight file, mounted-flag). Playwright is the only catcher.
- **Prop that won't map to one field → painful Act-3 port (HIGH).** Enforce flat-prop rule at design + code review; container arrays → folder-of-children; no computed/nested props; net-new flagged in T-spec.
- **Design drift (built from prose not POC markup) (MED).** Build from `pocs/poc-v5b-prd000/`; screenshot-diff gate before operator review.
- **Inner routes have no POC frame (MED).** They reuse Home's components/tokens; parity = "same visual language" verified against their own committed baselines + a11y AA. Keep component reuse strict (no bespoke inner-route markup).
- **`#gooey` SVG filter perf on low-end (MED — soft).** `will-change:transform` on blobs; reduced-motion freeze is the safety valve; NFR-1 is non-blocking (OQ-3).
- **Screenshot baseline flakiness (MED).** Stabilize capture (animations off, fonts ready, imagery settled); `maxDiffPixelRatio≈0.05`; generate baselines on a consistent runner (OQ-4).
- **Scope creep toward Act 3 (MED).** Zero-`@sitecore-*` assertion (T034); no API routes/server actions/fetch.

## 8. What Needs To Be Tested (global testing runbook)

*Lead Developer initial; QA (07) expands into § 9/§ 10. Developer (08) coverage status updated after E2 implementation.*

- **Unit (Vitest + RTL):** every component renders from its flat props (text/links/images/alt); container components render N children from arrays; theme store (`system` resolution, persistence, cycle order); motion-hook reduced-motion branches; presentational form logic (newsletter + contact: invalid/valid → error/success; **never `fetch`**).
- **UI / component:** card hover/focus states, count-up, image `onerror` fallback, drawer focus-trap/Esc/return, flowborder/magnetic (pointer-fine).
- **E2E (Playwright):** **hydration/console-error + FOUC check on all routes both themes** (the cliff vitest can't see); **screenshot-diff fidelity** 5 routes × 390/1440 × light/dark ≤~5%; **a11y/axe** zero serious/critical + AA contrast both themes; `prefers-reduced-motion` freeze verified.
- **Regression:** zero `@sitecore-*` dependency/import in `static/` (T034); presentational forms never network-submit (ADR-0006).
- **Test commands:** `npm run lint` · `next build` · `npx tsc --noEmit` · `npm run test` (vitest) · `npm run test:e2e` (playwright). NFR-1 perf: `next build && next start` (soft).
- **Smoke gates:** **none** — no tenant in PRD-000. (Real-tenant smoke is PRD-001.) Operator fidelity review of the screenshot-diff baselines is the human gate.

### E2 coverage status (after T014–T025 implementation — 2026-06-10)

| Task | Status | Vitest coverage |
|------|--------|-----------------|
| T014 `src/content/home.ts` | DONE | TypeScript compiles; shapes verified by downstream component rendering |
| T015 Hero | DONE | Render test in T035 (pending); `'use client'` — `useMagnetic` + `onError` |
| T016 Marquee | DONE | Render test in T035 (pending); `aria-hidden` on outer div |
| T017 ValueCard + ValueProps | DONE | Render tests in T035 (pending) |
| T018 DestinationCard + DestinationsGrid | DONE | `limit` prop tested in T035 (pending); `'use client'` — `onError` |
| T019 ExperienceItem + ExperienceShowcase | DONE | Render tests in T035 (pending); `'use client'` — `onError` |
| T020 Stat + StatsBand | DONE | `useCountUp` reduced-motion covered by E1 tests; render tests in T035 (pending) |
| T021 PromoBand | DONE | Render tests in T035 (pending); `'use client'` — `useMagnetic` |
| T022 TestimonialCard + Testimonials | DONE | Render tests in T035 (pending) |
| T023a [RED] NewsletterCTA tests | DONE — RED confirmed | 9 tests failing before T023b |
| T023b [GREEN] NewsletterCTA implementation | DONE — GREEN | 9/9 tests pass (TC-24…TC-28 + TC-19 coverage) |
| T024 SiteFooter | DONE | Render tests in T035 (pending); replaces layout stub |
| T025 Home route `page.tsx` | DONE | Full composition; build green |

**Vitest suite state:** 32 tests passing (23 E1 + 9 T023a/T023b); `npm run lint` 0 errors; `npx tsc --noEmit` clean; `npm run build` green.

**Pending for E3+:** T035 component render-from-props suite (written during T035 pass after inner routes exist); T036 theme+form suite additions; T033 Playwright fidelity; T034 zero-SDK assertion; T037 a11y.

### E3 coverage status (after T026–T032 implementation — 2026-06-10)

| Task | Status | Vitest coverage |
|------|--------|-----------------|
| T026 PageHero | DONE | Render test in T035 (pending); optional image + mesh fallback |
| T027 RichTextSection | DONE | Render test in T035 (pending); `dangerouslySetInnerHTML` with trusted static content |
| T028a [RED] ContactForm tests | DONE — RED confirmed | 9 tests failing before T028b (module not found) |
| T028b [GREEN] ContactForm implementation | DONE — GREEN | 9/9 tests pass (TC-32…TC-35 + TC-19 coverage) |
| T029 Inner content modules | DONE | `src/content/{destinations,experiences,about,contact}.ts`; TypeScript compiles |
| T030 Destinations + Experiences routes | DONE | Both routes build; composition: PageHero → Grid/Showcase → StatsBand? → NewsletterCTA |
| T031 About route | DONE | Route builds; composition: PageHero → RichTextSection → ValueProps → Testimonials |
| T032 Contact route | DONE | Route builds; composition: PageHero → ContactForm + contact details |

**Vitest suite state after E3:** 41 tests passing (23 E1 + 9 T023b + 9 T028b); `npm run lint` 0 errors; `npx tsc --noEmit` clean; `npm run build` green (all 5 routes: /, /destinations, /experiences, /about, /contact).

**Pending for E4+:** T035 component render-from-props suite; T036 theme+form suite additions; T033 Playwright fidelity; T034 zero-SDK assertion; T037 a11y.

### E4 coverage status (after T033–T038 implementation — 2026-06-10)

| Task | Status | Coverage |
|------|--------|----------|
| T033 Playwright screenshot-diff fidelity gate | DONE — GREEN | 20 baselines (5×2×2); 85 E2E pass 1 skipped 0 fail; structural DOM assertions |
| T034 Zero-Sitecore-dependency assertion | DONE — GREEN | 4 Vitest tests (TC-38, TC-39, 2× mutation checks) |
| T035 Vitest component render-from-props suite | DONE — GREEN | 44 new Vitest tests; all 18 components covered (leaves + containers) |
| T036 Vitest theme-provider + form-logic suite | DONE — GREEN | 11 new Vitest tests (outside-provider guard, server snapshot, email regex) |
| T037 axe a11y + runtime contrast + reduced-motion | DONE — GREEN | 10 axe route×theme checks; 4 runtime contrast ratio assertions; 3 reduced-motion freeze checks |
| T038 GATE — full quality bar | DONE — **PASS** | All gates green (see below) |

**T038 GATE RESULT: PASS**
- `npm run lint`: 0 errors
- `npx tsc --noEmit`: clean
- `npm run build`: green (all 5 routes)
- `npm run test` (Vitest): **100 tests passing** (8 test files; 41 E1–E3 + 59 E4 new)
- `npm run test:e2e` (Playwright): **85 passing, 1 intentional skip, 0 failing** (fidelity + a11y + theme + navigation)
  - 20 screenshot baselines generated at `tests/e2e/fidelity.spec.ts-snapshots/`
  - axe: zero serious/critical violations across 5 routes × 2 themes
  - Runtime contrast: dark body 17.94 (≥4.5 ✓), light body 16.25 (≥4.5 ✓), dark accent 5.67 (≥4.5 ✓), light accent 6.37 (≥4.5 ✓)
  - Reduced-motion: all verified (opacity, count-up final, marquee frozen)

**App fix applied during E4:** MobileNav `inert={!isOpen || undefined}` added to remove focusable elements from tab order when drawer is closed — fixes axe `aria-hidden-focus` WCAG 4.1.2 violation found and fixed by T037.

## 9. TDD and quality contract

*Written by QA Specialist (07). Governs all implementation work in this task breakdown.*

### 9.1 Mandate

**No production code before a failing test exists for that behavior.** This applies to every behavioral task where the logic is testable before the component is rendered (unit-level) or observable in a browser (E2E). The sequence for every in-scope behavioral unit is:

1. **RED** — write the test(s); run the suite; confirm they fail with a real assertion error (not a compile error from correct code).
2. **GREEN** — write the minimum implementation to make the tests pass.
3. **REFACTOR** — clean up; tests must stay green.

### 9.2 TDD scope vs. non-TDD tasks

| Task(s) | TDD applicable? | Rationale |
|---------|-----------------|-----------|
| T006a/T006b (`ThemeProvider` store) | **YES — split RED/GREEN** | Pure store logic (resolve, persist, cycle, re-sync); fully mockable in jsdom; HIGH risk (Next 16 setState-in-effect error). |
| T023a/T023b (`NewsletterCTA` validation) | **YES — split RED/GREEN** | Deterministic form logic; regression-critical (ADR-0006 never-fetch invariant). |
| T028a/T028b (`ContactForm` validation) | **YES — split RED/GREEN** | Same as above. |
| T009 (`useReveal`, `useCountUp`, `useMagnetic`) | **YES — Vitest** | Reduced-motion branches are synchronous + fully mockable; test before motion hooks are consumed by components. |
| T011 (`MobileNav`) | **Vitest + E2E** | Focus-trap + Esc logic is testable via RTL keyboard events; E2E verifies actual focus. |
| T001 (scaffold) | **NON-TDD** | Invocation of `create-next-app` — verification step: `next build` + `npm run lint` green on bare scaffold. |
| T002 (test stack setup) | **NON-TDD** | Infrastructure task; verification: `npm run test` runs (0 tests) + `npx playwright test` runs. |
| T003 (token CSS) | **NON-TDD** | CSS authoring; verification: `next build` green + manual token-resolution smoke + T012 Playwright check for FOUC/contrast. |
| T004 (fonts) | **NON-TDD** | Font self-hosting; verification: `next build` green + T033 fidelity capture shows correct font families. |
| T005 (theme-init.js) | **NON-TDD** | File authoring; verification: file exists at `public/theme-init.js`, `<script src="/theme-init.js">` in layout `<head>`, T012 Playwright FOUC check. |
| T007 (ThemeToggle) | **Vitest (GREEN from T006a)** | ThemeToggle cycle-order (TC-06) is covered by T006a tests on the store; mounted-flag test (TC-09) added in T035 suite. |
| T008 (primitives) | **Vitest (in T035)** | Styling primitives; render-from-props covered by T035 component suite. |
| T010 (`SiteHeader`) | **Vitest (in T035)** | Render-from-props + nav link destinations. |
| T012 (root layout + Playwright probe) | **E2E first** | This IS the test task for foundation. No production code is blocked — the root layout must exist to run the probe; T012 IS the RED-equivalent for hydration. |
| T013 (GATE) | **Gate task** | Must not proceed past RED T012 probe. |
| T014 (content modules) | **NON-TDD** | Static data authoring; verification: TypeScript compiles. |
| T015–T022, T024, T026–T027 (components) | **Vitest (in T035)** | Render-from-props tests written as part of T035; these implementation tasks should be developed with those tests in mind — write the T035 tests stub for each component before the component exists (a "micro-RED" per component where practical). Full RED/GREEN split is NOT mandated per component — the prime RED/GREEN splits are T006a, T023a, T028a. |
| T025, T030–T032 (routes) | **E2E (T012-style probe + T033 fidelity)** | Routes must render; verified by Playwright console-error probe (zero errors both themes). |
| T033–T037 (fidelity + a11y + suites) | **E2E / Vitest** | These ARE the quality tasks — they produce the test artifacts and run the gates. |
| T038 (GATE) | **Gate task** | All test commands must be green; do not proceed to T-spec until T038 passes. |
| T039–T040 (content-model spec) | **NON-TDD** | Documentation derivation; verification: manual review against US-4 ACs (TC-50 through TC-54). |

### 9.3 RED-before-GREEN enforcement in the dependency graph

Three behavioral splits have been enforced in the Depends on graph (the RED task precedes its GREEN task):

- **T006a → T006b** — theme store: failing unit tests before the store implementation.
- **T023a → T023b** — NewsletterCTA: failing form-logic tests before the component.
- **T028a → T028b** — ContactForm: failing form-logic tests before the component.

For all other components, the § 10 test specs define the test shape; the Developer writes those tests in the T035/T036 pass. The Developer **must not** invert this — T035 component stubs should be written BEFORE the full implementations where a component is built fresh.

### 9.4 Meaningful tests only — antipatterns to reject

The following are NOT acceptable and will be flagged at `/code-review`:

- `expect(true).toBe(true)` or identity assertions that always pass.
- A form test that only checks the component renders (does not test the submit path).
- A theme test that only checks `data-theme` is set (does not test the resolve logic or persistence).
- A contrast test that only checks `toHaveClass('bg-primary')` (does not verify computed foreground/background contrast at runtime).
- A reduced-motion test that only checks the CSS class is present (does not assert the animation state or final value).

### 9.5 Runtime contrast assertions mandate

For any component painted with theme tokens (body text, CTAs, headings, cards), tests must assert **resolved** foreground/background contrast at runtime — not just that the right CSS class exists. Use `getComputedStyle(el).color` + `getComputedStyle(el).backgroundColor` in Playwright and compare via a WCAG contrast helper (or `@axe-core/playwright` with the contrast rule enabled).

Specific targets from UI spec §6 (encode as test expectations):
- Dark theme body text (`--fg` on `--bg`): ratio ≥4.5:1 (target 17.82).
- Light theme body text (`--fg` on `--bg`): ratio ≥4.5:1 (target 16.24).
- Dark `--accent-500` (`#c64bff`) on `--bg` (`#060410`): ratio ≥4.5:1 (target 5.63).
- Light `--accent-500` (`#7a1fd6`) on `--bg` (`#f6f2ff`): ratio ≥4.5:1 (target 5.49).
- Body text NEVER on neon/mesh backgrounds — always on solid `--surface`/`--bg`.

These are TC-42 through TC-45. The axe checks (TC-40/41) provide broad coverage; the explicit computed-style checks verify the tokens the POC ships at the specific ratios the designer verified.

### 9.6 Image fallback test contract

Tests that involve `<img>` elements must also assert the CSS mesh fallback path. Trigger `onerror` on the image in jsdom/Playwright and assert:
- The image element receives `data-failed="true"`.
- The parent element's CSS mesh layer remains visible (check CSS `background` is not `none`, or that `.art-mesh` / `.sky` element is not hidden).
- Content of the section remains accessible (text still in DOM, no layout collapse).

This applies to: Hero (`photo-1743010314082-43bb0749436e`), all DestinationCard items, all ExperienceItem items.

### 9.7 No real-tenant smoke gates in PRD-000

There is **no tenant** in PRD-000. `manifest.smoke_outcomes` is NOT initialized — fidelity is the gate here. The Playwright screenshot-diff (T033) and a11y/contrast pass (T037) ARE the quality bar. No `tested_pending_smoke` status applies. (Tenant smoke is PRD-001.)

### 9.8 No SDK fixture citations required

PRD-000 makes zero `@sitecore-content-sdk/*` calls. Rule `40-sdk-contracts` SDK-fixture mandate is **deferred to PRD-001** where `client.getPage()` shapes become real. No `.d.ts` citations needed in this breakdown.

---

## 10. Per-task test specifications

*QA Specialist (07) — scenario-based, behavioral test specs per Task ID. Test type: unit (Vitest + RTL) | component (Vitest + RTL) | E2E (Playwright). File locations relative to `static/`.*

---

### T006a — Theme store RED tests

**File:** `src/ui/__tests__/theme-provider.test.ts`
**Test type:** unit (Vitest + jsdom)
**Must be RED before T006b begins.**

| # | Scenario | Expected outcome |
|---|----------|-----------------|
| 1 | `resolveTheme('system')` when `matchMedia('(prefers-color-scheme: dark)').matches === true` | Returns `'dark'` |
| 2 | `resolveTheme('system')` when `matchMedia(...).matches === false` | Returns `'light'` |
| 3 | `resolveTheme('dark')` (explicit) | Returns `'dark'` regardless of `matchMedia` |
| 4 | `resolveTheme('light')` (explicit) | Returns `'light'` regardless of `matchMedia` |
| 5 | After `setChoice('dark')`: `document.documentElement.getAttribute('data-theme')` | `'dark'` |
| 6 | After `setChoice('dark')`: `localStorage.getItem('aphelion-theme')` | `'dark'` |
| 7 | After `setChoice('system')` (system = dark): `data-theme` | `'dark'` |
| 8 | After `setChoice('system')`: `localStorage` | `'system'` |
| 9 | Cycle from initial `'light'` → click → `'dark'` → click → `'system'` → click → `'light'` | Exactly this sequence |
| 10 | `storage` event dispatched with `key='aphelion-theme'`, `newValue='light'`: store re-syncs to `'light'` | `data-theme` becomes `'light'` |
| 11 | `matchMedia change` event while on `'system'` (dark→light): `data-theme` updates | `data-theme` becomes `'light'` |
| 12 | `matchMedia change` event while on explicit `'dark'`: `data-theme` unchanged | `data-theme` stays `'dark'` |

---

### T006b — Theme store GREEN

No new test file. T006a tests must all pass after this task. No additional tests needed at the GREEN stage unless implementation reveals an untested edge — in which case add to T006a file.

---

### T007 — ThemeToggle (covered in T035 component suite)

**File:** `src/ui/__tests__/theme-toggle.test.tsx` (or inline in T035 file)
**Test type:** component (Vitest + RTL)

| # | Scenario | Expected outcome |
|---|----------|-----------------|
| 1 | Server render (mounted=false): toggle renders a stable placeholder (not `''`) — consistent between server and client snapshot | No hydration mismatch (text length > 0 on server) |
| 2 | After mount: toggle glyph matches `GLYPH[currentChoice]` per POC (`☀`/`☾`/`◑`) | Correct glyph rendered |
| 3 | After mount: `aria-label` is `"Theme: <Label>. Activate to change."` | Correct aria-label |
| 4 | Keyboard Enter on toggle triggers cycle | `setChoice` called with the next value |

---

### T009 — Motion hooks

**File:** `src/lib/motion/__tests__/motion-hooks.test.ts`
**Test type:** unit (Vitest + jsdom)

| # | Scenario | Hook | Expected outcome |
|---|----------|------|-----------------|
| 1 | `prefers-reduced-motion: reduce` — `useReveal` returns `{ isVisible: true }` immediately on first call | `useReveal` | `isVisible === true` without IntersectionObserver firing |
| 2 | No IntersectionObserver support (delete from global) — `useReveal` immediately reveals | `useReveal` | `isVisible === true` |
| 3 | `prefers-reduced-motion: reduce` — `useCountUp(1240, {})` returns `1240` immediately | `useCountUp` | Returned value equals target, not 0 |
| 4 | `prefers-reduced-motion` NOT reduced — `useCountUp` starts at 0 on first render | `useCountUp` | Initial display value is `0` |
| 5 | `useMagnetic` under `prefers-reduced-motion: reduce` — pointermove does not set `--mx`/`--my` | `useMagnetic` | CSS vars remain `0px` after pointermove event |
| 6 | `useMagnetic` under `pointer: coarse` media — pointermove does not set `--mx`/`--my` | `useMagnetic` | CSS vars remain `0px` |
| 7 | `useMagnetic` under `pointer: fine` + no reduced-motion — pointermove sets `--mx`/`--my` proportional to distance × strength | `useMagnetic` | CSS vars are non-zero after pointermove |
| 8 | Browser globals (`IntersectionObserver`, `matchMedia`, `window`) are accessed ONLY inside `useEffect` — confirmed by lint (no direct access in hook body outside effect) | All three hooks | Lint passes; no SSR-init access |

---

### T011 — MobileNav (focus-trap + keyboard)

**File:** `src/components/chrome/MobileNav/__tests__/MobileNav.test.tsx`
**Test type:** component (Vitest + RTL) + E2E (Playwright)

**Unit (Vitest + RTL):**

| # | Scenario | Expected outcome |
|---|----------|-----------------|
| 1 | Drawer renders with `aria-hidden="true"` initially | `aria-hidden` is `"true"` before open |
| 2 | After `[data-menu-open]` click: drawer `aria-hidden` becomes `"false"`; trigger `aria-expanded` becomes `"true"` | Correct ARIA state |
| 3 | After `[data-menu-close]` click: drawer `aria-hidden` returns to `"true"` | Drawer closed |
| 4 | Drawer links use `<Link>` to real routes (not `#anchors`) | `href` attributes contain `/destinations`, `/experiences`, `/about`, `/contact` |

**E2E (Playwright — `tests/e2e/navigation.spec.ts`):**

| # | Scenario | Expected outcome |
|---|----------|-----------------|
| 5 | At 390px: Tab from last focusable in drawer wraps to first | Focus stays inside drawer |
| 6 | At 390px: Shift+Tab from first focusable wraps to last | Focus stays inside drawer |
| 7 | `Escape` keypress closes drawer; focus returns to menu button | `aria-hidden="true"` after Esc; menu button has focus |
| 8 | Click any nav link in drawer: drawer closes | Drawer `aria-hidden="true"` after link click |

---

### T012 — Playwright hydration/FOUC probe

**File:** `tests/e2e/theme.spec.ts`
**Test type:** E2E (Playwright)
**This IS the RED-equivalent for the foundation tranche. Must surface real failures before the content tranche starts.**

| # | Scenario | Expected outcome |
|---|----------|-----------------|
| 1 | Navigate to `/` with dark stored in `localStorage` before `goto` | `document.documentElement.getAttribute('data-theme')` is `'dark'` immediately after `page.goto` (before any JS event fires) — no FOUC |
| 2 | Navigate to `/` with light stored | `data-theme` is `'light'` before first paint |
| 3 | Navigate to `/` with system preference = dark (emulate media) | `data-theme` is `'dark'` immediately |
| 4 | Navigate to `/` with system preference = light | `data-theme` is `'light'` immediately |
| 5 | After `goto('/')` in dark: zero console messages matching `/hydration/i` | No hydration-mismatch warnings |
| 6 | After `goto('/')` in dark: zero console messages with level `'error'` | No console errors |
| 7 | Toggle from dark → light → system: each `data-theme` value matches resolution rule | Correct `data-theme` after each click |
| 8 | After toggle to light + hard reload: `data-theme` is `'light'` before paint | Persists across reload |

---

### T015–T022, T024, T026–T027 — Component render-from-props (written in T035 suite)

**File:** `src/components/<Name>/__tests__/<Name>.test.tsx` or batched under `tests/unit/components/`
**Test type:** component (Vitest + RTL)
**Written during T035. Developer should create stub test files (RED) before each component implementation where practical.**

Minimum test per component:

| Component | Required scenarios |
|-----------|-------------------|
| `Hero` | (1) Required props render (eyebrow, title, titleAccent, lede in DOM); (2) primary CTA link has correct `href`; (3) secondary CTA is absent when not in props; (4) `alt` text matches `image.alt` prop; (5) image `onerror` → parent has `data-failed="true"` (mesh fallback path) |
| `ValueCard` | (1) icon, title, body render; (2) `data-magnetic` attribute present on card |
| `ValueProps` | (1) renders exactly N ValueCards from items array; (2) heading renders |
| `DestinationCard` | (1) name, tagline, distance render; (2) link `href` correct; (3) `alt` text correct; (4) `onerror` → `data-failed="true"` |
| `DestinationsGrid` | (1) renders N cards; (2) `limit` prop truncates array to `limit` count; (3) heading/eyebrow render |
| `ExperienceItem` | (1) title, summary, duration render; (2) CTA link correct; (3) `onerror` → `data-failed="true"` |
| `ExperienceShowcase` | (1) renders N ExperienceItems; (2) heading renders |
| `Stat` | (1) label renders; (2) initial display is "0" (before count-up trigger) |
| `StatsBand` | (1) renders N Stats; (2) optional heading renders when supplied |
| `PromoBand` | (1) eyebrow, heading, body render; (2) CTA link correct |
| `TestimonialCard` | (1) quote, author, role render; (2) avatar `alt` text when supplied |
| `Testimonials` | (1) renders N TestimonialCards; (2) heading renders |
| `Marquee` | (1) `aria-hidden="true"` present; (2) items render |
| `PageHero` | (1) title, subtitle render; (2) image `alt` when supplied; (3) renders without image (optional) |
| `RichTextSection` | (1) heading renders; (2) `body` HTML is rendered as HTML content (not escaped text — use `innerHTML` check) |
| `SiteHeader` | (1) nav links point to real routes (`/destinations`, `/experiences`, `/about`, `/contact`); (2) brand mark present |
| `SiteFooter` | (1) footer nav columns render; (2) links present |

---

### T023a — NewsletterCTA RED tests

**File:** `src/components/NewsletterCTA/__tests__/NewsletterCTA.test.tsx`
**Test type:** component (Vitest + RTL)
**Must be RED before T023b begins.**

| # | Scenario | Expected outcome |
|---|----------|-----------------|
| 1 | Render with required props: heading, body, placeholder, buttonLabel are in DOM | All four props render |
| 2 | Submit with empty input: `aria-invalid="true"` on input; error text "Email is required." visible; input receives focus | Correct error state |
| 3 | Submit with `"notanemail"`: `aria-invalid="true"`; error text "Enter a valid email address." | Correct error message |
| 4 | Submit with `"user@example.com"`: form element is hidden; `.nl-success` element is visible | Success state |
| 5 | Submit with valid email: success element has `role="status"` attribute | Live region correct |
| 6 | Success element receives programmatic focus after valid submit | Focus management correct |
| 7 | `input` event while `aria-invalid="true"`: attribute removed from input; error element hidden | Clears error on type |
| 8 | Submit handler never calls `window.fetch` (spy asserts 0 calls) | Never fetches (ADR-0006) |
| 9 | Submit handler never calls `window.XMLHttpRequest` | Belt-and-suspenders no-network assertion |

---

### T023b — NewsletterCTA GREEN

No new test file. T023a tests must all pass. REFACTOR: ensure validation regex matches the POC exactly (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).

---

### T028a — ContactForm RED tests

**File:** `src/components/ContactForm/__tests__/ContactForm.test.tsx`
**Test type:** component (Vitest + RTL)
**Must be RED before T028b begins.**

| # | Scenario | Expected outcome |
|---|----------|-----------------|
| 1 | Render: heading, intro, nameLabel, emailLabel, messageLabel, buttonLabel in DOM | All six props render |
| 2 | Submit with all fields empty: name field gets `aria-invalid="true"` + error copy visible | First-field error |
| 3 | Submit with name filled, email empty: email field gets `aria-invalid="true"` | Field-specific validation |
| 4 | Submit with name + message filled, email = `"bad"`: email `aria-invalid="true"` + "Enter a valid email address." | Email format validation |
| 5 | Submit with all fields valid: success state visible; `role="status"` present | Success state |
| 6 | `input` event on a field with `aria-invalid="true"`: that field's `aria-invalid` removed | Clears per-field error |
| 7 | Submit handler never calls `window.fetch` | Never fetches (ADR-0006) |
| 8 | Each field has `aria-describedby` pointing to its error element's `id` | a11y wire-up |
| 9 | Error elements have `role="alert"` | Live region correct |

---

### T028b — ContactForm GREEN

No new test file. T028a tests must all pass. REFACTOR: ensure field-level focus management on first invalid field is consistent with the newsletter pattern.

---

### T033 — Playwright fidelity gate

**File:** `tests/e2e/fidelity.spec.ts`
**Test type:** E2E (Playwright `toHaveScreenshot`)

| # | Scenario | Config |
|---|----------|--------|
| 1–10 | 5 routes × 2 viewports (390, 1440): light theme | `maxDiffPixelRatio: 0.05`; animations disabled via `page.emulateMedia({ reducedMotion: 'reduce' })`; await `document.fonts.ready`; wait for network idle for Unsplash OR intercept + abort Unsplash for deterministic mesh-fallback baseline |
| 11–20 | 5 routes × 2 viewports (390, 1440): dark theme | Same stabilization |
| 21 | Home `/` dark at 1440: gooey blob section is present in DOM (structural check) | `await expect(page.locator('.flux-field')).toBeVisible()` — structure gate separate from pixel diff |
| 22 | `/` at 390 mobile: `MobileNav` button visible; desktop nav not visible | Responsive structure sanity |

**Baseline generation note:** Generate baselines on first run with `--update-snapshots` on a consistent machine. Commit baselines. CI runs without `--update-snapshots`.

**Image network note:** Stub Unsplash requests (`page.route('https://images.unsplash.com/**', route => route.abort())`) to force CSS mesh fallback for deterministic baselines. This also verifies TC-49 (fallback path) as a side-effect.

---

### T034 — Zero-Sitecore assertion

**File:** `tests/unit/invariants/no-sitecore-deps.test.ts`
**Test type:** unit (Vitest — file-system assertion)

| # | Scenario | Expected outcome |
|---|----------|-----------------|
| 1 | Read `static/package.json` dependencies + devDependencies: no key starts with `@sitecore-content-sdk/` or `@sitecore-` | Zero Sitecore packages |
| 2 | Glob all `.ts`/`.tsx` under `static/src/`: no `import` or `require` contains `@sitecore-content-sdk` or `@sitecore-` | Zero Sitecore imports |
| 3 | Test fails when `package.json` is mutated to include `"@sitecore-content-sdk/core": "^1.0.0"` (test the test) | RED when invariant broken |

---

### T035 — Vitest component render-from-props suite

**File:** `tests/unit/components/` (or co-located `__tests__/` per component)
**Test type:** component (Vitest + RTL)

Per-component test requirements are listed in the T015–T024/T026–T027 table above. Additional cross-cutting checks:

| # | Scenario | Expected outcome |
|---|----------|-----------------|
| 1 | Every content-bearing component (`src/components/`) renders without throwing from the minimum valid prop set | No runtime errors from any component |
| 2 | No component file has a bare `import` from `src/ui/` at root level that would pollute the `generate-map` scanner (checked via lint or snapshot of import graph) | Infra stays in `src/ui/` |
| 3 | `DestinationsGrid` with no `limit` prop renders all items; with `limit=3` renders exactly 3 | Limit prop works |

---

### T036 — Vitest theme-provider + form-logic suite

**File:** `src/ui/__tests__/theme-provider.test.ts` (T006a file; T036 is the final GREEN pass) + `tests/unit/theme/` for integration-level checks
**Test type:** unit (Vitest)

T006a already covers the core store logic (TC-04 through TC-08). Additional assertions for T036:

| # | Scenario | Expected outcome |
|---|----------|-----------------|
| 1 | `useTheme()` hook throws or returns error when consumed outside `ThemeProvider` | Graceful error (not a silent wrong value) |
| 2 | `ThemeProvider` server-side snapshot (`getServerSnapshot`) returns `'system'` — never accesses `localStorage` or `window` | Server snapshot is deterministic |
| 3 | `system` resolves correctly on the server (snapshot = `'system'`; no crash in SSR context) | No `window is not defined` |
| 4 | Form validation regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` accepts `"user@example.com"` and rejects `"notanemail"`, `"@example.com"`, `"user@"` | Regex contract matches POC exactly |

---

### T037 — Accessibility + contrast AA

**File:** `tests/e2e/a11y.spec.ts`
**Test type:** E2E (Playwright + `@axe-core/playwright`)

| # | Scenario | Expected outcome |
|---|----------|-----------------|
| 1–5 | axe scan: 5 routes in dark theme | Zero serious/critical violations each route |
| 6–10 | axe scan: 5 routes in light theme | Zero serious/critical violations each route |
| 11 | Dark theme: `getComputedStyle` on `<body>` text — computed `color` vs `backgroundColor` WCAG contrast ≥4.5:1 | Target: ~17.82 (UI spec §6) |
| 12 | Light theme: same check | Target: ~16.24 |
| 13 | Dark theme: `.btn-primary` (or `.btn` with primary accent): computed `color` vs `backgroundColor` contrast ≥4.5:1 | `--accent-500` `#c64bff` on `--bg` `#060410` → target 5.63 |
| 14 | Light theme: same accent button check | `--accent-500` `#7a1fd6` on `--bg` `#f6f2ff` → target 5.49 |
| 15 | `prefers-reduced-motion: reduce` via `page.emulateMedia({ reducedMotion: 'reduce' })`: all `[data-reveal]` elements have class `in` immediately after page load | 27/27 revealed (per click-targets.md) |
| 16 | Reduced motion: `[data-countup]` stat values equal their `data-countup` attribute value (not "0") | Count-up shows final, not animating |
| 17 | Reduced motion: `.marquee-track` has `animation-play-state: paused` or `animation: none` | Marquee frozen |
| 18 | Home: keyboard-only navigation reaches all interactive elements (tab order) with visible focus ring | No focus traps outside MobileNav |
| 19 | `NewsletterCTA` error state: `role="alert"` element is announced (present in DOM with content) after empty submit | Correct live region |
| 20 | Decorative images (`aria-hidden="true"`): blob field, mesh, stars all have `aria-hidden` | No extraneous alt-text |

---

### T039–T040 — Content-model spec (non-TDD verification)

**Verification method:** manual review against TC-50 through TC-54 (§ 4b above) and US-4 ACs (PRD §6). No automated test file. The review pass confirms:

1. Every leaf component has a row in the spec table with `componentName` matching the folder name exactly.
2. Every container has a folder template + child template row (not multilist).
3. Nav is documented as excluded (not silently missing).
4. All 5 page compositions are present with `SITE_COLLECTION_NAME=cosmos`, `SITE_NAME=aphelion` path prefix.
5. The spec is dependency-ordered top-to-bottom (site collection → site → templates → content items → pages → publish).

## Handoff Metadata
- Canonical run manifest: `project-planning/workflow/run-20260609T150924Z.json`
- Source PRD: `project-planning/PRD/prd-000.md`
- Source architecture: `project-planning/architecture/architecture-20260609T150924Z.md` (+ ADR-0002..0008; no baseline.md yet)
- Winning UI: `project-planning/ui-design/ui-design-20260609T150924Z-v5b.md` + POC `pocs/poc-v5b-prd000/`
- QA enrichment by: QA Specialist (07), 2026-06-10 — `task_breakdown_style` flipped to `tdd`; § 4b, § 9, § 10 populated; 3 RED/GREEN splits (T006a/b, T023a/b, T028a/b); 54 test cases defined; no standalone qa-report.md produced (enriched breakdown is sufficient).
- Recommended next command: `/implement`
- Standalone qa-report.md: not produced — enriched task breakdown is the complete test contract.
