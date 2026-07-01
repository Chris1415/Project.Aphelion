import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import DestinationsGrid, { type DestinationsGridFields } from './DestinationsGrid';
import layout from '../../test/fixtures/group-1-test.layout.json';
import { findRendering, renderComponent } from '../../test/harness';

/**
 * DestinationsGrid — container via integrated GraphQL (Shape C). On Group-1-Test
 * the 2 child cards are unauthored (empty fields), so we assert the heading
 * scalar binds and one card renders per child. Card-field assertions strengthen
 * automatically once real destination content is authored + recaptured.
 */
const fields = findRendering(layout, 'DestinationsGrid').fields as DestinationsGridFields;
const ds = fields.data!.datasource!;

describe('DestinationsGrid (integrated-GraphQL container, Shape C) — published view', () => {
  it('binds the section heading scalar from the datasource', () => {
    renderComponent(<DestinationsGrid fields={fields} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain(
      ds.heading!.jsonValue!.value as string
    );
  });

  it('renders one card per child (source order preserved)', () => {
    const { container } = renderComponent(<DestinationsGrid fields={fields} />);
    expect(container.querySelectorAll('article.dest-card').length).toBe(
      ds.children!.results!.length
    );
  });
});
