# Architecture Decision Records

This directory holds ADRs for this product workspace.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| ADR-0001 | Use ADRs as architecture backbone | Accepted |
| ADR-0002 | Split the NEW-site build into PRD-000 (Acts 1–2) and PRD-001 (Act 3) | Accepted |
| ADR-0003 | Build a separate plain-React static app before scaffolding the head app | Accepted |
| ADR-0004 | Theme architecture — FOUC preflight + useSyncExternalStore + Tailwind v4 tokens | Accepted |
| ADR-0005 | Content-model-driven component boundary — flat leaves, folder-of-children arrays, nav excluded | Accepted |
| ADR-0006 | Newsletter + Contact are presentational-only in v1 | Accepted |
| ADR-0007 | Static-app stack, scaffold, and portable directory layout | Accepted |
| ADR-0008 | Test + fidelity-gate strategy (Vitest + Playwright screenshot-diff) | Accepted |
| ADR-0009 | Act-3 scaffold via baseline-copy + create-content-sdk-app | Accepted |
| ADR-0010 | A single authoritative componentName registry is the port contract | Accepted |
| ADR-0011 | Navigation via the component-level navigation pattern (server L1 + lazy L2 Route Handler) | Accepted |
| ADR-0012 | Home route is a hard verify-gate tranche before the inner routes | Accepted |
| ADR-0013 | Component-map server/client split keyed to the static `'use client'` boundary | Accepted |
| ADR-0014 | Editing-safe rendering via stock App-Router draftMode() + getPreview/getDesignLibraryData | Accepted |

## Next number

Use the next free four-digit id after the highest existing `adr-*.md` (next: ADR-0015).
