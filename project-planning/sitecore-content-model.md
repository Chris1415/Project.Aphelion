# Aphelion — Sitecore Content-Model Spec

**Act 2 operator runbook.** Derived mechanically from the static app's component prop
boundaries (ADR-0005). Execute top-to-bottom; every step depends on the ones above it.

```
SITE_COLLECTION_NAME = cosmos
SITE_NAME            = aphelion
```

---

## Derivation log

**Source:** `static/src/components/*/index.tsx` Props interfaces +
`static/src/content/*.ts` content values. ADR-0005 mapping rules applied:

- **Leaf component** → one flat datasource template; one prop = one Sitecore field
  (string headline → Single-Line Text; HTML body → Rich Text; `ImageField{src,alt}` →
  Image; `CtaLink{label,href}` → General Link).
- **Container/list component** → one folder template (datasource = folder item) +
  one child-item template (each array element). Container-level scalars become fields on
  the folder item. Resolver = Children (`{2F5C334E-5615-423C-8281-9FC180191302}`,
  confirmed SXA foundation GUID).
- **Nav (SiteHeader / SiteFooter / MobileNav)** → EXCLUDED. Sourced via the
  component-level navigation pattern in Act 3 (PRD-001). Not derived here.
- **`limit` on DestinationsGrid** → rendering PARAMETER (not a field); governs how
  many child items to display per placement.
- **`countTo`, `decimals`, `suffix`, `prefix` on Stat** → rendering PARAMETERS (not
  fields); drive the client-side count-up animation. `value` and `label` are datasource
  fields.
- **ContactDetails (rendered inline in contact/page.tsx)** → datasource template
  `ContactDetailsFolder` with child template `ContactDetailItem`. Not a named component
  folder, but a content-model entity derived from the `ContactDetailsProps` interface in
  `contact.ts`. Flagged with NET-NEW note below.

**Net-new flags — ALL RESOLVED 2026-06-11 (PRD-001 kickoff):**

- `HeroMeta[]` array on `Hero`: **RESOLVED → option (b): flatten to 3×2 Single-Line Text
  fields** (`MetaValue1`/`MetaLabel1` … `MetaValue3`/`MetaLabel3`) on the `Hero`
  datasource template. Already reflected in § 3-A. No `HeroMetaFolder` is created.

- `headingAccent` optional prop on container components (ValueProps, DestinationsGrid,
  ExperienceShowcase, Testimonials): in the static app this is a `string` scalar that
  gets `.kinetic` styling. Maps cleanly to a Single-Line Text field on the folder
  datasource item. **Not net-new** — noted here to confirm the mapping is intentional
  (it is; one field per scalar).

- `ContactDetails` (inline in `contact/page.tsx`): the contact route renders a
  contact-details panel from `contactDetailsContent` directly in the route file (not via
  a named component folder). The operator needs a rendering + datasource for this panel
  in the head app. **NET-NEW rendering** — the static app has no
  `src/components/ContactDetails/` folder. Derivation is straightforward (see § 3 spec
  table row for `ContactDetails`), but the operator must create the rendering item and
  Datasource template as part of this runbook.

---

## Dependency-ordered operator checklist

```
□ 1.  Site collection node             /sitecore/content/cosmos
□ 2.  Site node                        /sitecore/content/cosmos/aphelion
□ 3.  Datasource templates (leaf)      one per leaf component — with fields + types
□ 4.  Child templates                  one per container's child type
□ 5.  Folder templates                 one per container component — with scalar fields
□ 6.  Parameters templates             one per component that has rendering params
□ 7.  Rendering items                  one per componentName (JSON rendering; exact name)
□ 8.  Available Renderings             add each rendering to the site's placeholder settings
□ 9.  Page items + presentation        5 route items; place renderings into placeholders
□ 10. Datasource content items         folder + child items with verbatim field values
□ 11. Headless Variant items           none required for PRD-000 (no variants defined)
□ 12. Publish                          publish the cosmos/aphelion subtree to Edge
```

---

## Step 1 — Site collection node

| Path | Template |
|------|----------|
| `/sitecore/content/cosmos` | Sitecore site collection |

---

## Step 2 — Site node

| Path | Template | Field | Value |
|------|----------|-------|-------|
| `/sitecore/content/cosmos/aphelion` | Sitecore site | Site Name | `aphelion` |

---

## Step 3 — Datasource templates (leaf components)

Create under `/sitecore/templates/Project/cosmos/`.

### 3-A. Hero Datasource Template

**Template name:** `Hero`
**Path:** `/sitecore/templates/Project/cosmos/Hero`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| Eyebrow | Single-Line Text | `eyebrow` |
| Title | Single-Line Text | `title` |
| TitleAccent | Single-Line Text | `titleAccent` |
| Lede | Multi-Line Text | `lede` |
| PrimaryCta | General Link | `primaryCta` |
| SecondaryCta | General Link | `secondaryCta` (optional) |
| HeroImage | Image | `image` |
| MetaValue1 | Single-Line Text | `meta[0].value` (NET-NEW: flattened from array — see derivation log) |
| MetaLabel1 | Single-Line Text | `meta[0].label` |
| MetaValue2 | Single-Line Text | `meta[1].value` |
| MetaLabel2 | Single-Line Text | `meta[1].label` |
| MetaValue3 | Single-Line Text | `meta[2].value` |
| MetaLabel3 | Single-Line Text | `meta[2].label` |

