# ADR-0002: Split the NEW-site build into PRD-000 (Acts 1–2, no tenant) and PRD-001 (Act 3, live tenant)

## Status

Accepted

## Context

The Content SDK NEW-site flow is a three-act play: Act 1 (plain-React static app), Act 2 (derive content-model spec + operator builds the tenant), Act 3 (scaffold head app + port to SDK fields against live Edge + deploy). Acts 1–2 carry **no Sitecore code and no tenant dependency**; Act 3 is entirely tenant-gated. The Last-Edit-Trail post-mortem established: *don't bundle ship-ready work with tenant-gated work in one PRD — the gated half blocks the ready half.* Aphelion is a dogfood; tenant readiness should not block the design/static deliverable.

## Decision

Scope **PRD-000** to Acts 1–2: the static reference app + `sitecore-content-model.md`. Scope **PRD-001** (a later run) to Act 3: head-app scaffold, SDK field-component port against the live tenant, and Vercel deploy. The operator's CMS build (Act 2 gate) sits at the boundary between the two PRDs. PRD-001 is expected to branch off `prd-000` (stacked) until merged.

## Consequences

- **Easier:** PRD-000 is self-contained, fully verifiable, and shippable without any tenant or Edge contextId. The static app + spec can be reviewed and "done" independently. The tenant-gated risk is quarantined to PRD-001.
- **Easier:** clean operator stop gate (the CMS build) falls naturally between two PRDs rather than mid-run.
- **Harder:** two pipeline runs instead of one; PRD-001 must handle a stacked branch and a clean rebase once `prd-000` merges.
- **Harder:** the end-to-end "live site" outcome is only realized after PRD-001 — PRD-000 alone produces a reference app, not a deployed site.

## Date

2026-06-09
