# ADR-0011: Navigation via the component-level navigation pattern (server L1 + lazy L2 Route Handler)

## Status

Accepted

## Context

The header/footer nav was deliberately excluded from the content model (ADR-0005) — it is not a datasource-backed rendering. In the static app it was a hard-coded tree; in the head app it must reflect the real Sitecore route tree. The SXA Navigation Content Resolver is awkward; the proven approach (per `custom_content-sdk-component-level-navigation`) is component-level GraphQL: fetch root + L1 server-side with a `hasChildren` flag, lazy-load L2+ per branch on hover. Client-triggered data fetches must use a Route Handler, never a Server Action (a Server Action auto-fires `router.refresh()` → wipes client state → endless flicker, per `custom_nextjs-route-handler-vs-server-action`).

## Decision

Build navigation with the component-level navigation pattern: server-rendered L1 (root + first level, `hasChildren`), and lazy L2 loaded per-hover via a **Route Handler at `/api/nav-children`** (NOT a Server Action). Dropdown is flush with the parent `<li>` (no `mt-*` gap → no flicker), with a ~150ms hover intent-delay. The `/api/nav-children` Route Handler is **production infrastructure** and survives to deploy — only `/api/layout-debug` is removed at ship (NavigationTitle override + NavigationFilter respected per the skill).

## Consequences

- **Easier:** real route-tree-driven nav without fighting the content resolver; no flicker; scales to any depth.
- **Easier:** the same Route-Handler-not-Server-Action rule applies to any future client-triggered read.
- **Harder:** a separate route handler + client lazy-load logic to maintain; nav "feel" (no flicker) is partly an operator-eyeball smoke check, not fully automatable.

## Date

2026-06-11
