# Aphelion — Sitecore content values (copy/paste)

Datasource content for `/sitecore/content/cosmos/aphelion/Data/`. Field values are the
exact text from the static app. **General Link** fields show `href` + `text`. **Image**
fields show the URL + `alt`. Multi-Line / Rich Text fields are the full block.

> The **★ TEST SLICE** items at the top are the 3 leaf components to author now
> (`Hero`, `PromoBand`, `NewsletterCTA`). The rest is the full set for the later build.

---

# ★ TEST SLICE — author these now

## HomeHero  — template `Hero`

```
Eyebrow:      Commercial spaceflight · Est. 2419
Title:        Drift past the
TitleAccent:  edge of the familiar.
Lede:         Aphelion charters luminous voyages to the far points of the system — where the light bends, the silence sings, and the view rewrites you.
```
PrimaryCta — `href:` `/destinations`  · `text:` `Explore destinations`
SecondaryCta — `href:` `/experiences`  · `text:` `View experiences`
HeroImage — URL:
```
https://images.unsplash.com/photo-1743010314082-43bb0749436e?w=900&q=80&auto=format&fit=crop
```
HeroImage — alt: `Abstract iridescent rendered forms drifting in soft light, evoking distant cosmic bodies.`
```
MetaValue1:  7
MetaLabel1:  flagship routes
MetaValue2:  340k
MetaLabel2:  km apoapsis
MetaValue3:  100%
MetaLabel3:  return record
```

## HomePromoBand  — template `PromoBand`

```
Eyebrow:        2419 season
Heading:        Charters open for the
HeadingAccent:  long dark.
Body:           Aphelion Point and Caldera Prime release in limited windows. Join the manifest before the lights go out.
```
Cta — `href:` `/contact`  · `text:` `Request a manifest seat`
PromoImage — *(leave empty)*

## SharedNewsletter  — template `NewsletterCTA`

```
Heading:        Be first to the
HeadingAccent:  next window.
Body:           Charter releases, route previews, and the occasional dispatch from the dark. No noise.
Placeholder:    you@orbit.example
ButtonLabel:    Join the manifest
```

---

# Full set (for the rest of the build)

## HomeValueProps  — folder template `ValuePropsFolder`

```
Heading:        Engineered for wonder,
Eyebrow:        Why Aphelion
HeadingAccent:  tuned for calm.
```
Children (template `ValueCard`):

**WhisperCraft**
```
Icon:       ◇
CardTitle:  Whisper-class craft
Body:       Our Lumen-series vessels carry forty guests in near-silence, with full-spectrum cupolas on every deck.
```
**Navigators**
```
Icon:       ✶
CardTitle:  Guided by navigators
Body:       Every voyage is hosted by a flight navigator and an onboard astronomer who narrate the sky as it passes.
```
**CarbonSettled**
```
Icon:       ❋
CardTitle:  Carbon-settled travel
Body:       Each charter is fully offset at launch through our deep-orbit reclamation programme. Wonder without the weight.
```

## Destinations  — folder template `DestinationsGridFolder`

```
Heading:        Six points worth the
Eyebrow:        Destinations
HeadingAccent:  distance.
Intro:          From the inner glow of the Halcyon Belt to the long dark of Aphelion Point — choose where your story bends.
```
Children (template `DestinationCard`):

**HalcyonBelt**
```
Name:      Halcyon Belt
Tagline:   Closest of our routes
Distance:  2 days
Detail:    A shimmering ring of ice and light. Closest of our routes — the perfect first drift.
```
CardImage: `https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=600&q=80&auto=format&fit=crop` · alt `Fluid blue and violet rendered waves.`
CardLink — `href:` `/contact` · `text:` `Plan this voyage`

