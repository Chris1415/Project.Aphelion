/**
 * Navigation — static hard-coded tree
 * ADR-0005 rule 3: nav is EXCLUDED from content-model derivation.
 * Header + footer nav are sourced via component-level navigation pattern in Act 3 (PRD-001).
 * Links point to REAL routes, NOT #anchors.
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
