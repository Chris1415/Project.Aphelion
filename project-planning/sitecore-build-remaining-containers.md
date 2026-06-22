# Build guide — the 3 remaining containers (Testimonials · ContactDetails · Marquee)

**Approach = Integrated GraphQL (Shape C), identical to your built `DestinationsGrid` / `ValueProps` /
`StatsBand` / `ExperienceShowcase`.** (This supersedes the *Children-resolver* wording in
`sitecore-build-remaining-components.md` for these three — the live containers use a ComponentQuery
with the resolver CLEARED, not a Children resolver.)

Collection `cosmos`, site `aphelion`. Mirror the tree locations your existing cosmos items use:
- **Data templates:** `/sitecore/templates/Project/cosmos/…` (next to `DestinationCard`, `ValueCard`)
- **Renderings:** `/sitecore/layout/Renderings/Project/cosmos/…` (next to `DestinationsGrid`)
- **Content folders:** under the site's shared `Data` folder (or a page's local `Data/`)

> ⚠️ **Field names are case- AND space-sensitive — they must match the query aliases EXACTLY.** We
> already hit this: `ExperienceShowcase`'s folder field was created as `Heading Accent` (with a space)
> but the query reads `HeadingAccent` → the accent silently never bound. Type field names with **no
> spaces**: `HeadingAccent`, `SectionHeading`, `DetailLabel`, etc.

---

## The recipe (same for each container)

1. **Child data template** — fields below (the per-card/item fields).
2. **Folder data template** — the scalar (heading) fields below. **Insert Options → the child template**
   (so you can add children under the folder). Folder does NOT inherit the child template — scalars only.
3. **Rendering item** (`/sitecore/layout/Renderings/Project/cosmos/<Name>`), base template **Json Rendering**:
   - `componentName` = the exact value below (must match the head-app component-map key).
   - **`Rendering Contents Resolver` → CLEARED/empty** (check `__Standard Values` too — a resolver WINS over the query).
   - **`GraphQL Query`** (the *ComponentQuery* field) = the query below, pasted verbatim.
   - `Datasource Template` = the folder template (so Pages' datasource picker offers the right items).
   - No parameters template needed — none of these three read rendering params.
4. **Available Renderings** — add the rendering to the site's allowed list for `headless-main`.
5. **Author** the folder + children (content below).
6. **Publish** templates + rendering + folder + children.

---

## 1. Testimonials  ("Mission log")

**Child template `TestimonialCard`**

| Field | Type | Notes |
|---|---|---|
| `Quote` | Multi-Line Text | long quote, rendered in `<blockquote>` |
| `Author` | Single-Line Text | |
| `Role` | Single-Line Text | |
| `Avatar` | Image | optional — leave empty (component falls back to a blank avatar) |

**Folder template `TestimonialsFolder`** — Insert Options: `TestimonialCard`

| Field | Type |
|---|---|
| `Heading` | Single-Line Text |
| `Eyebrow` | Single-Line Text |
| `HeadingAccent` | Single-Line Text |

**Rendering `Testimonials`** — `componentName: Testimonials` · clear resolver · GraphQL Query:

```graphql
query($datasource: String!, $language: String!) {
  datasource: item(path: $datasource, language: $language) {
    heading: field(name: "Heading") { jsonValue }
    eyebrow: field(name: "Eyebrow") { jsonValue }
    headingAccent: field(name: "HeadingAccent") { jsonValue }
    children {
      results {
        id
        name
        quote: field(name: "Quote") { jsonValue }
        author: field(name: "Author") { jsonValue }
        role: field(name: "Role") { jsonValue }
        avatar: field(name: "Avatar") { jsonValue }
      }
    }
  }
}
```

**Content** — folder: `Heading: What the drift` · `Eyebrow: Mission log` · `HeadingAccent: leaves behind.`
Children (3 × `TestimonialCard`, `Avatar` empty):
```
1  Quote: "The silence in the cupola undid something in me — in the best way. I came back lighter."
   Author: Inara Voss          Role: Vela Drift, 2418
2  Quote: "I've travelled everywhere on Earth. Nothing prepared me for amber seas at three in the morning."
   Author: Dr. Okonkwo Reyes   Role: Caldera Prime, 2417
3  Quote: "The astronomer named every light we passed. I'll never look up the same way again."
   Author: Lena Maru           Role: The Lyrae Arc, 2418
```

---

## 2. ContactDetails

**Child template `ContactDetailItem`**

| Field | Type | Notes |
|---|---|---|
| `DetailLabel` | Single-Line Text | |
| `DetailValue` | Single-Line Text | shown when there's no link |
| `DetailLink` | General Link | optional — when set, renders as a link instead of plain value |

**Folder template `ContactDetailsFolder`** — Insert Options: `ContactDetailItem`

| Field | Type |
|---|---|
| `SectionHeading` | Single-Line Text |

**Rendering `ContactDetails`** — `componentName: ContactDetails` · clear resolver · GraphQL Query:

```graphql
query($datasource: String!, $language: String!) {
  datasource: item(path: $datasource, language: $language) {
    sectionHeading: field(name: "SectionHeading") { jsonValue }
    children {
      results {
        id
        name
        detailLabel: field(name: "DetailLabel") { jsonValue }
        detailValue: field(name: "DetailValue") { jsonValue }
        detailLink: field(name: "DetailLink") { jsonValue }
      }
    }
  }
}
```

**Content** — folder: `SectionHeading: Other ways to reach us`
Children (3 × `ContactDetailItem`):
```
1  DetailLabel: Manifest line    DetailValue: +1 (800) APH-ELIO
   DetailLink: href=tel:+18002743546   text=+1 (800) APH-ELIO
2  DetailLabel: Email            DetailValue: voyages@aphelion.example
   DetailLink: href=mailto:voyages@aphelion.example   text=voyages@aphelion.example
3  DetailLabel: Response time    DetailValue: Within one orbit — typically 24 hours.
   DetailLink: (leave empty)
```

---

## 3. Marquee  (NO new template — reuses the Destinations data)

- **No child/folder template, no content to author.** The Marquee reuses the **existing `Destinations`
  folder** (the one `DestinationsGrid` uses) and reads each child's `Name`.
- **Rendering `Marquee`** — `componentName: Marquee` · clear resolver · `Datasource Template` =
  the **`DestinationsGridFolder`** template (so you can pick the `Destinations` folder) · GraphQL Query:

```graphql
query($datasource: String!, $language: String!) {
  datasource: item(path: $datasource, language: $language) {
    children {
      results {
        id
        destName: field(name: "Name") { jsonValue }
      }
    }
  }
}
```

- When placing it on a page, **set its datasource to the `Destinations` folder.** It's decorative
  (`aria-hidden`) — a scrolling strip of destination names. (`destName` aliases the `Name` field to dodge
  GraphQL's reserved `name`.)

---

## When done

Publish everything, then **re-auth the Marketer MCP** (the token expired — run `/mcp`) and say **check**.
I'll then, via the MCP + official APIs (no manual Pages clicking): place these 3 on `/Showcase` (and the
real pages), author the folders + children, and publish — then verify each binds in the browser. Per-page
placement order is in `sitecore-build-remaining-components.md` (bottom table).
