# Click Targets — Aphelion POC v1 "Event Horizon" (prd-000)

Enumeration of every clickable element on every screen, with its post-state.
Self-contained clickdummy: relative links only, opens from `file://` (or `npx serve` / `python -m http.server` in sandboxed environments where `file://` is blocked).

**Screens:** `index.html` (Home), `destinations.html`, `experiences.html`, `about.html`, `contact.html`.
**Shared chrome** (header, mobile drawer, footer, theme toggle) is identical on every screen — listed once under "Global chrome", then per-screen tables cover page-body targets only.

Legend for post-state: a `*.html` file = full navigation; `#anchor` = in-page; "in-place" = DOM/visual state change without navigation (theme, drawer, form states).

---

## Global chrome (present on all 5 screens)

| Screen | Element | Click → | Post-state file/anchor |
|---|---|---|---|
| all | Skip link "Skip to content" | focus jump | `#main` (current page) |
| all | Header brand "Aphelion" (logo + wordmark) | navigate | `index.html` |
| all | Header nav "Home" | navigate | `index.html` |
| all | Header nav "Destinations" | navigate | `destinations.html` |
| all | Header nav "Experiences" | navigate | `experiences.html` |
| all | Header nav "About" | navigate | `about.html` |
| all | Header nav "Contact" | navigate | `contact.html` |
| all | Theme toggle — Light button | set theme | in-place: `data-theme=light` + `localStorage`, `aria-pressed=true` on Light |
| all | Theme toggle — Dark button | set theme | in-place: `data-theme=dark` + `localStorage`, `aria-pressed=true` on Dark |
| all | Theme toggle — System button | set theme | in-place: `data-theme=system` (follows OS) + `localStorage`, `aria-pressed=true` on System |
| all | Header CTA "Book a Briefing" | navigate | `contact.html` |
| all (≤760px) | Hamburger label (opens menu) | toggle `#nav-toggle` | in-place: `.mobile-drawer` slides in, body scroll-locked |
| all (≤760px) | Mobile drawer nav "Home" | navigate (+ closes drawer) | `index.html` |
| all (≤760px) | Mobile drawer nav "Destinations" | navigate (+ closes drawer) | `destinations.html` |
| all (≤760px) | Mobile drawer nav "Experiences" | navigate (+ closes drawer) | `experiences.html` |
| all (≤760px) | Mobile drawer nav "About" | navigate (+ closes drawer) | `about.html` |
| all (≤760px) | Mobile drawer nav "Contact" | navigate (+ closes drawer) | `contact.html` |
| all (≤760px) | Mobile drawer theme buttons (Light/Dark/System) | set theme | in-place (same as header toggle) |
| all (≤760px) | `Esc` key while drawer open | close drawer | in-place: drawer slides out, scroll unlocked |
| all | Footer brand "Aphelion" | navigate | `index.html` |
| all | Footer › Explore › Destinations | navigate | `destinations.html` |
| all | Footer › Explore › Experiences | navigate | `experiences.html` |
| all | Footer › Explore › About us | navigate | `about.html` |
| all | Footer › Explore › Contact | navigate | `contact.html` |
| all | Footer › Programs › Overview Dinner | navigate | `experiences.html` |
| all | Footer › Programs › Untethered EVA | navigate | `experiences.html` |
| all | Footer › Programs › Lunar Gateway | navigate | `destinations.html` |
| all | Footer › Programs › Serenity Descent | navigate | `destinations.html` |
| all | Footer › Company › Our story | navigate | `about.html` |
| all | Footer › Company › Safety | navigate | `about.html` |
| all | Footer › Company › Sustainability | navigate | `about.html` |
| all | Footer › Company › Press | navigate | `contact.html` |
| all | Footer social — X / Twitter | navigate (placeholder) | `contact.html` |
| all | Footer social — Instagram | navigate (placeholder) | `contact.html` |
| all | Footer social — LinkedIn | navigate (placeholder) | `contact.html` |

---

## Screen 1 — `index.html` (Home) — page body

