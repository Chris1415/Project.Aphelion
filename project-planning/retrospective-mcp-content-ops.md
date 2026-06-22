# Dogfood retrospective — programmatic content ops on a Content SDK head app (2026-06-18 → 06-20)

**Run:** Aphelion `/Showcase` page. Exercised, end-to-end and on a **live tenant**, the capability to
build a head-app's **content** (not code) with **no manual Pages clicking**: create a page, place all
renderings, author every datasource + folder-of-children, generate + upload media, and publish — via the
**Marketer MCP** (SitecoreAI Agent API) for authoring and the **official SitecoreAI REST/GraphQL APIs**
for publish + media. Purpose: prove + document our general capability to *quickly* stand up head-app
content, and capture every probe/issue as reusable docs.

This is the **dogfood capture**. Full API contracts live in memory
`reference_sitecore_marketer_mcp_content_authoring`; this doc records what was exercised, where time was
burned, and the **ready-to-apply skill/rule patches** so the next build doesn't re-derive any of it.

---

## What worked (the reusable pipeline)

1. **Author** via Marketer MCP: `create_page` → `add_component_on_page` (×N) → `update_fields_on_item`
   (leaf + folder fields) → `create_content_item` (folder children). All on the live tenant.
2. **Generate media** locally: `scripts/img-gen/` — Playwright renders parameterized CSS/SVG "nebula"
   art (one distinct hue per card). On-brand abstract cosmos art with **no AI-image model** needed.
3. **Upload + link** via official Authoring GraphQL: `uploadMedia` (presigned) → multipart POST →
   `updateItem`. `scripts/sitecore-upload-link.mjs`.
4. **Publish** via official Publishing REST: `scripts/sitecore-publish.mjs` (Smart default / `--mode
   Republish`).
5. **Verify** in a real browser (Playwright) against the local dev server (`npm run dev`, reads Preview).

Result: `/Showcase` with 10 renderings, 6 leaf datasources, 4 integrated-GraphQL container folders + 16
children, and 11/11 images rendering live. Screenshots in `storage/telemetry/showcase-*.jpeg`.

---

## Issues hit + probes that resolved them (the expensive bits)

- **MCP has no publish/upload tool.** The Marketer MCP authors content only. Publish + media upload must
  use the official REST/GraphQL APIs (same automation client).
- **Publishing create-job body shape.** `GET /jobs` returns a *flat* `options.xmc.{type,mode,locales}`;
  `POST /jobs` needs *nested* `options.xmc.site.{mode}` + `locales` (flat → 500). Confirmed against the
  official OpenAPI (`api-docs.sitecore.com/_bundle/sai/publishing-api/index.yaml`). `mode` =
  Republish | Incremental | Smart. `xmc.site` = whole-**environment** (no site-id field by design).
- **uploadMedia is 2-step.** `uploadMedia(input)` returns a **`presignedUploadUrl`**
  (`/sitecore/api/v1/authoring/media/upload?token=…`); then **multipart POST** the binary (`file` field)
  **with Bearer still required** (PUT → 405; no-auth → login HTML). `itemPath` is **media-library-RELATIVE,
  no leading slash** (`Project/cosmos/aphelion/foo`; a leading `/` errors). Response gives `{Id}` =
  the media GUID → use directly in `<image mediaid="…">` via `updateItem`.
- **Media renders only after publish.** Pre-publish the `<img src>` is well-formed but the delivery
  handler 404s. **A direct CLI GET of a media URL returns a ~2818B HTML stub even for working media** —
  so it's a false negative; **verify image loading in a real browser, never curl/Invoke-WebRequest.**
- **Publish failures are env-wide + chronic.** Smart re-attempts *all* modified-since items across every
  site on the env; the operator's own full Republish failed **592** items (mostly `solo-website`). Don't
  attribute publish `itemsFailed` to your items — check `GET /jobs/permissions` (`canCreate`) for scope.
