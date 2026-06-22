# ADR-0013: Component-map server/client split keyed to the static `'use client'` boundary

## Status

Accepted

## Context

In a Content SDK App Router head app, components register in two maps: `.sitecore/component-map.ts` (Server Components) and `.sitecore/component-map.client.ts` (Client Components). The Aphelion port has 13 placeable renderings, some interactive (gooey Hero, count-up StatsBand, magnetic CTAs, presentational forms, onError images). We need a deterministic rule for which map each rendering joins, rather than ad-hoc guessing (a wrong map = hydration error or a Server Component trying to use hooks).

## Decision

A rendering's map is keyed to its **`'use client'` status in the already-built static app** (the source of the port):

- **Client map (4):** `Hero`, `PromoBand`, `NewsletterCTA`, `ContactForm` — the only TOP-LEVEL renderings marked `'use client'` in `static/`.
- **Server map (9):** `PageHero`, `ValueProps`, `DestinationsGrid`, `ExperienceShowcase`, `StatsBand`, `Testimonials`, `RichTextSection`, `ContactDetails`, `Marquee`. (`Marquee` is verified Server — 0 hooks, pure CSS animation.)
- **Interactive CHILD components** (`DestinationCard`, `ValueCard`, `ExperienceItem`, `Stat`) are `'use client'` but get **no component-map entry** — they are imported as Client children by their Server container (a Server Component may render a Client child). Only the placeable rendering registers.

## Consequences

- **Easier:** the split is mechanical and traceable to the static app (no judgment per component); container renderings stay Server (better RSC streaming) while their interactive leaves still hydrate.
- **Easier:** maximizes Server Components (only 4 of 13 renderings are client) → smaller client bundle.
- **Harder:** the rule must be re-checked if a component's interactivity changes; a count-up/animation added to a currently-Server rendering would move it to the client map — the `'use client'` directive in the ported file is the trigger to update the registry.

## Date

2026-06-11
