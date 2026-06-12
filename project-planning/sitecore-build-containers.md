# Sitecore build guide — Container components (Children resolver)

**Scope:** add the **container** components to your tenant. These differ from the leaf
components you already built: a container's datasource is a **folder** whose **child items**
become the cards/rows it renders. The SXA **Children Rendering Contents Resolver** delivers
those children to the head app as a list.

**Build `DestinationsGrid` first (Part 1, full worked example).** Once it renders correctly,
the other five containers are the identical recipe with different field names (Part 2).

> **What this tranche is proving (one open question):** whether the Children resolver returns
> the folder's **own scalar fields** (Heading/Eyebrow/Intro) *alongside* the children, or only
> the children. The head-app component handles both cases, so either way the cards render — but
> if the section heading comes out blank, that's the answer (and I'll adjust how scalars are
> sourced). Don't treat a blank heading as a mistake on your side.

The head-app component is already built, registered, and type-checks — `componentName`
**`DestinationsGrid`** is ready to bind. You only do the Sitecore side below.

---

## Part 1 — `DestinationsGrid` (full recipe)

All paths assume collection `cosmos`, site `aphelion`.

### Step 1 — Child datasource template: `DestinationCard`

**Path:** `/sitecore/templates/Project/cosmos/DestinationCard`
Create a template with one section (e.g. `Content`) and these fields:

| Field Name | Field Type |
|------------|------------|
| `Name`      | Single-Line Text |
| `Tagline`   | Single-Line Text |
| `CardImage` | Image |
| `Distance`  | Single-Line Text |
| `Detail`    | Multi-Line Text |
| `CardLink`  | General Link |

> Field names must match **exactly** (case-sensitive) — the head app reads `item.fields.Name`,
> `item.fields.CardImage`, etc.

### Step 2 — Folder (container) datasource template: `DestinationsGridFolder`

**Path:** `/sitecore/templates/Project/cosmos/DestinationsGridFolder`
**Base template / inherits:** `DestinationCard` (so the folder can hold `DestinationCard`
children and the SXA convention is satisfied).
Add these **scalar** fields (the section head):

| Field Name | Field Type |
|------------|------------|
| `Heading`       | Single-Line Text |
| `Eyebrow`       | Single-Line Text |
| `HeadingAccent` | Single-Line Text |
| `Intro`         | Multi-Line Text |

**Insert Options:** on this template's `__Standard Values` (or the folder item), set Insert
Options to allow **`DestinationCard`** so authors can add cards.

### Step 3 — Rendering item: `DestinationsGrid`

**Path:** `/sitecore/layout/Renderings/Project/cosmos/DestinationsGrid`
Create a **JSON Rendering** with:

| Field | Value |
|-------|-------|
| **Component Name** | `DestinationsGrid` (verbatim — binds to the head-app component-map) |
| **Datasource Template** | `/sitecore/templates/Project/cosmos/DestinationsGridFolder` |
| **Datasource Location** | wherever you keep this site's data (e.g. `/sitecore/content/cosmos/aphelion/Data/Destinations`) |
| **Rendering Contents Resolver** | **Datasource Children** — `{2F5C334E-5615-423C-8281-9FC180191302}` |
| **Parameters Template** | `/sitecore/templates/Project/cosmos/Parameters/DestinationsGridParams` (Step 4) |

> The **Rendering Contents Resolver** is the load-bearing field. Without it set to the
> Children resolver GUID above, the head app receives no `items` and the grid renders empty.

### Step 4 — Parameters template: `DestinationsGridParams`

**Path:** `/sitecore/templates/Project/cosmos/Parameters/DestinationsGridParams`

| Parameter Name | Field Type | Purpose |
|----------------|------------|---------|
| `GridLimit` | Single-Line Text (integer string) | `0` or empty = show all; `3` = first 3 (Home preview) |

> Avoid the generic names `Items` / `Depth` / `Levels` — they collide with SXA base fields.

### Step 5 — Available Renderings

Add `DestinationsGrid` to the site's **Available Renderings** (Presentation → the placeholder
settings / available renderings list for `aphelion`) so it can be placed in Pages.

### Step 6 — Datasource content: the folder + six cards

Under your datasource location, create:

**The folder** — item of template `DestinationsGridFolder`, name it e.g. `Destinations`:

```
Heading:       Six points worth the
Eyebrow:       Destinations
HeadingAccent: distance.
Intro:         From the inner glow of the Halcyon Belt to the long dark of Aphelion Point — choose where your story bends.
```

**Six child items** of template `DestinationCard` (create them *inside* the `Destinations`
folder, in this order — source order is preserved):

**1 — `Halcyon Belt`**
```
Name:     Halcyon Belt
Tagline:  Closest of our routes
Distance: 2 days
Detail:   A shimmering ring of ice and light. Closest of our routes — the perfect first drift.
CardImage (Image): https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=600&q=80&auto=format&fit=crop
   alt: Fluid blue and violet rendered waves.
CardLink (General Link): text=Plan this voyage  href=/contact
```

**2 — `Vela Drift`**
```
Name:     Vela Drift
Tagline:  Ride the slow current
Distance: 4 days
Detail:   Ride the slow current of the Vela stream, where dust catches starlight like falling silk.
CardImage: https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&auto=format&fit=crop
   alt: Purple and cyan fluid render.
CardLink: text=Plan this voyage  href=/contact
```

**3 — `The Lyrae Arc`**
```
Name:     The Lyrae Arc
Tagline:  Auroral corridor
Distance: 6 days
Detail:   An auroral corridor that paints the cupola in moving colour for the length of the passage.
CardImage: https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80&auto=format&fit=crop
   alt: Violet and magenta glowing render.
CardLink: text=Plan this voyage  href=/contact
```

