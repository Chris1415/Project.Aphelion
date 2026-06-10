# Click targets — Nebula Drift (v5) POC

Single-page Home pitch. Nav links are `#` anchors (smooth-scroll). Open `index.html` via `file://`.

## Header
| Element | Action | Post-state |
|---|---|---|
| Brand "Aphelion" logo | click | Smooth-scrolls to `#top` (page top / hero). |
| Nav: Destinations | click | Smooth-scrolls to `#destinations` band. |
| Nav: Experiences | click | Smooth-scrolls to `#experiences` band. |
| Nav: About | click | Smooth-scrolls to `#about` (Mission log / testimonials). |
| Nav: Contact | click | Smooth-scrolls to `#newsletter` band. |
| Theme toggle button | click | Cycles **System → Light → Dark → System**. Updates `data-theme`/`data-theme-mode` on `<html>`, icon (◐/☀/☾), label, and `aria-label`; persists to `localStorage['aphelion-theme']`. Whole palette + mesh + pastel/neon swap. |
| Hamburger ☰ (≤720px only) | click | Opens mobile drawer + scrim; `aria-expanded=true`; focus moves to first drawer link. |

## Mobile drawer (≤720px)
| Element | Action | Post-state |
|---|---|---|
| ✕ close button | click | Closes drawer + scrim; focus returns to hamburger. |
| Scrim (dim backdrop) | click | Closes drawer; focus returns to hamburger. |
| Any drawer nav link | click | Scrolls to its anchor AND closes the drawer. |
| `Esc` key (drawer open) | keypress | Closes drawer; focus returns to hamburger. |

## Hero
| Element | Action | Post-state |
|---|---|---|
| "Browse destinations" (primary) | click | Scrolls to `#destinations`. Hover → lift + brighter neon glow. |
| "View experiences" (ghost) | click | Scrolls to `#experiences`. Hover → accent border + ring. |

## Value props / Destinations / Experiences / Testimonials cards
| Element | Action | Post-state |
|---|---|---|
| Any `.card` (hover/focus-within) | hover / tab into | Lifts 6px; border picks up accent; neon-violet halo shadow blooms. |
| Destination "Plan this trip" link | click | Scrolls to `#newsletter`. Hover → arrow `→` slides right. |
| Experience "Reserve a slot" (ghost) | click | Scrolls to `#newsletter`. |

## Promo
| Element | Action | Post-state |
|---|---|---|
| "Request your seat" (primary) | click | Scrolls to `#newsletter`. |

## Newsletter (presentational — ADR-0006, no network)
| Element | Action | Post-state |
|---|---|---|
| Email input (focus) | focus | Accent border + focus ring. |
| Submit "Notify me" — **empty/invalid** | submit | `preventDefault`; `aria-invalid=true`, red border + ring; error `Enter a valid email address.` revealed (`role="alert"`, wired via `aria-describedby`); focus returns to input. |
| Email input — typing after error | input | Clears `aria-invalid` and hides the error message. |
| Submit "Notify me" — **valid email** | submit | `preventDefault`; form hidden; success `✓ You are on the manifest…` shown (`role="status"`, focused). |

## Footer
| Element | Action | Post-state |
|---|---|---|
| Explore / Company / Follow links | click | Scroll to their anchors (`#destinations`, `#experiences`, `#about`, `#newsletter`, `#main`). Hover → text brightens to `--fg`. |

## Global / motion
| Condition | Effect |
|---|---|
| Scroll | `[data-reveal]` sections fade + rise in once (IntersectionObserver). |
| Ambient (no input) | Mesh-gradient blobs drift (32s), hero orb pulses (7s), kinetic headlines shift gradient (9s). |
| `prefers-reduced-motion: reduce` | Mesh frozen, orb/reveal/kinetic static; reveals shown immediately. No rAF starts. |
| OS theme change while in **System** mode | Palette re-resolves live (no reload). |
| Skip link (`Tab` from page load) | "Skip to content" focuses, jumps to `#main`. |
