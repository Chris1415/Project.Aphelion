# Playbook — build a NEW inline-editable container (parent + children)

Use this when you need **a section with its own heading + a list of child items, all editable
inline in Pages** (cards, stats, testimonials, FAQ rows, …). It's the Integrated-GraphQL pattern,
proven on `DestinationsGrid`. Reference that component + its query when in doubt.

**Don't use this for:** a single content block (→ plain datasource / leaf component) or a region
where authors drop *arbitrary* components and drag-reorder them (→ standard Container/Row/Column
splitter). This pattern = a **fixed, typed list of inline-editable items**.

---

## The shape it produces (so you know the target)

```
fields.data.datasource.<scalarAlias>.jsonValue                          ← section heading fields
fields.data.datasource.children.results[].<childAlias>.jsonValue        ← one entry per child item
```
`jsonValue` carries editing metadata → the SDK field helpers render every field inline-editable.

---

## A. Sitecore side

1. **Child template** `MyCard` (`/sitecore/templates/Project/cosmos/MyCard`) — one field per card
   field. Pick the Sitecore field type per data: Single-Line / Multi-Line / Rich Text / Image /
   General Link / Integer.
2. **Folder template** `MyThingFolder` — **Base Templates → inherit `MyCard`** (lets the folder hold
   `MyCard` children) **+ add the section-heading scalar fields** (e.g. `Heading`, `Eyebrow`,
   `Intro`). On its `__Standard Values`, set **Insert Options → `MyCard`**.
3. **Rendering** `MyThing` (`/sitecore/layout/Renderings/Project/cosmos/MyThing`) — JSON Rendering:
   - **Component Name** = `MyThing` (must match the head-app component-map key exactly).
   - **Datasource Template** = `MyThingFolder`; **Datasource Location** = where the data lives.
   - **`GraphQL Query`** = paste the query (template below).
   - **`Rendering Contents Resolver`** = **LEAVE EMPTY.** ⚠️ A resolver wins over the query.
4. **Available Renderings** — add `MyThing` so it can be placed.
5. **Author**: place `MyThing` (datasource = a `MyThingFolder` item), then author the heading + add
   `MyCard` children and fill them **inline on the canvas**.

### Query template
```graphql
query($datasource: String!, $language: String!) {
  datasource: item(path: $datasource, language: $language) {
    heading: field(name: "Heading") { jsonValue }      # one line per SCALAR field, alias = camelCase
    intro: field(name: "Intro") { jsonValue }
    children {
      results {
        id
        name
        cardTitle: field(name: "CardTitle") { jsonValue }   # one line per CHILD field, alias = camelCase
        cardImage: field(name: "CardImage") { jsonValue }
        cardLink: field(name: "CardLink") { jsonValue }
      }
    }
  }
}
```
- `$datasource` / `$language` are auto-supplied — keep the names.
- Use **`jsonValue`**, never `value` (value isn't editable).
- The **alias = the key the component reads**. Keep aliases and component in lockstep (the contract).

---

## B. Head-app side

Create `src/components/MyThing/MyThing.tsx` (copy `DestinationsGrid.tsx` and swap fields):

```tsx
import { JSX } from 'react';
import { Text, Image, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

interface Gql<T> { jsonValue?: T }

interface MyCardResult {
  id?: string; name?: string;
  cardTitle?: Gql<TextField>;
  cardImage?: Gql<ImageField>;
  cardLink?: Gql<LinkField>;
}
interface MyThingDatasource {
  heading?: Gql<TextField>;
  intro?: Gql<TextField>;
  children?: { results?: MyCardResult[] };
}
export interface MyThingFields { data?: { datasource?: MyThingDatasource } }
export interface MyThingProps {
  rendering: ComponentRendering & { fields?: MyThingFields };
  fields?: MyThingFields;
  params?: ComponentParams;
}

function Card({ item, isEditing }: { item: MyCardResult; isEditing: boolean }): JSX.Element {
  const img = item.cardImage?.jsonValue;
  const link = item.cardLink?.jsonValue;
  return (
    <article className="card">
      {(isEditing || img?.value?.src) && img && <Image field={img} />}
      <h3><Text field={item.cardTitle?.jsonValue} /></h3>
      {(isEditing || link?.value?.href) && link && <Link field={link} />}
    </article>
  );
}

const MyThing = ({ fields }: MyThingProps): JSX.Element => {
  const ds = fields?.data?.datasource;
  const isEditing = !!ds?.heading?.jsonValue?.metadata;   // server: metadata present only in edit mode
  const cards = ds?.children?.results ?? [];
  return (
    <section>
      <h2><Text field={ds?.heading?.jsonValue} /></h2>
      {(isEditing || ds?.intro?.jsonValue?.value) && <p><Text field={ds?.intro?.jsonValue} /></p>}
      {cards.map((item, i) => <Card key={item.id || i} item={item} isEditing={isEditing} />)}
    </section>
  );
};
export default MyThing;
```

Then run `npm run sitecore-tools:generate-map` (auto-registers it) and `npx tsc --noEmit`.

### Rules that matter
- **Render every field through a helper off `jsonValue`** (`<Text field={x.jsonValue}>` etc.) — that's what makes it editable. Inline the child as a local function (don't make it its own folder, or generate-map registers it as a rendering).
- **Editing detection:** server component → `!!ds?.<firstScalar>?.jsonValue?.metadata`. **Client** component (needs hooks, e.g. animation) → `const { page } = useSitecore(); const isEditing = page.mode.isEditing;` and add `'use client'`.
- **Editing-safe gating:** wrap optional/decorative wrappers (image frame, link, accent span, optional eyebrow/intro) in `(isEditing || <hasValue>)` so empty fields still show the editable placeholder in editing but stay clean when published. Required text → render `<Text>` directly.
- **Alias = component key.** If the query aliases and the component's interface keys drift, the field reads `undefined` and renders blank.

---

## Gotchas checklist (the ones that cost time)
- [ ] **Resolver cleared?** Resolver wins over the query → you get `fields.items` (Shape B) and an empty Shape-C component. Check the item **and `__Standard Values`**, on the **folder rendering** not the child.
- [ ] **`jsonValue` not `value`** in the query (editability).
- [ ] **Field names case-sensitive** and match the template exactly.
- [ ] **componentName** matches the component-map key exactly.
- [ ] Published the rendering + folder + **children** + page.
- [ ] To debug an empty render: fire the query **straight at Edge** (`getEdgeProxyContentUrl()` + `?sitecoreContextId=` + `GraphQLRequestClient.request`) to prove the query works, separate from resolver/cache issues.
