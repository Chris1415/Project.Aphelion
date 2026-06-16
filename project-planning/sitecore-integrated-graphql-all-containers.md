# Rework existing containers → Integrated GraphQL (execute guide)

All container head-app components are already rewritten for **Integrated GraphQL (Shape C)** and
pushed. This doc is everything you need to **execute the Sitecore side**: per container, the
**query**, the **clear-resolver** step, and the **verbatim content** to author inline.

## The 3 steps — same for every rendering

1. **Paste the query** into the rendering's **`GraphQL Query`** field (the *ComponentQuery* field).
2. **CLEAR the `Rendering Contents Resolver` field** ⚠️ — resolver **wins** over the query (empty
   render if left). Check **`__Standard Values`**, and clear it on the **folder/container**
   rendering, not the child item.
3. **Publish** the rendering + folder + children + page. Then author content inline on the canvas.

Aliases in the query are a **hard contract** (the component reads those exact keys — don't rename).
`$datasource`/`$language` are auto-supplied. `jsonValue` (not `value`) is what makes fields editable.
Each rendering's **datasource = its folder**; the cards/items are that folder's children.

Suggested order: one at a time (ValueProps first), publish, glance, next.

---

## 1. ValueProps

**Query:**
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

**Content** — folder (`ValuePropsFolder`):
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

---

## 2. ExperienceShowcase

**Query:**
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

**Content** — folder (`ExperienceShowcaseFolder`):
```
Heading: Not just a view —
Eyebrow: Experiences
HeadingAccent: a way to be there.
```
Children (3 × `ExperienceItem`):
```
1  ItemTitle: The Silent Cupola
   Summary: Two hours, lights down, comms off. The whole deck given over to the sky and nothing else. Our most requested ritual.
   ItemImage: https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80&auto=format&fit=crop   (alt: Cyan-edged voxel 3D render suggesting an observation lattice.)
   Duration: Every voyage
   Cta: text=Reserve a session  href=/contact
2  ItemTitle: Astronomer's Table
   Summary: Dine beside the cupola while our resident astronomer maps what you're seeing — course, distance, and the stories behind each light.
   ItemImage: https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&q=80&auto=format&fit=crop   (alt: Soft atmospheric abstract render.)
   Duration: 3+ day routes
   Cta: text=Reserve a session  href=/contact
3  ItemTitle: Tether Walk
   Summary: Suit up for a guided drift outside the hull — fully tethered, fully held, entirely unforgettable.
   ItemImage: https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80&auto=format&fit=crop   (alt: Violet and magenta glowing abstract render.)
   Duration: Caldera & Aphelion routes
   Cta: text=Reserve a session  href=/contact
```

---

## 3. StatsBand

**Query:**
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

**Content** — folder (`StatsBandFolder`): `BandHeading: Aphelion by the numbers`
Children (4 × `Stat`) — `StatValue` is self-describing (the `+`/`%`/decimal is parsed for you):
```
1  StatValue: 7      StatLabel: Flagship routes
2  StatValue: 1240+  StatLabel: Guests carried
3  StatValue: 100%   StatLabel: Safe-return record
4  StatValue: 4.9    StatLabel: Guest rating
```

---

## 4. Testimonials

**Query:**
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

**Content** — folder (`TestimonialsFolder`):
```
Heading: What the drift
Eyebrow: Mission log
HeadingAccent: leaves behind.
```
Children (3 × `TestimonialCard`, leave `Avatar` empty):
```
1  Quote: "The silence in the cupola undid something in me — in the best way. I came back lighter."
   Author: Inara Voss          Role: Vela Drift, 2418
2  Quote: "I've travelled everywhere on Earth. Nothing prepared me for amber seas at three in the morning."
   Author: Dr. Okonkwo Reyes    Role: Caldera Prime, 2417
3  Quote: "The astronomer named every light we passed. I'll never look up the same way again."
   Author: Lena Maru            Role: The Lyrae Arc, 2418
```

---

## 5. ContactDetails

**Query:**
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

**Content** — folder (`ContactDetailsFolder`): `SectionHeading: Other ways to reach us`
Children (3 × `ContactDetailItem`):
```
1  DetailLabel: Manifest line   DetailValue: +1 (800) APH-ELIO       DetailLink: href=tel:+18002743546
2  DetailLabel: Email           DetailValue: voyages@aphelion.example  DetailLink: href=mailto:voyages@aphelion.example
3  DetailLabel: Response time   DetailValue: Within one orbit — typically 24 hours.   DetailLink: (leave empty)
```

---

## 6. Marquee  (decorative — no content to author)

**Query** (datasource = the existing `Destinations` folder; reads each child's `Name`):
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
Point the Marquee rendering's datasource at the **`Destinations` folder** (the same one
DestinationsGrid uses). Nothing to author — it reads the destination names. aria-hidden / decorative.

---

## Verify
After each: place the rendering (datasource = its folder), author the content inline, publish,
say **check** — I'll probe and confirm `fields.data.datasource…` populated + editable.

**Field names are case-sensitive — must match your templates exactly.**
