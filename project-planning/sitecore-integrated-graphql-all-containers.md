# Integrated GraphQL — all resolver containers (inline-editable in Pages)

All container head-app components are now rewritten for **Integrated GraphQL (Shape C)** — same
as DestinationsGrid. For **each** rendering below, do the **same 3 steps**:

1. **Paste the query** into the rendering's **`GraphQL Query`** field (the *ComponentQuery* field,
   under the rendering's *Data* / *GraphQL* section).
2. **CLEAR the `Rendering Contents Resolver` field** ⚠️ — a resolver **wins** over the query, so
   you get the old `items` shape and an empty render if you leave it. **Check `__Standard Values`
   too**, and make sure you're clearing it on the **folder/container rendering**, not the child
   item (that exact mix-up was the DestinationsGrid bug).
3. **Publish** the rendering item, the folder + its children, and the page.

The **aliases in the query are a hard contract** — the component reads exactly those keys. Don't
rename them. `$datasource` / `$language` are auto-supplied; keep the names. `jsonValue` (not
`value`) is what makes the fields inline-editable.

> Reminder: the **datasource of each rendering = its folder** (e.g. the `ValuePropsFolder`
> instance), and the children are that folder's child items. Author the child content **inline on
> the Pages canvas** now — no Content Editor.

---

## ValueProps

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
        icon: field(name: "Icon") { jsonValue }
        cardTitle: field(name: "CardTitle") { jsonValue }
        body: field(name: "Body") { jsonValue }
      }
    }
  }
}
```

## ExperienceShowcase

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
        itemTitle: field(name: "ItemTitle") { jsonValue }
        summary: field(name: "Summary") { jsonValue }
        itemImage: field(name: "ItemImage") { jsonValue }
        duration: field(name: "Duration") { jsonValue }
        cta: field(name: "Cta") { jsonValue }
      }
    }
  }
}
```

## StatsBand

```graphql
query($datasource: String!, $language: String!) {
  datasource: item(path: $datasource, language: $language) {
    bandHeading: field(name: "BandHeading") { jsonValue }
    children {
      results {
        id
        name
        statValue: field(name: "StatValue") { jsonValue }
        statLabel: field(name: "StatLabel") { jsonValue }
      }
    }
  }
}
```

## Testimonials

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

## ContactDetails

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

## Marquee  (datasource = the existing `Destinations` folder — reads child `Name` only)

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

- Marquee is **decorative** (aria-hidden) — no editing chrome, nothing to author. Point its
  datasource at the **`Destinations` folder** (the same one DestinationsGrid uses) and it reads
  each child's `Name`.

---

## Verify

After each: place the rendering on a page (datasource = its folder), author the child content
inline on the canvas, publish, and say **check** — I'll probe and confirm the payload is
`fields.data.datasource…` with the children populated and editable.

**Field-name reminder** (case-sensitive — must match your templates exactly):
ValueCard `Icon/CardTitle/Body` · ExperienceItem `ItemTitle/Summary/ItemImage/Duration/Cta` ·
Stat `StatValue/StatLabel` · TestimonialCard `Quote/Author/Role/Avatar` ·
ContactDetailItem `DetailLabel/DetailValue/DetailLink`. Folder scalars: `Heading/Eyebrow/HeadingAccent`
(ValueProps, ExperienceShowcase, Testimonials), `BandHeading` (StatsBand), `SectionHeading` (ContactDetails).