- **Integrated-GraphQL folder field names must match the query aliases EXACTLY, including spaces.** The
  `ExperienceShowcase` folder field was `Heading Accent` (with a space) but the query read
  `HeadingAccent` → silent non-bind. (Reinforces the existing layout-field case-sensitivity rule.)
- **dev server reads Preview** → unpublished *content* renders locally immediately (great for verify),
  but *media* still needs a publish (see above).
- **Cloud `get_page_screenshot` / editing-render uses whatever rendering host the tenant has configured**
  — for an UNDEPLOYED head app it falls back to a different deployed app (wrong chrome + "missing layout
  implementation" boxes). Not a valid visual of your app; use the local dev server.
- **MCP authoring mechanics:** `add_component_on_page` appends in call order, auto-creates a local
  datasource of the rendering's datasource template, body placeholder = `headless-main`, chrome comes
  from the partial design (don't place it); serialize layout writes (concurrent → dropped renderings).
  `create_content_item` honors **`__Sortorder`** in `fields` → deterministic child order under concurrency.
  Link raw = `<link linktype="external" url="/path" text="…" .../>`; Image raw = `<image mediaid="GUID"/>`
  (external URLs unsupported). Item names obey the ItemNameValidation regex (no apostrophes in the name).

---

## Reusable tooling delivered (this repo, `scripts/`)

- `sitecore-publish.mjs` — official Publishing REST; `--mode Smart|Republish|Incremental`.
- `sitecore-upload-link.mjs` — official `uploadMedia` (2-step) + `updateItem` link; map of file→item→field.
- `img-gen/nebula.html` + `generate.mjs` — Playwright nebula generator (parameterized hue/seed/size).

These are tenant/aphelion-shaped (hardcoded host + item GUIDs) — generalize (env-driven host, arg-driven
item map) when promoting to a shared head-app toolkit.

---

## Documentation status + proposed patches

| Learning | Memory | Skill home (proposed) | Status |
|---|---|---|---|
| Marketer MCP authoring surface (add_component/__Sortorder/raw formats/headless-main) | ✅ | NEW skill `sitecoreai-content-authoring` (or section in `marketplace-sdk-xmc`) | proposed |
| Publishing `POST /jobs` nested body + modes + chronic-failures + permissions | ✅ | **patch `sitecoreai-publishing`** (fill the `{/* job config */}` gap) | proposed |
| `uploadMedia` 2-step presigned multipart POST + itemPath-relative + verify-in-browser | ✅ | **patch `sitecoreai-graphql-schemas`** (add the upload *mechanism*, not just the mutation name) | proposed |
| Agent can author+publish+upload programmatically (the manual-operator-runbook is now optional) | ✅ | **patch `custom_content-sdk-website-build-flow`** (new "programmatic content ops" path) | proposed |
| Verify media in browser, not curl; field names match query aliases incl. spaces | ✅ | guardrail note in the publishing + resolver-patterns skills | proposed |

**Skills are NOT tracked in this repo** — canonical source is the external `Chris1415/sitecore-skills-pocs`
(cloned at `C:\Projects\agentic\sitecore-skills`). Applying the patches there + reinstalling the plugin is
an **on-demand** step (operator-gated). The exact patch content is the memory contract above.

### Biggest reuse lever
`custom_content-sdk-website-build-flow` currently frames content authoring as a **manual operator runbook
"until Developer MCP."** This run proves the MCP + official APIs already cover it. The build-flow should
gain a **"programmatic content ops"** branch: after components are ported + the schema exists, an agent
can compose pages, author datasources/children, generate+upload media, and publish — leaving the operator
to approve, not click.

---

## Open / deferred (next build)
- 3 container renderings still don't exist (`Marquee` / `Testimonials` / `ContactDetails`) — schema/SCS
  work the MCP can't do (templates/renderings/resolvers). Once they exist, place+author via MCP as today.
- Vercel deploy.
- Generalize the `scripts/` toolkit (env-driven host, arg-driven item map) into a shared head-app kit.
