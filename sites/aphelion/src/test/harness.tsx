/**
 * Test harness — fixture helpers + render wrapper.
 *
 * Fixtures are REAL `getPage` layout payloads captured from the live tenant
 * (see tests/README or the /api/layout-debug capture route). `findRendering`
 * walks the LayoutServiceData placeholder tree and returns a component's real
 * `fields` + `params` so a component test renders exactly what Edge delivers.
 */
import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';

export interface Rendering {
  componentName?: string;
  fields?: Record<string, unknown>;
  params?: Record<string, unknown>;
  placeholders?: Record<string, Rendering[]>;
}

function collect(node: { placeholders?: Record<string, Rendering[]> } | undefined, acc: Rendering[]): void {
  const phs = node?.placeholders ?? {};
  for (const key of Object.keys(phs)) {
    const list = phs[key];
    if (!Array.isArray(list)) continue;
    for (const r of list) {
      if (r?.componentName) acc.push(r);
      collect(r, acc);
    }
  }
}

/** Every rendering on a captured layout, recursing nested placeholders. */
export function allRenderings(layout: unknown): Rendering[] {
  // LayoutServiceData: { sitecore: { route: { placeholders } } }
  const root =
    (layout as { sitecore?: { route?: unknown } })?.sitecore?.route ??
    (layout as { route?: unknown })?.route ??
    layout;
  const acc: Rendering[] = [];
  collect(root as { placeholders?: Record<string, Rendering[]> }, acc);
  return acc;
}

/** First rendering matching `componentName`, or throw a helpful error listing what IS present. */
export function findRendering(layout: unknown, componentName: string): Rendering {
  const all = allRenderings(layout);
  const hit = all.find((r) => r.componentName === componentName);
  if (!hit) {
    const names = [...new Set(all.map((r) => r.componentName))].sort().join(', ');
    throw new Error(
      `findRendering: no "${componentName}" in fixture. Present: ${names || '(none)'}`
    );
  }
  return hit;
}

/** All renderings matching `componentName` (e.g. a component placed more than once). */
export function findRenderings(layout: unknown, componentName: string): Rendering[] {
  return allRenderings(layout).filter((r) => r.componentName === componentName);
}

/** Thin render wrapper — components are presentational (fields-in, markup-out). */
export function renderComponent(ui: ReactElement): RenderResult {
  return render(ui);
}
