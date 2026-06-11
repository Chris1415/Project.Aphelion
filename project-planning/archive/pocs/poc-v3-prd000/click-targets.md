# Aphelion v3 "Aurora" — POC click targets

Self-contained Home-page pitch. Open `index.html` via `file://` (or `npx serve .`).
Nav links resolve to in-page `#` anchors (single-page direction pitch; only the
winning variant gets all 5 routes wired). Below: every clickable element → post-state.

## Header (sticky glass pill)
| Element | Action / post-state |
|---|---|
| Brand "Aphelion" (logo) | Scrolls to top (`href="#"`) |
| Nav: Home | `#` — top of page (marked `.active`) |
| Nav: Destinations | Smooth-scrolls to `#destinations` section |
| Nav: Experiences | Smooth-scrolls to `#experiences` section |
| Nav: About | Smooth-scrolls to footer `#about` |
| Nav: Contact | Smooth-scrolls to `#contact` (Newsletter CTA) |
| Theme toggle — Light | Sets `data-theme="light"`, persists `aphelion-theme=light`; this button `aria-pressed="true"` |
| Theme toggle — System | Resolves to OS scheme, persists `=system`; follows OS changes live; `aria-pressed="true"` |
| Theme toggle — Dark | Sets `data-theme="dark"`, persists `=dark`; `aria-pressed="true"` |
| Hamburger (≤720px only) | Opens full-height frosted mobile drawer; focus moves into drawer; focus trapped |

## Mobile nav drawer (≤720px)
| Element | Action / post-state |
|---|---|
| Close (✕) | Closes drawer; focus returns to hamburger |
| Any nav link | Navigates to anchor AND closes drawer |
| Theme toggle (Light/System/Dark) | Same as header toggle |
| `Esc` key | Closes drawer (focus restored) |
| `Tab` / `Shift+Tab` at ends | Wraps focus within drawer (trap) |

## Skip link
| Element | Action / post-state |
|---|---|
| "Skip to content" (visible on focus) | Jumps to `#main` |

## Hero bento
| Element | Action / post-state |
|---|---|
| Headline tile | Featured glass + drifting iridescent sheen (decorative; static under reduced-motion) |
| "Browse destinations" (primary) | Scrolls to `#destinations`; hover = lift + brightness |
| "Explore experiences" (ghost) | Scrolls to `#experiences`; hover = lift + accent border |
| Fleet / Stat tiles | Interactive glass: hover = lift + cursor-tracked specular + border-glow bloom |
| "Reserve a seat" (primary) | Scrolls to `#contact` |

## Value props / Destinations / Experiences / Stats / Testimonials tiles
| Element | Action / post-state |
|---|---|
| Any `.glass.interactive` tile | Hover = `translateY(-4px)` lift + specular highlight follows cursor + iridescent border brightens; focus-visible = aurora-gradient ring |
| Destination card "Explore →" | Scrolls to `#contact`; arrow nudges right on hover |
| Experience "Request the menu" / "Reserve" (ghost) | Scrolls to `#contact` |
| Promo "Request an invitation" (primary) | Scrolls to `#contact` |
| Empty-tile copy (design note) | Container empty-state covered by spec §4; not triggered in POC content |

## Newsletter CTA (presentational form)
| Element | Action / post-state |
|---|---|
| Email input (focus) | Aurora-violet border + 3px focus glow |
| Submit "Request access" — empty | `aria-invalid="true"`; error msg "✕ Enter your email…" (danger color, `role="status"`) |
| Submit — malformed email | `aria-invalid="true"`; error msg "✕ That email doesn't look right." |
| Submit — valid email | Success msg "✓ Cleared for boarding…" (success color); input clears |

## Footer
| Element | Action / post-state |
|---|---|
| Brand | Scrolls to top |
| Explore / Company / Contact links | In-page anchors (Destinations/Experiences/About/Contact) or `#` placeholders (fleet, careers, email, phone) |
| Social icons (X / Instagram / LinkedIn) | `#` placeholders; hover = lift + color brighten |

## Global behaviors
- **Theme:** light / dark / system all functional; FOUC-safe (preflight `<head>` script sets `data-theme` before paint); choice persists in `localStorage` (`aphelion-theme`).
- **Reduced motion:** `prefers-reduced-motion: reduce` → sheen drift off, tile-reveal cascade instant, cursor-specular disabled, hover reduced to static border brighten.
- **Responsive:** 12-col bento at 1440 → single-column glass stack at 390; header nav → hamburger at ≤720px; stats 2-up on small.
- **Touch:** cursor-specular auto-disabled on non-hover (touch) devices.
