import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import StatsBand, { type StatsBandFields } from './StatsBand';
import layout from '../../test/fixtures/group-1-test.layout.json';
import { findRendering, renderComponent } from '../../test/harness';

/**
 * StatsBand — CLIENT container via integrated GraphQL (Shape C). Stat VALUES
 * are count-up animated (non-deterministic in jsdom), so we assert the
 * deterministic surface: fallback heading, one .stat per child, and the
 * non-animated stat LABELS (rendered via <Text>).
 */
const fields = findRendering(layout, 'StatsBand').fields as StatsBandFields;
const stats = fields.data!.datasource!.children!.results!;

describe('StatsBand (integrated-GraphQL container, Shape C) — published view', () => {
  it('falls back to the default band heading when bandHeading is empty', () => {
    // fixture bandHeading = '' → sr-only h2 uses the literal fallback
    renderComponent(<StatsBand fields={fields} />);
    expect(screen.getByText('Aphelion by the numbers')).toBeInTheDocument();
  });

  it('renders one .stat per child with its label bound', () => {
    const { container } = renderComponent(<StatsBand fields={fields} />);
    expect(container.querySelectorAll('.stat').length).toBe(stats.length); // 4
    for (const s of stats) {
      const label = s.statLabel?.jsonValue?.value as string;
      if (label) expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