| Screen | Element | Click → | Post-state file/anchor |
|---|---|---|---|
| Home | Hero CTA "Explore destinations" (primary, pulse) | navigate | `destinations.html` |
| Home | Hero CTA "View experiences" (ghost) | navigate | `experiences.html` |
| Home | Destination card "Aphelion Station" | navigate | `destinations.html` |
| Home | Destination card "Lunar Gateway" | navigate | `destinations.html` |
| Home | Destination card "Serenity Descent" | navigate | `destinations.html` |
| Home | "See all seven destinations" (ghost button) | navigate | `destinations.html` |
| Home | Experience 01 "Reserve a seating →" (link) | navigate | `experiences.html` |
| Home | Experience 02 "Begin training →" (link) | navigate | `experiences.html` |
| Home | Promo CTA "Request your briefing" | navigate | `contact.html` |
| Home | Newsletter input (email) | focus | in-place: focus ring; on submit validates |
| Home | Newsletter "Subscribe" button — empty | submit | in-place: `field-msg` "✕ Please enter your email address.", `aria-invalid=true` |
| Home | Newsletter "Subscribe" button — invalid email | submit | in-place: `field-msg` "✕ That doesn’t look like a valid email." |
| Home | Newsletter "Subscribe" button — valid email | submit | in-place: input row hidden, `#newsletter-status` success "✓ You’re on the manifest…" |

---

## Screen 2 — `destinations.html` — page body

| Screen | Element | Click → | Post-state file/anchor |
|---|---|---|---|
| Destinations | Destination card "Aphelion Station" | navigate | `contact.html` (enquire) |
| Destinations | Destination card "Lunar Gateway" | navigate | `contact.html` |
| Destinations | Destination card "Serenity Descent" | navigate | `contact.html` |
| Destinations | Destination card "Aurora Watch" | navigate | `contact.html` |
| Destinations | Destination card "The Far Point" | navigate | `contact.html` |
| Destinations | Destination card "Titan Overlook" | navigate | `contact.html` |
| Destinations | Promo CTA "Request a briefing" | navigate | `contact.html` |

(Each card's inner "Enquire" link is part of the whole-card link — single target per card.)

---

## Screen 3 — `experiences.html` — page body

| Screen | Element | Click → | Post-state file/anchor |
|---|---|---|---|
| Experiences | Experience 01 "Reserve a seating →" | navigate | `contact.html` |
| Experiences | Experience 02 "Begin training →" | navigate | `contact.html` |
| Experiences | Experience 03 "Enquire →" | navigate | `contact.html` |
| Experiences | Experience 04 "Start here →" | navigate | `contact.html` |

(Stats band on this screen is presentational — no click targets.)

---

## Screen 4 — `about.html` — page body

| Screen | Element | Click → | Post-state file/anchor |
|---|---|---|---|
| About | Promo CTA "Book a briefing" | navigate | `contact.html` |

(RichTextSection prose, the four value cards, and the four team cards are presentational — no click targets. Value/team cards have hover/focus-within elevation but are non-navigating.)

---

## Screen 5 — `contact.html` — page body

| Screen | Element | Click → | Post-state file/anchor |
|---|---|---|---|
| Contact | Field "Full name" | focus | in-place: focus ring |
| Contact | Field "Email" | focus | in-place: focus ring |
| Contact | Field "Which destination…" (optional) | focus | in-place: focus ring |
| Contact | Field "Message" (textarea) | focus | in-place: focus ring |
| Contact | "Request briefing" — missing required fields | submit | in-place: per-field "✕ This field is required." / "✕ Enter a valid email."; `#contact-status` error "✕ Please fix the highlighted fields…" |
| Contact | "Request briefing" — all valid | submit | in-place: form rows hidden, `#contact-status` success "✓ Message received…" |
| Contact | Newsletter input + "Subscribe" | submit | in-place: same states as Home newsletter (empty/invalid/success) |

(Contact aside email/phone/address are plain text, not links, by design.)

---

## Notes on intentional interpretations

- **Whole-card links.** Destination cards are wrapped in a single `<a>` (the inner "View stay" / "Enquire" text is a visual affordance, not a second target) — one click target per card, larger hit area, better mobile UX.
- **Placeholder link destinations.** Footer "Press", all footer-social icons, and inner-page card/CTA "enquire" links route to `contact.html` since this is a 5-route clickdummy with no detail pages — every path resolves to a real page in the set (no dead `#` links).
- **Theme toggle is 3-state, persisted, FOUC-safe.** Plus a `?theme=light|dark|system` URL override on every page (set in the preflight) so QA can force a theme for screenshot-diff without scripting `localStorage`.
- **Forms are presentational only** (ADR-0006 / PRD A1) — no network submit; success simply swaps the input area for a status banner. State icons are monochrome glyphs (`✓` U+2713 / `✕` U+2715) that inherit theme color — never emoji codepoints.
