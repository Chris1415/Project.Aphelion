# ADR-0004: Theme architecture — FOUC preflight + useSyncExternalStore + Tailwind v4 tokens

## Status

Accepted

## Context

Dark + light + system theme is mandatory for every app. App Router + React 19 / Next 16 have two known traps: (1) the react-hooks plugin ERRORS on setState-in-effect and `Date.now()`-in-render for client-only state; (2) inline raw-HTML `<script>` props for FOUC preflight are blocked by security tooling. The theme stack must be hydration-safe and must port verbatim from the static app into the head app.

## Decision

Adopt `custom_content-sdk-theme-hydration-pattern` exactly:
- FOUC preflight via `public/theme-init.js`, referenced from the root layout `<head>` (NOT a React inline raw-HTML script), setting the theme class before first paint.
- A `useSyncExternalStore`-based theme provider (localStorage + `matchMedia` system listener) — NOT setState-in-effect.
- A mounted-flag for any client-only styling to avoid SSR/CSR mismatch.
- Tailwind v4 `@theme` token block + `@custom-variant dark`. Hex-literal tokens are used via `var(--token)` directly — never wrapped in `hsl()` (breaks parsing → black/currentColor).

## Consequences

- **Easier:** no FOUC, no hydration warnings, no react-hooks lint errors; the entire theme module ports verbatim to the head app in Act 3.
- **Easier:** vivid accents via `*-500` tokens; `color-mix`/SVG `stopOpacity` for alpha.
- **Harder:** `public/theme-init.js` is a small bit of untyped JS outside the React tree that must stay in sync with the token names; Playwright is the only gate that catches hydration regressions (vitest+build cannot).

## Date

2026-06-09
