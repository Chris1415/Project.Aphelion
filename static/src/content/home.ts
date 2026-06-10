/**
 * Home page content — hard-coded plain-prop objects.
 * ADR-0005: each object's shape IS the future datasource (flat props; 1 scalar → 1 Sitecore field).
 * Copy and Unsplash image URLs taken verbatim from pocs/poc-v5b-prd000/index.html (the POC is the oracle).
 * Image URL form: https://images.unsplash.com/<id>?w=<n>&q=80&auto=format&fit=crop
 */

// ---------------------------------------------------------------------------
// Shared / reusable types (used by Home AND inner routes)
// ---------------------------------------------------------------------------

export interface CtaLink {
  label: string;
  href: string;
}

export interface ImageField {
  src: string;
  alt: string;
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export interface HeroMeta {
  value: string;
  label: string;
}

export interface HeroProps {
  eyebrow: string;
  title: string;
  titleAccent: string;
  lede: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  image: ImageField;
  meta: HeroMeta[];
}

export const heroContent: HeroProps = {
  eyebrow: 'Commercial spaceflight · Est. 2419',
  title: 'Drift past the',
  titleAccent: 'edge of the familiar.',
  lede: 'Aphelion charters luminous voyages to the far points of the system — where the light bends, the silence sings, and the view rewrites you.',
  primaryCta: { label: 'Explore destinations', href: '/destinations' },
  secondaryCta: { label: 'View experiences', href: '/experiences' },
  image: {
    src: 'https://images.unsplash.com/photo-1743010314082-43bb0749436e?w=900&q=80&auto=format&fit=crop',
    alt: 'Abstract iridescent rendered forms drifting in soft light, evoking distant cosmic bodies.',
  },
  meta: [
    { value: '7', label: 'flagship routes' },
    { value: '340k', label: 'km apoapsis' },
    { value: '100%', label: 'return record' },
  ],
};

// ---------------------------------------------------------------------------
// ValueProps
// ---------------------------------------------------------------------------

export interface ValueCardProps {
  icon: string;
  title: string;
  body: string;
}

export interface ValuePropsProps {
  heading: string;
  eyebrow?: string;
  headingAccent?: string;
  items: ValueCardProps[];
}

export const valuePropsContent: ValuePropsProps = {
  eyebrow: 'Why Aphelion',
  heading: 'Engineered for wonder,',
  headingAccent: 'tuned for calm.',
  items: [
    {
      icon: '◇',
      title: 'Whisper-class craft',
      body: 'Our Lumen-series vessels carry forty guests in near-silence, with full-spectrum cupolas on every deck.',
    },
    {
      icon: '✶',
      title: 'Guided by navigators',
      body: 'Every voyage is hosted by a flight navigator and an onboard astronomer who narrate the sky as it passes.',
    },
    {
      icon: '❋',
      title: 'Carbon-settled travel',
      body: 'Each charter is fully offset at launch through our deep-orbit reclamation programme. Wonder without the weight.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Destinations
// ---------------------------------------------------------------------------

export interface DestinationCardProps {
  name: string;
  tagline: string;
  image: ImageField;
  distance: string;
  detail: string;
  link: CtaLink;
}

export interface DestinationsGridProps {
  heading: string;
  eyebrow?: string;
  headingAccent?: string;
  intro?: string;
  items: DestinationCardProps[];
}

export const destinationsContent: DestinationsGridProps = {
  eyebrow: 'Destinations',
  heading: 'Six points worth the',
  headingAccent: 'distance.',
  intro: 'From the inner glow of the Halcyon Belt to the long dark of Aphelion Point — choose where your story bends.',
  items: [
    {
      name: 'Halcyon Belt',
      tagline: 'Closest of our routes',
      image: {
        src: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=600&q=80&auto=format&fit=crop',
        alt: 'Fluid blue and violet rendered waves.',
      },
      distance: '2 days',
      detail: 'A shimmering ring of ice and light. Closest of our routes — the perfect first drift.',
      link: { label: 'Plan this voyage', href: '/contact' },
    },
    {
      name: 'Vela Drift',
      tagline: 'Ride the slow current',
      image: {
        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&auto=format&fit=crop',
        alt: 'Purple and cyan fluid render.',
      },
      distance: '4 days',
      detail: 'Ride the slow current of the Vela stream, where dust catches starlight like falling silk.',
      link: { label: 'Plan this voyage', href: '/contact' },
    },
    {
      name: 'The Lyrae Arc',
      tagline: 'Auroral corridor',
      image: {
        src: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80&auto=format&fit=crop',
        alt: 'Violet and magenta glowing render.',
      },
      distance: '6 days',
      detail: 'An auroral corridor that paints the cupola in moving colour for the length of the passage.',
      link: { label: 'Plan this voyage', href: '/contact' },
    },
    {
      name: 'Caldera Prime',
      tagline: 'Most dramatic vantage',
      image: {
        src: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=600&q=80&auto=format&fit=crop',
        alt: 'Violet grain gradient render.',
      },
      distance: '8 days',
      detail: 'Orbit a world of molten amber seas. Our most dramatic vantage — and our quietest nights.',
      link: { label: 'Plan this voyage', href: '/contact' },
    },
    {
      name: 'Umbra Station',
      tagline: 'Far outpost dock',
      image: {
        src: 'https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?w=600&q=80&auto=format&fit=crop',
        alt: 'Teal and blush diagonal abstract planes.',
      },
      distance: '10 days',
      detail: 'Dock at the system\'s far outpost. Walk the observation ring above an endless field of dark.',
      link: { label: 'Plan this voyage', href: '/contact' },
    },
    {
      name: 'Aphelion Point',
      tagline: "The farthest light",
      image: {
        src: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80&auto=format&fit=crop',
        alt: 'Deep nebular gradient.',
      },
      distance: '14 days',
      detail: "The farthest light. Our namesake voyage to the system's edge, where the sun is just one more star.",
      link: { label: 'Plan this voyage', href: '/contact' },
    },
  ],
};

// ---------------------------------------------------------------------------
// Experiences
// ---------------------------------------------------------------------------

export interface ExperienceItemProps {
  title: string;
  summary: string;
  image: ImageField;
  duration: string;
  cta: CtaLink;
}

export interface ExperienceShowcaseProps {
  heading: string;
  eyebrow?: string;
  headingAccent?: string;
  items: ExperienceItemProps[];
}

export const experiencesContent: ExperienceShowcaseProps = {
  eyebrow: 'Experiences',
  heading: 'Not just a view —',
  headingAccent: 'a way to be there.',
  items: [
    {
      title: 'The Silent Cupola',
      summary: 'Two hours, lights down, comms off. The whole deck given over to the sky and nothing else. Our most requested ritual.',
      image: {
        src: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80&auto=format&fit=crop',
        alt: 'Cyan-edged voxel 3D render suggesting an observation lattice.',
      },
      duration: 'Every voyage',
      cta: { label: 'Reserve a session', href: '/contact' },
    },
    {
      title: "Astronomer's Table",
      summary: 'Dine beside the cupola while our resident astronomer maps what you\'re seeing — course, distance, and the stories behind each light.',
      image: {
        src: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&q=80&auto=format&fit=crop',
        alt: 'Soft atmospheric abstract render.',
      },
      duration: '3+ day routes',
      cta: { label: 'Reserve a session', href: '/contact' },
    },
    {
      title: 'Tether Walk',
      summary: 'Suit up for a guided drift outside the hull — fully tethered, fully held, entirely unforgettable.',
      image: {
        src: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80&auto=format&fit=crop',
        alt: 'Violet and magenta glowing abstract render.',
      },
      duration: 'Caldera & Aphelion routes',
      cta: { label: 'Reserve a session', href: '/contact' },
    },
  ],
};

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export interface StatProps {
  value: string;
  label: string;
  countTo: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export interface StatsBandProps {
  heading?: string;
  items: StatProps[];
}

export const statsBandContent: StatsBandProps = {
  heading: 'Aphelion by the numbers',
  items: [
    { value: '7', label: 'Flagship routes', countTo: 7 },
    { value: '1240+', label: 'Guests carried', countTo: 1240, suffix: '+' },
    { value: '100%', label: 'Safe-return record', countTo: 100, suffix: '%' },
    { value: '4.9', label: 'Guest rating', countTo: 4.9, decimals: 1 },
  ],
};

// ---------------------------------------------------------------------------
// PromoBand
// ---------------------------------------------------------------------------

export interface PromoBandProps {
  eyebrow: string;
  heading: string;
  headingAccent?: string;
  body: string;
  cta: CtaLink;
  image?: ImageField;
}

export const promoBandContent: PromoBandProps = {
  eyebrow: '2419 season',
  heading: 'Charters open for the',
  headingAccent: 'long dark.',
  body: 'Aphelion Point and Caldera Prime release in limited windows. Join the manifest before the lights go out.',
  cta: { label: 'Request a manifest seat', href: '/contact' },
};

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar?: ImageField;
}

export interface TestimonialsProps {
  heading: string;
  eyebrow?: string;
  headingAccent?: string;
  items: TestimonialCardProps[];
}

export const testimonialsContent: TestimonialsProps = {
  eyebrow: 'Mission log',
  heading: 'What the drift',
  headingAccent: 'leaves behind.',
  items: [
    {
      quote: '"The silence in the cupola undid something in me — in the best way. I came back lighter."',
      author: 'Inara Voss',
      role: 'Vela Drift, 2418',
    },
    {
      quote: '"I\'ve travelled everywhere on Earth. Nothing prepared me for amber seas at three in the morning."',
      author: 'Dr. Okonkwo Reyes',
      role: 'Caldera Prime, 2417',
    },
    {
      quote: '"The astronomer named every light we passed. I\'ll never look up the same way again."',
      author: 'Lena Maru',
      role: 'The Lyrae Arc, 2418',
    },
  ],
};

// ---------------------------------------------------------------------------
// NewsletterCTA
// ---------------------------------------------------------------------------

export interface NewsletterCTAProps {
  heading: string;
  headingAccent?: string;
  body: string;
  placeholder: string;
  buttonLabel: string;
}

export const newsletterContent: NewsletterCTAProps = {
  heading: 'Be first to the',
  headingAccent: 'next window.',
  body: 'Charter releases, route previews, and the occasional dispatch from the dark. No noise.',
  placeholder: 'you@orbit.example',
  buttonLabel: 'Join the manifest',
};

// ---------------------------------------------------------------------------
// Marquee
// ---------------------------------------------------------------------------

export interface MarqueeProps {
  items: string[];
}

export const marqueeContent: MarqueeProps = {
  items: [
    'Halcyon Belt',
    'Vela Drift',
    'The Lyrae Arc',
    'Caldera Prime',
    'Umbra Station',
    'Aphelion Point',
  ],
};