**VelaDrift**
```
Name:      Vela Drift
Tagline:   Ride the slow current
Distance:  4 days
Detail:    Ride the slow current of the Vela stream, where dust catches starlight like falling silk.
```
CardImage: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&auto=format&fit=crop` · alt `Purple and cyan fluid render.`
CardLink — `href:` `/contact` · `text:` `Plan this voyage`

**TheLyraeArc**
```
Name:      The Lyrae Arc
Tagline:   Auroral corridor
Distance:  6 days
Detail:    An auroral corridor that paints the cupola in moving colour for the length of the passage.
```
CardImage: `https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80&auto=format&fit=crop` · alt `Violet and magenta glowing render.`
CardLink — `href:` `/contact` · `text:` `Plan this voyage`

**CalderaPrime**
```
Name:      Caldera Prime
Tagline:   Most dramatic vantage
Distance:  8 days
Detail:    Orbit a world of molten amber seas. Our most dramatic vantage — and our quietest nights.
```
CardImage: `https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=600&q=80&auto=format&fit=crop` · alt `Violet grain gradient render.`
CardLink — `href:` `/contact` · `text:` `Plan this voyage`

**UmbraStation**
```
Name:      Umbra Station
Tagline:   Far outpost dock
Distance:  10 days
Detail:    Dock at the system's far outpost. Walk the observation ring above an endless field of dark.
```
CardImage: `https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?w=600&q=80&auto=format&fit=crop` · alt `Teal and blush diagonal abstract planes.`
CardLink — `href:` `/contact` · `text:` `Plan this voyage`

**AphelionPoint**
```
Name:      Aphelion Point
Tagline:   The farthest light
Distance:  14 days
Detail:    The farthest light. Our namesake voyage to the system's edge, where the sun is just one more star.
```
CardImage: `https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80&auto=format&fit=crop` · alt `Deep nebular gradient.`
CardLink — `href:` `/contact` · `text:` `Plan this voyage`

## Experiences  — folder template `ExperienceShowcaseFolder`

```
Heading:        Not just a view —
Eyebrow:        Experiences
HeadingAccent:  a way to be there.
```
Children (template `ExperienceItem`):

**SilentCupola**
```
ItemTitle:  The Silent Cupola
Summary:    Two hours, lights down, comms off. The whole deck given over to the sky and nothing else. Our most requested ritual.
Duration:   Every voyage
```
ItemImage: `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80&auto=format&fit=crop` · alt `Cyan-edged voxel 3D render suggesting an observation lattice.`
Cta — `href:` `/contact` · `text:` `Reserve a session`

**AstronomerTable**
```
ItemTitle:  Astronomer's Table
Summary:    Dine beside the cupola while our resident astronomer maps what you're seeing — course, distance, and the stories behind each light.
Duration:   3+ day routes
```
ItemImage: `https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&q=80&auto=format&fit=crop` · alt `Soft atmospheric abstract render.`
Cta — `href:` `/contact` · `text:` `Reserve a session`

**TetherWalk**
```
ItemTitle:  Tether Walk
Summary:    Suit up for a guided drift outside the hull — fully tethered, fully held, entirely unforgettable.
Duration:   Caldera & Aphelion routes
```
ItemImage: `https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80&auto=format&fit=crop` · alt `Violet and magenta glowing abstract render.`
Cta — `href:` `/contact` · `text:` `Reserve a session`

## HomeStatsBand  — folder template `StatsBandFolder`  *(reused on Experiences page)*

```
BandHeading:  Aphelion by the numbers
```
Children (template `Stat`):
```
FlagshipRoutes   StatValue: 7      StatLabel: Flagship routes
GuestsCarried    StatValue: 1240+  StatLabel: Guests carried
SafeReturn       StatValue: 100%   StatLabel: Safe-return record
GuestRating      StatValue: 4.9    StatLabel: Guest rating
```
Count-up params (set on the StatsBand *placement*, not the datasource):
`FlagshipRoutes` decimals 0 · `GuestsCarried` suffix `+` decimals 0 · `SafeReturn` suffix `%` decimals 0 · `GuestRating` decimals 1

## HomeTestimonials  — folder template `TestimonialsFolder`  *(reused on About page)*

```
Heading:        What the drift
Eyebrow:        Mission log
HeadingAccent:  leaves behind.
```
Children (template `TestimonialCard`):

**InaraVoss**
```
Quote:   "The silence in the cupola undid something in me — in the best way. I came back lighter."
Author:  Inara Voss
Role:    Vela Drift, 2418
```
**OkonkwoReyes**
```
Quote:   "I've travelled everywhere on Earth. Nothing prepared me for amber seas at three in the morning."
Author:  Dr. Okonkwo Reyes
Role:    Caldera Prime, 2417
```
**LenaMaru**
```
Quote:   "The astronomer named every light we passed. I'll never look up the same way again."
Author:  Lena Maru
Role:    The Lyrae Arc, 2418
```

## PageHero items  — template `PageHero`  (HeroImage left empty on all)

**DestinationsHero**
```
Title:     Six points worth the distance.
Subtitle:  From the inner glow of the Halcyon Belt to the long dark of Aphelion Point — choose where your story bends.
```
**ExperiencesHero**
```
Title:     Not just a view — a way to be there.
Subtitle:  Every Aphelion voyage is shaped around moments you can only have in the far dark. Here is what waits aboard.
```
**AboutHero**
```
Title:     We are Aphelion.
Subtitle:  A charter company born from one conviction: the far dark deserves to be witnessed, not just survived.
```
**ContactHero**
```
Title:     Begin your voyage.
Subtitle:  Interested in a charter, a specific route, or simply the idea of drifting further than you've been? We're here.
```

## AboutStory  — template `RichTextSection`

```
SectionHeading:  The long way around
```
Body (paste into the **Rich Text** editor):
```html
<p>Aphelion began in 2401, in a converted cargo berth at Umbra Station, with a single converted Lumen-class vessel and twelve guests who wanted to see Caldera Prime from the inside. We had no marketing. We had a manifest and a navigator named Sorel who talked for eight days without pausing for breath.</p>
<p>Those twelve came back. And they brought others. Word moved the way good things do — quietly, then all at once. By 2410 we operated three vessels. By 2415, seven routes. By 2419 — the year you're reading this — we have carried over twelve hundred guests to the farthest addresses in the system.</p>
<p>We are not a tour operator. We are not an adventure company. We are, as best we can describe it, a practice: of slowness, of attention, of witnessing the sky as it actually is when you remove the noise of proximity to a star. Come far. Come slowly. Come back changed.</p>
```

## ContactFormData  — template `ContactForm`

```
FormHeading:   Send an enquiry
Intro:         Tell us where you'd like to go, when, and how many guests. We'll reach out within one orbit.
NameLabel:     Your name
EmailLabel:    Your email
MessageLabel:  Your message
ButtonLabel:   Send enquiry
```

## ContactDetailsData  — folder template `ContactDetailsFolder`

```
SectionHeading:  Other ways to reach us
```
Children (template `ContactDetailItem`):

**ManifestLine**
```
DetailLabel:  Manifest line
DetailValue:  +1 (800) APH-ELIO
```
DetailLink — `href:` `tel:+18002743546` · `text:` `+1 (800) APH-ELIO`

**Email**
```
DetailLabel:  Email
DetailValue:  voyages@aphelion.example
```
DetailLink — `href:` `mailto:voyages@aphelion.example` · `text:` `voyages@aphelion.example`

**ResponseTime**
```
DetailLabel:  Response time
DetailValue:  Within one orbit — typically 24 hours.
```
DetailLink — *(leave empty)*

---

## Page composition (which datasource goes on which page)

| Page | Renderings (in `headless-main`) → datasource |
|------|---------------------------------------------|
| **Home** `/` | Hero→`HomeHero` · Marquee→(none) · ValueProps→`HomeValueProps` · DestinationsGrid→`Destinations` (`GridLimit=3`) · ExperienceShowcase→`Experiences` · StatsBand→`HomeStatsBand` · PromoBand→`HomePromoBand` · Testimonials→`HomeTestimonials` · NewsletterCTA→`SharedNewsletter` |
| **Destinations** `/destinations` | PageHero→`DestinationsHero` · DestinationsGrid→`Destinations` (`GridLimit=0`) · NewsletterCTA→`SharedNewsletter` |
| **Experiences** `/experiences` | PageHero→`ExperiencesHero` · ExperienceShowcase→`Experiences` · StatsBand→`HomeStatsBand` · NewsletterCTA→`SharedNewsletter` |
| **About** `/about` | PageHero→`AboutHero` · RichTextSection→`AboutStory` · ValueProps→`HomeValueProps` · Testimonials→`HomeTestimonials` |
| **Contact** `/contact` | PageHero→`ContactHero` · ContactForm→`ContactFormData` · ContactDetails→`ContactDetailsData` |
