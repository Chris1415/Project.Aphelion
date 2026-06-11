# Click targets — Aphelion POC v2 ("Almanac")

Self-contained, multi-page clickdummy. All links are relative; opens via `file://`
(or `npx serve` / `python -m http.server` in a sandbox). Variant direction:
observatory-grade editorial precision — Swiss grid, near-monochrome, hairline rules,
Newsreader + Inter, one signal-amber accent. Light "Daybreak Paper" / dark "Observatory Ink".

Forms are **presentational only** (ADR-0006): submit `preventDefault`s and transitions
local UI; no network. Theme + drawer + reveal handled by `theme.js`. FOUC preflight is
inline in each `<head>`.

Legend: post-state is the file/anchor the element resolves to, or the local UI state it sets.

---

## Global — present on every screen (header + footer)

| Screen | Element | Click → | Post-state file/anchor |
|--------|---------|---------|------------------------|
| All | Skip link ("Skip to content") | Anchor jump | current page `#main` |
| All | Brand wordmark (header) | Navigate | `index.html` |
| All | Nav link "Destinations" | Navigate | `destinations.html` |
| All | Nav link "Experiences" | Navigate | `experiences.html` |
| All | Nav link "About" | Navigate | `about.html` |
| All | Nav link "Contact" | Navigate | `contact.html` |
| All | Theme toggle — Light button | Set theme | `localStorage aphelion-theme=light`; `<html>` loses `.dark`; button `aria-pressed=true` |
| All | Theme toggle — Dark button | Set theme | `localStorage aphelion-theme=dark`; `<html>` gains `.dark`; button `aria-pressed=true` |
| All | Theme toggle — System button | Set theme | `localStorage aphelion-theme=system`; `<html>.dark` follows `prefers-color-scheme`; button `aria-pressed=true` |
| All (≤760px) | Hamburger (`label[for=nav-toggle]`) | Toggle drawer | `#nav-toggle` checked ↔ unchecked; `.mobile-nav` shown/hidden; Esc closes + returns focus |
| All (≤760px) | Drawer link "Destinations" 01 | Navigate (closes drawer) | `destinations.html` |
| All (≤760px) | Drawer link "Experiences" 02 | Navigate (closes drawer) | `experiences.html` |
| All (≤760px) | Drawer link "About" 03 | Navigate (closes drawer) | `about.html` |
| All (≤760px) | Drawer link "Contact" 04 | Navigate (closes drawer) | `contact.html` |
| All | Footer brand wordmark | Navigate | `index.html` |
| All | Footer · Flight · "Destinations" | Navigate | `destinations.html` |
| All | Footer · Flight · "Experiences" | Navigate | `experiences.html` |
| All | Footer · Flight · "Fleet" | Anchor jump | `index.html#stats` |
| All | Footer · Program · "About" | Navigate | `about.html` |
| All | Footer · Program · "Principles" | Anchor jump | `about.html#principles` |
| All | Footer · Program · "Contact" | Navigate | `contact.html` |
| All | Footer · Signal · "Apsis Circle" | Navigate | `contact.html` |
| All | Footer · Signal · "Dispatch" | Anchor jump | `index.html#news` |
| All | Footer · Signal · "Press" | Navigate | `contact.html` |

---

## index.html (Home)

| Screen | Element | Click → | Post-state file/anchor |
|--------|---------|---------|------------------------|
| Home | Hero CTA "View destinations" (accent) | Navigate | `destinations.html` |
| Home | Hero CTA "The program" (ghost) | Navigate | `about.html` |
| Home | Destinations idx meta "Full register →" | Navigate | `destinations.html` |
| Home | Experiences idx meta "All experiences →" | Navigate | `experiences.html` |
| Home | Experience 01 link "Read the briefing →" | Navigate | `experiences.html` |
| Home | Experience 02 link "Read the briefing →" | Navigate | `experiences.html` |
| Home | Promo CTA "Request an invitation →" | Navigate | `contact.html` |
| Home | Newsletter input (email) | Focus | accent underline focus; client validation on submit |
| Home | Newsletter button "Subscribe →" (submit) | Validate → success | invalid/empty: inline `✕` error + `aria-invalid`; valid: form gains `.is-sent`, `.form-success` (role=status) shows "Confirmed…" |

