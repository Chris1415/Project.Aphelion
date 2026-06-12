# Compositional layout toolkit (Container / Row Splitter / Column Splitter)

> **UPDATE — nothing to build in Sitecore.** `Container`, `RowSplitter`, and `ColumnSplitter`
> are **standard SXA components**. The renderings, parameters templates, and placeholder
> settings already ship with SXA Headless in your tenant (under *Page Structure*). The earlier
> version of this guide had you build custom versions — **disregard that**; the head-app
> components have been **taken over from the official `xmcloud-starter-js`**
> (`examples/kit-nextjs-article-starter/src/components/sxa`, Content SDK v2 / App Router) so
> they bind to the standard renderings as-is.

## What was done (head-app side)

`src/components/{Container,RowSplitter,ColumnSplitter}/*.tsx` are now the standard SXA
implementations — server components that render `AppPlaceholder`, import the **server**
`componentMap` directly, and forward the injected `page` (build-trap #7). They honor the
standard SXA params and placeholder keys:

| Component | Key params | Placeholder key(s) |
|---|---|---|
| `Container` | `DynamicPlaceholderId`, `GridParameters`, `Styles`, `BackgroundImage` | `container-{id}` |
| `RowSplitter` | `EnabledPlaceholders` (`"1,2,…"`), `Styles{N}` | `row-{n}-{*}` |
| `ColumnSplitter` | `EnabledPlaceholders`, `ColumnWidth{N}`, `Styles{N}` | `column-{n}-{*}` |

## What you do in Sitecore

1. **Nothing to create.** Use the standard **Container / Row Splitter / Column Splitter**
   renderings already available to the `aphelion` site (SXA *Page Structure* category in
   Pages / Available Renderings). If they aren't in the site's Available Renderings yet, add
   them (they exist as standard renderings — you're just enabling them for the site).
2. In **Pages**, drop a `Container` (or splitter) onto a page, then drag any of your registered
   renderings (`Promo`, `RichTextSection`, `DestinationsGrid`, …) into its placeholder(s).
3. For splitters, set `EnabledPlaceholders` (e.g. `1,2` for two columns/rows) and, for columns,
   the `ColumnWidth{N}` grid classes — exactly as you would on any standard SXA site.
4. Publish the page.

## Verify

After you place one and drop a child in, say **check** — I'll confirm the child **binds** (not
"unknown component", which would mean the server/client-map split — already handled in code).

## The two container philosophies (reference)

| | **Children resolver** (`DestinationsGrid`) | **Standard splitter** (`Container`/`Row`/`Column`) |
|---|---|---|
| Build | child + folder templates + resolver | nothing — standard SXA |
| Authoring | manage child content items | drag-drop renderings on canvas |
| Children are | reusable **data** (Marquee reuses them) | placed **renderings**, page-bound |
| Use for | homogeneous, reusable lists | freeform page-section composition |