### 3-B. PageHero Datasource Template

**Template name:** `PageHero`
**Path:** `/sitecore/templates/Project/cosmos/PageHero`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| Title | Single-Line Text | `title` |
| Subtitle | Multi-Line Text | `subtitle` |
| HeroImage | Image | `image` (optional) |

### 3-C. ValueCard Datasource Template (child template)

**Template name:** `ValueCard`
**Path:** `/sitecore/templates/Project/cosmos/ValueCard`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| Icon | Single-Line Text | `icon` |
| CardTitle | Single-Line Text | `title` |
| Body | Multi-Line Text | `body` |

### 3-D. DestinationCard Datasource Template (child template)

**Template name:** `DestinationCard`
**Path:** `/sitecore/templates/Project/cosmos/DestinationCard`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| Name | Single-Line Text | `name` |
| Tagline | Single-Line Text | `tagline` |
| CardImage | Image | `image` |
| Distance | Single-Line Text | `distance` |
| Detail | Multi-Line Text | `detail` |
| CardLink | General Link | `link` |

### 3-E. ExperienceItem Datasource Template (child template)

**Template name:** `ExperienceItem`
**Path:** `/sitecore/templates/Project/cosmos/ExperienceItem`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| ItemTitle | Single-Line Text | `title` |
| Summary | Multi-Line Text | `summary` |
| ItemImage | Image | `image` |
| Duration | Single-Line Text | `duration` |
| Cta | General Link | `cta` |

### 3-F. Stat Datasource Template (child template)

**Template name:** `Stat`
**Path:** `/sitecore/templates/Project/cosmos/Stat`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| StatValue | Single-Line Text | `value` |
| StatLabel | Single-Line Text | `label` |

*Note: `countTo`, `decimals`, `suffix`, `prefix` are rendering PARAMETERS on the
StatsBand parameters template (§ 6-E), not datasource fields.*

### 3-G. PromoBand Datasource Template

**Template name:** `PromoBand`
**Path:** `/sitecore/templates/Project/cosmos/PromoBand`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| Eyebrow | Single-Line Text | `eyebrow` |
| Heading | Single-Line Text | `heading` |
| HeadingAccent | Single-Line Text | `headingAccent` (optional) |
| Body | Multi-Line Text | `body` |
| Cta | General Link | `cta` |
| PromoImage | Image | `image` (optional) |

### 3-H. TestimonialCard Datasource Template (child template)

**Template name:** `TestimonialCard`
**Path:** `/sitecore/templates/Project/cosmos/TestimonialCard`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| Quote | Multi-Line Text | `quote` |
| Author | Single-Line Text | `author` |
| Role | Single-Line Text | `role` |
| Avatar | Image | `avatar` (optional) |

### 3-I. NewsletterCTA Datasource Template

**Template name:** `NewsletterCTA`
**Path:** `/sitecore/templates/Project/cosmos/NewsletterCTA`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| Heading | Single-Line Text | `heading` |
| HeadingAccent | Single-Line Text | `headingAccent` (optional) |
| Body | Multi-Line Text | `body` |
| Placeholder | Single-Line Text | `placeholder` |
| ButtonLabel | Single-Line Text | `buttonLabel` |

### 3-J. RichTextSection Datasource Template

**Template name:** `RichTextSection`
**Path:** `/sitecore/templates/Project/cosmos/RichTextSection`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| SectionHeading | Single-Line Text | `heading` |
| Body | Rich Text | `body` (HTML markup) |

### 3-K. ContactForm Datasource Template

**Template name:** `ContactForm`
**Path:** `/sitecore/templates/Project/cosmos/ContactForm`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| FormHeading | Single-Line Text | `heading` |
| Intro | Multi-Line Text | `intro` |
| NameLabel | Single-Line Text | `nameLabel` |
| EmailLabel | Single-Line Text | `emailLabel` |
| MessageLabel | Single-Line Text | `messageLabel` |
| ButtonLabel | Single-Line Text | `buttonLabel` |

### 3-L. ContactDetailItem Datasource Template (child template — NET-NEW rendering)

**Template name:** `ContactDetailItem`
**Path:** `/sitecore/templates/Project/cosmos/ContactDetailItem`

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| DetailLabel | Single-Line Text | `label` |
| DetailValue | Single-Line Text | `value` |
| DetailLink | General Link | `href` (optional — `href?` in static prop; leave empty for items without a link) |

---

## Step 4 — Folder (container) templates

Create under `/sitecore/templates/Project/cosmos/`.

### 4-A. ValueProps Folder Template

**Template name:** `ValuePropsFolder`
**Path:** `/sitecore/templates/Project/cosmos/ValuePropsFolder`
**Inherits:** `ValueCard` (children are `ValueCard` items)

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| Heading | Single-Line Text | `heading` |
| Eyebrow | Single-Line Text | `eyebrow` (optional) |
| HeadingAccent | Single-Line Text | `headingAccent` (optional) |

*Insert policy: children must be of template `ValueCard`.*

### 4-B. DestinationsGrid Folder Template

**Template name:** `DestinationsGridFolder`
**Path:** `/sitecore/templates/Project/cosmos/DestinationsGridFolder`
**Inherits:** `DestinationCard` (children are `DestinationCard` items)

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| Heading | Single-Line Text | `heading` |
| Eyebrow | Single-Line Text | `eyebrow` (optional) |
| HeadingAccent | Single-Line Text | `headingAccent` (optional) |
| Intro | Multi-Line Text | `intro` (optional) |