Home composition order (per PRD §5): Hero → ValueProps (`00`) → Destinations preview (`01`) → Experience showcase (`02`) → Stats band → Promo band → Testimonials/Mission Log (`03`) → Newsletter CTA. ValueProps cards and Stats are presentational (no click target).

---

## destinations.html

| Screen | Element | Click → | Post-state file/anchor |
|--------|---------|---------|------------------------|
| Destinations | Breadcrumb "Home" | Navigate | `index.html` |
| Destinations | Index row 01 "Lagrange Terrace" (whole row) | Navigate | `contact.html` (request briefing) |
| Destinations | Index row 02 "Aurora Station" | Navigate | `contact.html` |
| Destinations | Index row 03 "Marius Hills" | Navigate | `contact.html` |
| Destinations | Index row 04 "Meridian Arc" | Navigate | `contact.html` |
| Destinations | Index row 05 "Perihelion Deck" | Navigate | `contact.html` |
| Destinations | Index row 06 "Sea of Serenity" | Navigate | `contact.html` |
| Destinations | CTA "Reserve a window →" (accent) | Navigate | `contact.html` |

Each index row is a single focusable `<a>` (hover = amber wash + crosshair `+` tick + name turns amber). Feature plate cards (Lagrange / Marius / Perihelion) are presentational (no link) — the index rows above carry the navigation.

---

## experiences.html

| Screen | Element | Click → | Post-state file/anchor |
|--------|---------|---------|------------------------|
| Experiences | Breadcrumb "Home" | Navigate | `index.html` |
| Experiences | EXP-01 "Request briefing →" (ghost) | Navigate | `contact.html` |
| Experiences | EXP-02 "Request briefing →" (ghost) | Navigate | `contact.html` |
| Experiences | EXP-03 "Request briefing →" (ghost) | Navigate | `contact.html` |
| Experiences | EXP-04 "Request briefing →" (ghost) | Navigate | `contact.html` |
| Experiences | Promo CTA "Plan your programme →" | Navigate | `contact.html` |

---

## about.html

| Screen | Element | Click → | Post-state file/anchor |
|--------|---------|---------|------------------------|
| About | Breadcrumb "Home" | Navigate | `index.html` |
| About | Closing CTA "Get in touch →" (accent) | Navigate | `contact.html` |

Principles grid (`#principles`, PR.01–PR.04), story prose, and Stats band (`#stats`) are presentational (no click target). `#principles` and `#stats` are anchor destinations reachable from the footer.

---

## contact.html

| Screen | Element | Click → | Post-state file/anchor |
|--------|---------|---------|------------------------|
| Contact | Breadcrumb "Home" | Navigate | `index.html` |
| Contact | Field "Name" | Focus | accent underline focus; required on submit |
| Contact | Field "Email" | Focus | accent underline focus; required + email-format on submit |
| Contact | Field "Interest" | Focus | accent underline focus; required on submit |
| Contact | Field "Message" (textarea) | Focus | accent underline focus; required on submit |
| Contact | Button "Transmit →" (accent, submit) | Validate → success | invalid: per-field `✕` errors + `aria-invalid=true` + focus first bad; valid: button → "Sending…", then form gains `.is-sent`, `.form-success` (role=status) shows "Received…" |

Direct-channels data sheet (emails, voice, flight campus) is presentational text (no click target — plain values, not `mailto:`, to keep the clickdummy self-contained).

---

## State coverage demonstrated in POC

- **Theme:** light / dark / system, persisted, FOUC-preflighted, OS-change-reactive in system mode.
- **Nav:** active-page `aria-current` underline; mobile collapse → drawer (Esc-close, link-tap-close).
- **Rows/cards:** hover (amber wash + crosshair tick), focus-visible (2px accent ring).
- **Links:** ink text + accent underline grow on hover; focus-visible ring.
- **Forms (presentational):** default · focus · error (per-field, monochrome `✕` glyph, `aria-invalid`) · pending ("Sending…") · success (`role=status` live region). No network.
- **Reveal:** content visible by default; JS-gated fade-up that always resolves (1.6s safety net) so full-page screenshots / no-JS / print never trap content at opacity 0 — protects the downstream screenshot-diff fidelity gate.
- **Reduced motion:** `prefers-reduced-motion: reduce` zeroes all transitions/transforms incl. the live-chip pulse.
