# ADR-0008: Test + fidelity-gate strategy (Vitest + Playwright screenshot-diff)

## Status

Accepted

## Context

PRD-000's load-bearing gate is design fidelity vs the approved clickdummy, and its highest-risk failure mode is a theme hydration mismatch — which `vitest` + `next build` structurally cannot catch (no real browser, no SSR/CSR diff). The fidelity definition (ADR/PRD): structural + visual parity, ≤~5% per-route pixel delta, viewports 390 + 1440, both themes, 5 routes.

## Decision

- **Vitest** for component/unit tests: render-from-plain-props for every component + theme-provider behaviour (light/dark/system resolution, persistence).
- **Playwright** for two browser-only gates:
  1. **Screenshot-diff fidelity gate** via `toHaveScreenshot` with `maxDiffPixelRatio ≈ 0.05`, baseline = the operator-selected clickdummy variant rendered in Playwright, across 5 routes × 2 viewports × 2 themes.
  2. **Hydration / console-error check** — navigate each route in both themes and assert zero hydration-mismatch warnings and zero console errors (the cliff vitest+build can't see).
- The screenshot-diff knob (`toHaveScreenshot`/`maxDiffPixelRatio` vs an explicit `pixelmatch` harness) is confirmed when the gate is wired at the T-fidelity tranche (OQ-4).

## Consequences

- **Easier:** the fidelity contract and the hydration cliff both have an automated gate; the theme stack's correctness is provable before operator review.
- **Easier:** the Playwright suite ports forward to PRD-001 as the head-app smoke harness.
- **Harder:** screenshot baselines are environment-sensitive (font rendering, OS) — baselines must be generated in a consistent runner; a ≤5% tolerance absorbs minor AA/subpixel noise but must be tuned at T-fidelity.

## Date

2026-06-09