*Insert policy: children must be of template `DestinationCard`.*

### 4-C. ExperienceShowcase Folder Template

**Template name:** `ExperienceShowcaseFolder`
**Path:** `/sitecore/templates/Project/cosmos/ExperienceShowcaseFolder`
**Inherits:** `ExperienceItem` (children are `ExperienceItem` items)

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| Heading | Single-Line Text | `heading` |
| Eyebrow | Single-Line Text | `eyebrow` (optional) |
| HeadingAccent | Single-Line Text | `headingAccent` (optional) |

*Insert policy: children must be of template `ExperienceItem`.*

### 4-D. StatsBand Folder Template

**Template name:** `StatsBandFolder`
**Path:** `/sitecore/templates/Project/cosmos/StatsBandFolder`
**Inherits:** `Stat` (children are `Stat` items)

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| BandHeading | Single-Line Text | `heading` (optional) |

*Insert policy: children must be of template `Stat`.*

### 4-E. Testimonials Folder Template

**Template name:** `TestimonialsFolder`
**Path:** `/sitecore/templates/Project/cosmos/TestimonialsFolder`
**Inherits:** `TestimonialCard` (children are `TestimonialCard` items)

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| Heading | Single-Line Text | `heading` |
| Eyebrow | Single-Line Text | `eyebrow` (optional) |
| HeadingAccent | Single-Line Text | `headingAccent` (optional) |

*Insert policy: children must be of template `TestimonialCard`.*

### 4-F. ContactDetails Folder Template (NET-NEW rendering)

**Template name:** `ContactDetailsFolder`
**Path:** `/sitecore/templates/Project/cosmos/ContactDetailsFolder`
**Inherits:** `ContactDetailItem` (children are `ContactDetailItem` items)

| Field Name | Sitecore Field Type | Maps to Prop |
|------------|---------------------|--------------|
| SectionHeading | Single-Line Text | `heading` |

*Insert policy: children must be of template `ContactDetailItem`.*

---

## Step 5 — Rendering items

Create JSON rendering items under
`/sitecore/layout/Renderings/Project/cosmos/`.

**CRITICAL: the `componentName` value in each rendering item MUST match the
`src/components/<Name>/` folder name EXACTLY. A mismatch renders `<MissingComponent>`
in the head app.**

| componentName (verbatim) | Rendering item path | Datasource Template | Rendering Contents Resolver | Notes |
|--------------------------|---------------------|---------------------|----------------------------|-------|
| `"Hero"` | `/sitecore/layout/Renderings/Project/cosmos/Hero` | `Hero` | none (Standard Datasource — Shape A) | Leaf |
| `"PageHero"` | `/sitecore/layout/Renderings/Project/cosmos/PageHero` | `PageHero` | none (Standard Datasource — Shape A) | Leaf |
| `"ValueProps"` | `/sitecore/layout/Renderings/Project/cosmos/ValueProps` | `ValuePropsFolder` | `{2F5C334E-5615-423C-8281-9FC180191302}` Children resolver | Container |
| `"DestinationsGrid"` | `/sitecore/layout/Renderings/Project/cosmos/DestinationsGrid` | `DestinationsGridFolder` | `{2F5C334E-5615-423C-8281-9FC180191302}` Children resolver | Container |
| `"ExperienceShowcase"` | `/sitecore/layout/Renderings/Project/cosmos/ExperienceShowcase` | `ExperienceShowcaseFolder` | `{2F5C334E-5615-423C-8281-9FC180191302}` Children resolver | Container |
| `"StatsBand"` | `/sitecore/layout/Renderings/Project/cosmos/StatsBand` | `StatsBandFolder` | `{2F5C334E-5615-423C-8281-9FC180191302}` Children resolver | Container |
| `"PromoBand"` | `/sitecore/layout/Renderings/Project/cosmos/PromoBand` | `PromoBand` | none (Standard Datasource — Shape A) | Leaf |
| `"Testimonials"` | `/sitecore/layout/Renderings/Project/cosmos/Testimonials` | `TestimonialsFolder` | `{2F5C334E-5615-423C-8281-9FC180191302}` Children resolver | Container |
| `"NewsletterCTA"` | `/sitecore/layout/Renderings/Project/cosmos/NewsletterCTA` | `NewsletterCTA` | none (Standard Datasource — Shape A) | Leaf |
| `"RichTextSection"` | `/sitecore/layout/Renderings/Project/cosmos/RichTextSection` | `RichTextSection` | none (Standard Datasource — Shape A) | Leaf |
| `"ContactForm"` | `/sitecore/layout/Renderings/Project/cosmos/ContactForm` | `ContactForm` | none (Standard Datasource — Shape A) | Leaf |
| `"ContactDetails"` | `/sitecore/layout/Renderings/Project/cosmos/ContactDetails` | `ContactDetailsFolder` | `{2F5C334E-5615-423C-8281-9FC180191302}` Children resolver | NET-NEW rendering; inline in contact/page.tsx in static app |
| `"Marquee"` | `/sitecore/layout/Renderings/Project/cosmos/Marquee` | none (no content datasource) | none | See Marquee note below |

