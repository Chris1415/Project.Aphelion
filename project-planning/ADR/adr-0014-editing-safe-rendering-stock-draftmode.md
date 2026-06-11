# ADR-0014: Editing-safe rendering via stock App-Router draftMode() + getPreview/getDesignLibraryData

## Status

Accepted

## Context

The head app ships into XM Cloud — content authors edit it in Sitecore Pages. Components that render cleanly on a plain `localhost` hit can still crash inside the editor (missing draftMode branch, null-deref on an unpopulated field while authoring, component-map miss in the editing API). PRD-000's static app had no editor surface; Act 3 introduces it (US-5). The Content SDK App Router provides a stock editing path; inventing a custom one is unnecessary risk.

## Decision

Use the **stock App Router editing path**: `draftMode()` to detect preview, and `getPreview` / `getDesignLibraryData` resolved from `searchParams` in the catch-all route — no custom editing route or bespoke preview wiring. Every ported component must **render safely under preview**: defensive optional-chaining to the deepest field leaf (empty-state shapes — `Image: {value:{}}`, `Link: {value:{href:""}}`) so an unpopulated field while authoring renders an empty state, never a thrown error. The component-map must resolve every `componentName` in the editing API (same canonical registry, ADR-0010).

## Consequences

- **Easier:** authors can edit in Pages without crashes; no custom editing infrastructure to maintain; the preview path is whatever the SDK ships (upgrade-safe).
- **Easier:** the defensive-read discipline also hardens production against partially-published content.
- **Harder:** every component carries empty-state optional-chaining even where production content is always populated; a failing editor/preview check is a Major finding (Critical if it crashes the editor) even when the standalone render is clean — so `/test` must exercise the editor surface, not just `localhost`.

## Date

2026-06-11
