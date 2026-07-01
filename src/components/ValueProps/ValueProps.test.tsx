import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import ValueProps, { type ValuePropsFields } from './ValueProps';
import layout from '../../test/fixtures/group-1-test.layout.json';
import { findRendering, renderComponent } from '../../test/harness';

/**
 * ValueProps — CONTAINER via integrated GraphQL (Shape C: data.datasource +
 * children[].jsonValue), SERVER component. Asserts both the folder scalar
 * binding AND per-child card binding against the REAL captured payload.
 */
const fields = findRendering(layout, 'ValueProps').fields as ValuePropsFields;
const ds = fields.data!.datasource!;

describe('ValueProps (integrated-GraphQL container, Shape C) — published view', () => {
  it('binds the section eyebrow + heading scalars from the datasource', () => {
    renderComponent(<ValueProps fields={fields} />);
    expect(screen.getByText(ds.eyebrow!.jsonValue!.value as string)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain(
      ds.heading!.jsonValue!.value as string
    );
  });

  it('renders one card per child with title + body bound from jsonValue', () => {
    const { container } = renderComponent(<ValueProps fields={fields} />);
    const children = ds.children!.results!;
    expect(container.querySelectorAll('article.card').length).toBe(children.length);
    for (const card of children) {
      expect(screen.getByText(card.cardTitle!.jsonValue!.value as string)).toBeInTheDocument();
      expect(screen.getByText(card.body!.jsonValue!.value as string)).toBeInTheDocument();
    }
  });
});
