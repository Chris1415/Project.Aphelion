# ADR-0012: Home route is a hard verify-gate tranche before the inner routes

## Status

Accepted

## Context

PRD-001 is the first time this product is ported against a live tenant. The whole port chain has real, untested-together unknowns: does the operator's CMS build match the canonical `componentName` table? do the SDK field shapes match the live payload? does the component-map resolve? does the folder-of-children resolver return the expected shape? does nav work? Bundling all 5 routes into one undifferentiated port risks discovering a systemic problem (e.g. a resolver-shape misunderstanding) only after porting everything. The operator's tranche-first preference (test-tranche-first when uncertain) applies.

## Decision

Within the single PRD-001, the **Home route is a hard verify gate**. The tenant is built fully up front (one operator gate, ADR-0009 scaffold follows), but the head-app PORT is staged: port + smoke Home's components FIRST, against binary exit criteria (0 `<MissingComponent>`, 0 empty renderings, component-map resolves, build/lint/tsc, nav functional, axe, motion-ON + client-nav, structural screenshot-diff both themes, + operator visual sign-off). The four inner routes — mechanical repetition of the same already-ported components — begin only after the Home gate passes.

## Consequences

- **Easier:** every port mechanic (leaf, container/folder-of-children, nav, theme, editing-safe) is exercised and verified on Home before commitment; a systemic problem surfaces on one route, not five.
- **Easier:** the inner routes become low-risk repetition once Home is green.
- **Harder:** an explicit mid-PRD gate the operator must sign off on; slightly more ceremony than a single bulk port — accepted to de-risk the first live-tenant integration.

## Date

2026-06-11
