import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import RichTextSection, { type RichTextSectionFields } from './RichTextSection';
import layout from '../../test/fixtures/group-1-test.layout.json';
import { findRendering, renderComponent } from '../../test/harness';

/**
 * RichTextSection — the ONLY RichTextField in the registry. Asserts the Body is
 * rendered as REAL HTML via <RichText> (a `.ck-content` element exists), not
 * escaped as text — the distinction we flagged on PromoBand.
 */
const fields = findRendering(layout, 'RichTextSection').fields as RichTextSectionFields;

describe('RichTextSection (flat Shape A leaf) — published view', () => {
  it('binds the SectionHeading Text field', () => {
    renderComponent(<RichTextSection fields={fields} />);
    expect(screen.getByText(fields.SectionHeading!.value as string)).toBeInTheDocument();
  });

  it('renders the Body as real HTML (RichText), not escaped text', () => {
    const { container } = renderComponent(<RichTextSection fields={fields} />);
    const body = container.querySelector('.rts-body');
    expect(body).toBeTruthy();
    // Sitecore rich text wraps content in .ck-content — its presence proves the HTML
    // was parsed into DOM, not printed as a literal string.
    expect(body!.querySelector('.ck-content')).toBeTruthy();
  });
});