**Marquee note — RESOLVED 2026-06-11:** sourcing strategy = **derived from the published
`Destination` child items at render time** (all of them, **Sitecore source order**, the
**`Name`** field only, no truncation). **No marquee datasource template; no marquee
content item.** The `"Marquee"` rendering item still exists (Step 5) so component-map
registration works and it can be placed on Home; at render the head app reads the
`Destinations` folder's children. Operator builds nothing extra for the marquee.

---

## Step 6 — Parameters templates

Create under `/sitecore/templates/Project/cosmos/Parameters/`.
Only components that need rendering-level overrides get a parameters template.

### 6-A. DestinationsGrid Parameters Template

**Template name:** `DestinationsGridParams`
**Path:** `/sitecore/templates/Project/cosmos/Parameters/DestinationsGridParams`

| Parameter Name | Type | Valid values | Purpose |
|----------------|------|--------------|---------|
| GridLimit | Integer | `0` (all) or positive int | Limits rendered child count. `3` on Home, `0` (all) on /destinations |

*Avoid generic names (`Items`, `Depth`, `Levels`) — they collide with base templates.*

### 6-B. StatsBand Parameters Template

**Template name:** `StatsBandParams`
**Path:** `/sitecore/templates/Project/cosmos/Parameters/StatsBandParams`

| Parameter Name | Type | Valid values | Purpose |
|----------------|------|--------------|---------|
| CountUpSuffix | Single-Line Text | `+`, `%`, or empty | Appended to animated numeral |
| CountUpPrefix | Single-Line Text | string or empty | Prepended to animated numeral |
| CountUpDecimals | Integer | `0`, `1` | Decimal places for count-up animation |

*These match `StatProps.suffix`, `StatProps.prefix`, `StatProps.decimals` from the static
app. They are per-placement overrides; the primary `value` and `label` remain datasource
fields.*

---

## Step 7 — Per-rendering spec table (full reference)

| Component | componentName | Pattern | Datasource Template | Datasource Fields | Parameters Template | Parameters | Resolver GUID | Headless Variants |
|-----------|---------------|---------|---------------------|-------------------|---------------------|------------|---------------|-------------------|
| Hero | `"Hero"` | Standard DS (Shape A) | `Hero` | Eyebrow, Title, TitleAccent, Lede, PrimaryCta, SecondaryCta, HeroImage, MetaValue1–3, MetaLabel1–3 | none | — | none | none |
| PageHero | `"PageHero"` | Standard DS (Shape A) | `PageHero` | Title, Subtitle, HeroImage | none | — | none | none |
| ValueProps | `"ValueProps"` | Children (Shape B) | `ValuePropsFolder` | Heading, Eyebrow, HeadingAccent | none | — | `{2F5C334E-…0191302}` | none |
| DestinationsGrid | `"DestinationsGrid"` | Children (Shape B) | `DestinationsGridFolder` | Heading, Eyebrow, HeadingAccent, Intro | `DestinationsGridParams` | GridLimit | `{2F5C334E-…0191302}` | none |
| ExperienceShowcase | `"ExperienceShowcase"` | Children (Shape B) | `ExperienceShowcaseFolder` | Heading, Eyebrow, HeadingAccent | none | — | `{2F5C334E-…0191302}` | none |
| StatsBand | `"StatsBand"` | Children (Shape B) | `StatsBandFolder` | BandHeading | `StatsBandParams` | CountUpSuffix, CountUpPrefix, CountUpDecimals | `{2F5C334E-…0191302}` | none |
| PromoBand | `"PromoBand"` | Standard DS (Shape A) | `PromoBand` | Eyebrow, Heading, HeadingAccent, Body, Cta, PromoImage | none | — | none | none |
| Testimonials | `"Testimonials"` | Children (Shape B) | `TestimonialsFolder` | Heading, Eyebrow, HeadingAccent | none | — | `{2F5C334E-…0191302}` | none |
| NewsletterCTA | `"NewsletterCTA"` | Standard DS (Shape A) | `NewsletterCTA` | Heading, HeadingAccent, Body, Placeholder, ButtonLabel | none | — | none | none |
| RichTextSection | `"RichTextSection"` | Standard DS (Shape A) | `RichTextSection` | SectionHeading, Body (Rich Text) | none | — | none | none |
| ContactForm | `"ContactForm"` | Standard DS (Shape A) | `ContactForm` | FormHeading, Intro, NameLabel, EmailLabel, MessageLabel, ButtonLabel | none | — | none | none |
| ContactDetails | `"ContactDetails"` | Children (Shape B) | `ContactDetailsFolder` | SectionHeading | none | — | `{2F5C334E-…0191302}` | none |
| Marquee | `"Marquee"` | — | none | — (NET-NEW: strategy TBD) | — | — | none | none |
| SiteHeader | (nav exception) | — | — | — | — | — | — | Act 3 / PRD-001 |
| SiteFooter | (nav exception) | — | — | — | — | — | — | Act 3 / PRD-001 |

**Children resolver GUID full value:** `{2F5C334E-5615-423C-8281-9FC180191302}`
(Datasource Children — standard SXA foundation, confirmed 2026-05-27).

---

## Step 8 — Available Renderings

Add each rendering from Step 5 to the site's placeholder settings.
Path: `/sitecore/content/cosmos/aphelion/Presentation/Available Renderings/`

Create one Available Renderings item named `cosmos Renderings` and add all 13 renderings
from the table in Step 5 to the Renderings field.

---

## Step 9 — Page items + presentation

### 9-A. Page templates and placeholder

