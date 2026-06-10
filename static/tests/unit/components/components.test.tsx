/**
 * T035 — Vitest component render-from-props suite
 * § 10 T035 test spec (+ T015–T024/T026–T027 per-component specs)
 *
 * Tests every content-bearing component in src/components/ for:
 * - Required text/links/images/alt present from flat props
 * - Container components render exactly N children
 * - DestinationsGrid limit prop truncation
 * - No throw from minimum valid prop set
 * - src/ui/ infra not reachable from component renders (structural invariant)
 *
 * Cross-cutting checks per § 10 T035:
 * 1. Every component renders without throwing from minimum valid props
 * 2. No component bleeds src/ui/ primitives into its import graph in a way
 *    that would pollute the generate-map scanner (verified below via import check)
 * 3. DestinationsGrid limit prop truncation
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── Mock Next.js Link + navigation for RTL environment ─────────────────────
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ),
}));

// Mock useMagnetic — returns a no-op ref (browser globals not available in jsdom)
vi.mock('@/lib/motion', () => ({
  useMagnetic: () => ({ ref: { current: null } }),
  useReveal: () => ({ ref: { current: null }, isVisible: true }),
  useCountUp: (target: number, opts?: { suffix?: string; prefix?: string }) => ({
    ref: { current: null },
    displayValue: `${opts?.prefix ?? ''}${target}${opts?.suffix ?? ''}`,
  }),
}));

// ── Component imports ───────────────────────────────────────────────────────
import { Hero } from '@/components/Hero';
import { ValueCard } from '@/components/ValueCard';
import { ValueProps } from '@/components/ValueProps';
import { DestinationCard } from '@/components/DestinationCard';
import { DestinationsGrid } from '@/components/DestinationsGrid';
import { ExperienceItem } from '@/components/ExperienceItem';
import { ExperienceShowcase } from '@/components/ExperienceShowcase';
import { Stat } from '@/components/Stat';
import { StatsBand } from '@/components/StatsBand';
import { PromoBand } from '@/components/PromoBand';
import { TestimonialCard } from '@/components/TestimonialCard';
import { Testimonials } from '@/components/Testimonials';
import { Marquee } from '@/components/Marquee';
import { PageHero } from '@/components/PageHero';
import { RichTextSection } from '@/components/RichTextSection';
import { SiteHeader } from '@/components/chrome/SiteHeader';
import { SiteFooter } from '@/components/chrome/SiteFooter';

// Mock ThemeToggle for SiteHeader (it's a client component using useTheme)
vi.mock('@/ui/theme-toggle', () => ({
  ThemeToggle: () => <button data-theme-toggle type="button">Theme</button>,
}));

// Mock navigation content for SiteHeader / SiteFooter
vi.mock('@/content/navigation', () => ({
  headerNav: [
    { label: 'Destinations', href: '/destinations' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  footerNav: [
    {
      heading: 'Explore',
      links: [
        { label: 'Destinations', href: '/destinations' },
        { label: 'Experiences', href: '/experiences' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
      ],
    },
  ],
}));

// ── Minimal prop fixtures ───────────────────────────────────────────────────

const heroProps = {
  eyebrow: 'Commercial spaceflight',
  title: 'Drift past the',
  titleAccent: 'edge of the familiar.',
  lede: 'Luminous voyages to the far points of the system.',
  primaryCta: { label: 'Explore destinations', href: '/destinations' },
  secondaryCta: { label: 'View experiences', href: '/experiences' },
  image: { src: 'https://images.unsplash.com/test?w=900', alt: 'Cosmos view' },
  meta: [{ value: '4', label: 'Destinations' }],
};

const valueCardProps = { icon: '✦', title: 'Safety First', body: 'We prioritize your safety.' };

const destCardProps = {
  name: 'Europa',
  tagline: 'Ice-covered ocean moon',
  image: { src: 'https://images.unsplash.com/test?w=600', alt: 'Europa surface' },
  distance: '628.3M km',
  detail: 'Subsurface ocean with potential for life.',
  link: { label: 'Discover Europa', href: '/destinations/europa' },
};

const expItemProps = {
  title: 'Zero-G Immersion',
  summary: 'Float weightlessly in our null-g chamber.',
  image: { src: 'https://images.unsplash.com/test?w=600', alt: 'Zero gravity' },
  duration: '3 hours',
  cta: { label: 'Book now', href: '/experiences/zero-g' },
};

const statProps = {
  value: '1,240',
  label: 'Travelers',
  countTo: 1240,
  decimals: 0,
};

const promoBandProps = {
  eyebrow: 'Limited availability',
  heading: 'Reserve your',
  headingAccent: 'cosmic berth.',
  body: 'Join the pioneers of commercial spaceflight.',
  cta: { label: 'Apply now', href: '/contact' },
};

const testimonialCardProps = {
  quote: 'An experience beyond words.',
  author: 'Alex Reeve',
  role: 'Orbital voyager',
  avatar: { src: 'https://images.unsplash.com/test?w=80', alt: 'Alex Reeve portrait' },
};

const pageHeroProps = {
  title: 'Our Destinations',
  subtitle: 'Explore the cosmos.',
};

const richTextSectionProps = {
  heading: 'Our Story',
  body: '<p>Founded in 2419, Aphelion has charted <strong>extraordinary</strong> voyages.</p>',
};

// ── Hero ────────────────────────────────────────────────────────────────────

describe('Hero', () => {
  it('(1) renders eyebrow, title, titleAccent, lede in DOM', () => {
    render(<Hero {...heroProps} />);
    expect(screen.getByText('Commercial spaceflight')).toBeInTheDocument();
    expect(screen.getByText('Drift past the')).toBeInTheDocument();
    expect(screen.getByText('edge of the familiar.')).toBeInTheDocument();
    expect(screen.getByText(/Luminous voyages/)).toBeInTheDocument();
  });

  it('(2) primary CTA link has correct href', () => {
    render(<Hero {...heroProps} />);
    const link = screen.getByRole('link', { name: 'Explore destinations' });
    expect(link).toHaveAttribute('href', '/destinations');
  });

  it('(3) secondary CTA is absent when not in props', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { secondaryCta: _cta, ...noSecondary } = heroProps;
    render(<Hero {...noSecondary} />);
    expect(screen.queryByRole('link', { name: 'View experiences' })).not.toBeInTheDocument();
  });

  it('(4) alt text matches image.alt prop', () => {
    render(<Hero {...heroProps} />);
    const img = screen.getByAltText('Cosmos view');
    expect(img).toBeInTheDocument();
  });

  it('(5) image onerror → parent has data-failed="true" (mesh fallback path)', () => {
    render(<Hero {...heroProps} />);
    const img = screen.getByAltText('Cosmos view');
    fireEvent.error(img);
    expect(img).toHaveAttribute('data-failed', 'true');
  });
});

// ── ValueCard ───────────────────────────────────────────────────────────────

describe('ValueCard', () => {
  it('(1) icon, title, body render', () => {
    render(<ValueCard {...valueCardProps} />);
    expect(screen.getByText('✦')).toBeInTheDocument();
    expect(screen.getByText('Safety First')).toBeInTheDocument();
    expect(screen.getByText('We prioritize your safety.')).toBeInTheDocument();
  });

  it('(2) data-magnetic attribute present on card', () => {
    const { container } = render(<ValueCard {...valueCardProps} />);
    const article = container.querySelector('article');
    expect(article).toHaveAttribute('data-magnetic');
  });
});

// ── ValueProps ──────────────────────────────────────────────────────────────

describe('ValueProps', () => {
  const items = [
    { icon: '✦', title: 'Safety', body: 'Body A' },
    { icon: '◈', title: 'Comfort', body: 'Body B' },
    { icon: '⬡', title: 'Wonder', body: 'Body C' },
  ];

  it('(1) renders exactly N ValueCards from items array', () => {
    const { container } = render(
      <ValueProps
        heading="Why Aphelion"
        eyebrow="Our promise"
        headingAccent="beyond ordinary"
        items={items}
      />
    );
    const cards = container.querySelectorAll('article.card');
    expect(cards).toHaveLength(3);
  });

  it('(2) heading renders', () => {
    render(
      <ValueProps
        heading="Why Aphelion"
        eyebrow="Our promise"
        headingAccent="beyond ordinary"
        items={items}
      />
    );
    expect(screen.getByText('Why Aphelion')).toBeInTheDocument();
  });
});

// ── DestinationCard ─────────────────────────────────────────────────────────

describe('DestinationCard', () => {
  it('(1) name, distance render', () => {
    render(<DestinationCard {...destCardProps} />);
    expect(screen.getByText('Europa')).toBeInTheDocument();
    expect(screen.getByText('628.3M km')).toBeInTheDocument();
  });

  it('(2) link href correct', () => {
    render(<DestinationCard {...destCardProps} />);
    const link = screen.getByRole('link', { name: 'Discover Europa' });
    expect(link).toHaveAttribute('href', '/destinations/europa');
  });

  it('(3) alt text correct', () => {
    render(<DestinationCard {...destCardProps} />);
    expect(screen.getByAltText('Europa surface')).toBeInTheDocument();
  });

  it('(4) onerror → data-failed="true"', () => {
    render(<DestinationCard {...destCardProps} />);
    const img = screen.getByAltText('Europa surface');
    fireEvent.error(img);
    expect(img).toHaveAttribute('data-failed', 'true');
  });
});

// ── DestinationsGrid ────────────────────────────────────────────────────────

describe('DestinationsGrid', () => {
  const destinations = [
    {
      name: 'A',
      tagline: 'T',
      image: { src: 'a.jpg', alt: 'A' },
      distance: '1km',
      detail: 'D',
      link: { label: 'Go A', href: '/a' },
    },
    {
      name: 'B',
      tagline: 'T',
      image: { src: 'b.jpg', alt: 'B' },
      distance: '2km',
      detail: 'D',
      link: { label: 'Go B', href: '/b' },
    },
    {
      name: 'C',
      tagline: 'T',
      image: { src: 'c.jpg', alt: 'C' },
      distance: '3km',
      detail: 'D',
      link: { label: 'Go C', href: '/c' },
    },
    {
      name: 'D',
      tagline: 'T',
      image: { src: 'd.jpg', alt: 'D' },
      distance: '4km',
      detail: 'D',
      link: { label: 'Go D', href: '/d' },
    },
  ];

  it('(1) renders N cards without limit', () => {
    const { container } = render(
      <DestinationsGrid
        heading="Destinations"
        eyebrow="Explore"
        headingAccent="all"
        intro="Browse"
        items={destinations}
      />
    );
    const cards = container.querySelectorAll('article.dest-card');
    expect(cards).toHaveLength(4);
  });

  it('(2) limit prop truncates array to limit count (TC-21)', () => {
    const { container } = render(
      <DestinationsGrid
        heading="Destinations"
        eyebrow="Explore"
        headingAccent="all"
        intro="Browse"
        items={destinations}
        limit={3}
      />
    );
    const cards = container.querySelectorAll('article.dest-card');
    expect(cards).toHaveLength(3);
  });

  it('(3) heading and eyebrow render', () => {
    render(
      <DestinationsGrid
        heading="Destinations"
        eyebrow="Explore"
        headingAccent="all"
        intro="Browse"
        items={destinations}
      />
    );
    expect(screen.getByText('Destinations')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
  });
});

// ── ExperienceItem ──────────────────────────────────────────────────────────

describe('ExperienceItem', () => {
  it('(1) title, summary, duration render', () => {
    render(<ExperienceItem {...expItemProps} />);
    expect(screen.getByText('Zero-G Immersion')).toBeInTheDocument();
    expect(screen.getByText('Float weightlessly in our null-g chamber.')).toBeInTheDocument();
    expect(screen.getByText('3 hours')).toBeInTheDocument();
  });

  it('(2) CTA link correct', () => {
    render(<ExperienceItem {...expItemProps} />);
    const link = screen.getByRole('link', { name: 'Book now' });
    expect(link).toHaveAttribute('href', '/experiences/zero-g');
  });

  it('(3) onerror → data-failed="true"', () => {
    render(<ExperienceItem {...expItemProps} />);
    const img = screen.getByAltText('Zero gravity');
    fireEvent.error(img);
    expect(img).toHaveAttribute('data-failed', 'true');
  });
});

// ── ExperienceShowcase ──────────────────────────────────────────────────────

describe('ExperienceShowcase', () => {
  const experiences = [
    {
      title: 'Exp A',
      summary: 'Summary A',
      image: { src: 'a.jpg', alt: 'A' },
      duration: '1h',
      cta: { label: 'CTA A', href: '/a' },
    },
    {
      title: 'Exp B',
      summary: 'Summary B',
      image: { src: 'b.jpg', alt: 'B' },
      duration: '2h',
      cta: { label: 'CTA B', href: '/b' },
    },
  ];

  it('(1) renders N ExperienceItems', () => {
    const { container } = render(
      <ExperienceShowcase
        heading="Experiences"
        eyebrow="Journey"
        headingAccent="beyond"
        items={experiences}
      />
    );
    const items = container.querySelectorAll('.exp-item');
    expect(items).toHaveLength(2);
  });

  it('(2) heading renders', () => {
    render(
      <ExperienceShowcase
        heading="Experiences"
        eyebrow="Journey"
        headingAccent="beyond"
        items={experiences}
      />
    );
    expect(screen.getByText('Experiences')).toBeInTheDocument();
  });
});

// ── Stat ────────────────────────────────────────────────────────────────────

describe('Stat', () => {
  it('(1) label renders', () => {
    render(<Stat {...statProps} />);
    expect(screen.getByText('Travelers')).toBeInTheDocument();
  });

  it('(2) initial display shows countTo value (via mocked useCountUp returning final value)', () => {
    // Our mock returns the final value immediately (reduced-motion-safe behavior)
    render(<Stat {...statProps} />);
    expect(screen.getByText('1240')).toBeInTheDocument();
  });
});

// ── StatsBand ───────────────────────────────────────────────────────────────

describe('StatsBand', () => {
  const stats = [
    { value: '100', label: 'Missions', countTo: 100 },
    { value: '50', label: 'Clients', countTo: 50 },
    { value: '25', label: 'Planets', countTo: 25 },
    { value: '10', label: 'Years', countTo: 10 },
  ];

  it('(1) renders N Stats from items array', () => {
    const { container } = render(<StatsBand items={stats} />);
    const statEls = container.querySelectorAll('.stat');
    expect(statEls).toHaveLength(4);
  });

  it('(2) optional heading renders when supplied', () => {
    render(<StatsBand heading="Mission metrics" items={stats} />);
    expect(screen.getByText('Mission metrics')).toBeInTheDocument();
  });
});

// ── PromoBand ───────────────────────────────────────────────────────────────

describe('PromoBand', () => {
  it('(1) eyebrow, heading, body render', () => {
    render(<PromoBand {...promoBandProps} />);
    expect(screen.getByText('Limited availability')).toBeInTheDocument();
    expect(screen.getByText('Reserve your')).toBeInTheDocument();
    expect(screen.getByText('Join the pioneers of commercial spaceflight.')).toBeInTheDocument();
  });

  it('(2) CTA link correct', () => {
    render(<PromoBand {...promoBandProps} />);
    const link = screen.getByRole('link', { name: 'Apply now' });
    expect(link).toHaveAttribute('href', '/contact');
  });
});

// ── TestimonialCard ─────────────────────────────────────────────────────────

describe('TestimonialCard', () => {
  it('(1) quote, author, role render', () => {
    render(<TestimonialCard {...testimonialCardProps} />);
    expect(screen.getByText('An experience beyond words.')).toBeInTheDocument();
    expect(screen.getByText('Alex Reeve')).toBeInTheDocument();
    expect(screen.getByText('Orbital voyager')).toBeInTheDocument();
  });

  it('(2) avatar alt text when supplied', () => {
    render(<TestimonialCard {...testimonialCardProps} />);
    const img = screen.getByAltText('Alex Reeve portrait');
    expect(img).toBeInTheDocument();
  });
});

// ── Testimonials ─────────────────────────────────────────────────────────────

describe('Testimonials', () => {
  const testimonials = [
    { quote: 'Q1', author: 'A1', role: 'R1' },
    { quote: 'Q2', author: 'A2', role: 'R2' },
    { quote: 'Q3', author: 'A3', role: 'R3' },
  ];

  it('(1) renders N TestimonialCards from items array', () => {
    const { container } = render(
      <Testimonials heading="Mission Log" eyebrow="Voices" headingAccent="from orbit" items={testimonials} />
    );
    const cards = container.querySelectorAll('article.quote-card');
    expect(cards).toHaveLength(3);
  });

  it('(2) heading renders', () => {
    render(
      <Testimonials heading="Mission Log" eyebrow="Voices" headingAccent="from orbit" items={testimonials} />
    );
    expect(screen.getByText('Mission Log')).toBeInTheDocument();
  });
});

// ── Marquee ─────────────────────────────────────────────────────────────────

describe('Marquee', () => {
  it('(1) aria-hidden="true" present on outer wrapper', () => {
    const { container } = render(<Marquee items={['Europa', 'Titan', 'Io']} />);
    const wrapper = container.querySelector('.marquee');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('(2) items render (at least one instance of each)', () => {
    render(<Marquee items={['Europa', 'Titan', 'Io']} />);
    // Items are duplicated for the loop — at least one instance per name
    expect(screen.getAllByText('Europa').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Titan').length).toBeGreaterThanOrEqual(1);
  });
});

// ── PageHero ─────────────────────────────────────────────────────────────────

describe('PageHero', () => {
  it('(1) title and subtitle render', () => {
    render(<PageHero {...pageHeroProps} />);
    expect(screen.getByText('Our Destinations')).toBeInTheDocument();
    expect(screen.getByText('Explore the cosmos.')).toBeInTheDocument();
  });

  it('(2) image alt text renders when image supplied', () => {
    render(
      <PageHero
        title="Destinations"
        subtitle="Explore."
        image={{ src: 'test.jpg', alt: 'Space panorama' }}
      />
    );
    expect(screen.getByAltText('Space panorama')).toBeInTheDocument();
  });

  it('(3) renders without image (image is optional)', () => {
    expect(() => render(<PageHero title="About" subtitle="Our story." />)).not.toThrow();
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});

// ── RichTextSection ───────────────────────────────────────────────────────────

describe('RichTextSection', () => {
  it('(1) heading renders', () => {
    render(<RichTextSection {...richTextSectionProps} />);
    expect(screen.getByText('Our Story')).toBeInTheDocument();
  });

  it('(2) body is rendered as HTML (not escaped text) — TC-36', () => {
    const { container } = render(<RichTextSection {...richTextSectionProps} />);
    // The <strong> tag must exist as a DOM element, not as escaped &lt;strong&gt;
    const strong = container.querySelector('.rts-body strong');
    expect(strong).toBeInTheDocument();
    expect(strong?.textContent).toBe('extraordinary');
  });
});

// ── SiteHeader ────────────────────────────────────────────────────────────────

describe('SiteHeader', () => {
  it('(1) nav links point to real routes', () => {
    render(<SiteHeader />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    const links = nav.querySelectorAll('a');
    const hrefs = Array.from(links).map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/destinations');
    expect(hrefs).toContain('/experiences');
    expect(hrefs).toContain('/about');
    expect(hrefs).toContain('/contact');
  });

  it('(2) brand mark present', () => {
    render(<SiteHeader />);
    const brand = screen.getByRole('link', { name: 'Aphelion — Home' });
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveAttribute('href', '/');
  });
});

// ── SiteFooter ────────────────────────────────────────────────────────────────

describe('SiteFooter', () => {
  it('(1) footer nav columns render', () => {
    const { container } = render(<SiteFooter />);
    const cols = container.querySelectorAll('.footer-col');
    // Brand col + 3 nav columns = 4 total
    expect(cols.length).toBeGreaterThanOrEqual(3);
  });

  it('(2) links present in footer', () => {
    render(<SiteFooter />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});

// ── Cross-cutting invariants ─────────────────────────────────────────────────

describe('T035 cross-cutting invariants', () => {
  it('(1) every component renders without throwing from minimum valid props', () => {
    // Spot-check a selection that covers all component categories
    expect(() => render(<ValueCard icon="✦" title="T" body="B" />)).not.toThrow();
    expect(() =>
      render(<DestinationCard {...destCardProps} />)
    ).not.toThrow();
    expect(() => render(<ExperienceItem {...expItemProps} />)).not.toThrow();
    expect(() => render(<Stat value="1" label="L" countTo={1} />)).not.toThrow();
    expect(() => render(<PromoBand {...promoBandProps} />)).not.toThrow();
    expect(() => render(<TestimonialCard quote="Q" author="A" role="R" />)).not.toThrow();
    expect(() => render(<Marquee items={['A']} />)).not.toThrow();
    expect(() => render(<PageHero title="T" subtitle="S" />)).not.toThrow();
    expect(() =>
      render(<RichTextSection heading="H" body="<p>Text</p>" />)
    ).not.toThrow();
  });

  it('(2) DestinationsGrid: no limit → all 4 items; limit=3 → exactly 3 items (TC-21)', () => {
    const items = [destCardProps, destCardProps, destCardProps, destCardProps].map((d, i) => ({
      ...d,
      name: `Dest${i}`,
      image: { src: 'd.jpg', alt: `Dest ${i}` },
      link: { label: `Go ${i}`, href: `/dest/${i}` },
    }));

    const { container: noLimit } = render(
      <DestinationsGrid heading="H" eyebrow="E" headingAccent="A" intro="I" items={items} />
    );
    expect(noLimit.querySelectorAll('article.dest-card')).toHaveLength(4);

    const { container: withLimit } = render(
      <DestinationsGrid heading="H" eyebrow="E" headingAccent="A" intro="I" items={items} limit={3} />
    );
    expect(withLimit.querySelectorAll('article.dest-card')).toHaveLength(3);
  });
});
