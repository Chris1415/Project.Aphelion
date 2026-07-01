import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Footer from './Footer';
import { renderComponent } from '../../test/harness';

/** Footer — static chrome (hardcoded nav, no datasource — ADR-0005 nav exception). */
describe('Footer (static chrome)', () => {
  it('renders the contentinfo landmark + hardcoded nav links', () => {
    renderComponent(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Destinations' }).length).toBeGreaterThan(0);
    expect(screen.getByText(/Aphelion Spaceflight/)).toBeInTheDocument();
  });
});