All 5 pages share the same placeholder: `headless-main`
(the head-app catch-all renders `{children}` inside `<main id="main">`; in the CMS this
maps to a single named placeholder per page item).

Create page items under `/sitecore/content/cosmos/aphelion/home/`:

| Route | Page item path | Page template |
|-------|---------------|---------------|
| `/` (Home) | `/sitecore/content/cosmos/aphelion/home` | Aphelion Page |
| `/destinations` | `/sitecore/content/cosmos/aphelion/home/Destinations` | Aphelion Page |
| `/experiences` | `/sitecore/content/cosmos/aphelion/home/Experiences` | Aphelion Page |
| `/about` | `/sitecore/content/cosmos/aphelion/home/About` | Aphelion Page |
| `/contact` | `/sitecore/content/cosmos/aphelion/home/Contact` | Aphelion Page |

### 9-B. Home page (/) — rendering placements

Placeholder: `headless-main`

| Order | componentName | Datasource item | Parameters |
|-------|---------------|-----------------|------------|
| 1 | `"Hero"` | `/sitecore/content/cosmos/aphelion/Data/HomeHero` | — |
| 2 | `"Marquee"` | — | — |
| 3 | `"ValueProps"` | `/sitecore/content/cosmos/aphelion/Data/HomeValueProps` | — |
| 4 | `"DestinationsGrid"` | `/sitecore/content/cosmos/aphelion/Data/Destinations` | `GridLimit=3` |
| 5 | `"ExperienceShowcase"` | `/sitecore/content/cosmos/aphelion/Data/Experiences` | — |
| 6 | `"StatsBand"` | `/sitecore/content/cosmos/aphelion/Data/HomeStatsBand` | — |
| 7 | `"PromoBand"` | `/sitecore/content/cosmos/aphelion/Data/HomePromoBand` | — |
| 8 | `"Testimonials"` | `/sitecore/content/cosmos/aphelion/Data/HomeTestimonials` | — |
| 9 | `"NewsletterCTA"` | `/sitecore/content/cosmos/aphelion/Data/SharedNewsletter` | — |

### 9-C. Destinations page (/destinations) — rendering placements

| Order | componentName | Datasource item | Parameters |
|-------|---------------|-----------------|------------|
| 1 | `"PageHero"` | `/sitecore/content/cosmos/aphelion/Data/DestinationsHero` | — |
| 2 | `"DestinationsGrid"` | `/sitecore/content/cosmos/aphelion/Data/Destinations` | `GridLimit=0` (all) |
| 3 | `"NewsletterCTA"` | `/sitecore/content/cosmos/aphelion/Data/SharedNewsletter` | — |

### 9-D. Experiences page (/experiences) — rendering placements

| Order | componentName | Datasource item | Parameters |
|-------|---------------|-----------------|------------|
| 1 | `"PageHero"` | `/sitecore/content/cosmos/aphelion/Data/ExperiencesHero` | — |
| 2 | `"ExperienceShowcase"` | `/sitecore/content/cosmos/aphelion/Data/Experiences` | — |
| 3 | `"StatsBand"` | `/sitecore/content/cosmos/aphelion/Data/HomeStatsBand` | — |
| 4 | `"NewsletterCTA"` | `/sitecore/content/cosmos/aphelion/Data/SharedNewsletter` | — |

*Note: StatsBand is reused verbatim from Home (same datasource item).*

### 9-E. About page (/about) — rendering placements

| Order | componentName | Datasource item | Parameters |
|-------|---------------|-----------------|------------|
| 1 | `"PageHero"` | `/sitecore/content/cosmos/aphelion/Data/AboutHero` | — |
| 2 | `"RichTextSection"` | `/sitecore/content/cosmos/aphelion/Data/AboutStory` | — |
| 3 | `"ValueProps"` | `/sitecore/content/cosmos/aphelion/Data/HomeValueProps` | — |
| 4 | `"Testimonials"` | `/sitecore/content/cosmos/aphelion/Data/HomeTestimonials` | — |

*Note: ValueProps and Testimonials are reused verbatim from Home (same datasource items).*

### 9-F. Contact page (/contact) — rendering placements

| Order | componentName | Datasource item | Parameters |
|-------|---------------|-----------------|------------|
| 1 | `"PageHero"` | `/sitecore/content/cosmos/aphelion/Data/ContactHero` | — |
| 2 | `"ContactForm"` | `/sitecore/content/cosmos/aphelion/Data/ContactFormData` | — |
| 3 | `"ContactDetails"` | `/sitecore/content/cosmos/aphelion/Data/ContactDetailsData` | — |

---

## Step 10 — Datasource content items

Create under `/sitecore/content/cosmos/aphelion/Data/`.

Field values are copied **verbatim** from `static/src/content/*.ts`.

---

### 10-A. HomeHero (template: Hero)

**Path:** `/sitecore/content/cosmos/aphelion/Data/HomeHero`

| Field | Value |
|-------|-------|
| Eyebrow | `Commercial spaceflight · Est. 2419` |
| Title | `Drift past the` |
| TitleAccent | `edge of the familiar.` |
| Lede | `Aphelion charters luminous voyages to the far points of the system — where the light bends, the silence sings, and the view rewrites you.` |
| PrimaryCta | `{ href: "/destinations", text: "Explore destinations" }` |
| SecondaryCta | `{ href: "/experiences", text: "View experiences" }` |
| HeroImage | `https://images.unsplash.com/photo-1743010314082-43bb0749436e?w=900&q=80&auto=format&fit=crop` — alt: `Abstract iridescent rendered forms drifting in soft light, evoking distant cosmic bodies.` |
| MetaValue1 | `7` |
| MetaLabel1 | `flagship routes` |
| MetaValue2 | `340k` |
| MetaLabel2 | `km apoapsis` |
| MetaValue3 | `100%` |
| MetaLabel3 | `return record` |

