# Aphelion — pick-up for next session (handoff 2026-06-16)

## Test foundation — ADDED 2026-06-17 ✅ (head-app now has its OWN tests)
The static app's suite did NOT cover the port layer (SDK field binding); the head app had **zero** tests. Fixed:
- **`npm test`** → 25 Vitest + RTL unit tests (12 files) against **real captured Edge fixtures** (`src/test/fixtures/*.layout.json`, harvested from `/Group-1-Test`). Covers 13 components' binding (flat Shape-A + integrated-GraphQL Shape-C), chrome (Header/Footer), and empty-state for the 4 unauthored containers.
- **`npm run test:e2e`** → Playwright live-smoke (`tests/e2e/smoke.spec.ts`), 2 viewports × 6 routes; asserts chrome + no MissingComponent + clean console; unauthored 404 routes auto-skip. Covers splitters + chrome live.
- **Re-capture fixtures** after authoring new content: dev server up → `GET /api/layout-debug?path=/<route>` (dev-only route; 404s in prod) → save under `src/test/fixtures/`.
- Gate is green: lint + build (46 pages) + 25 unit + smoke all pass on `prd-001`.
- **Still thin (by design — no real content yet):** ExperienceShowcase / Testimonials / ContactDetails / Marquee have empty-state tests only; splitter child-binding (build-trap #7) is unverified. Strengthen these once the containers are authored + recaptured.
- Trap caught + fixed: colocated `*.test.tsx` were being registered as components by `generate-map` (build-trap #5) → `componentMap.exclude` globs added in `sitecore.cli.config.ts`.

## Where we are — head-app build is DONE + deploy-ready ✅
- **Production build passes** (`npm run build` → component map + 45 prerendered pages). tsc + lint clean.
- All 16 components + chrome (`Header`/`Footer` via partial designs) + `PartialDesignDynamicPlaceholder` + Integrated GraphQL + the editing-UX hardening are in and working.
- **Inline editing works** (after the hydration fix).
- No more head-app code is needed to finish the site — what's left is **Sitecore authoring + page composition + deploy**.

## Verified live now
- ✅ Chrome (`site-header`/`site-footer`) renders on every route.
- ✅ `/Group-1-Test` scratch page: content + chrome, no missing-component errors.
- ⏳ Home `/`: exists but **empty** (chrome only — no body renderings placed).
- ⏳ `/destinations`, `/experiences`, `/about`, `/contact`: **404 — not created yet**.

## Remaining tasks (in order) — follow `BUILD-THE-REAL-SITE.md`

1. **Finish the remaining containers** (Phase 1: paste query → clear `Rendering Contents Resolver` → author content). Queries + content in `sitecore-integrated-graphql-all-containers.md`:
   - [ ] `ExperienceShowcase`
   - [ ] `Testimonials`
   - [ ] `ContactDetails`
   - [ ] `Marquee` (datasource = the `Destinations` folder; nothing to author)
   - (`DestinationsGrid` / `ValueProps` / `StatsBand` already structurally done — just need real content.)

2. **Author real content** — replace the junk test values (`13213213`, `321321`, …) everywhere:
   - Container content → `sitecore-integrated-graphql-all-containers.md`
   - Leaf + PageHero content → `sitecore-content-values.md`

3. **Compose the 5 real pages** (rendering stacks per route in `BUILD-THE-REAL-SITE.md` Phase 3):
   - [ ] **Home `/`** — Promo → Marquee → ValueProps → DestinationsGrid (GridLimit=3) → ExperienceShowcase → StatsBand → PromoBand → Testimonials → NewsletterCTA
   - [ ] **/destinations** — PageHero → DestinationsGrid (GridLimit=0) → NewsletterCTA  *(create the route item)*
   - [ ] **/experiences** — PageHero → ExperienceShowcase → StatsBand → NewsletterCTA
   - [ ] **/about** — PageHero → RichTextSection → ValueProps → Testimonials
   - [ ] **/contact** — PageHero → ContactForm → ContactDetails

4. **Publish** everything → say **check** so I probe every route (bindings / chrome / content / no "unknown component").

5. **Deploy to Vercel** — head app is build-verified. I handle the head-app/config side; you provide/confirm the Vercel project (env = the same Edge contextId).

## Recommended starting point tomorrow
Do **Home end-to-end first** (finish its containers' content + compose the Home stack) so we validate the full real composition on one route, then replicate for the four inner routes.

## Reference docs (all in project-planning/)
- `BUILD-THE-REAL-SITE.md` — master step-by-step (Phases 1–5)
- `sitecore-integrated-graphql-all-containers.md` — container queries + content
- `sitecore-content-values.md` — leaf + PageHero content
- `PLAYBOOK-new-inline-editable-container.md` — recipe for any new container

## State note
Dev server left running on `localhost:3000`. Branch `prd-001`. Latest commit pushed.
