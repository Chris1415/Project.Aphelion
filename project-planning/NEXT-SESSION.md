# Aphelion — pick-up for next session (handoff 2026-06-16)

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