---

### 10-B. HomeValueProps (template: ValuePropsFolder + ValueCard children)

**Folder path:** `/sitecore/content/cosmos/aphelion/Data/HomeValueProps`

| Field | Value |
|-------|-------|
| Heading | `Engineered for wonder,` |
| Eyebrow | `Why Aphelion` |
| HeadingAccent | `tuned for calm.` |

**Child items** (template: ValueCard):

| Item name | Icon | CardTitle | Body |
|-----------|------|-----------|------|
| `WhisperCraft` | `◇` | `Whisper-class craft` | `Our Lumen-series vessels carry forty guests in near-silence, with full-spectrum cupolas on every deck.` |
| `Navigators` | `✶` | `Guided by navigators` | `Every voyage is hosted by a flight navigator and an onboard astronomer who narrate the sky as it passes.` |
| `CarbonSettled` | `❋` | `Carbon-settled travel` | `Each charter is fully offset at launch through our deep-orbit reclamation programme. Wonder without the weight.` |

---

### 10-C. Destinations (template: DestinationsGridFolder + DestinationCard children)

**Folder path:** `/sitecore/content/cosmos/aphelion/Data/Destinations`

| Field | Value |
|-------|-------|
| Heading | `Six points worth the` |
| Eyebrow | `Destinations` |
| HeadingAccent | `distance.` |
| Intro | `From the inner glow of the Halcyon Belt to the long dark of Aphelion Point — choose where your story bends.` |

**Child items** (template: DestinationCard):

| Item name | Name | Tagline | CardImage src | CardImage alt | Distance | Detail | CardLink |
|-----------|------|---------|---------------|---------------|----------|--------|----------|
| `HalcyonBelt` | `Halcyon Belt` | `Closest of our routes` | `https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=600&q=80&auto=format&fit=crop` | `Fluid blue and violet rendered waves.` | `2 days` | `A shimmering ring of ice and light. Closest of our routes — the perfect first drift.` | `{ href: "/contact", text: "Plan this voyage" }` |
| `VelaDrift` | `Vela Drift` | `Ride the slow current` | `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&auto=format&fit=crop` | `Purple and cyan fluid render.` | `4 days` | `Ride the slow current of the Vela stream, where dust catches starlight like falling silk.` | `{ href: "/contact", text: "Plan this voyage" }` |
| `TheLyraeArc` | `The Lyrae Arc` | `Auroral corridor` | `https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80&auto=format&fit=crop` | `Violet and magenta glowing render.` | `6 days` | `An auroral corridor that paints the cupola in moving colour for the length of the passage.` | `{ href: "/contact", text: "Plan this voyage" }` |
| `CalderaPrime` | `Caldera Prime` | `Most dramatic vantage` | `https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=600&q=80&auto=format&fit=crop` | `Violet grain gradient render.` | `8 days` | `Orbit a world of molten amber seas. Our most dramatic vantage — and our quietest nights.` | `{ href: "/contact", text: "Plan this voyage" }` |
| `UmbraStation` | `Umbra Station` | `Far outpost dock` | `https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?w=600&q=80&auto=format&fit=crop` | `Teal and blush diagonal abstract planes.` | `10 days` | `Dock at the system's far outpost. Walk the observation ring above an endless field of dark.` | `{ href: "/contact", text: "Plan this voyage" }` |
| `AphelionPoint` | `Aphelion Point` | `The farthest light` | `https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80&auto=format&fit=crop` | `Deep nebular gradient.` | `14 days` | `The farthest light. Our namesake voyage to the system's edge, where the sun is just one more star.` | `{ href: "/contact", text: "Plan this voyage" }` |

---

### 10-D. Experiences (template: ExperienceShowcaseFolder + ExperienceItem children)

**Folder path:** `/sitecore/content/cosmos/aphelion/Data/Experiences`

| Field | Value |
|-------|-------|
| Heading | `Not just a view —` |
| Eyebrow | `Experiences` |
| HeadingAccent | `a way to be there.` |

**Child items** (template: ExperienceItem):

| Item name | ItemTitle | Summary | ItemImage src | ItemImage alt | Duration | Cta |
|-----------|-----------|---------|---------------|---------------|----------|-----|
| `SilentCupola` | `The Silent Cupola` | `Two hours, lights down, comms off. The whole deck given over to the sky and nothing else. Our most requested ritual.` | `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80&auto=format&fit=crop` | `Cyan-edged voxel 3D render suggesting an observation lattice.` | `Every voyage` | `{ href: "/contact", text: "Reserve a session" }` |
| `AstronomerTable` | `Astronomer's Table` | `Dine beside the cupola while our resident astronomer maps what you're seeing — course, distance, and the stories behind each light.` | `https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&q=80&auto=format&fit=crop` | `Soft atmospheric abstract render.` | `3+ day routes` | `{ href: "/contact", text: "Reserve a session" }` |
| `TetherWalk` | `Tether Walk` | `Suit up for a guided drift outside the hull — fully tethered, fully held, entirely unforgettable.` | `https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80&auto=format&fit=crop` | `Violet and magenta glowing abstract render.` | `Caldera & Aphelion routes` | `{ href: "/contact", text: "Reserve a session" }` |

