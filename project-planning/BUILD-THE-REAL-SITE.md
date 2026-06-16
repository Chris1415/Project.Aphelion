# Build the real Aphelion site — step-by-step

The head-app code is feature-complete. This is the remaining **Sitecore-side** work, in order:
finish the containers → author content → compose the 5 real pages → publish → deploy. Copy-paste
queries/content from the referenced docs.

References:
- **Container queries + content:** `sitecore-integrated-graphql-all-containers.md`
- **Leaf component content + PageHeros:** `sitecore-content-values.md`
- **New-container playbook (if you add more later):** `PLAYBOOK-new-inline-editable-container.md`

---

## PHASE 1 — Finish the remaining containers

`DestinationsGrid` + `ValueProps` are done. For each of these five, do the **3 steps**
(query in `sitecore-integrated-graphql-all-containers.md`):

| Container | 1. Paste GraphQL query on the rendering | 2. Clear `Rendering Contents Resolver` | 3. Author folder + children |
|---|---|---|---|
| `ExperienceShowcase` | ✔ | ✔ | ✔ |
| `StatsBand` | ✔ | ✔ | ✔ |
| `Testimonials` | ✔ | ✔ | ✔ |
| `ContactDetails` | ✔ | ✔ | ✔ |
| `Marquee` | ✔ (datasource = the `Destinations` folder) | ✔ | — (reuses destinations) |

Publish each rendering + its folder + children as you go.

---

## PHASE 2 — Author the real content

Replace the test values (`321321`, etc.) with the real copy:
- **Container content** (ValueProps, Destinations cards, Experiences, Stats, Testimonials,
  ContactDetails): in `sitecore-integrated-graphql-all-containers.md` (per container).
- **Leaf content** (Promo/Hero, PromoBand, NewsletterCTA, RichTextSection, ContactForm, and the
  per-page **PageHero** items): in `sitecore-content-values.md`.

All authored **inline on the canvas** now.

---

## PHASE 3 — Compose the 5 real pages

Each page = an ordered stack of renderings in the **`headless-main`** placeholder. The
**Header/Footer come from the Partial Design** (already set up), so you only place the
page-body renderings below. Datasource per rendering: a **leaf** points at a datasource item of
its template; a **container** points at its **folder**; `Marquee` points at the `Destinations`
folder.

### Home  (the site's Home item)
1. `Promo`  *(this is "Hero" — the renamed homepage hero)*
2. `Marquee`  *(datasource = Destinations folder)*
3. `ValueProps`
4. `DestinationsGrid`  — **set rendering parameter `GridLimit = 3`** (Home shows a 3-card preview)
5. `ExperienceShowcase`
6. `StatsBand`
7. `PromoBand`
8. `Testimonials`
9. `NewsletterCTA`

### /destinations
1. `PageHero`  *(destinations hero content)*
2. `DestinationsGrid`  — **`GridLimit = 0`** (all six)
3. `NewsletterCTA`

### /experiences
1. `PageHero`
2. `ExperienceShowcase`
3. `StatsBand`
4. `NewsletterCTA`

### /about
1. `PageHero`
2. `RichTextSection`
3. `ValueProps`
4. `Testimonials`

### /contact
1. `PageHero`
2. `ContactForm`
3. `ContactDetails`

**Page mechanics:** create the four route items (`/destinations`, `/experiences`, `/about`,
`/contact`) under Home; give each the Page Design that includes the header/footer partials; drop
the renderings above into `headless-main` in order; point each at its datasource; author content.
Reuse a single folder per container across pages where the content is the same (e.g. one
`Destinations` folder feeds Home's preview, /destinations, and the Marquee).

---

## PHASE 4 — Publish & verify

Publish everything (templates, renderings, all folders + children, the 5 pages, partial designs).
Then say **check** — I'll probe each route and confirm renderings bind, content shows, chrome is
present, and nothing is "unknown component".

---

## PHASE 5 — Deploy to Vercel (last)

Once the pages look right on the live tenant, we deploy the head app to Vercel (env = the same
Edge contextId). I'll handle the head-app side; you provide/confirm the Vercel project.

---

### Quick status checklist
- [ ] Containers: ExperienceShowcase / StatsBand / Testimonials / ContactDetails / Marquee (query + clear resolver + content)
- [ ] Content: real copy in DestinationsGrid + ValueProps + all leaf items + PageHeros
- [ ] Pages: Home + /destinations + /experiences + /about + /contact composed
- [ ] Publish all → **check**
- [ ] Deploy to Vercel
