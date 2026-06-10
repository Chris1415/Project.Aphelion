# POC click targets — Aphelion "Flux" (v5b)

Self-contained Home clickdummy. Open `index.html` via `file://` or `npx serve .`
(serve recommended so the hotlinked Unsplash images load; offline still works via
CSS mesh fallbacks behind every image).

## Interactive targets

| Target | Selector | Behavior |
|---|---|---|
| Theme toggle | `[data-theme-toggle]` (header) | Cycles **Light → Dark → System**; persists to `localStorage('aphelion-theme')`; icon + label update; follows OS while on System. |
| Mobile menu open | `[data-menu-open]` (≤720px) | Opens right-side drawer + scrim; focus moves into drawer. |
| Mobile menu close | `[data-menu-close]` / scrim / `Esc` | Closes drawer; focus returns to trigger; simple focus trap while open. |
| Primary nav links | `.nav-desktop a`, `.mobile-nav a` | Anchor-scroll to `#destinations` / `#experiences` / `#about`(→footer) / `#contact`(→newsletter). |
| Hero CTAs | `.hero-cta a` | `data-magnetic` — element follows cursor on hover (pointer:fine only); anchor-scroll. |
| Value / quote cards | `.card[data-magnetic]`, `.flowborder` | Magnetic lift + animated flowing gradient border on hover/focus-within. |
| Destination "Plan this voyage" | `.dest-link` | Anchor to `#contact`; arrow nudges on hover; image zooms. |
| Experience "Reserve a session" | `.exp-copy .dest-link` | Anchor to `#contact`. |
| Marquee | `.marquee` | Infinite scroll of destination names; **pauses on hover**. |
| Stats | `[data-countup]` | Count-up animates 0 → target when band scrolls into view (`7 / 1240+ / 100% / 4.9`). |
| Newsletter submit | `form[data-newsletter] button` | Presentational validation: empty/invalid → inline `✕` error; valid email → form hides, `✓` success live-region. |

## States demonstrated
- **Default / hover / focus-visible** — all links, buttons, cards, inputs (focus ring = `--accent-500`).
- **Magnetic hover** — CTAs + value/quote cards (disabled under reduced-motion + on coarse pointers).
- **Error** — newsletter empty (`Email is required.`) and invalid (`Enter a valid email address.`).
- **Success** — newsletter valid submit (`role="status"` live region).
- **Empty** — newsletter input empty placeholder; destination grid copy is the container empty-state pattern.
- **Disabled** — `.btn[disabled]` style defined (dim, no transform).

## Motion (all gated by `prefers-reduced-motion: reduce`)
Gooey morphing blob field · kinetic gradient headlines · drifting mesh · marquee ·
scroll reveal · stat count-up · magnetic hover · morphing hero frame · spinning brand mark.
Under reduced-motion **all freeze**, every `[data-reveal]` is shown immediately, and
count-up jumps straight to final values (verified: 27/27 reveal `in`, stat = `7`).

## Imagery
Abstract 3D-render / fluid / iridescent photos hotlinked from Unsplash (Unsplash
License — royalty-free, commercial-OK). Full ID list + sources in the `index.html`
header comment and spec §7. Every `<img>` has a CSS mesh fallback + `onerror` handler.
