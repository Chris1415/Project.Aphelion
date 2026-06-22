/**
 * Navigation — static hard-coded tree (chrome, ADR-0005 rule 3 nav exception).
 * Ported from the static app. Lives in src/site/ (NOT src/components/) so
 * sitecore-tools generate-map does not register it as a Sitecore rendering.
 * Links point to REAL routes. Upgrade to Sitecore-driven nav (component-level
 * GraphQL, ADR-0011) is a later option; hardcoded is intentional for now.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterNavColumn {
  heading: string;
  links: NavLink[];
}

/** Header desktop navigation */
export const headerNav: NavLink[] = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/** Footer navigation columns */
export const footerNav: FooterNavColumn[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'Destinations', href: '/destinations' },
      { label: 'Experiences', href: '/experiences' },
      { label: 'Packages', href: '/experiences' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/about' },
    ],
  },
  {
    heading: 'Connect',
    links: [
      { label: 'Twitter / X', href: '#' },
      { label: 'Instagram', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
  },
];
