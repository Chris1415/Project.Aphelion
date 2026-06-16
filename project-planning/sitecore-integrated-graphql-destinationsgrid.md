# DestinationsGrid → Integrated GraphQL (inline-editable cards in Pages)

Switches `DestinationsGrid` from the Children resolver (cards = read-only data, Content-Editor
only) to **Integrated GraphQL** so the folder's heading **and every card field** are
**inline-editable on the Pages canvas**. Each field is queried as **`jsonValue`**, which carries
the editing metadata the field helpers need.

The head-app component is already rewritten for this (Shape C). You do the two Sitecore steps below.

## Step 1 — Put the query on the rendering

On the **`DestinationsGrid` rendering item**
(`/sitecore/layout/Renderings/Project/cosmos/DestinationsGrid`), paste this into the
**`GraphQL Query`** field (a.k.a. *Component GraphQL Query* / `ComponentQuery`, under the
*Data* / *GraphQL* section of the rendering):

```graphql
query DestinationsGridQuery($datasource: String!, $language: String!) {
  datasource: item(path: $datasource, language: $language) {
    heading: field(name: "Heading") { jsonValue }
    eyebrow: field(name: "Eyebrow") { jsonValue }
    headingAccent: field(name: "HeadingAccent") { jsonValue }
    intro: field(name: "Intro") { jsonValue }
    children {
      results {
        id
        name
        cardName: field(name: "Name") { jsonValue }
        tagline: field(name: "Tagline") { jsonValue }
        distance: field(name: "Distance") { jsonValue }
        detail: field(name: "Detail") { jsonValue }
        cardImage: field(name: "CardImage") { jsonValue }
        cardLink: field(name: "CardLink") { jsonValue }
      }
    }
  }
}
```

Notes:
- `$datasource` and `$language` are **auto-supplied** by Sitecore's integrated-GraphQL engine — keep the names exactly.
- The **aliases matter** — the component reads `data.datasource.heading.jsonValue`, `…children.results[].cardName.jsonValue`, etc. If you rename an alias, the component won't find it.
- `jsonValue` (not `value`) is what makes the fields **editable** — it includes the editing metadata.

## Step 2 — CLEAR the Children resolver ⚠️

On the same rendering, **empty the `Rendering Contents Resolver` field** (remove the Datasource
Children resolver). **A resolver wins over the query when both are set** — if you leave it, the
query stays dormant and you get the old `items` shape (empty heading, read-only cards).

## Step 3 — Publish

Publish the `DestinationsGrid` rendering item, the `DGF` folder + its card children, and the page.

## What you get

- The **section heading** (`Heading`/`Eyebrow`/`Intro`) is back and **inline-editable** on the canvas.
- **Every card field** (`Name`, `Distance`, `Detail`, `CardImage`, `CardLink`) is **inline-editable** — click a card's text/image/link right in Pages, no Content Editor.
- Empty fields show the editable placeholder (our empty-field pattern still applies).

Then say **check** — I'll re-probe and confirm the payload is now `fields.data.datasource…` with
the children populated, and that the fields carry metadata (editable).

## Trade-off reminder

Cards are still **data** (children of the folder), so they remain reusable — but they are NOT
placed renderings, so you can't drag-reorder them on the canvas (reorder in the content tree).
For Aphelion that's fine. If you later want drag-reorder, that's the composition pattern instead.
