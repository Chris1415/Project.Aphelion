# ADR-0010: A single authoritative componentName registry is the port contract

## Status

Accepted

## Context

In a Content SDK port, the same `componentName` string appears in three independent places: the operator's Sitecore rendering items, the head-app component-map, and the live `getPage` payload. Any mismatch renders `<MissingComponent>` at runtime — silently, and only at real-tenant smoke. The critical review of PRD-001 flagged that the component list was restated ad hoc in several PRD sections with nothing forcing them to agree, making `componentName` a distributed single-point-of-failure.

## Decision

Finalizing `sitecore-content-model.md` produces **one canonical table of every `componentName`** (with its datasource template, resolver, and route placement). That table is the binding contract: the operator's renderings, the head-app component-map registration, and the probed live payload MUST all match it exactly. No component list is authored anywhere else; downstream artifacts reference the table. The Home verify gate checks that every Home `componentName` resolves (no `<MissingComponent>`) against this table.

## Consequences

- **Easier:** three High risks (operator build divergence, component-map mismatch, payload mismatch) collapse into one verifiable artifact; `<MissingComponent>` becomes a table-reconciliation check, not a hunt.
- **Easier:** the operator's tenant-readiness check is "the canonical table is all-green."
- **Harder:** the table must be kept authoritative — any rename touches Sitecore + component-map + the table together; drift in one place reintroduces the failure. Discipline cost, paid to remove a silent runtime failure mode.

## Date

2026-06-11