---

### 10-E. HomeStatsBand (template: StatsBandFolder + Stat children)

**Folder path:** `/sitecore/content/cosmos/aphelion/Data/HomeStatsBand`
*(Reused by Experiences page — same datasource item.)*

| Field | Value |
|-------|-------|
| BandHeading | `Aphelion by the numbers` |

**Child items** (template: Stat):

| Item name | StatValue | StatLabel |
|-----------|-----------|-----------|
| `FlagshipRoutes` | `7` | `Flagship routes` |
| `GuestsCarried` | `1240+` | `Guests carried` |
| `SafeReturn` | `100%` | `Safe-return record` |
| `GuestRating` | `4.9` | `Guest rating` |

*Count-up metadata (`countTo`, `decimals`, `suffix`, `prefix`) is set as rendering
parameters on each StatsBand placement, not stored in the datasource. Recommended
parameter values for the Home and Experiences placements:*

| Stat | CountUpSuffix | CountUpDecimals |
|------|---------------|-----------------|
| FlagshipRoutes | — | 0 |
| GuestsCarried | `+` | 0 |
| SafeReturn | `%` | 0 |
| GuestRating | — | 1 |

---

### 10-F. HomePromoBand (template: PromoBand)

**Path:** `/sitecore/content/cosmos/aphelion/Data/HomePromoBand`

| Field | Value |
|-------|-------|
| Eyebrow | `2419 season` |
| Heading | `Charters open for the` |
| HeadingAccent | `long dark.` |
| Body | `Aphelion Point and Caldera Prime release in limited windows. Join the manifest before the lights go out.` |
| Cta | `{ href: "/contact", text: "Request a manifest seat" }` |
| PromoImage | (empty — static app has no image on promo; CSS mesh backdrop used) |

---

### 10-G. HomeTestimonials (template: TestimonialsFolder + TestimonialCard children)

**Folder path:** `/sitecore/content/cosmos/aphelion/Data/HomeTestimonials`
*(Reused by About page — same datasource item.)*

| Field | Value |
|-------|-------|
| Heading | `What the drift` |
| Eyebrow | `Mission log` |
| HeadingAccent | `leaves behind.` |

**Child items** (template: TestimonialCard):

| Item name | Quote | Author | Role |
|-----------|-------|--------|------|
| `InaraVoss` | `"The silence in the cupola undid something in me — in the best way. I came back lighter."` | `Inara Voss` | `Vela Drift, 2418` |
| `OkonkwoReyes` | `"I've travelled everywhere on Earth. Nothing prepared me for amber seas at three in the morning."` | `Dr. Okonkwo Reyes` | `Caldera Prime, 2417` |
| `LenaMaru` | `"The astronomer named every light we passed. I'll never look up the same way again."` | `Lena Maru` | `The Lyrae Arc, 2418` |

---

### 10-H. SharedNewsletter (template: NewsletterCTA)

**Path:** `/sitecore/content/cosmos/aphelion/Data/SharedNewsletter`
*(Shared across Home, Destinations, Experiences pages.)*

| Field | Value |
|-------|-------|
| Heading | `Be first to the` |
| HeadingAccent | `next window.` |
| Body | `Charter releases, route previews, and the occasional dispatch from the dark. No noise.` |
| Placeholder | `you@orbit.example` |
| ButtonLabel | `Join the manifest` |

---

### 10-I. DestinationsHero (template: PageHero)

**Path:** `/sitecore/content/cosmos/aphelion/Data/DestinationsHero`

| Field | Value |
|-------|-------|
| Title | `Six points worth the distance.` |
| Subtitle | `From the inner glow of the Halcyon Belt to the long dark of Aphelion Point — choose where your story bends.` |
| HeroImage | (empty) |

---

### 10-J. ExperiencesHero (template: PageHero)

**Path:** `/sitecore/content/cosmos/aphelion/Data/ExperiencesHero`

| Field | Value |
|-------|-------|
| Title | `Not just a view — a way to be there.` |
| Subtitle | `Every Aphelion voyage is shaped around moments you can only have in the far dark. Here is what waits aboard.` |
| HeroImage | (empty) |

---

### 10-K. AboutHero (template: PageHero)

**Path:** `/sitecore/content/cosmos/aphelion/Data/AboutHero`

| Field | Value |
|-------|-------|
| Title | `We are Aphelion.` |
| Subtitle | `A charter company born from one conviction: the far dark deserves to be witnessed, not just survived.` |
| HeroImage | (empty) |

---

### 10-L. AboutStory (template: RichTextSection)

**Path:** `/sitecore/content/cosmos/aphelion/Data/AboutStory`

| Field | Value |
|-------|-------|
| SectionHeading | `The long way around` |
| Body | (Rich Text — enter the three paragraphs below verbatim) |

**Body HTML (paste into the Rich Text editor):**

