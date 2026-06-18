import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Header from './Header';
import { ThemeProvider } from 'src/ui/theme-provider';
import { renderComponent } from '../../test/harness';

/**
 * Header — static chrome (hardcoded nav, no datasource — ADR-0005 nav exception).
 * Wrapped in ThemeProvider exactly as the root layout does, because the embedded
 * ThemeToggle reads theme context.
 */
describe('Header (static chrome)', () => {
  it('renders the banner landmark + the hardcoded main nav', () => {
    renderComponent(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    for (const label of ['Destinations', 'Experiences', 'About', 'Contact']) {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0);
    }
  });
});
