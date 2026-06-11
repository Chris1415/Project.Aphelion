# ADR-0005: Content-model-driven component boundary — flat props for leaves, folder-of-children for arrays, nav excluded

## Status

Accepted

## Context

The static app's component prop boundaries ARE the future Sitecore content model — the port to SDK field components is only mechanical if each boundary maps cleanly to a datasource. The critical review surfaced that the naive "one flat prop object per component" rule breaks for container/list components (`DestinationsGrid`, `ValueProps`, `ExperienceShowcase`, `StatsBand`, `Testimonials`), whose props are arrays of child objects — not single flat fields. Navigation is a further exception: it is sourced via a navigation query in Act 3, not from a datasource.

## Decision

Three rules govern every static component's prop design:
1. **Leaf components** expose one flat prop object; each scalar prop maps 1:1 to a single Sitecore datasource field (string→Single-Line, html→Rich Text, image→Image, link→General Link).
2. **Container/list components** map array-of-child props to **child items under a folder datasource** (the canonical SXA Children-resolver pattern, per `custom_content-sdk-resolver-patterns`): the container's datasource is a folder; each child is an item of the child template carrying the card fields; the container's own scalars become fields on the folder item (or rendering parameters). NOT multilist, NOT a repeating field.
3. **Navigation (header + footer)** is excluded from content-model derivation; a static hard-coded tree in the static app, sourced via the component-level navigation pattern in Act 3.

`sitecore-content-model.md` is derived from these rules; any prop that fits none is flagged net-new for the operator.

## Consequences

- **Easier:** the Act-3 port stays a mechanical field-component swap; the content-model spec is unambiguous for the operator's CMS build; the folder-of-children pattern matches real SXA conventions, so the head app uses stock resolvers.
- **Harder:** designers/developers must respect the boundary discipline up front — a "convenient" computed or nested prop now becomes a content-model dead end later; reviewers must apply the nav exception consciously rather than flagging it.
- **Harder:** container components need both a folder datasource and per-child items in Act 2, increasing operator CMS steps versus a single multilist field (accepted: it is the idiomatic Sitecore shape).

## Date

2026-06-09