```html
<p>Aphelion began in 2401, in a converted cargo berth at Umbra Station, with a single converted Lumen-class vessel and twelve guests who wanted to see Caldera Prime from the inside. We had no marketing. We had a manifest and a navigator named Sorel who talked for eight days without pausing for breath.</p>
<p>Those twelve came back. And they brought others. Word moved the way good things do — quietly, then all at once. By 2410 we operated three vessels. By 2415, seven routes. By 2419 — the year you're reading this — we have carried over twelve hundred guests to the farthest addresses in the system.</p>
<p>We are not a tour operator. We are not an adventure company. We are, as best we can describe it, a practice: of slowness, of attention, of witnessing the sky as it actually is when you remove the noise of proximity to a star. Come far. Come slowly. Come back changed.</p>
```

---

### 10-M. ContactHero (template: PageHero)

**Path:** `/sitecore/content/cosmos/aphelion/Data/ContactHero`

| Field | Value |
|-------|-------|
| Title | `Begin your voyage.` |
| Subtitle | `Interested in a charter, a specific route, or simply the idea of drifting further than you've been? We're here.` |
| HeroImage | (empty) |

---

### 10-N. ContactFormData (template: ContactForm)

**Path:** `/sitecore/content/cosmos/aphelion/Data/ContactFormData`

| Field | Value |
|-------|-------|
| FormHeading | `Send an enquiry` |
| Intro | `Tell us where you'd like to go, when, and how many guests. We'll reach out within one orbit.` |
| NameLabel | `Your name` |
| EmailLabel | `Your email` |
| MessageLabel | `Your message` |
| ButtonLabel | `Send enquiry` |

---

### 10-O. ContactDetailsData (template: ContactDetailsFolder + ContactDetailItem children)

**Folder path:** `/sitecore/content/cosmos/aphelion/Data/ContactDetailsData`
*(NET-NEW rendering — see derivation log.)*

| Field | Value |
|-------|-------|
| SectionHeading | `Other ways to reach us` |

**Child items** (template: ContactDetailItem):

| Item name | DetailLabel | DetailValue | DetailLink |
|-----------|-------------|-------------|------------|
| `ManifestLine` | `Manifest line` | `+1 (800) APH-ELIO` | `{ href: "tel:+18002743546", text: "+1 (800) APH-ELIO" }` |
| `Email` | `Email` | `voyages@aphelion.example` | `{ href: "mailto:voyages@aphelion.example", text: "voyages@aphelion.example" }` |
| `ResponseTime` | `Response time` | `Within one orbit — typically 24 hours.` | (empty — no link) |

---

## Step 11 — Headless Variant items

No Headless Variants are defined in PRD-000. Skip.
(Variants are a PRD-001 concern if the head-app port introduces alternate visual
treatments. No Headless Variant items need to be created at this stage.)

---

## Step 12 — Publish

Publish the entire `cosmos/aphelion` subtree to Edge:

1. In Sitecore Pages or Content Editor, select `/sitecore/content/cosmos/aphelion`
2. Publish subtree (including all Data/ items and all page items)
3. Verify Edge delivery: hit
   `https://<edge-host>/sitecore/api/layout/render/v1?item=/&sc_apikey=<contextId>&sc_site=aphelion&sc_lang=en`
   — response should include `{"sitecore":{"context":{...},"route":{...}}}` with the
   Home page layout.
4. If `/api/layout-debug?site=aphelion&locale=en&path=/` returns `No sitecore context`:
   the site or home route is not yet published — re-check steps 9-A and 12.

---

## Nav exclusion note

`SiteHeader`, `MobileNav`, and `SiteFooter` are **NOT in this runbook**. In the static
app they are sourced from `src/content/navigation.ts` (a static hard-coded tree; ADR-0005
rule 3). In the head app (PRD-001) they are sourced via the **component-level navigation
pattern** (`custom_content-sdk-component-level-navigation`): a server-rendered L1 nav
driven by the Sitecore route tree with a lazy-loaded L2 per hover via a Route Handler.
The operator builds the navigation rendering and its configuration in Act 3, not here.

---

## Content-model summary

| Category | Count |
|----------|-------|
| Leaf-flat datasource mappings | 9 (Hero, PageHero, PromoBand, NewsletterCTA, RichTextSection, ContactForm, ValueCard, ExperienceItem, DestinationCard, TestimonialCard, Stat — 11 templates, but 5 are child templates for containers; net leaf datasources are 9) |
| Container folder-of-children mappings | 6 (ValueProps, DestinationsGrid, ExperienceShowcase, StatsBand, Testimonials, ContactDetails) |
| Nav excluded | SiteHeader, SiteFooter, MobileNav (3 chrome components) |
| `limit` as rendering parameter (not field) | DestinationsGrid `GridLimit` |
| Content items (folders + leaves) | 15 datasource groups (10-A through 10-O) containing: 1 Hero + 4 PageHero + 1 RichTextSection + 1 NewsletterCTA + 1 PromoBand + 1 ContactForm + 3 ValueCard + 6 DestinationCard + 3 ExperienceItem + 4 Stat + 3 TestimonialCard + 3 ContactDetailItem = **31 leaf content items** across **9 folder/container items** |
| Net-new flags | 2: HeroMeta array (recommend flatten to 3×2 fields); ContactDetails rendering (not a named static component — needs a rendering item created); Marquee items sourcing strategy (parameter vs derived) |
| Renderings total | 13 (Hero, PageHero, ValueProps, DestinationsGrid, ExperienceShowcase, StatsBand, PromoBand, Testimonials, NewsletterCTA, RichTextSection, ContactForm, ContactDetails, Marquee) |
| Headless Variants | 0 |
