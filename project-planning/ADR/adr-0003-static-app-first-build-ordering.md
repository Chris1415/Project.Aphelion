# ADR-0003: Build a separate plain-React static app before scaffolding the head app

## Status

Accepted

## Context

The redesigned NEW-site flow (2026-06-09) defaults to building a standalone static app first, deriving a content model from it, then porting into a head app against a live tenant — explicitly rejecting the mock-first approach that sprawled in the deleted `dogfood-content-sdk` run (sentinel guards across `page.tsx`, `i18n/request.ts`, `not-found.tsx`, `generateStaticParams`, broken `npm run dev`). The static app is a design-fidelity deliverable carrying zero Sitecore cognitive load.

## Decision

Act 1 produces a separate `create-next-app` at `products/head-application/aphelion/static/` with **zero `@sitecore-content-sdk/*` dependencies**, realizing the approved clickdummy with plain props. It is a reference deliverable (not deployed). The head app is **not** scaffolded until Act 3 (PRD-001), after the operator has built + published the tenant — so the head app is real-data-driven from its first line, with no mock scaffolding.

## Consequences

- **Easier:** design fidelity is locked and screenshot-diff-gated before any Sitecore integration; the head app stays 100% stock (no mock seams to maintain).
- **Easier:** the static app is portable — handing it to any frontend dev requires no Sitecore knowledge; theme code ports verbatim.
- **Harder:** components are written once in plain React and then ported to SDK fields — an accepted, deliberate transform cost (the port is where Sitecore expertise is applied and verified against real data).
- **Harder:** requires a real tenant (operator CMS build) before Act 3 can begin — paid up front by design.

## Date

2026-06-09