**4 — `Caldera Prime`**
```
Name:     Caldera Prime
Tagline:  Most dramatic vantage
Distance: 8 days
Detail:   Orbit a world of molten amber seas. Our most dramatic vantage — and our quietest nights.
CardImage: https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=600&q=80&auto=format&fit=crop
   alt: Violet grain gradient render.
CardLink: text=Plan this voyage  href=/contact
```

**5 — `Umbra Station`**
```
Name:     Umbra Station
Tagline:  Far outpost dock
Distance: 10 days
Detail:   Dock at the system's far outpost. Walk the observation ring above an endless field of dark.
CardImage: https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?w=600&q=80&auto=format&fit=crop
   alt: Teal and blush diagonal abstract planes.
CardLink: text=Plan this voyage  href=/contact
```

**6 — `Aphelion Point`**
```
Name:     Aphelion Point
Tagline:  The farthest light
Distance: 14 days
Detail:   The farthest light. Our namesake voyage to the system's edge, where the sun is just one more star.
CardImage: https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80&auto=format&fit=crop
   alt: Deep nebular gradient.
CardLink: text=Plan this voyage  href=/contact
```

### Step 7 — Place it on a page

In **Pages**, on your test page (or a new `Destinations` page), add the **`DestinationsGrid`**
rendering and point its datasource at the `Destinations` folder. Optionally set the
`GridLimit` rendering parameter (leave empty/`0` for all six; `3` for a Home-style preview).

### Step 8 — Publish

Publish the templates, rendering, parameters template, the `Destinations` folder **and its six
children**, and the page. Then tell me **check** — I'll render it against Edge and confirm:
- all six cards bind (Name / Distance / Detail / image / link),
- correct source order,
- whether the section heading scalars came through (the open question above),
- `GridLimit` truncation works.

---

## Part 2 — The other five containers (same recipe, different fields)

Each is **identical** to Part 1: build the child template, build the folder template that
**inherits** the child template + adds scalar fields, create the rendering with the **same
Children resolver GUID** `{2F5C334E-5615-423C-8281-9FC180191302}`, add Available Renderings,
author a folder + children, publish. Only the names/fields below change. (Head-app components
for these are **not yet ported** — build them in Sitecore when ready and I'll port each to
bind; or wait until `DestinationsGrid` is verified and I'll port all five together.)

### ValueProps
- **Rendering / componentName:** `ValueProps` · **Folder template:** `ValuePropsFolder` (inherits `ValueCard`)
- **Folder scalars:** `Heading`, `Eyebrow`, `HeadingAccent`
- **Child template `ValueCard`:** `Icon` (Single-Line), `CardTitle` (Single-Line), `Body` (Multi-Line)
- **Params:** none

### ExperienceShowcase
- **Rendering / componentName:** `ExperienceShowcase` · **Folder template:** `ExperienceShowcaseFolder` (inherits `ExperienceItem`)
- **Folder scalars:** `Heading`, `Eyebrow`, `HeadingAccent`
- **Child template `ExperienceItem`:** `ItemTitle` (Single-Line), `Summary` (Multi-Line), `ItemImage` (Image), `Duration` (Single-Line), `Cta` (General Link)
- **Params:** none

### StatsBand
- **Rendering / componentName:** `StatsBand` · **Folder template:** `StatsBandFolder` (inherits `Stat`)
- **Folder scalars:** `BandHeading` (Single-Line)
- **Child template `Stat`:** `StatValue` (Single-Line), `StatLabel` (Single-Line)
- **Params template `StatsBandParams`:** `CountUpSuffix` (Single-Line), `CountUpPrefix` (Single-Line), `CountUpDecimals` (Integer)

### Testimonials
- **Rendering / componentName:** `Testimonials` · **Folder template:** `TestimonialsFolder` (inherits `TestimonialCard`)
- **Folder scalars:** `Heading`, `Eyebrow`, `HeadingAccent`
- **Child template `TestimonialCard`:** `Quote` (Multi-Line), `Author` (Single-Line), `Role` (Single-Line), `Avatar` (Image, optional)
- **Params:** none

### ContactDetails (net-new vs static)
- **Rendering / componentName:** `ContactDetails` · **Folder template:** `ContactDetailsFolder` (inherits `ContactDetailItem`)
- **Folder scalars:** `SectionHeading` (Single-Line)
- **Child template `ContactDetailItem`:** `DetailLabel` (Single-Line), `DetailValue` (Single-Line), `DetailLink` (General Link, optional)
- **Params:** none

### Marquee (no datasource)
- **Rendering / componentName:** `Marquee` · **No datasource template, no content.**
- The head app derives the marquee from the published `Destination` child items at render
  (their `Name` field, source order). Just create the rendering item + add Available
  Renderings so it can be placed. Nothing else to author.

---

## Quick reference — the Children-resolver pattern

1. **Child template** = one card/row's fields (a leaf).
2. **Folder template** = inherits the child template + adds the section's scalar fields; holds the children.
3. **Rendering** = `componentName` + datasource = folder template + **Children resolver GUID** `{2F5C334E-5615-423C-8281-9FC180191302}`.
4. **Content** = a folder item + N child items (source order preserved).
5. The head app receives `fields.items[]` and maps over them; `componentName` must match exactly.

**The two things that most commonly go wrong:** (a) the Rendering Contents Resolver not set to
the Children GUID → empty grid; (b) a field name mismatch → that field renders blank.
