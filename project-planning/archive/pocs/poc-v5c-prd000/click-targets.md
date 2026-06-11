# POC click targets — Aphelion v5c "Pulse"

Self-contained Home clickdummy. Open `index.html` via `file://`, or serve it
(`npx serve .`) in a sandboxed browser. Nav links are in-page `#` anchors
(single-page POC). Real cosmos photos are hotlinked from Unsplash (royalty-free,
Unsplash License); each `<img>` has a CSS mesh-gradient fallback so the page
renders fully offline.

## What to evaluate (the v5c deltas vs v5 "Nebula Drift")
- **Portal windows** — real photos masked into glowing circular/arched portals,
  each ringed by an animated conic neon halo with a pulsing bloom.
- **3D tilt** — hover a hero portal cluster / destination card / promo portal:
  it tilts toward the cursor (`perspective` + `rotateX/Y`); the portal lifts on
  a `translateZ` depth layer.
- **Cursor-reactive glow** — move the pointer across the hero; a soft radial
  light tracks it (`mix-blend: screen`).
- **Scroll-progress aurora** — the 3px neon bar pinned to the very top fills
  left→right as you scroll the page.
- **Pulse / breathing** — the hero focal orb breathes (scale + bloom);
  portal rings pulse.

## Interactive elements
| # | Element | Selector / location | Behavior |
|---|---------|---------------------|----------|
| 1 | Theme toggle | header, `.theme-toggle` | Cycles light → dark → system; persists in `localStorage`; icon + label update; no FOUC on reload |
| 2 | Hamburger (≤720px) | header, `.menu-toggle` | Opens right-side drawer + scrim; focus moves into drawer; `Esc` / scrim / link closes; focus returns to trigger (focus trap) |
| 3 | Primary nav links | `.nav-desktop a` | Smooth-scroll to `#destinations` / `#experiences` / `#about` / `#mission-log` / `#newsletter`; animated gradient underline on hover/focus |
| 4 | Hero CTAs | `.hero-cta .btn` | "Browse destinations" (gradient) → `#destinations`; "View experiences" (animated gradient border) → `#experiences` |
| 5 | Hero portal cluster | `.hero-portal-stage.tilt` | 3D tilt on hover; Earth-limb + astronaut portals lift on depth layers; "Next departure" badge floats forward |
| 6 | Destination cards (×6) | `.dest-card.tilt` | Tilt on hover; portal photo zooms; "Plan this flight →" arrow nudges; focus-within ring |
| 7 | Experience CTAs (×3) | `.exp-copy .btn-ghost` | Ghost buttons → `#` (placeholder); arch-portal photos |
| 8 | Promo CTA | `.promo .btn-primary` | "Hold a seat" → `#newsletter`; promo portal tilts |
| 9 | Newsletter form | `.nl-form` | Submit empty → "Email is required"; bad email → "Enter a valid email address" (`aria-invalid`, red ring); valid → form hides, success `role="status"` shows; typing clears the error |
| 10 | Footer nav | `.footer-col a` | In-page anchors |

## States to inspect
- **Hover / focus-visible:** nav links, all buttons, every card (`:focus-within`), inputs.
- **Newsletter:** default · empty-error · invalid-error · success · disabled (add `disabled` to the button to preview).
- **Disabled button:** `.btn[disabled]` → 0.5 opacity, no transform.
- **Reduced motion:** enable OS "reduce motion" → mesh frozen, kinetic type static,
  orb pulse off, tilt disabled, cursor-glow hidden, scroll-aurora flat, reveals shown.
- **Offline / blocked images:** disable network → every portal shows its neon-mesh
  gradient fallback (the `.portal-fallback` layer); layout unchanged.

## Responsive checkpoints
- **1440 (desktop):** hero split 2-col (copy + portal cluster); destinations 3-up;
  experiences 2-col alternating; stats 4-up; promo 2-col.
- **390 (mobile):** single column; hamburger drawer; hero stacks (portal under copy);
  cards 1-up; stats 2-up; promo portal hidden; tilt auto-disabled on coarse pointers.
