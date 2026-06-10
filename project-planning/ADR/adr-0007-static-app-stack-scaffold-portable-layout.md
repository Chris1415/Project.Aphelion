# ADR-0007: Static-app stack, scaffold, and portable directory layout

## Status

Accepted

## Context

PRD-000 (Acts 1–2) builds a standalone plain-React reference app whose components must later port 1:1 into a Content SDK head app (PRD-001 / Act 3). The stack and file layout chosen now determine how mechanical that port is, and must enforce the zero-`@sitecore-content-sdk/*` invariant. Rule `50-scaffold` forbids hand-writing `package.json` (pinned versions drift past the cutoff).

## Decision

- Scaffold the static app with the canonical **`create-next-app`** (App Router, TypeScript, Tailwind v4) at `products/head-application/aphelion/static/` — run literally per rule `50-scaffold`. **NOT** `create-content-sdk-app` (that is PRD-001's scaffold).
- Each reusable component is a self-contained `src/components/<Name>/` folder (component + plain-prop types co-located) so it ports 1:1 into a head-app `src/components/<X>/` later.
- **Theme/UI infrastructure and shared utilities live in `src/ui/` (and `src/lib/`), never `src/components/`** — in the head app, `sitecore-tools generate-map` auto-scans `src/components/` and would register infra as a rendering (per `custom_content-sdk-component-naming-traps`). Designing the boundary now keeps the port clean.
- The zero-`@sitecore-content-sdk/*` invariant is enforced (no such import anywhere in `static/`); standard `next build` (NOT `output: 'export'`).

## Consequences

- **Easier:** the Act-3 port is a mechanical per-component move + field-component swap; infra never pollutes the future component map; versions are scaffold-pinned, not guessed.
- **Easier:** the static app is handable to any frontend dev with no Sitecore knowledge.
- **Harder:** developers must respect the `src/ui` vs `src/components` split from day one even though the static app has no generate-map scanner yet — discipline paid forward for a trap that only bites in Act 3.

## Date

2026-06-09
