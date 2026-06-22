# Sitecore build guide — remaining components (batch 2)

Eight new head-app components are built, registered, and type-checked. This guide is what to
build in Sitecore to bind them. Two groups:

- **A. Resolver containers** (5) + **Marquee** — same recipe as `DestinationsGrid` (see
  `sitecore-build-containers.md` Part 1 for the click-by-click mechanics; here you get each
  component's field tables + verbatim content).
- **B. Splitters** (RowSplitter, ColumnSplitter) — same recipe as `Container` (see
  `sitecore-build-splitters.md`; here you get the placeholder keys + the count parameter).

All paths assume collection `cosmos`, site `aphelion`, resolver GUID
`{2F5C334E-5615-423C-8281-9FC180191302}`.

---

# Group A — Resolver containers

For **each** of these: build the **child** template → the **folder** template (inherits the
child, adds the scalars) → a **JSON rendering** (componentName, datasource = folder template,
**Children resolver GUID**) → **Available Renderings** → author a **folder + child items** →
place in Pages → publish. (Identical to DestinationsGrid — only names/fields/content differ.)

## A1 — ValueProps  ("Why Aphelion")

**Child template `ValueCard`** — `/sitecore/templates/Project/cosmos/ValueCard`

| Field | Type |
|---|---|
| `Icon` | Single-Line Text |
| `CardTitle` | Single-Line Text |
| `Body` | Multi-Line Text |

**Folder template `ValuePropsFolder`** (inherits `ValueCard`) — scalars:

| Field | Type |
|---|---|
| `Heading` | Single-Line Text |
| `Eyebrow` | Single-Line Text |
| `HeadingAccent` | Single-Line Text |

**Rendering:** `ValueProps` · datasource template `ValuePropsFolder` · Children resolver.

**Content** — folder:
```
Heading: Engineered for wonder,
Eyebrow: Why Aphelion
HeadingAccent: tuned for calm.
```
Children (3 × `ValueCard`):
```
1  Icon: ◇   CardTitle: Whisper-class craft
   Body: Our Lumen-series vessels carry forty guests in near-silence, with full-spectrum cupolas on every deck.
2  Icon: ✶   CardTitle: Guided by navigators
   Body: Every voyage is hosted by a flight navigator and an onboard astronomer who narrate the sky as it passes.
3  Icon: ❋   CardTitle: Carbon-settled travel
   Body: Each charter is fully offset at launch through our deep-orbit reclamation programme. Wonder without the weight.
```

## A2 — ExperienceShowcase

**Child template `ExperienceItem`** — fields:

| Field | Type |
|---|---|
| `ItemTitle` | Single-Line Text |
| `Summary` | Multi-Line Text |
| `ItemImage` | Image |
| `Duration` | Single-Line Text |
| `Cta` | General Link |

**Folder template `ExperienceShowcaseFolder`** (inherits `ExperienceItem`) — scalars `Heading`,
`Eyebrow`, `HeadingAccent` (all Single-Line Text).

**Rendering:** `ExperienceShowcase` · datasource `ExperienceShowcaseFolder` · Children resolver.

**Content** — folder:
```
Heading: Not just a view —
Eyebrow: Experiences
HeadingAccent: a way to be there.
```
Children (3 × `ExperienceItem`):
```
1  ItemTitle: The Silent Cupola
   Summary: Two hours, lights down, comms off. The whole deck given over to the sky and nothing else. Our most requested ritual.
   ItemImage: https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80&auto=format&fit=crop
      alt: Cyan-edged voxel 3D render suggesting an observation lattice.
   Duration: Every voyage
   Cta: text=Reserve a session  href=/contact
2  ItemTitle: Astronomer's Table
   Summary: Dine beside the cupola while our resident astronomer maps what you're seeing — course, distance, and the stories behind each light.
   ItemImage: https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&q=80&auto=format&fit=crop
      alt: Soft atmospheric abstract render.
   Duration: 3+ day routes
   Cta: text=Reserve a session  href=/contact
3  ItemTitle: Tether Walk
   Summary: Suit up for a guided drift outside the hull — fully tethered, fully held, entirely unforgettable.
   ItemImage: https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80&auto=format&fit=crop
      alt: Violet and magenta glowing abstract render.
   Duration: Caldera & Aphelion routes
   Cta: text=Reserve a session  href=/contact
```

## A3 — StatsBand  ⚠️ simplified vs the old spec

**No parameters template.** The old plan put suffix/decimals as band-level params, but the
stats are heterogeneous (`+`, `%`, a decimal). Instead **`StatValue` is self-describing** — the
head app parses the number, the trailing `+`/`%`, and the decimals straight from the value. So
you just author the value exactly as it should read.

**Child template `Stat`** — `StatValue` (Single-Line Text), `StatLabel` (Single-Line Text).
**Folder template `StatsBandFolder`** (inherits `Stat`) — scalar `BandHeading` (Single-Line Text).
**Rendering:** `StatsBand` · datasource `StatsBandFolder` · Children resolver · **no params template**.

**Content** — folder: `BandHeading: Aphelion by the numbers`
Children (4 × `Stat`):
```
1  StatValue: 7      StatLabel: Flagship routes
2  StatValue: 1240+  StatLabel: Guests carried
3  StatValue: 100%   StatLabel: Safe-return record
4  StatValue: 4.9    StatLabel: Guest rating
```

## A4 — Testimonials  ("Mission log")

**Child template `TestimonialCard`** — `Quote` (Multi-Line Text), `Author` (Single-Line),
`Role` (Single-Line), `Avatar` (Image, optional).
**Folder template `TestimonialsFolder`** (inherits `TestimonialCard`) — scalars `Heading`,
`Eyebrow`, `HeadingAccent`.
**Rendering:** `Testimonials` · datasource `TestimonialsFolder` · Children resolver.

**Content** — folder:
```
Heading: What the drift
Eyebrow: Mission log
HeadingAccent: leaves behind.
```
Children (3 × `TestimonialCard`, leave `Avatar` empty):
```
1  Quote: "The silence in the cupola undid something in me — in the best way. I came back lighter."
   Author: Inara Voss        Role: Vela Drift, 2418
2  Quote: "I've travelled everywhere on Earth. Nothing prepared me for amber seas at three in the morning."
   Author: Dr. Okonkwo Reyes  Role: Caldera Prime, 2417
3  Quote: "The astronomer named every light we passed. I'll never look up the same way again."
   Author: Lena Maru          Role: The Lyrae Arc, 2418
```

## A5 — ContactDetails

**Child template `ContactDetailItem`** — `DetailLabel` (Single-Line), `DetailValue`
(Single-Line), `DetailLink` (General Link, optional).
**Folder template `ContactDetailsFolder`** (inherits `ContactDetailItem`) — scalar
`SectionHeading` (Single-Line Text).
**Rendering:** `ContactDetails` · datasource `ContactDetailsFolder` · Children resolver.

**Content** — folder: `SectionHeading: Other ways to reach us`
Children (3 × `ContactDetailItem`):
```
1  DetailLabel: Manifest line   DetailValue: +1 (800) APH-ELIO
   DetailLink: href=tel:+18002743546
2  DetailLabel: Email           DetailValue: voyages@aphelion.example
   DetailLink: href=mailto:voyages@aphelion.example
3  DetailLabel: Response time   DetailValue: Within one orbit — typically 24 hours.
   DetailLink: (leave empty)
```

## A6 — Marquee  (reuses the Destinations data — no new content)

- **Rendering:** `Marquee` · **datasource = the EXISTING `Destinations` folder** you built for
  DestinationsGrid · **Children resolver** (same GUID).
- The head app reads only each child's `Name` field and renders the scrolling strip. **Author
  nothing new** — it re-uses the destination items. (This is the "reuse data, not presentation"
  payoff of the resolver pattern: two renderings consume one folder.)

---

# Group B — Splitters (placeholder composition)

Same as `Container` (`sitecore-build-splitters.md`): a **Placeholder Settings** item with a
dynamic key + **Allowed Controls**, a no-datasource **rendering** that references it, **Available
Renderings**, then compose on canvas. The only extra is a **count parameter**.

## B1 — RowSplitter  (N stacked drop zones)

- **Placeholder Settings:** key `row-{*}` (matches the head app's requested `row-1`, `row-2`, …);
  set Allowed Controls to the renderings you want to allow.
- **Rendering:** `RowSplitter` · no datasource · **Placeholders** field → the `row-{*}` settings item.
- **Parameters template `RowSplitterParams`** (optional): `Rows` (Single-Line Text, integer;
  default 2). The head app renders that many stacked placeholders.

## B2 — ColumnSplitter  (N side-by-side drop zones)

- **Placeholder Settings:** key `column-{*}` (matches `column-1`, `column-2`, …); Allowed Controls.
- **Rendering:** `ColumnSplitter` · no datasource · **Placeholders** field → the `column-{*}` settings item.
- **Parameters template `ColumnSplitterParams`** (optional): `Columns` (integer; default 2).

> Both must render their children as **server** components (already handled in code — they
> forward the injected `page`/server `componentMap`, build-trap #7). If a dropped-in child shows
> "unknown component," tell me — that's a head-app fix, not your Sitecore build.

---

# Suggested placement (flexible — compose freely in Pages)

| Page | Renderings (top → bottom) |
|---|---|
| **Home** | `Promo` → `ValueProps` → `DestinationsGrid` (GridLimit=3) → `ExperienceShowcase` → `StatsBand` → `PromoBand` → `Testimonials` → `Marquee` → `NewsletterCTA` |
| **Destinations** | `PageHero` → `DestinationsGrid` (GridLimit=0) → `NewsletterCTA` |
| **Experiences** | `PageHero` → `ExperienceShowcase` → `NewsletterCTA` |
| **About** | `PageHero` → `ValueProps` → `StatsBand` → `Testimonials` |
| **Contact** | `PageHero` → `ContactForm` → `ContactDetails` |

---

# When you're done

Publish the templates, renderings, parameters/placeholder-settings items, all content folders +
children, and the pages. Then say **check** — I'll render each against Edge and confirm bindings,
source order, the scalar-fields-with-items question, count-up parsing on StatsBand, the Marquee
re-use, and that splitter children bind (not "unknown component").

**Built head-app components (all registered, tsc clean):** ValueProps, ExperienceShowcase,
StatsBand (client), Testimonials, ContactDetails, Marquee, RowSplitter, ColumnSplitter.
