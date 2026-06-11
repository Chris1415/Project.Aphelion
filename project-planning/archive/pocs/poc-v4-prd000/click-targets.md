# Chromatica (v4) — Click Targets & States

Self-contained Home-page clickdummy for the **Chromatica** direction (liquid-chrome aerospace HUD).
Open `index.html` via `file://` — no build step. This is a single-page direction pitch: most nav links
are in-page `#` anchors. Below = every clickable element and its post-click / post-state behavior.

## How to open
- Double-click `index.html`, or drag into a browser.
- Resize to **390** (mobile) and **1440** (desktop) to verify both fidelity viewports.
- Toggle OS dark/light (or the in-page toggle) to verify both themes are first-class.
- Enable "reduce motion" in OS settings to verify motion falls back to static.

## Header
| Element | Action | Post-state |
|---|---|---|
| Brand logo / "APHELION" | click | scrolls to top (`href="#"`) |
| Nav "Destinations" | click | smooth-scrolls to `#destinations`; underline ignites on hover (cyan) |
| Nav "Experiences" | click | smooth-scrolls to `#experiences` |
| Nav "Programme" | click | smooth-scrolls to `#about` (promo/manifest band) |
| Nav "Manifest" | click | smooth-scrolls to `#contact` (newsletter) |
| Theme toggle — Light | click | `data-theme=light`; this button `aria-pressed=true`; persists to `localStorage` (Polished Titanium) |
| Theme toggle — Dark | click | `data-theme=dark`; persists (Gunmetal Deck) |
| Theme toggle — System | click | follows OS `prefers-color-scheme`; live-updates if OS theme changes |
| Burger (≤760px only) | click | opens full-height HUD drawer; `aria-expanded=true`; focus moves to first drawer link |

## Mobile drawer (visible ≤760px)
| Element | Action | Post-state |
|---|---|---|
| Any nav link | click | scrolls to anchor **and** closes drawer |
| Close "✕" | click | closes drawer; focus returns to burger |
| `Esc` key (drawer open) | keypress | closes drawer; focus returns to burger |
| Theme toggle (in drawer) | click | same as header toggle; both toggles stay in sync via `aria-pressed` |

## Hero
| Element | Action | Post-state |
|---|---|---|
| "Reserve a transit" (chrome CTA) | click | scrolls to `#destinations`; running specular sweep + cyan ignition edge on hover (motion-gated) |
| "View flight programme" (ghost) | click | scrolls to `#experiences`; border + text turn cyan on hover |
| HUD readout panel | — | non-interactive; decorative live-telemetry instrument (reticle + Δv/ALT readouts) |

## Value props / Destinations / Experiences (panels)
| Element | Action | Post-state |
|---|---|---|
| Any `.panel` card (hover/focus) | hover / tab | lifts 4px; border → cyan; HUD corner ticks (`tc-tl`/`tc-br`) snap into corners; accent glow |
| Destination "Flight detail" links | click | `href="#"` (placeholder; arrow nudges right on hover) |
| 4th destination ("Aphelion Mark") | — | demonstrates **empty/no-image fallback** (`.no-image` hatch) + "Join waitlist" link |
| Experience "Programme detail" links | click | `href="#"` (placeholder) |

## Promo band
| Element | Action | Post-state |
|---|---|---|
| "Hold a seat" (chrome CTA) | click | scrolls to `#contact`; sits on brushed-chrome background panel with scrim |

## Newsletter (presentational form — ADR-0006, no backend)
| Element | Action | Post-state |
|---|---|---|
| Email input | type | live: clearing the field resets the message to empty (initial state) |
| "Uplink" — empty / invalid email | submit | `aria-invalid=true`; red message `✕  Enter a valid email…` (error state) |
| "Uplink" — valid email | submit | green message `✓  Telemetry uplink confirmed…` (success state); `role=status` announces it; input clears |

## Footer
| Element | Action | Post-state |
|---|---|---|
| Transit / Programme links | click | in-page anchors to `#destinations` / `#experiences` / `#about` / `#contact` |
| Office links | click | `href="#"` placeholders; hover → cyan |

## State coverage demonstrated in this single file
- **Default / hover / focus:** all nav links, both CTA styles, every panel card.
- **Empty:** 4th destination card (no-image fallback + TBD stats).
- **Error / success:** newsletter form (invalid vs valid email).
- **Disabled:** `.btn[disabled]` / `[aria-disabled=true]` styling defined in `styles.css` (not instantiated on Home; used by Contact form in the full app).
- **Both themes:** every surface re-skins via `data-theme` (Gunmetal Deck ↔ Polished Titanium); metallic specular reads in both.
- **Reduced motion:** specular sweep, hero glint, lens-flare drift, panel-lift transitions all disabled under `prefers-reduced-motion: reduce`.

## Files
- `index.html` — markup + FOUC preflight + font links.
- `styles.css` — Chromatica bespoke design system (metallic recipe, tokens for both themes, all states).
- `theme.js` — three-state theme controller, mobile drawer, presentational newsletter, motion guard.
