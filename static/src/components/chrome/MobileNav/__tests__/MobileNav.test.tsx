/**
 * T011 — MobileNav unit tests (Vitest + RTL)
 * § 10 T011 unit test spec
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileNav } from '../index';

// Minimal ThemeProvider mock (MobileNav uses ThemeToggle → useTheme)
vi.mock('@/ui/theme-provider', () => ({
  useTheme: () => ({
    choice: 'system',
    resolved: 'dark',
    setChoice: vi.fn(),
    cycleChoice: vi.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('MobileNav', () => {
  it('(1) drawer renders with aria-hidden="true" initially', () => {
    const { container } = render(<MobileNav />);
    // aria-hidden=true hides from a11y tree; query via CSS selector
    const drawer = container.querySelector('.mobile-nav');
    expect(drawer).not.toBeNull();
    expect(drawer).toHaveAttribute('aria-hidden', 'true');
  });

  it('(2) after open click: drawer aria-hidden becomes "false"; trigger aria-expanded becomes "true"', () => {
    render(<MobileNav />);
    // The trigger button (not the close button inside the drawer)
    const trigger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(trigger);

    const drawer = screen.getByRole('navigation', { name: /mobile navigation/i });
    expect(drawer).toHaveAttribute('aria-hidden', 'false');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('(3) after close click: drawer aria-hidden returns to "true"', () => {
    const { container } = render(<MobileNav />);
    const trigger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(trigger); // open

    const closeBtn = screen.getByRole('button', { name: /close navigation menu/i });
    fireEvent.click(closeBtn); // close

    const drawer = container.querySelector('.mobile-nav');
    expect(drawer).not.toBeNull();
    expect(drawer).toHaveAttribute('aria-hidden', 'true');
  });

  it('(4) drawer links use <Link> to real routes (not #anchors)', () => {
    render(<MobileNav />);
    const trigger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(trigger);

    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/destinations');
    expect(hrefs).toContain('/experiences');
    expect(hrefs).toContain('/about');
    expect(hrefs).toContain('/contact');
  });
});
