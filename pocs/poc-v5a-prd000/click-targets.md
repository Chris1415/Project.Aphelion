# Click targets — Aphelion "Lumen" (v5a) POC

Single-page pitch clickdummy. Nav links are `#` in-page anchors (smooth-scroll), not separate routes.
Open `index.html` via `file://` (or `npx serve .` in a sandbox). Images hotlink from Unsplash (need network);
if offline, the on-brand gradient fallback shows behind every image — layout still reads.

## Interactive targets

| Target | Action | Result |
|---|---|---|
| **Theme toggle** (header, `◐`/`☀`/`☾`) | click | Cycles light → dark → system; persists to `localStorage['aphelion-theme']`; icon + label update. System tracks OS `prefers-color-scheme`. |
| **Hamburger** (`☰`, ≤720px only) | click | Opens right-side mobile drawer + scrim; focus moves into drawer, trapped; `Esc` / scrim-click / link-click closes and returns focus to the button. |
| **Drawer close** (`✕`) | click | Closes drawer. |
| **Primary nav links** | click | Smooth-scroll to `#destinations` / `#experiences` / `#about` / `#newsletter`. |
| **"Book a flight" / "Request access" / CTAs** | click | Scroll to `#newsletter` (or `#destinations` / `#experiences`). Buttons show hover lift + neon halo. |
| **Newsletter form** | submit empty | Inline error "Email is required." (`aria-invalid`, `role="alert"`). |
| **Newsletter form** | submit bad email | Inline error "Enter a valid email address." |
| **Newsletter form** | submit valid email | Form hides; success message (`role="status"`) appears + receives focus. |
| **Destination cards** | scroll into view | `clip-path` reveal mask animates the real photo open. Hover = ken-burns push-in on the image + link arrow nudge. |
| **Value / testimonial cards** | hover / focus-within | Lift + neon halo + accent border. |

## Motion to observe (freezes under `prefers-reduced-motion: reduce`)

- **Hero**: real nebula photo with neon mesh blended on top; **scroll parallax** (photo + mesh move at different rates) + slow **ken-burns** scale drift.
- **Headlines**: kinetic gradient fill (`background-position` drift) + brighter **shimmer sweep** highlight.
- **Destination photos**: clip-path **reveal masks** on scroll; ken-burns on hover.
- **Experience / promo imagery**: **duotone** blend (grayscale + brand-gradient `mix-blend-mode`) + ken-burns drift.
- **Mesh**: slow drifting neon blobs (hero, stats, newsletter).
- **Orb**: gentle glow pulse in the hero.
- Reduced-motion: parallax off (photo static), ken-burns off, shimmer static, reveal masks start fully open, mesh frozen, reveals shown.

## Viewports to check

- **390** (mobile): hamburger drawer; hero full-bleed, parallax dampened; cards 1-col (masks still reveal); stats 2-up; duotone images stack above copy.
- **1440** (desktop): canonical; content ~1180px over full-bleed hero photo + mesh; destinations 3-up, experiences 2-up alternating duotone.

## Themes to check

Toggle through **dark** (saturated neon on near-black, full-strength duotone) and **light** (pastel-aurora day, brighter photo exposure, dark-tinted hero scrim so text stays AA). Both fully designed; neither is an inversion.
