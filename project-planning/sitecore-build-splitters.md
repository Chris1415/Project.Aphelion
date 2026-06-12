# Sitecore build guide — Compositional layout toolkit (placeholders)

**Scope:** the *other* container philosophy — generic **layout primitives** that expose a
**placeholder** authors fill with **any** registered rendering in Pages (drag-drop), as opposed
to the typed Children-resolver lists (`DestinationsGrid`, see `sitecore-build-containers.md`).

**Start with `Container` (one placeholder).** It proves the placeholder handshake end-to-end;
Row/Column splitters are the same pattern with more named placeholders and I'll add them right
after this verifies.

> **This is genuinely new ground for Aphelion (build-trap #7).** A nested placeholder only works
> if the host renders the SDK's **`AppPlaceholder`** as a **server component** and forwards the
> `page` + **server** `componentMap` that the parent injects. I've already built `Container`
> that way (verified against the SDK source: `AppPlaceholder.js:46` injects them into server
> children only). So if a child you drop in renders as **"unknown component"**, that's the
> server/client-map split — tell me and I'll fix the head-app side; it is *not* something you
> mis-built in Sitecore.

The head-app `Container` component is built, registered **server-side**, and type-checks.
`componentName` **`Container`** is ready to bind. You build the Sitecore side below.

---

## How the placeholder handshake works (read once)

- The head app renders a placeholder with a fixed requested name: **`container-1`**.
- In Sitecore you create a **Placeholder Settings** item whose key is the **dynamic** form
  **`container-{*}`**. The SDK turns `container-{*}` into the regex `^container-\d+$`, which
  matches the requested `container-1`. (This is why the key has `{*}`, not a literal number.)
- **Allowed Controls** on that Placeholder Settings item = the whitelist of renderings an author
  may drop into the container. This is your governance lever (the thing the typed resolver gives
  you for free, you set explicitly here).

---

## Step 1 — Placeholder Settings item

Create a **Placeholder Settings** item (location varies by tenant — typically under
`/sitecore/content/<tenant>/aphelion/Presentation/Placeholder Settings/` or
`/sitecore/layout/Placeholder Settings/Project/cosmos/`):

| Field | Value |
|-------|-------|
| **Item name** | `container-1` (friendly) |
| **Placeholder Key** | `container-{*}` &nbsp;←&nbsp; **must include `{*}`** |
| **Allowed Controls** | the renderings authors may place here — start permissive: `Promo`, `PromoBand`, `RichTextSection`, `NewsletterCTA`, `ContactForm`, `DestinationsGrid` (add/remove to taste) |

## Step 2 — Rendering item: `Container`

**Path:** `/sitecore/layout/Renderings/Project/cosmos/Container`
Create a **JSON Rendering**:

| Field | Value |
|-------|-------|
| **Component Name** | `Container` (verbatim) |
| **Datasource Template** | *(none — Container is pure layout; leave datasource location/template empty)* |
| **Rendering Contents Resolver** | *(none)* |
| **Placeholders** | reference the **`container-1`** Placeholder Settings item from Step 1 (this is what tells Pages the rendering exposes that placeholder) |
| **Parameters Template** | *(optional)* — only if you want a `Styles` field for CSS hooks |

## Step 3 — Available Renderings

Add `Container` to the site's **Available Renderings** so it can be placed on a page in Pages.

## Step 4 — Compose in Pages

1. Open your test page in **Pages**.
2. Add the **`Container`** rendering to the main placeholder (`headless-main`).
3. The Container now shows an **empty placeholder** drop zone. Drag any allowed rendering into
   it (e.g. a `Promo`, then a `RichTextSection`).
4. Author each child's datasource as usual (the child renderings behave exactly as they do
   placed directly — including the editing-safe field behavior we fixed earlier).

## Step 5 — Publish

Publish the Placeholder Settings item, the `Container` rendering, and the page. Then say
**check** — I'll render it and confirm:
- the Container's placeholder resolves,
- each child you dropped in **binds and renders** (NOT "unknown component" — that's the trap-#7
  proof),
- nesting depth works (a child inside the container renders its own fields/placeholders).

---

## What comes after Container verifies

Same server-component + `AppPlaceholder` pattern, just more named placeholders:

| Primitive | Placeholders (requested → settings key) | Notes |
|-----------|------------------------------------------|-------|
| **RowSplitter** | `row-1`, `row-2`, … → `row-{*}` each | N stacked full-width drop zones; row count via a parameter |
| **ColumnSplitter** | `column-1`, `column-2`, … → `column-{*}` each | side-by-side; column count + widths via parameters (e.g. `EnabledPlaceholders`, `ColumnWidth1..N`) |

I'll build those head-app components (each a server component forwarding `page`/`componentMap`)
once `Container` is green, and extend this guide with their Placeholder Settings + parameters.

---

## The two container philosophies, side by side (for reference)

| | **Children resolver** (`DestinationsGrid`) | **Placeholder** (`Container`/splitters) |
|---|---|---|
| Build | child + folder templates + resolver | Placeholder Settings + a generic rendering |
| Authoring | manage child content items | drag-drop renderings on canvas |
| Children are | reusable **data** (Marquee reuses them) | placed **renderings**, page-bound |
| Guardrail | template-enforced (cards only) | Allowed Controls list (explicit) |
| Use for | homogeneous, reusable lists | freeform page-section composition |
